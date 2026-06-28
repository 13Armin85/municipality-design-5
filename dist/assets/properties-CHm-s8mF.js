import{c as a}from"./index-BPpTCP6M.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],s=a("info",l),r=["region","neighborhood","block","property","building","apartment","guild"],i={region:"منطقه",neighborhood:"محله",block:"بلوک",property:"ملک",building:"ساختمان",apartment:"آپارتمان",guild:"صنفی"},p=[...r].reverse().map(e=>({key:e,label:i[e]})),c="municipality-selected-property-id",n="municipality-selected-property-renewal-code",g=e=>e?e.replace(/[۰-۹]/g,t=>String("۰۱۲۳۴۵۶۷۸۹".indexOf(t))).replace(/[٠-٩]/g,t=>String("٠١٢٣٤٥٦٧٨٩".indexOf(t))).replace(/[^\d]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""):"",u=()=>typeof window>"u"?null:localStorage.getItem(n),y=(e,t)=>{typeof window>"u"||(localStorage.setItem(n,e),t&&localStorage.setItem(c,t),window.dispatchEvent(new CustomEvent("municipality-selected-property-change",{detail:t??e})))},m=(e,t)=>r.every(o=>e[o]===t[o]);export{s as I,u as a,m as b,p as g,g as n,y as p,r,c as s};
