// Shared settings and helpers for the "Request a PDF" form.
// Settings come from config/pdf_requests.yml.

const settings = __APP_ENV__.pdf_requests || {}

export const PDF_REQUEST_ENDPOINT = settings.endpoint || ''
export const TURNSTILE_SITE_KEY = settings.turnstile_site_key || ''
export const isPdfRequestEnabled = () => !!PDF_REQUEST_ENDPOINT

const STORAGE_KEY = 'wid:pdf-request:contact'

// Remember the requester's name, e-mail and institution in this browser only
export function loadContact() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveContact({ name, email, institution }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, institution }))
  } catch {}
}

let turnstilePromise
export function loadTurnstile() {
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

export async function sendPdfRequest(payload) {
  const res = await fetch(PDF_REQUEST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'The request could not be sent. Please try again later.')
  }
  return data
}
