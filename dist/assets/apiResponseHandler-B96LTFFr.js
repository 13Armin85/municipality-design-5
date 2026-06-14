import{c}from"./index-CI4Z6ZX6.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],l=c("info",u),t=r=>{const e=r.IsSuccess??r.isSuccess,s=r.IsFailure??r.isFailure;return e===!0&&s===!1},o=r=>{var e,s,i;return(e=r.Error)!=null&&e.Description?r.Error.Description:(s=r.error)!=null&&s.description?r.error.description:(i=r.error)!=null&&i.name?r.error.name:"خطای نامعلوم از سرور"},f=r=>r.Value??r.value??null,I=r=>{if(typeof r=="object"&&("IsSuccess"in r||"IsFailure"in r||"isSuccess"in r||"isFailure"in r))return r;if(Array.isArray(r))return{IsSuccess:!0,IsFailure:!1,Value:r};if(typeof r=="object"&&r!==null){if(r.success===!0)return{IsSuccess:!0,IsFailure:!1,Value:r};if(r.success===!1)return{IsSuccess:!1,IsFailure:!0,Error:{Description:r.message||"خطای نامعلوم از سرور",Type:0}}}return{IsSuccess:!0,IsFailure:!1,Value:r}};export{l as I,f as a,o as g,t as i,I as n};
