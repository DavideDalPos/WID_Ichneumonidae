// Shared plumbing for the WID inbox forms (Request a PDF, Submit a publication,
// Report an error). Settings come from config/inbox.yml; every form posts to the
// same Cloudflare Worker, which opens an issue in the private inbox repository.
import { onBeforeUnmount, ref } from 'vue'

const settings = __APP_ENV__.inbox || __APP_ENV__.pdf_requests || {}

export const INBOX_ENDPOINT = settings.endpoint || ''
export const TURNSTILE_SITE_KEY = settings.turnstile_site_key || ''
export const isInboxEnabled = () => !!INBOX_ENDPOINT

const STORAGE_KEY = 'wid:inbox:contact'

// Remember the sender's name, e-mail and institution in this browser only
export function loadContact() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('wid:pdf-request:contact') || '{}')
  } catch {
    return {}
  }
}

export function saveContact({ name, email, institution }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, institution }))
  } catch {}
}

export async function sendToInbox(payload) {
  const res = await fetch(INBOX_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Your message could not be sent. Please try again later.')
  }
  return data
}

let turnstilePromise
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))
  if (window.turnstile) return Promise.resolve(window.turnstile)
  turnstilePromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = () => {
      turnstilePromise = null
      reject(new Error('Could not load the spam check'))
    }
    document.head.appendChild(s)
  })
  return turnstilePromise
}

// Cloudflare Turnstile widget bound to an element ref
export function useTurnstile(elRef) {
  const token = ref('')
  const failed = ref(false)
  let widgetId = null

  async function render() {
    if (!TURNSTILE_SITE_KEY || !elRef.value) return
    try {
      const turnstile = await loadTurnstile()
      if (widgetId !== null) turnstile.remove(widgetId)
      widgetId = turnstile.render(elRef.value, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (t) => (token.value = t),
        'expired-callback': () => (token.value = ''),
        'error-callback': () => (token.value = '')
      })
      failed.value = false
    } catch {
      failed.value = true
    }
  }
  function reset() {
    token.value = ''
    if (widgetId !== null) window.turnstile?.reset(widgetId)
  }
  onBeforeUnmount(() => {
    if (widgetId !== null) window.turnstile?.remove(widgetId)
  })
  return { token, failed, render, reset }
}
