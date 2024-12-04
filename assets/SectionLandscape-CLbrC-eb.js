import{_ as m,h as _,i as h,k as g,f as c,o,c as l,a as t,l as b,g as f,w as p,t as r,b as x,m as w,d as i,u as v}from"./index-CDzUkNRI.js";const y="/assets/logoWID-BRkXZTTf.png",k={class:"overflow-hidden h-[550px] w-full"},I=["src"],D={class:"bg-black bg-opacity-25 absolute h-full w-full top-0"},W={class:"absolute bottom-2 right-4"},S={class:"z-10 text-white text-sm drop-shadow"},C={__name:"ImageCarrousel",props:{duration:{type:Number,default:5e3}},setup(u){const a=[{label:"LogoWID",copyright:"Filippo Di Giovanni",src:y,otuId:3435}],s=_(null),e=h(()=>a[s.value]||{});return g(()=>{s.value=Math.floor(Math.random()*a.length)}),(n,M)=>{const d=c("RouterLink");return o(),l("div",k,[(o(),l("img",{class:"object-cover overflow-hidden h-[550px] w-full absolute",key:e.value.src,src:e.value.src,alt:"Dichroplus maculipennis"},null,8,I)),t("div",D,[b(n.$slots,"default",{},void 0,!0)]),t("div",W,[t("span",S,[e.value.otuId?(o(),f(d,{key:0,class:"text-white",to:{name:"otus-id",params:{id:e.value.otuId}}},{default:p(()=>[t("i",null,r(e.value.label),1),x(" © "+r(e.value.copyright),1)]),_:1},8,["to"])):w("",!0)])])])}}},B=m(C,[["__scopeId","data-v-55d2c48e"]]);var G={base_url:"/",hash_mode:!0,map_tile_server:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",map_tile_attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',issue_trackers:[{label:"Data",description:"E.g. missing data that I'd like to add, misspellings, or invalid data",url:"https://github.com/DavideDalPos/WID_Ichneumonidae/issues"},{label:"Website",description:"E.g. a link, panel, or other feature is not working as expected",url:"https://github.com/SpeciesFileGroup/taxonpages/issues"}],taxa_page:{overview:{panels:[[["panel:gallery","panel:type","panel:type-specimen","panel:nomenclature","panel:nomenclature-references"],["panel:map","panel:descendants","panel:scrutiny","panel:content","panel:keys","panel:gbif","panel:statistics"]]]},specimen_records:{rank_group:["SpeciesGroup"],panels:[[["panel:specimen-records"]]]},inaturalist:{label:"iNaturalist",rank_group:["GenusGroup","SpeciesGroup"],panels:[[["panel:inaturalist"]]]}},project_name:"World Ichneumonidae Database (WID)",project_citation:"World Ichneumonidae Database (WID)",project_url:"https://worldichneumonidae.com",project_authors:"Dal Pos et al (2023)",metadata:[{name:"description",content:"TaxonPages is a tool to serve taxon pages."},{name:"keywords",content:"taxonpages, species, sfg"},{name:"robots",content:"follow"}],map_tiles:[{label:"OpenStreetMap",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',server:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"},{label:"GBIF",attribution:'&copy; <a href="https://gbif.org">GBIF.org</a>',server:"https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-natural-en"}],header_logo_text:"World Ichneumonidae Database (WID)",header_logo_url:"/images/logoWid_wasp.png",header_links:[{label:"Home",link:"/"},{label:"About",link:"/about"},{label:"Subfamilies",link:"/subfamilies"},{label:"Meetings",link:"/announcements"},{label:"News & Updates",link:"/news"},{label:"Collaborate with us",link:"/collaboration"},{label:"How to Cite",link:"/cite"}],copyright_image:"http://licensebuttons.net/l/by/4.0/80x15.png",copyright_image_link:"http://creativecommons.org/licenses/by/4.0/",copyright_text:"Except where otherwise noted, content on this site is licensed under a Creative Commons Attribution License. (CC-BY)",url:"https://sfg.taxonworks.org/api/v1",project_token:"nOnhTWA3rt1Bs92dEAm7fw",analytics_services:{enableDev:!0,analytics:[{id:"G-882L0S5P9L"}]}};const j={class:"relative box-border"},A={class:"flex flex-col justify-center sm:items-center w-full h-full gap-4 bg-black bg-opacity-10"},N={class:"text-3xl sm:text-4xl px-4 font-medium text-white"},L={class:"p-3 bg-black bg-opacity-20 w-full max-w-lg box-border rounded-lg"},O={__name:"SectionLandscape",setup(u){const{project_name:a}=G;return(s,e)=>{const n=c("AutocompleteOtu");return o(),l("section",null,[t("div",j,[i(B,null,{default:p(()=>[t("div",A,[t("span",N,r(v(a)),1),e[0]||(e[0]=t("span",{class:"text-lg sm:text-xl text-white px-4"},"A comprehensive database for the world fauna of Darwin wasps",-1)),t("div",L,[i(n,{autofocus:"",class:"w-full",placeholder:"Search by taxon name..."})])])]),_:1})])])}}};export{O as default};
