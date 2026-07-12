import{a as Qi}from"./devEnvironmentUtils-CpTMSeVK.js";import{cz as Ma,ot as eo,ou as to,bK as Kr,cy as ro,jm as ao,bR as Ca,ay as Ge,d8 as Dt,ij as xr,az as M,ih as io,hj as Oa,da as Me,hv as fe,av as Mr,fz as j,dd as me,dc as pe,ov as oo,dS as Ce,eQ as no,w as Cr,s as St,cu as so,e3 as Qr,kf as lo,fW as ht,kS as mt,de as ea,ow as co,hg as uo,hh as ho,fq as zt,ks as mo,hi as Et,ie as Ne,eL as fo,m8 as po,B as Ra,ox as vo,dV as at,oy as go,oz as xo,d9 as Ft,by as To,ax as Yt,hw as Ze,hu as Gt,oA as Ia,oB as Pa,_ as _o,cK as Xt,kO as Tr,b4 as m,cH as $a,aj as ie,hs as Or,il as Rr,b5 as G,b6 as Ir,bF as La,oC as Na,be as Da,bf as bo,ft as Ve,fp as Jt,ii as So,S as Ot,hb as _r,au as Eo,cN as yo,P as Ao,oD as wo,hW as Fa,i9 as Ba,U as Mo,aI as za,oE as Ga,iJ as Vt,cS as Co,ma as ta,cI as ra,cJ as Oo}from"./Map-BTjbmh4q.js";import{t as lr,e as yt,o as ct}from"./mat3f64-q3fE-ZOt.js";import{o as Ut,r as Ro,e as Zt}from"./mat4f64-CSKppSlJ.js";import{x as Kt,c as br,y as Io,u as Po,q as $o,i as jt,L as Lo,O as No,E as Do}from"./BufferView-CSjj8PzM.js";import{e as Fo,f as Bo,l as aa,o as ia}from"./vec3-CBUHk6Mc.js";import{n as zo,s as oa}from"./vec4-CDTYrNBZ.js";import{l as Go,n as Vo,g as qe,o as Uo,h as jo,t as Ho,i as Wo}from"./DefaultMaterial_COLOR_GAMMA-DRXWRPjD.js";import{r as cr}from"./resourceUtils-CdknLLmy.js";import{t as qo}from"./NestedMap-BqcbDFZ4.js";import{t as ko,l as Va}from"./Indices-hjoNqq8c.js";import{t as Ua}from"./requestImageUtils-xGRN_Q0y.js";import{I as Yo,L as Xo,t as Xe}from"./orientedBoundingBox-DD99sWSu.js";import{t as Jo,u as vt,a as Sr,i as Zo,N as Oe,s as J,O as ja,e as Re,n as At}from"./basicInterfaces-DiCeWLf9.js";import{s as q}from"./Util-D_NYdbn2.js";import{s as Ha,_ as Wa,V as Ae}from"./sphere-fXxx5Gzw.js";import{v as Ko}from"./lineSegment-BsdbrBP5.js";import"./plane-BoJ2EujD.js";import{e as f}from"./VertexAttribute-BlT9lbVY.js";import{_ as wt}from"./index-AhaWH6RN.js";import{c as Ee,G as Fe,L as nt,D as Ue,O as ve,R as we,X as na,E as Qo,I as ne,t as en,_ as tn,f as rn}from"./enums-Co1-zCx_.js";import{c as it,a as an,e as qa,d as on}from"./Texture-DPnqwa3p.js";import{H as nn}from"./InterleavedLayout-nO_IoF_A.js";import{n as be,a as K,t as Qt,o as B,b as dr,r as ur}from"./NormalAttribute.glsl-tm0gZ5iC.js";import{o as s,n as Mt}from"./interfaces-B8ge7Jg9.js";import{l as ka,S as Pr,_ as $r,o as sn,h as ln}from"./renderState-CW9GJeLs.js";import{a as D}from"./BindType-BmZEZMMh.js";import{o as cn,r as dn}from"./doublePrecisionUtils-B0owpBza.js";import"./apiResponseHandler-Dr28aEFZ.js";import"./quat-BP2_AaPd.js";import"./quatf64-Bdb9ZJJK.js";import"./spatialReferenceEllipsoidUtils-s74whnAN.js";import"./computeTranslationToOriginAndRotation-BpuUCWcj.js";import"./types-D0PSWh4d.js";function Rt(t,e=!1){return t<=Ma?e?new Array(t).fill(0):new Array(t):new Float32Array(t)}function un(t){t.vertex.code.add(s`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${s.int(be.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${s.int(be.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${s.int(be.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${s.int(be.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}let ee=class{constructor(e,r,a,o,i=null){if(this.name=e,this.type=r,this.arraySize=i,this.bind={[D.Pass]:null,[D.Draw]:null},o)switch(a){case D.Pass:this.bind[D.Pass]=o;break;case D.Draw:this.bind[D.Draw]=o}}equals(e){return this.type===e.type&&this.name===e.name&&this.arraySize===e.arraySize}},gt=class extends ee{constructor(e,r){super(e,"sampler2D",D.Draw,((a,o,i)=>a.bindTexture(e,r(o,i))))}};function Ya({code:t},e){e.doublePrecisionRequiresObfuscation?t.add(s`vec3 dpPlusFrc(vec3 a, vec3 b) {
return mix(a, a + b, vec3(notEqual(b, vec3(0))));
}
vec3 dpMinusFrc(vec3 a, vec3 b) {
return mix(vec3(0), a - b, vec3(notEqual(a, b)));
}
vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = dpPlusFrc(hiA, hiB);
vec3 e = dpMinusFrc(t1, hiA);
vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
return t1 + t2;
}`):t.add(s`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = hiA + hiB;
vec3 e = t1 - hiA;
vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
return t1 + t2;
}`)}let de=class extends ee{constructor(e,r){super(e,"vec3",D.Draw,((a,o,i,n)=>a.setUniform3fv(e,r(o,i,n))))}},Z=class extends ee{constructor(e,r){super(e,"vec3",D.Pass,((a,o,i)=>a.setUniform3fv(e,r(o,i))))}},se=class extends ee{constructor(e,r){super(e,"float",D.Pass,((a,o,i)=>a.setUniform1f(e,r(o,i))))}},Xa=class extends ee{constructor(e,r){super(e,"mat3",D.Draw,((a,o,i)=>a.setUniformMatrix3fv(e,r(o,i))))}},ge=class extends ee{constructor(e,r){super(e,"mat3",D.Pass,((a,o,i)=>a.setUniformMatrix3fv(e,r(o,i))))}},ot=class extends ee{constructor(e,r){super(e,"mat4",D.Pass,((a,o,i)=>a.setUniformMatrix4fv(e,r(o,i))))}};function dt(t){if(t==null)return null;const e=t.offset!=null?t.offset:eo,r=t.rotation!=null?t.rotation:0,a=t.scale!=null?t.scale:to,o=lr(1,0,0,0,1,0,e[0],e[1],1),i=lr(Math.cos(r),-Math.sin(r),0,Math.sin(r),Math.cos(r),0,0,0,1),n=lr(a[0],0,0,0,a[1],0,0,0,1),c=yt();return Kr(c,i,n),Kr(c,o,c),c}let hn=class{constructor(){this.geometries=new Array,this.materials=new Array,this.textures=new Array}},mn=class{constructor(e,r,a){this.name=e,this.lodThreshold=r,this.pivotOffset=a,this.stageResources=new hn,this.numberOfVertices=0}};function fn(t){if(t.length<Ma)return Array.from(t);if(ro(t))return Float64Array.from(t);if(!("BYTES_PER_ELEMENT"in t))return Array.from(t);switch(t.BYTES_PER_ELEMENT){case 1:return Uint8Array.from(t);case 2:return ao(t)?Uint16Array.from(t):Int16Array.from(t);case 4:return Float32Array.from(t);default:return Float64Array.from(t)}}let pn=class Ja{constructor(e,r,a){this.primitiveIndices=e,this._numIndexPerPrimitive=r,this.position=a,this._children=void 0,q(e.length>=1),q(a.size===3||a.size===4);const{data:o,size:i,indices:n}=a;q(n.length%this._numIndexPerPrimitive==0),q(n.length>=e.length*this._numIndexPerPrimitive);const c=e.length;let l=i*n[this._numIndexPerPrimitive*e[0]];De.clear(),De.push(l);const u=Ge(o[l],o[l+1],o[l+2]),d=Dt(u);for(let v=0;v<c;++v){const x=this._numIndexPerPrimitive*e[v];for(let T=0;T<this._numIndexPerPrimitive;++T){l=i*n[x+T],De.push(l);let g=o[l];u[0]=Math.min(g,u[0]),d[0]=Math.max(g,d[0]),g=o[l+1],u[1]=Math.min(g,u[1]),d[1]=Math.max(g,d[1]),g=o[l+2],u[2]=Math.min(g,u[2]),d[2]=Math.max(g,d[2])}}this.bbMin=u,this.bbMax=d;const h=xr(M(),this.bbMin,this.bbMax,.5);this.radius=.5*Math.max(Math.max(d[0]-u[0],d[1]-u[1]),d[2]-u[2]);let p=this.radius*this.radius;for(let v=0;v<De.length;++v){l=De.at(v);const x=o[l]-h[0],T=o[l+1]-h[1],g=o[l+2]-h[2],I=x*x+T*T+g*g;if(I<=p)continue;const C=Math.sqrt(I),$=.5*(C-this.radius);this.radius=this.radius+$,p=this.radius*this.radius;const N=$/C;h[0]+=x*N,h[1]+=T*N,h[2]+=g*N}this.center=h,De.clear()}getChildren(){if(this._children||io(this.bbMin,this.bbMax)<=1)return this._children;const e=xr(M(),this.bbMin,this.bbMax,.5),r=this.primitiveIndices.length,a=new Uint8Array(r),o=new Array(8);for(let d=0;d<8;++d)o[d]=0;const{data:i,size:n,indices:c}=this.position;for(let d=0;d<r;++d){let h=0;const p=this._numIndexPerPrimitive*this.primitiveIndices[d];let v=n*c[p],x=i[v],T=i[v+1],g=i[v+2];for(let I=1;I<this._numIndexPerPrimitive;++I){v=n*c[p+I];const C=i[v],$=i[v+1],N=i[v+2];C<x&&(x=C),$<T&&(T=$),N<g&&(g=N)}x<e[0]&&(h|=1),T<e[1]&&(h|=2),g<e[2]&&(h|=4),a[d]=h,++o[h]}let l=0;for(let d=0;d<8;++d)o[d]>0&&++l;if(l<2)return;const u=new Array(8);for(let d=0;d<8;++d)u[d]=o[d]>0?new Uint32Array(o[d]):void 0;for(let d=0;d<8;++d)o[d]=0;for(let d=0;d<r;++d){const h=a[d];u[h][o[h]++]=this.primitiveIndices[d]}this._children=new Array;for(let d=0;d<8;++d)u[d]!==void 0&&this._children.push(new Ja(u[d],this._numIndexPerPrimitive,this.position));return this._children}static prune(){De.prune()}};const De=new Ca({deallocator:null});let Lr=class{constructor(){this.id=Oa()}};var ye;(function(t){t[t.Layer=0]="Layer",t[t.Object=1]="Object",t[t.Mesh=2]="Mesh",t[t.Line=3]="Line",t[t.Point=4]="Point",t[t.Material=5]="Material",t[t.Texture=6]="Texture",t[t.COUNT=7]="COUNT"})(ye||(ye={}));function vn(t){return t?{p0:Dt(t.p0),p1:Dt(t.p1),p2:Dt(t.p2)}:{p0:M(),p1:M(),p2:M()}}function gn(t,e,r){return Me(hr,e,t),Me(sa,r,t),.5*fe(Mr(hr,hr,sa))}new Ha(Ko);new Ha((()=>vn()));const hr=M(),sa=M();function xn(t,e){if(!t)return!1;const{size:r,data:a,indices:o}=t;j(e,0,0,0),j(oe,0,0,0);let i=0,n=0;for(let c=0;c<o.length-2;c+=3){const l=o[c]*r,u=o[c+1]*r,d=o[c+2]*r;j(X,a[l],a[l+1],a[l+2]),j(Se,a[u],a[u+1],a[u+2]),j(It,a[d],a[d+1],a[d+2]);const h=gn(X,Se,It);h?(me(X,X,Se),me(X,X,It),pe(X,X,1/3*h),me(e,e,X),i+=h):(me(oe,oe,X),me(oe,oe,Se),me(oe,oe,It),n+=3)}return(n!==0||i!==0)&&(i!==0?(pe(e,e,1/i),!0):n!==0&&(pe(e,oe,1/n),!0))}function Tn(t,e){if(!t)return!1;const{size:r,data:a,indices:o}=t;j(e,0,0,0);let i=-1,n=0;for(let c=0;c<o.length;c++){const l=o[c]*r;i!==l&&(e[0]+=a[l],e[1]+=a[l+1],e[2]+=a[l+2],n++),i=l}return n>1&&pe(e,e,1/n),n>0}function _n(t,e,r){if(!t)return!1;j(r,0,0,0),j(oe,0,0,0);let a=0,o=0;const{size:i,data:n,indices:c}=t,l=c.length-1,u=l+(e?2:0);for(let d=0;d<u;d+=2){const h=d<l?d+1:0,p=c[d<l?d:l]*i,v=c[h]*i;X[0]=n[p],X[1]=n[p+1],X[2]=n[p+2],Se[0]=n[v],Se[1]=n[v+1],Se[2]=n[v+2],pe(X,me(X,X,Se),.5);const x=oo(X,Se);x>0?(me(r,r,pe(X,X,x)),a+=x):a===0&&(me(oe,oe,X),o++)}return a!==0?(pe(r,r,1/a),!0):o!==0&&(pe(r,oe,1/o),!0)}const X=M(),Se=M(),It=M(),oe=M();let bn=class{constructor(e){this.channel=e,this.id=Oa()}};function Sn(t,e){return t==null&&(t=[]),t.push(e),t}function En(t,e){if(t==null)return null;const r=t.filter((a=>a!==e));return r.length===0?null:r}let Za=class Ka extends Lr{constructor(e,r,a=null,o=ye.Mesh,i=null,n=-1){super(),this.material=e,this.mapPositions=a,this.type=o,this.objectAndLayerIdColor=i,this.edgeIndicesLength=n,this.visible=!0,this._attributes=new Map,this._boundingInfo=null;for(const[c,l]of r)this._attributes.set(c,{...l,indices:ko(l.indices)}),c===f.POSITION&&(this.edgeIndicesLength=this.edgeIndicesLength<0?this._attributes.get(c).indices.length:this.edgeIndicesLength)}instantiate(e={}){const r=new Ka(e.material||this.material,[],this.mapPositions,this.type,this.objectAndLayerIdColor,this.edgeIndicesLength);return this._attributes.forEach(((a,o)=>{a.exclusive=!1,r._attributes.set(o,a)})),r._boundingInfo=this._boundingInfo,r.transformation=e.transformation||this.transformation,r}get attributes(){return this._attributes}getMutableAttribute(e){let r=this._attributes.get(e);return r&&!r.exclusive&&(r={...r,exclusive:!0,data:fn(r.data)},this._attributes.set(e,r)),r}setAttributeData(e,r){const a=this._attributes.get(e);a&&this._attributes.set(e,{...a,exclusive:!0,data:r})}get indexCount(){const e=this._attributes.values().next().value.indices;return(e==null?void 0:e.length)??0}get faceCount(){return this.indexCount/3}get boundingInfo(){return this._boundingInfo==null&&(this._boundingInfo=this._calculateBoundingInfo()),this._boundingInfo}computeAttachmentOrigin(e){return!!(this.type===ye.Mesh?this._computeAttachmentOriginTriangles(e):this.type===ye.Line?this._computeAttachmentOriginLines(e):this._computeAttachmentOriginPoints(e))&&(this._transformation!=null&&Ce(e,e,this._transformation),!0)}_computeAttachmentOriginTriangles(e){const r=this.attributes.get(f.POSITION);return xn(r,e)}_computeAttachmentOriginLines(e){const r=this.attributes.get(f.POSITION);return _n(r,yn(this.material.parameters,r),e)}_computeAttachmentOriginPoints(e){const r=this.attributes.get(f.POSITION);return Tn(r,e)}invalidateBoundingInfo(){this._boundingInfo=null}_calculateBoundingInfo(){const e=this.attributes.get(f.POSITION);if(!e||e.indices.length===0)return null;const r=this.type===ye.Mesh?3:1;q(e.indices.length%r==0,"Indexing error: "+e.indices.length+" not divisible by "+r);const a=Va(e.indices.length/r);return new pn(a,r,e)}get transformation(){return this._transformation??Ut}set transformation(e){this._transformation=e&&e!==Ut?Ro(e):null}addHighlight(){const e=new bn(Jo.Highlight);return this.highlights=Sn(this.highlights,e),e}removeHighlight(e){this.highlights=En(this.highlights,e)}};function yn(t,e){return!(!("isClosed"in t)||!t.isClosed)&&e.indices.length>2}function An(){return la??(la=(async()=>{const t=await wt(()=>import("./basis_transcoder-DDr9ZhVb.js"),[]),e=await t.default({locateFile:r=>no(`esri/libs/basisu/${r}`)});return e.initializeBasis(),e})()),la}let la;var Be;(function(t){t[t.ETC1_RGB=0]="ETC1_RGB",t[t.ETC2_RGBA=1]="ETC2_RGBA",t[t.BC1_RGB=2]="BC1_RGB",t[t.BC3_RGBA=3]="BC3_RGBA",t[t.BC4_R=4]="BC4_R",t[t.BC5_RG=5]="BC5_RG",t[t.BC7_M6_RGB=6]="BC7_M6_RGB",t[t.BC7_M5_RGBA=7]="BC7_M5_RGBA",t[t.PVRTC1_4_RGB=8]="PVRTC1_4_RGB",t[t.PVRTC1_4_RGBA=9]="PVRTC1_4_RGBA",t[t.ASTC_4x4_RGBA=10]="ASTC_4x4_RGBA",t[t.ATC_RGB=11]="ATC_RGB",t[t.ATC_RGBA=12]="ATC_RGBA",t[t.FXT1_RGB=17]="FXT1_RGB",t[t.PVRTC2_4_RGB=18]="PVRTC2_4_RGB",t[t.PVRTC2_4_RGBA=19]="PVRTC2_4_RGBA",t[t.ETC2_EAC_R11=20]="ETC2_EAC_R11",t[t.ETC2_EAC_RG11=21]="ETC2_EAC_RG11",t[t.RGBA32=13]="RGBA32",t[t.RGB565=14]="RGB565",t[t.BGR565=15]="BGR565",t[t.RGBA4444=16]="RGBA4444"})(Be||(Be={}));let ue=null,Pt=null;async function Qa(){return Pt==null&&(Pt=An(),ue=await Pt),Pt}function wn(t,e){if(ue==null)return t.byteLength;const r=new ue.BasisFile(new Uint8Array(t)),a=ti(r)?ei(r.getNumLevels(0),r.getHasAlpha(),r.getImageWidth(0,0),r.getImageHeight(0,0),e):0;return r.close(),r.delete(),a}function Mn(t,e){if(ue==null)return t.byteLength;const r=new ue.KTX2File(new Uint8Array(t)),a=ri(r)?ei(r.getLevels(),r.getHasAlpha(),r.getWidth(),r.getHeight(),e):0;return r.close(),r.delete(),a}function ei(t,e,r,a,o){const i=an(e?Ee.COMPRESSED_RGBA8_ETC2_EAC:Ee.COMPRESSED_RGB8_ETC2),n=o&&t>1?(4**t-1)/(3*4**(t-1)):1;return Math.ceil(r*a*i*n)}function ti(t){return t.getNumImages()>=1&&!t.isUASTC()}function ri(t){return t.getFaces()>=1&&t.isETC1S()}async function Cn(t,e,r){ue==null&&(ue=await Qa());const a=new ue.BasisFile(new Uint8Array(r));if(!ti(a))return null;a.startTranscoding();const o=ai(t,e,a.getNumLevels(0),a.getHasAlpha(),a.getImageWidth(0,0),a.getImageHeight(0,0),((i,n)=>a.getImageTranscodedSizeInBytes(0,i,n)),((i,n,c)=>a.transcodeImage(c,0,i,n,0,0)));return a.close(),a.delete(),o}async function On(t,e,r){ue==null&&(ue=await Qa());const a=new ue.KTX2File(new Uint8Array(r));if(!ri(a))return null;a.startTranscoding();const o=ai(t,e,a.getLevels(),a.getHasAlpha(),a.getWidth(),a.getHeight(),((i,n)=>a.getImageTranscodedSizeInBytes(i,0,0,n)),((i,n,c)=>a.transcodeImage(c,i,0,0,n,0,-1,-1)));return a.close(),a.delete(),o}function ai(t,e,r,a,o,i,n,c){const{compressedTextureETC:l,compressedTextureS3TC:u}=t.capabilities,[d,h]=l?a?[Be.ETC2_RGBA,Ee.COMPRESSED_RGBA8_ETC2_EAC]:[Be.ETC1_RGB,Ee.COMPRESSED_RGB8_ETC2]:u?a?[Be.BC3_RGBA,Ee.COMPRESSED_RGBA_S3TC_DXT5_EXT]:[Be.BC1_RGB,Ee.COMPRESSED_RGB_S3TC_DXT1_EXT]:[Be.RGBA32,Fe.RGBA],p=e.hasMipmap?r:Math.min(1,r),v=[];for(let x=0;x<p;x++)v.push(new Uint8Array(n(x,d))),c(x,d,v[x]);return e.internalFormat=h,e.hasMipmap=v.length>1,e.samplingMode=e.hasMipmap?nt.LINEAR_MIPMAP_LINEAR:nt.LINEAR,e.width=o,e.height=i,new it(t,e,{type:"compressed",levels:v})}const $t=()=>Cr.getLogger("esri.views.3d.webgl-engine.lib.DDSUtil"),Rn=542327876,In=131072,Pn=4;function Nr(t){return t.charCodeAt(0)+(t.charCodeAt(1)<<8)+(t.charCodeAt(2)<<16)+(t.charCodeAt(3)<<24)}function $n(t){return String.fromCharCode(255&t,t>>8&255,t>>16&255,t>>24&255)}const Ln=Nr("DXT1"),Nn=Nr("DXT3"),Dn=Nr("DXT5"),Fn=31,Bn=0,zn=1,Gn=2,Vn=3,Un=4,jn=7,Hn=20,Wn=21;function qn(t,e,r){const a=kn(r,e.hasMipmap??!1);if(a==null)throw new Error("DDS texture data is null");const{textureData:o,internalFormat:i,width:n,height:c}=a;return e.samplingMode=o.levels.length>1?nt.LINEAR_MIPMAP_LINEAR:nt.LINEAR,e.hasMipmap=o.levels.length>1,e.internalFormat=i,e.width=n,e.height=c,new it(t,e,o)}function kn(t,e){const r=new Int32Array(t,0,Fn);if(r[Bn]!==Rn)return $t().error("Invalid magic number in DDS header"),null;if(!(r[Hn]&Pn))return $t().error("Unsupported format, must contain a FourCC code"),null;const a=r[Wn];let o,i;switch(a){case Ln:o=8,i=Ee.COMPRESSED_RGB_S3TC_DXT1_EXT;break;case Nn:o=16,i=Ee.COMPRESSED_RGBA_S3TC_DXT3_EXT;break;case Dn:o=16,i=Ee.COMPRESSED_RGBA_S3TC_DXT5_EXT;break;default:return $t().error("Unsupported FourCC code:",$n(a)),null}let n=1,c=r[Un],l=r[Vn];(3&c||3&l)&&($t().warn("Rounding up compressed texture size to nearest multiple of 4."),c=c+3&-4,l=l+3&-4);const u=c,d=l;let h,p;r[Gn]&In&&e!==!1&&(n=Math.max(1,r[jn]));let v=r[zn]+4;const x=[];for(let T=0;T<n;++T)p=(c+3>>2)*(l+3>>2)*o,h=new Uint8Array(t,v,p),x.push(h),v+=p,c=Math.max(1,c>>1),l=Math.max(1,l>>1);return{textureData:{type:"compressed",levels:x},internalFormat:i,width:u,height:d}}function Yn(t,e){let i=t.width*t.height;if(i<4096)return t instanceof ImageData?ii(t):t;let n=t.width,c=t.height;do n=Math.ceil(n/2),c=Math.ceil(c/2),i=n*c;while(i>1048576||e!=null&&(n>e||c>e));return Dr(t,n,c)}function Xn(t,e){const r=Math.max(t.width,t.height);if(r<=e)return t;const a=e/r;return Dr(t,Math.round(t.width*a),Math.round(t.height*a))}function Dr(t,e,r){if(t instanceof ImageData)return Dr(ii(t),e,r);const a=document.createElement("canvas");return a.width=e,a.height=r,a.getContext("2d").drawImage(t,0,0,a.width,a.height),a}function ii(t){const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const r=e.getContext("2d");if(r==null)throw new St("Failed to create 2d context from HTMLCanvasElement");return r.putImageData(t,0,0),e}let oi=class extends Lr{get parameters(){return this._parameters}constructor(e,r){super(),this._data=e,this.type=ye.Texture,this._glTexture=null,this._loadingPromise=null,this._loadingController=null,this.events=new so,this._parameters={...Zn,...r},this._startPreload(e)}dispose(){this.unload(),this._data=this.frameUpdate=void 0}_startPreload(e){e!=null&&(e instanceof HTMLVideoElement?(this.frameUpdate=r=>this._frameUpdate(e,r),this._startPreloadVideoElement(e)):e instanceof HTMLImageElement&&this._startPreloadImageElement(e))}_startPreloadVideoElement(e){if(!(Qr(e.src)||e.preload==="auto"&&e.crossOrigin)){e.preload="auto",e.crossOrigin="anonymous";const r=!e.paused;if(e.src=e.src,r&&e.autoplay){const a=()=>{e.removeEventListener("canplay",a),e.play()};e.addEventListener("canplay",a)}}}_startPreloadImageElement(e){lo(e.src)||Qr(e.src)||e.crossOrigin||(e.crossOrigin="anonymous",e.src=e.src)}_createDescriptor(e){const r=new qa;return r.wrapMode=this._parameters.wrap??Ue.REPEAT,r.flipped=!this._parameters.noUnpackFlip,r.samplingMode=this._parameters.mipmap?nt.LINEAR_MIPMAP_LINEAR:nt.LINEAR,r.hasMipmap=!!this._parameters.mipmap,r.preMultiplyAlpha=!!this._parameters.preMultiplyAlpha,r.maxAnisotropy=this._parameters.maxAnisotropy??(this._parameters.mipmap?e.parameters.maxMaxAnisotropy:1),r}get glTexture(){return this._glTexture}get memoryEstimate(){var e;return((e=this._glTexture)==null?void 0:e.usedMemory)||Jn(this._data,this._parameters)}load(e){if(this._glTexture)return this._glTexture;if(this._loadingPromise)return this._loadingPromise;const r=this._data;return r==null?(this._glTexture=new it(e,this._createDescriptor(e),null),this._glTexture):(this._parameters.reloadable||(this._data=void 0),typeof r=="string"?this._loadFromURL(e,r):r instanceof Image?this._loadFromImageElement(e,r):r instanceof HTMLVideoElement?this._loadFromVideoElement(e,r):r instanceof ImageData||r instanceof HTMLCanvasElement?this._loadFromImage(e,r):(ht(r)||mt(r))&&this._parameters.encoding===vt.DDS_ENCODING?this._loadFromDDSData(e,r):(ht(r)||mt(r))&&this._parameters.encoding===vt.KTX2_ENCODING?this._loadFromKTX2(e,r):(ht(r)||mt(r))&&this._parameters.encoding===vt.BASIS_ENCODING?this._loadFromBasis(e,r):mt(r)?this._loadFromPixelData(e,r):ht(r)?this._loadFromPixelData(e,new Uint8Array(r)):null)}_frameUpdate(e,r){return this._glTexture==null||e.readyState<xt.HAVE_CURRENT_DATA||r===e.currentTime?r:(this._glTexture.setData(e),this._glTexture.descriptor.hasMipmap&&this._glTexture.generateMipmap(),this._parameters.updateCallback&&this._parameters.updateCallback(),e.currentTime)}_loadFromDDSData(e,r){return this._glTexture=qn(e,this._createDescriptor(e),r),this._glTexture}_loadFromKTX2(e,r){return this._loadAsync((()=>On(e,this._createDescriptor(e),r).then((a=>(this._glTexture=a,a)))))}_loadFromBasis(e,r){return this._loadAsync((()=>Cn(e,this._createDescriptor(e),r).then((a=>(this._glTexture=a,a)))))}_loadFromPixelData(e,r){q(this._parameters.width>0&&this._parameters.height>0);const a=this._createDescriptor(e);return a.pixelFormat=this._parameters.components===1?Fe.LUMINANCE:this._parameters.components===3?Fe.RGB:Fe.RGBA,a.width=this._parameters.width??0,a.height=this._parameters.height??0,this._glTexture=new it(e,a,r),this._glTexture}_loadFromURL(e,r){return this._loadAsync((async a=>{const o=await Ua(r,{signal:a});return ea(a),this._loadFromImage(e,o)}))}_loadFromImageElement(e,r){return r.complete?this._loadFromImage(e,r):this._loadAsync((async a=>{const o=await co(r,r.src,!1,a);return ea(a),this._loadFromImage(e,o)}))}_loadFromVideoElement(e,r){return r.readyState>=xt.HAVE_CURRENT_DATA?this._loadFromImage(e,r):this._loadFromVideoElementAsync(e,r)}_loadFromVideoElementAsync(e,r){return this._loadAsync((a=>new Promise(((o,i)=>{const n=()=>{r.removeEventListener("loadeddata",c),r.removeEventListener("error",l),mo(u)},c=()=>{r.readyState>=xt.HAVE_CURRENT_DATA&&(n(),o(this._loadFromImage(e,r)))},l=d=>{n(),i(d||new St("Failed to load video"))};r.addEventListener("loadeddata",c),r.addEventListener("error",l);const u=uo(a,(()=>l(ho())))}))))}_loadFromImage(e,r){let a=r;if(!(a instanceof HTMLVideoElement)){const{maxTextureSize:n}=e.parameters;a=this._parameters.downsampleUncompressed?Yn(a,n):Xn(a,n)}const o=ni(a);this._parameters.width=o.width,this._parameters.height=o.height;const i=this._createDescriptor(e);return i.pixelFormat=this._parameters.components===3?Fe.RGB:Fe.RGBA,i.width=o.width,i.height=o.height,this._glTexture=new it(e,i,a),this._glTexture}_loadAsync(e){const r=new AbortController;this._loadingController=r;const a=e(r.signal);this._loadingPromise=a;const o=()=>{this._loadingController===r&&(this._loadingController=null),this._loadingPromise===a&&(this._loadingPromise=null)};return a.then(o,o),a}unload(){if(this._glTexture=zt(this._glTexture),this._loadingController!=null){const e=this._loadingController;this._loadingController=null,this._loadingPromise=null,e.abort()}this.events.emit("unloaded")}};function Jn(t,e){if(t==null)return 0;if(ht(t)||mt(t))return e.encoding===vt.KTX2_ENCODING?Mn(t,!!e.mipmap):e.encoding===vt.BASIS_ENCODING?wn(t,!!e.mipmap):t.byteLength;const{width:r,height:a}=t instanceof Image||t instanceof ImageData||t instanceof HTMLCanvasElement||t instanceof HTMLVideoElement?ni(t):e;return(e.mipmap?4/3:1)*r*a*(e.components||4)||0}function ni(t){return t instanceof HTMLVideoElement?{width:t.videoWidth,height:t.videoHeight}:t}var xt;(function(t){t[t.HAVE_NOTHING=0]="HAVE_NOTHING",t[t.HAVE_METADATA=1]="HAVE_METADATA",t[t.HAVE_CURRENT_DATA=2]="HAVE_CURRENT_DATA",t[t.HAVE_FUTURE_DATA=3]="HAVE_FUTURE_DATA",t[t.HAVE_ENOUGH_DATA=4]="HAVE_ENOUGH_DATA"})(xt||(xt={}));const Zn={wrap:{s:Ue.REPEAT,t:Ue.REPEAT},mipmap:!0,noUnpackFlip:!1,preMultiplyAlpha:!1,downsampleUncompressed:!1};function Kn(t,e){const r=t.fragment;switch(r.code.add(s`struct ShadingNormalParameters {
vec3 normalView;
vec3 viewDirection;
} shadingParams;`),e.doubleSidedMode){case re.None:r.code.add(s`vec3 shadingNormal(ShadingNormalParameters params) {
return normalize(params.normalView);
}`);break;case re.View:r.code.add(s`vec3 shadingNormal(ShadingNormalParameters params) {
return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
}`);break;case re.WindingOrder:r.code.add(s`vec3 shadingNormal(ShadingNormalParameters params) {
return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
}`);break;default:Et(e.doubleSidedMode);case re.COUNT:}}var re;(function(t){t[t.None=0]="None",t[t.View=1]="View",t[t.WindingOrder=2]="WindingOrder",t[t.COUNT=3]="COUNT"})(re||(re={}));var Y;function ze(t,e){switch(e.textureCoordinateType){case Y.Default:return t.attributes.add(f.UV0,"vec2"),t.varyings.add("vuv0","vec2"),void t.vertex.code.add(s`void forwardTextureCoordinates() {
vuv0 = uv0;
}`);case Y.Compressed:return t.attributes.add(f.UV0,"vec2"),t.varyings.add("vuv0","vec2"),void t.vertex.code.add(s`vec2 getUV0() {
return uv0 / 16384.0;
}
void forwardTextureCoordinates() {
vuv0 = getUV0();
}`);case Y.Atlas:return t.attributes.add(f.UV0,"vec2"),t.varyings.add("vuv0","vec2"),t.attributes.add(f.UVREGION,"vec4"),t.varyings.add("vuvRegion","vec4"),void t.vertex.code.add(s`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);default:Et(e.textureCoordinateType);case Y.None:return void t.vertex.code.add(s`void forwardTextureCoordinates() {}`);case Y.COUNT:return}}(function(t){t[t.None=0]="None",t[t.Default=1]="Default",t[t.Atlas=2]="Atlas",t[t.Compressed=3]="Compressed",t[t.COUNT=4]="COUNT"})(Y||(Y={}));function Qn(t){t.fragment.code.add(s`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function si(t,e){switch(t.include(ze,e),e.textureCoordinateType){case Y.Default:case Y.Compressed:return void t.fragment.code.add(s`vec4 textureLookup(sampler2D tex, vec2 uv) {
return texture(tex, uv);
}`);case Y.Atlas:return t.include(Qn),void t.fragment.code.add(s`vec4 textureLookup(sampler2D tex, vec2 uv) {
return textureAtlasLookup(tex, uv, vuvRegion);
}`);default:Et(e.textureCoordinateType);case Y.None:case Y.COUNT:return}}let Q=class extends ee{constructor(e,r){super(e,"sampler2D",D.Pass,((a,o,i)=>a.bindTexture(e,r(o,i))))}},es=class{constructor(e){this._material=e.material,this._techniques=e.techniques,this._output=e.output}dispose(){this._techniques.release(this._technique)}get technique(){return this._technique}get _stippleTextures(){return this._techniques.constructionContext.stippleTextures}get _markerTextures(){return this._techniques.constructionContext.markerTextures}ensureTechnique(e,r){return this._technique=this._techniques.releaseAndAcquire(e,this._material.getConfiguration(this._output,r),this._technique),this._technique}ensureResources(e){return Sr.LOADED}},ts=class extends es{constructor(e){super(e),this._numLoading=0,this._disposed=!1,this._textures=e.textures,this._textureId=e.textureId,this._acquire(e.textureId,(r=>this._texture=r)),this._acquire(e.normalTextureId,(r=>this._textureNormal=r)),this._acquire(e.emissiveTextureId,(r=>this._textureEmissive=r)),this._acquire(e.occlusionTextureId,(r=>this._textureOcclusion=r)),this._acquire(e.metallicRoughnessTextureId,(r=>this._textureMetallicRoughness=r))}dispose(){this._texture=Ne(this._texture),this._textureNormal=Ne(this._textureNormal),this._textureEmissive=Ne(this._textureEmissive),this._textureOcclusion=Ne(this._textureOcclusion),this._textureMetallicRoughness=Ne(this._textureMetallicRoughness),this._disposed=!0}ensureResources(e){return this._numLoading===0?Sr.LOADED:Sr.LOADING}get textureBindParameters(){return new rs(this._texture!=null?this._texture.glTexture:null,this._textureNormal!=null?this._textureNormal.glTexture:null,this._textureEmissive!=null?this._textureEmissive.glTexture:null,this._textureOcclusion!=null?this._textureOcclusion.glTexture:null,this._textureMetallicRoughness!=null?this._textureMetallicRoughness.glTexture:null)}updateTexture(e){this._texture!=null&&e===this._texture.id||(this._texture=Ne(this._texture),this._textureId=e,this._acquire(this._textureId,(r=>this._texture=r)))}_acquire(e,r){if(e==null)return void r(null);const a=this._textures.acquire(e);if(fo(a))return++this._numLoading,void a.then((o=>{if(this._disposed)return Ne(o),void r(null);r(o)})).finally((()=>--this._numLoading));r(a)}},rs=class extends Mt{constructor(e=null,r=null,a=null,o=null,i=null,n,c){super(),this.texture=e,this.textureNormal=r,this.textureEmissive=a,this.textureOcclusion=o,this.textureMetallicRoughness=i,this.scale=n,this.normalTextureTransformMatrix=c}};var L;(function(t){t[t.Disabled=0]="Disabled",t[t.Normal=1]="Normal",t[t.Schematic=2]="Schematic",t[t.Water=3]="Water",t[t.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",t[t.Simplified=5]="Simplified",t[t.TerrainWithWater=6]="TerrainWithWater",t[t.COUNT=7]="COUNT"})(L||(L={}));function li(t,e){const r=t.fragment,a=e.hasMetallicRoughnessTexture||e.hasEmissionTexture||e.hasOcclusionTexture;if(e.pbrMode===L.Normal&&a&&t.include(si,e),e.pbrMode!==L.Schematic)if(e.pbrMode!==L.Disabled){if(e.pbrMode===L.Normal){r.code.add(s`vec3 mrr;
vec3 emission;
float occlusion;`);const o=e.pbrTextureBindType;e.hasMetallicRoughnessTexture&&(r.uniforms.add(o===D.Pass?new Q("texMetallicRoughness",(i=>i.textureMetallicRoughness)):new gt("texMetallicRoughness",(i=>i.textureMetallicRoughness))),r.code.add(s`void applyMetallnessAndRoughness(vec2 uv) {
vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
mrr[0] *= metallicRoughness.b;
mrr[1] *= metallicRoughness.g;
}`)),e.hasEmissionTexture&&(r.uniforms.add(o===D.Pass?new Q("texEmission",(i=>i.textureEmissive)):new gt("texEmission",(i=>i.textureEmissive))),r.code.add(s`void applyEmission(vec2 uv) {
emission *= textureLookup(texEmission, uv).rgb;
}`)),e.hasOcclusionTexture?(r.uniforms.add(o===D.Pass?new Q("texOcclusion",(i=>i.textureOcclusion)):new gt("texOcclusion",(i=>i.textureOcclusion))),r.code.add(s`void applyOcclusion(vec2 uv) {
occlusion *= textureLookup(texOcclusion, uv).r;
}
float getBakedOcclusion() {
return occlusion;
}`)):r.code.add(s`float getBakedOcclusion() { return 1.0; }`),o===D.Pass?r.uniforms.add(new Z("emissionFactor",(i=>i.emissiveFactor)),new Z("mrrFactors",(i=>i.mrrFactors))):r.uniforms.add(new de("emissionFactor",(i=>i.emissiveFactor)),new de("mrrFactors",(i=>i.mrrFactors))),r.code.add(s`
    void applyPBRFactors() {
      mrr = mrrFactors;
      emission = emissionFactor;
      occlusion = 1.0;

      ${e.hasMetallicRoughnessTexture?s`applyMetallnessAndRoughness(${e.hasMetallicRoughnessTextureTransform?s`metallicRoughnessUV`:"vuv0"});`:""}

      ${e.hasEmissionTexture?s`applyEmission(${e.hasEmissiveTextureTransform?s`emissiveUV`:"vuv0"});`:""}

      ${e.hasOcclusionTexture?s`applyOcclusion(${e.hasOcclusionTextureTransform?s`occlusionUV`:"vuv0"});`:""}
    }
  `)}}else r.code.add(s`float getBakedOcclusion() { return 1.0; }`);else r.code.add(s`vec3 mrr = vec3(0.0, 0.6, 0.2);
vec3 emission = vec3(0.0);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`)}const er=new Map([[f.POSITION,0],[f.NORMAL,1],[f.NORMALCOMPRESSED,1],[f.UV0,2],[f.COLOR,3],[f.COLORFEATUREATTRIBUTE,3],[f.SIZE,4],[f.TANGENT,4],[f.CENTEROFFSETANDDISTANCE,5],[f.SYMBOLCOLOR,5],[f.FEATUREATTRIBUTE,6],[f.INSTANCEFEATUREATTRIBUTE,6],[f.INSTANCECOLOR,7],[f.OBJECTANDLAYERIDCOLOR,7],[f.INSTANCEOBJECTANDLAYERIDCOLOR,7],[f.INSTANCEMODEL,8],[f.INSTANCEMODELNORMAL,12],[f.INSTANCEMODELORIGINHI,11],[f.INSTANCEMODELORIGINLO,15]]);function as(t){return Math.abs(t*t*t)}function is(t,e,r){const a=r.parameters;return mr.scale=Math.min(a.divisor/(e-a.offset),1),mr.factor=as(t),mr}function os(t,e){return po(t*Math.max(e.scale,e.minScaleFactor),t,e.factor)}function ns(t,e,r,a){return os(t,is(e,r,a))}const mr={scale:0,factor:0,minScaleFactor:0};function ss(t,e,r,a,o){let i=(r.screenLength||0)*t.pixelRatio;o!=null&&(i=ns(i,a,e,o));const n=i*Math.tan(.5*t.fovY)/(.5*t.fullHeight);return Ra(n*e,r.minWorldLength||0,r.maxWorldLength!=null?r.maxWorldLength:1/0)}function ci(t,e){const r=e?ci(e):{};for(const a in t){let o=t[a];o!=null&&o.forEach&&(o=cs(o)),o==null&&a in r||(r[a]=o)}return r}function ls(t,e){let r=!1;for(const a in e){const o=e[a];o!==void 0&&(Array.isArray(o)?t[a]===null?(t[a]=o.slice(),r=!0):vo(t[a],o)&&(r=!0):t[a]!==o&&(r=!0,t[a]=o))}return r}function cs(t){const e=[];return t.forEach((r=>e.push(r))),e}const ds={multiply:1,ignore:2,replace:3,tint:4};let us=class extends Lr{constructor(e,r){super(),this.type=ye.Material,this.supportsEdges=!1,this._visible=!0,this._renderPriority=0,this._vertexAttributeLocations=er,this._pp0=Ge(0,0,1),this._pp1=Ge(0,0,0),this._parameters=ci(e,r),this.validateParameters(this._parameters)}get parameters(){return this._parameters}update(e){return!1}setParameters(e,r=!0){ls(this._parameters,e)&&(this.validateParameters(this._parameters),r&&this.parametersChanged())}validateParameters(e){}get visible(){return this._visible}set visible(e){e!==this._visible&&(this._visible=e,this.parametersChanged())}shouldRender(e){return this.isVisible()&&this.isVisibleForOutput(e.output)&&(!this.parameters.isDecoration||e.bindParameters.decorations===Zo.ON)&&!!(this.parameters.renderOccluded&e.renderOccludedMask)}isVisibleForOutput(e){return!0}get renderPriority(){return this._renderPriority}set renderPriority(e){e!==this._renderPriority&&(this._renderPriority=e,this.parametersChanged())}get vertexAttributeLocations(){return this._vertexAttributeLocations}isVisible(){return this._visible}parametersChanged(){var e;(e=this.repository)==null||e.materialChanged(this)}queryRenderOccludedState(e){return this.isVisible()&&this.parameters.renderOccluded===e}intersectDraped(e,r,a,o,i,n){return this._pp0[0]=this._pp1[0]=o[0],this._pp0[1]=this._pp1[1]=o[1],this.intersect(e,r,a,this._pp0,this._pp1,i)}};var Er;(function(t){t[t.None=0]="None",t[t.Occlude=1]="Occlude",t[t.Transparent=2]="Transparent",t[t.OccludeAndTransparent=4]="OccludeAndTransparent",t[t.OccludeAndTransparentStencil=8]="OccludeAndTransparentStencil",t[t.Opaque=16]="Opaque"})(Er||(Er={}));var ae;(function(t){t[t.ColorAlpha=0]="ColorAlpha",t[t.FrontFace=1]="FrontFace",t[t.NONE=2]="NONE",t[t.COUNT=3]="COUNT"})(ae||(ae={}));const hs=ka(we.SRC_ALPHA,we.ONE,we.ONE_MINUS_SRC_ALPHA,we.ONE_MINUS_SRC_ALPHA),ms=ka(we.ONE,we.ZERO,we.ONE,we.ONE_MINUS_SRC_ALPHA);function fs(t){return t===ae.FrontFace?null:ms}const ps=5e5,vs={factor:-1,units:-2};function gs(t){return t?vs:null}function xs(t,e=ve.LESS){return t===ae.NONE||t===ae.FrontFace?e:ve.LEQUAL}function Ts(t){return t===ae.ColorAlpha?{buffers:[na.COLOR_ATTACHMENT0,na.COLOR_ATTACHMENT1]}:null}let _s=class{constructor(e=!1,r=!0){this.isVerticalRay=e,this.normalRequired=r}};const Lt=To();function bs(t,e,r,a,o,i){if(!t.visible)return;const n=at(Ns,a,r),c=(u,d,h)=>{i(u,h,d,!1)},l=new _s(!1,e.options.normalRequired);if(t.boundingInfo){q(t.type===ye.Mesh);const u=e.tolerance;di(t.boundingInfo,r,n,u,o,l,c)}else{const u=t.attributes.get(f.POSITION),d=u.indices;ys(r,n,0,d.length/3,d,u.data,u.stride,o,l,c)}}const Ss=M();function di(t,e,r,a,o,i,n){if(t==null)return;const c=Rs(r,Ss);if(go(Lt,t.bbMin),xo(Lt,t.bbMax),o!=null&&o.applyToAabb(Lt),Is(Lt,e,c,a)){const{primitiveIndices:l,position:u}=t,d=l?l.length:u.indices.length/3;if(d>$s){const h=t.getChildren();if(h!==void 0){for(const p of h)di(p,e,r,a,o,i,n);return}}Es(e,r,0,d,u.indices,u.data,u.stride,l,o,i,n)}}const ft=M();function Es(t,e,r,a,o,i,n,c,l,u,d){const h=t[0],p=t[1],v=t[2],x=e[0],T=e[1],g=e[2],{normalRequired:I}=u;for(let C=r;C<a;++C){const $=c[C],N=3*$,V=n*o[N];let z=i[V],w=i[V+1],b=i[V+2];const A=n*o[N+1];let R=i[A],S=i[A+1],E=i[A+2];const O=n*o[N+2];let U=i[O],P=i[O+1],F=i[O+2];l!=null&&([z,w,b]=l.applyToVertex(z,w,b,C),[R,S,E]=l.applyToVertex(R,S,E,C),[U,P,F]=l.applyToVertex(U,P,F,C));const H=R-z,le=S-w,he=E-b,Ie=U-z,Pe=P-w,xe=F-b,$e=T*xe-Pe*g,Le=g*Ie-xe*x,je=x*Pe-Ie*T,ce=H*$e+le*Le+he*je;if(Math.abs(ce)<=Ls)continue;const He=h-z,nr=p-w,sr=v-b,We=He*$e+nr*Le+sr*je;if(ce>0){if(We<0||We>ce)continue}else if(We>0||We<ce)continue;const Yr=nr*he-le*sr,Xr=sr*H-he*He,Jr=He*le-H*nr,Ct=x*Yr+T*Xr+g*Jr;if(ce>0){if(Ct<0||We+Ct>ce)continue}else if(Ct>0||We+Ct<ce)continue;const Zr=(Ie*Yr+Pe*Xr+xe*Jr)/ce;Zr>=0&&d(Zr,$,I?Cs(H,le,he,Ie,Pe,xe,ft):null)}}function ys(t,e,r,a,o,i,n,c,l,u){const d=e,h=Ds,p=Math.abs(d[0]),v=Math.abs(d[1]),x=Math.abs(d[2]),T=p>=v?p>=x?0:2:v>=x?1:2,g=T,I=d[g]<0?2:1,C=(T+I)%3,$=(T+(3-I))%3,N=d[C]/d[g],V=d[$]/d[g],z=1/d[g],w=As,b=ws,A=Ms,{normalRequired:R}=l;for(let S=r;S<a;++S){const E=3*S,O=n*o[E];j(h[0],i[O+0],i[O+1],i[O+2]);const U=n*o[E+1];j(h[1],i[U+0],i[U+1],i[U+2]);const P=n*o[E+2];j(h[2],i[P+0],i[P+1],i[P+2]),c&&(Ft(h[0],c.applyToVertex(h[0][0],h[0][1],h[0][2],S)),Ft(h[1],c.applyToVertex(h[1][0],h[1][1],h[1][2],S)),Ft(h[2],c.applyToVertex(h[2][0],h[2][1],h[2][2],S))),at(w,h[0],t),at(b,h[1],t),at(A,h[2],t);const F=w[C]-N*w[g],H=w[$]-V*w[g],le=b[C]-N*b[g],he=b[$]-V*b[g],Ie=A[C]-N*A[g],Pe=A[$]-V*A[g],xe=Ie*he-Pe*le,$e=F*Pe-H*Ie,Le=le*H-he*F;if((xe<0||$e<0||Le<0)&&(xe>0||$e>0||Le>0))continue;const je=xe+$e+Le;if(je===0)continue;const ce=xe*(z*w[g])+$e*(z*b[g])+Le*(z*A[g]);if(ce*Math.sign(je)<0)continue;const He=ce/je;He>=0&&u(He,S,R?Os(h):null)}}const As=M(),ws=M(),Ms=M();function Cs(t,e,r,a,o,i,n){return j(Ht,t,e,r),j(Wt,a,o,i),Mr(n,Ht,Wt),Yt(n,n),n}function Os(t){return at(Ht,t[1],t[0]),at(Wt,t[2],t[0]),Mr(ft,Ht,Wt),Yt(ft,ft),ft}const Ht=M(),Wt=M();function Rs(t,e){return j(e,1/t[0],1/t[1],1/t[2])}function Is(t,e,r,a){return Ps(t,e,r,a,1/0)}function Ps(t,e,r,a,o){const i=(t[0]-a-e[0])*r[0],n=(t[3]+a-e[0])*r[0];let c=Math.min(i,n),l=Math.max(i,n);const u=(t[1]-a-e[1])*r[1],d=(t[4]+a-e[1])*r[1];if(l=Math.min(l,Math.max(u,d)),l<0||(c=Math.max(c,Math.min(u,d)),c>l))return!1;const h=(t[2]-a-e[2])*r[2],p=(t[5]+a-e[2])*r[2];return l=Math.min(l,Math.max(h,p)),!(l<0)&&(c=Math.max(c,Math.min(h,p)),!(c>l)&&c<o)}const $s=1e3,Ls=1e-7,Ns=M(),Ds=[M(),M(),M()];var Tt;(function(t){t[t.INTEGRATED_MESH=0]="INTEGRATED_MESH",t[t.OPAQUE_TERRAIN=1]="OPAQUE_TERRAIN",t[t.OPAQUE_MATERIAL=2]="OPAQUE_MATERIAL",t[t.OPAQUE_NO_SSAO_DEPTH=3]="OPAQUE_NO_SSAO_DEPTH",t[t.TRANSPARENT_MATERIAL=4]="TRANSPARENT_MATERIAL",t[t.TRANSPARENT_NO_SSAO_DEPTH=5]="TRANSPARENT_NO_SSAO_DEPTH",t[t.TRANSPARENT_TERRAIN=6]="TRANSPARENT_TERRAIN",t[t.TRANSPARENT_DEPTH_WRITE_DISABLED_MATERIAL=7]="TRANSPARENT_DEPTH_WRITE_DISABLED_MATERIAL",t[t.OCCLUDED_TERRAIN=8]="OCCLUDED_TERRAIN",t[t.OCCLUDER_MATERIAL=9]="OCCLUDER_MATERIAL",t[t.TRANSPARENT_OCCLUDER_MATERIAL=10]="TRANSPARENT_OCCLUDER_MATERIAL",t[t.OCCLUSION_PIXELS=11]="OCCLUSION_PIXELS",t[t.OPAQUE_ENVIRONMENT=12]="OPAQUE_ENVIRONMENT",t[t.TRANSPARENT_ENVIRONMENT=13]="TRANSPARENT_ENVIRONMENT",t[t.LASERLINES=14]="LASERLINES",t[t.LASERLINES_CONTRAST_CONTROL=15]="LASERLINES_CONTRAST_CONTROL",t[t.HUD_MATERIAL=16]="HUD_MATERIAL",t[t.LABEL_MATERIAL=17]="LABEL_MATERIAL",t[t.LINE_CALLOUTS=18]="LINE_CALLOUTS",t[t.LINE_CALLOUTS_HUD_DEPTH=19]="LINE_CALLOUTS_HUD_DEPTH",t[t.DRAPED_MATERIAL=20]="DRAPED_MATERIAL",t[t.DRAPED_WATER=21]="DRAPED_WATER",t[t.VIEWSHED=22]="VIEWSHED",t[t.VOXEL=23]="VOXEL",t[t.MAX_SLOTS=24]="MAX_SLOTS"})(Tt||(Tt={}));let Fs=class{constructor(e=0){this.componentLocalOriginLength=0,this._totalOffset=0,this._offset=0,this._tmpVertex=M(),this._tmpMbs=Wa(),this._tmpObb=new Yo,this._resetOffset(e)}_resetOffset(e){this._offset=e,this._totalOffset=e}set offset(e){this._resetOffset(e)}get offset(){return this._offset}set componentOffset(e){this._totalOffset=this._offset+e}set localOrigin(e){this.componentLocalOriginLength=fe(e)}applyToVertex(e,r,a){const o=j(ui,e,r,a),i=j(Gs,e,r,a+this.componentLocalOriginLength),n=this._totalOffset/fe(i);return Ze(this._tmpVertex,o,i,n),this._tmpVertex}applyToAabb(e){const r=this.componentLocalOriginLength,a=e[0],o=e[1],i=e[2]+r,n=e[3],c=e[4],l=e[5]+r,u=Math.abs(a),d=Math.abs(o),h=Math.abs(i),p=Math.abs(n),v=Math.abs(c),x=Math.abs(l),T=.5*(1+Math.sign(a*n))*Math.min(u,p),g=.5*(1+Math.sign(o*c))*Math.min(d,v),I=.5*(1+Math.sign(i*l))*Math.min(h,x),C=Math.max(u,p),$=Math.max(d,v),N=Math.max(h,x),V=Math.sqrt(T*T+g*g+I*I),z=Math.sign(u+a),w=Math.sign(d+o),b=Math.sign(h+i),A=Math.sign(p+n),R=Math.sign(v+c),S=Math.sign(x+l),E=this._totalOffset;if(V<E)return e[0]-=(1-z)*E,e[1]-=(1-w)*E,e[2]-=(1-b)*E,e[3]+=A*E,e[4]+=R*E,e[5]+=S*E,e;const O=E/Math.sqrt(C*C+$*$+N*N),U=E/V,P=U-O,F=-P;return e[0]+=a*(z*F+U),e[1]+=o*(w*F+U),e[2]+=i*(b*F+U),e[3]+=n*(A*P+O),e[4]+=c*(R*P+O),e[5]+=l*(S*P+O),e}applyToMbs(e){const r=fe(Ae(e)),a=this._totalOffset/r;return Ze(Ae(this._tmpMbs),Ae(e),Ae(e),a),this._tmpMbs[3]=e[3]+e[3]*this._totalOffset/r,this._tmpMbs}applyToObb(e){return Xo(e,this._totalOffset,this._totalOffset,Gt.Global,this._tmpObb),this._tmpObb}},Bs=class{constructor(e=0){this.offset=e,this.sphere=Wa(),this.tmpVertex=M()}applyToVertex(e,r,a){const o=this.objectTransform.transform,i=j(ui,e,r,a),n=Ce(i,i,o),c=this.offset/fe(n);Ze(n,n,n,c);const l=this.objectTransform.inverse;return Ce(this.tmpVertex,n,l),this.tmpVertex}applyToMinMax(e,r){const a=this.offset/fe(e);Ze(e,e,e,a);const o=this.offset/fe(r);Ze(r,r,r,o)}applyToAabb(e){const r=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*r,e[1]+=e[1]*r,e[2]+=e[2]*r;const a=this.offset/Math.sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);return e[3]+=e[3]*a,e[4]+=e[4]*a,e[5]+=e[5]*a,e}applyToBoundingSphere(e){const r=fe(Ae(e)),a=this.offset/r;return Ze(Ae(this.sphere),Ae(e),Ae(e),a),this.sphere[3]=e[3]+e[3]*this.offset/r,this.sphere}};const ca=new Bs;function zs(t){return t!=null?(ca.offset=t,ca):null}new Fs;const ui=M(),Gs=M();function da(t,e,r){const{data:a,indices:o}=t,i=e.typedBuffer,n=e.typedBufferStride,c=o.length;r*=n;for(let l=0;l<c;++l){const u=2*o[l];i[r]=a[u],i[r+1]=a[u+1],r+=n}}function hi(t,e,r,a){const{data:o,indices:i}=t,n=e.typedBuffer,c=e.typedBufferStride,l=i.length;if(r*=c,a==null||a===1)for(let u=0;u<l;++u){const d=3*i[u];n[r]=o[d],n[r+1]=o[d+1],n[r+2]=o[d+2],r+=c}else for(let u=0;u<l;++u){const d=3*i[u];for(let h=0;h<a;++h)n[r]=o[d],n[r+1]=o[d+1],n[r+2]=o[d+2],r+=c}}function mi(t,e,r,a=1){const{data:o,indices:i}=t,n=e.typedBuffer,c=e.typedBufferStride,l=i.length;if(r*=c,a===1)for(let u=0;u<l;++u){const d=4*i[u];n[r]=o[d],n[r+1]=o[d+1],n[r+2]=o[d+2],n[r+3]=o[d+3],r+=c}else for(let u=0;u<l;++u){const d=4*i[u];for(let h=0;h<a;++h)n[r]=o[d],n[r+1]=o[d+1],n[r+2]=o[d+2],n[r+3]=o[d+3],r+=c}}function Vs(t,e,r,a,o=1){if(!e)return void hi(t,r,a,o);const{data:i,indices:n}=t,c=r.typedBuffer,l=r.typedBufferStride,u=n.length,d=e[0],h=e[1],p=e[2],v=e[4],x=e[5],T=e[6],g=e[8],I=e[9],C=e[10],$=e[12],N=e[13],V=e[14];a*=l;let z=0,w=0,b=0;const A=Pa(e)?R=>{z=i[R]+$,w=i[R+1]+N,b=i[R+2]+V}:R=>{const S=i[R],E=i[R+1],O=i[R+2];z=d*S+v*E+g*O+$,w=h*S+x*E+I*O+N,b=p*S+T*E+C*O+V};if(o===1)for(let R=0;R<u;++R)A(3*n[R]),c[a]=z,c[a+1]=w,c[a+2]=b,a+=l;else for(let R=0;R<u;++R){A(3*n[R]);for(let S=0;S<o;++S)c[a]=z,c[a+1]=w,c[a+2]=b,a+=l}}function Us(t,e,r,a,o=1){if(!e)return void hi(t,r,a,o);const{data:i,indices:n}=t,c=e,l=r.typedBuffer,u=r.typedBufferStride,d=n.length,h=c[0],p=c[1],v=c[2],x=c[4],T=c[5],g=c[6],I=c[8],C=c[9],$=c[10],N=!Ia(c),V=1e-6,z=1-V;a*=u;let w=0,b=0,A=0;const R=Pa(c)?S=>{w=i[S],b=i[S+1],A=i[S+2]}:S=>{const E=i[S],O=i[S+1],U=i[S+2];w=h*E+x*O+I*U,b=p*E+T*O+C*U,A=v*E+g*O+$*U};if(o===1)if(N)for(let S=0;S<d;++S){R(3*n[S]);const E=w*w+b*b+A*A;if(E<z&&E>V){const O=1/Math.sqrt(E);l[a]=w*O,l[a+1]=b*O,l[a+2]=A*O}else l[a]=w,l[a+1]=b,l[a+2]=A;a+=u}else for(let S=0;S<d;++S)R(3*n[S]),l[a]=w,l[a+1]=b,l[a+2]=A,a+=u;else for(let S=0;S<d;++S){if(R(3*n[S]),N){const E=w*w+b*b+A*A;if(E<z&&E>V){const O=1/Math.sqrt(E);w*=O,b*=O,A*=O}}for(let E=0;E<o;++E)l[a]=w,l[a+1]=b,l[a+2]=A,a+=u}}function js(t,e,r,a,o=1){if(!e)return void mi(t,r,a,o);const{data:i,indices:n}=t,c=e,l=r.typedBuffer,u=r.typedBufferStride,d=n.length,h=c[0],p=c[1],v=c[2],x=c[4],T=c[5],g=c[6],I=c[8],C=c[9],$=c[10],N=!Ia(c),V=1e-6,z=1-V;if(a*=u,o===1)for(let w=0;w<d;++w){const b=4*n[w],A=i[b],R=i[b+1],S=i[b+2],E=i[b+3];let O=h*A+x*R+I*S,U=p*A+T*R+C*S,P=v*A+g*R+$*S;if(N){const F=O*O+U*U+P*P;if(F<z&&F>V){const H=1/Math.sqrt(F);O*=H,U*=H,P*=H}}l[a]=O,l[a+1]=U,l[a+2]=P,l[a+3]=E,a+=u}else for(let w=0;w<d;++w){const b=4*n[w],A=i[b],R=i[b+1],S=i[b+2],E=i[b+3];let O=h*A+x*R+I*S,U=p*A+T*R+C*S,P=v*A+g*R+$*S;if(N){const F=O*O+U*U+P*P;if(F<z&&F>V){const H=1/Math.sqrt(F);O*=H,U*=H,P*=H}}for(let F=0;F<o;++F)l[a]=O,l[a+1]=U,l[a+2]=P,l[a+3]=E,a+=u}}function Hs(t,e,r,a,o=1){const{data:i,indices:n}=t,c=r.typedBuffer,l=r.typedBufferStride,u=n.length;if(a*=l,e!==i.length||e!==4)if(o!==1)if(e!==4)for(let d=0;d<u;++d){const h=3*n[d];for(let p=0;p<o;++p)c[a]=i[h],c[a+1]=i[h+1],c[a+2]=i[h+2],c[a+3]=255,a+=l}else for(let d=0;d<u;++d){const h=4*n[d];for(let p=0;p<o;++p)c[a]=i[h],c[a+1]=i[h+1],c[a+2]=i[h+2],c[a+3]=i[h+3],a+=l}else{if(e===4){for(let d=0;d<u;++d){const h=4*n[d];c[a]=i[h],c[a+1]=i[h+1],c[a+2]=i[h+2],c[a+3]=i[h+3],a+=l}return}for(let d=0;d<u;++d){const h=3*n[d];c[a]=i[h],c[a+1]=i[h+1],c[a+2]=i[h+2],c[a+3]=255,a+=l}}else{c[a]=i[0],c[a+1]=i[1],c[a+2]=i[2],c[a+3]=i[3];const d=new Uint32Array(r.typedBuffer.buffer,r.start),h=l/4,p=d[a/=4];a+=h;const v=u*o;for(let x=1;x<v;++x)d[a]=p,a+=h}}function Ws(t,e,r){const{data:a,indices:o}=t,i=e.typedBuffer,n=e.typedBufferStride,c=o.length,l=a[0];r*=n;for(let u=0;u<c;++u)i[r]=l,r+=n}function qs(t,e,r,a,o=1){const i=e.typedBuffer,n=e.typedBufferStride;if(a*=n,o===1)for(let c=0;c<r;++c)i[a]=t[0],i[a+1]=t[1],i[a+2]=t[2],i[a+3]=t[3],a+=n;else for(let c=0;c<r;++c)for(let l=0;l<o;++l)i[a]=t[0],i[a+1]=t[1],i[a+2]=t[2],i[a+3]=t[3],a+=n}function ks(t,e,r,a,o,i){var n;for(const c of e.fields.keys()){const l=t.attributes.get(c),u=l==null?void 0:l.indices;if(l&&u)Ys(c,l,r,a,o,i);else if(c===f.OBJECTANDLAYERIDCOLOR&&t.objectAndLayerIdColor!=null){const d=(n=t.attributes.get(f.POSITION))==null?void 0:n.indices;if(d){const h=d.length,p=o.getField(c,Kt);qs(t.objectAndLayerIdColor,p,h,i)}}}}function Ys(t,e,r,a,o,i){switch(t){case f.POSITION:{q(e.size===3);const n=o.getField(t,jt);q(!!n,`No buffer view for ${t}`),n&&Vs(e,r,n,i);break}case f.NORMAL:{q(e.size===3);const n=o.getField(t,jt);q(!!n,`No buffer view for ${t}`),n&&Us(e,a,n,i);break}case f.NORMALCOMPRESSED:{q(e.size===2);const n=o.getField(t,$o);q(!!n,`No buffer view for ${t}`),n&&da(e,n,i);break}case f.UV0:{q(e.size===2);const n=o.getField(t,Po);q(!!n,`No buffer view for ${t}`),n&&da(e,n,i);break}case f.COLOR:case f.SYMBOLCOLOR:{const n=o.getField(t,Kt);q(!!n,`No buffer view for ${t}`),q(e.size===3||e.size===4),!n||e.size!==3&&e.size!==4||Hs(e,e.size,n,i);break}case f.COLORFEATUREATTRIBUTE:{const n=o.getField(t,Io);q(!!n,`No buffer view for ${t}`),q(e.size===1),n&&e.size===1&&Ws(e,n,i);break}case f.TANGENT:{q(e.size===4);const n=o.getField(t,br);q(!!n,`No buffer view for ${t}`),n&&js(e,r,n,i);break}case f.PROFILERIGHT:case f.PROFILEUP:case f.PROFILEVERTEXANDNORMAL:case f.FEATUREVALUE:{q(e.size===4);const n=o.getField(t,br);q(!!n,`No buffer view for ${t}`),n&&mi(e,n,i)}}}let Xs=class{constructor(e){this.vertexBufferLayout=e}elementCount(e){return e.attributes.get(f.POSITION).indices.length}write(e,r,a,o,i){ks(a,this.vertexBufferLayout,e,r,o,i)}};function Fr(t){t.attributes.add(f.POSITION,"vec3"),t.vertex.code.add(s`vec3 positionModel() { return position; }`)}function fi(t,e){t.include(Fr);const r=t.vertex;r.include(Ya,e),t.varyings.add("vPositionWorldCameraRelative","vec3"),t.varyings.add("vPosition_view","vec3"),r.uniforms.add(new Z("transformWorldFromViewTH",(a=>a.transformWorldFromViewTH)),new Z("transformWorldFromViewTL",(a=>a.transformWorldFromViewTL)),new ge("transformViewFromCameraRelativeRS",(a=>a.transformViewFromCameraRelativeRS)),new ot("transformProjFromView",(a=>a.transformProjFromView)),new Xa("transformWorldFromModelRS",(a=>a.transformWorldFromModelRS)),new de("transformWorldFromModelTH",(a=>a.transformWorldFromModelTH)),new de("transformWorldFromModelTL",(a=>a.transformWorldFromModelTL))),r.code.add(s`vec3 positionWorldCameraRelative() {
vec3 rotatedModelPosition = transformWorldFromModelRS * positionModel();
vec3 transform_CameraRelativeFromModel = dpAdd(
transformWorldFromModelTL,
transformWorldFromModelTH,
-transformWorldFromViewTL,
-transformWorldFromViewTH
);
return transform_CameraRelativeFromModel + rotatedModelPosition;
}`),r.code.add(s`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${e.spherical?s`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:s`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),t.fragment.uniforms.add(new Z("transformWorldFromViewTL",(a=>a.transformWorldFromViewTL))),r.code.add(s`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),t.fragment.code.add(s`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}class Js extends Mt{constructor(){super(...arguments),this.transformWorldFromViewTH=M(),this.transformWorldFromViewTL=M(),this.transformViewFromCameraRelativeRS=yt(),this.transformProjFromView=Zt()}}function pi(t,e){switch(e.normalType){case K.Attribute:case K.Compressed:t.include(Qt,e),t.varyings.add("vNormalWorld","vec3"),t.varyings.add("vNormalView","vec3"),t.vertex.uniforms.add(new Xa("transformNormalGlobalFromModel",(r=>r.transformNormalGlobalFromModel)),new ge("transformNormalViewFromGlobal",(r=>r.transformNormalViewFromGlobal))),t.vertex.code.add(s`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case K.Ground:t.include(fi,e),t.varyings.add("vNormalWorld","vec3"),t.vertex.code.add(s`
        void forwardNormal() {
          vNormalWorld = ${e.spherical?s`normalize(vPositionWorldCameraRelative);`:s`vec3(0.0, 0.0, 1.0);`}
        }
        `);break;case K.ScreenDerivative:t.vertex.code.add(s`void forwardNormal() {}`);break;default:Et(e.normalType);case K.COUNT:}}let Zs=class extends Js{constructor(){super(...arguments),this.transformNormalViewFromGlobal=yt()}};const Ks=.1,Br=.001;let tr=class{constructor(e,r){this._module=e,this._loadModule=r}get(){return this._module}async reload(){return this._module=await this._loadModule(),this._module}},zr=class{constructor(e,r,a){this.release=a,this.initializeConfiguration(e,r),this._configuration=r.snapshot(),this._program=this.initializeProgram(e),this._pipeline=this.initializePipeline(e)}destroy(){this._program=zt(this._program),this._pipeline=this._configuration=null}reload(e){zt(this._program),this._program=this.initializeProgram(e),this._pipeline=this.initializePipeline(e)}get program(){return this._program}get compiled(){return this.program.compiled}get key(){return this._configuration.key}get configuration(){return this._configuration}ensureAttributeLocations(e){this.program.assertCompatibleVertexAttributeLocations(e)}get primitiveType(){return Qo.TRIANGLES}getPipeline(e,r,a){return this._pipeline}initializeConfiguration(e,r){}},Gr=class{constructor(e,r,a){this._context=e,this._locations=a,this._textures=new Map,this._freeTextureUnits=new Ca({deallocator:null}),this._glProgram=e.programCache.acquire(r.generate("vertex"),r.generate("fragment"),a),this._glProgram.stop=()=>{throw new Error("Wrapped _glProgram used directly")},this.bindPass=r.generateBindPass(this),this.bindDraw=r.generateBindDraw(this),this._fragmentUniforms=on()?r.fragmentUniforms:null}dispose(){this._glProgram.dispose()}get glName(){return this._glProgram.glName}get hasTransformFeedbackVaryings(){return this._glProgram.hasTransformFeedbackVaryings}get compiled(){return this._glProgram.compiled}setUniform1b(e,r){this._glProgram.setUniform1i(e,r?1:0)}setUniform1i(e,r){this._glProgram.setUniform1i(e,r)}setUniform1f(e,r){this._glProgram.setUniform1f(e,r)}setUniform2fv(e,r){this._glProgram.setUniform2fv(e,r)}setUniform3fv(e,r){this._glProgram.setUniform3fv(e,r)}setUniform4fv(e,r){this._glProgram.setUniform4fv(e,r)}setUniformMatrix3fv(e,r){this._glProgram.setUniformMatrix3fv(e,r)}setUniformMatrix4fv(e,r){this._glProgram.setUniformMatrix4fv(e,r)}setUniform1fv(e,r){this._glProgram.setUniform1fv(e,r)}setUniform1iv(e,r){this._glProgram.setUniform1iv(e,r)}setUniform2iv(e,r){this._glProgram.setUniform3iv(e,r)}setUniform3iv(e,r){this._glProgram.setUniform3iv(e,r)}setUniform4iv(e,r){this._glProgram.setUniform4iv(e,r)}assertCompatibleVertexAttributeLocations(e){e.locations!==this._locations&&console.error("VertexAttributeLocations are incompatible")}stop(){this._textures.clear(),this._freeTextureUnits.clear()}bindTexture(e,r){if((r==null?void 0:r.glName)==null){const o=this._textures.get(e);return o&&(this._context.bindTexture(null,o.unit),this._freeTextureUnit(o),this._textures.delete(e)),null}let a=this._textures.get(e);return a==null?(a=this._allocTextureUnit(r),this._textures.set(e,a)):a.texture=r,this._context.useProgram(this),this.setUniform1i(e,a.unit),this._context.bindTexture(r,a.unit),a.unit}rebindTextures(){var e;this._context.useProgram(this),this._textures.forEach(((r,a)=>{this._context.bindTexture(r.texture,r.unit),this.setUniform1i(a,r.unit)})),(e=this._fragmentUniforms)==null||e.forEach((r=>{r.type!=="sampler2D"&&r.type!=="samplerCube"||this._textures.has(r.name)||console.error(`Texture sampler ${r.name} has no bound texture`)}))}_allocTextureUnit(e){return{texture:e,unit:this._freeTextureUnits.length===0?this._textures.size:this._freeTextureUnits.pop()}}_freeTextureUnit(e){this._freeTextureUnits.push(e.unit)}};ve.LESS;ve.ALWAYS;const Qs={mask:255},el={function:{func:ve.ALWAYS,ref:Oe.OutlineVisualElementMask,mask:Oe.OutlineVisualElementMask},operation:{fail:ne.KEEP,zFail:ne.KEEP,zPass:ne.ZERO}},tl={function:{func:ve.ALWAYS,ref:Oe.OutlineVisualElementMask,mask:Oe.OutlineVisualElementMask},operation:{fail:ne.KEEP,zFail:ne.KEEP,zPass:ne.REPLACE}};ve.EQUAL,Oe.OutlineVisualElementMask,Oe.OutlineVisualElementMask,ne.KEEP,ne.KEEP,ne.KEEP;ve.NOTEQUAL,Oe.OutlineVisualElementMask,Oe.OutlineVisualElementMask,ne.KEEP,ne.KEEP,ne.KEEP;function rl({normalTexture:t,metallicRoughnessTexture:e,metallicFactor:r,roughnessFactor:a,emissiveTexture:o,emissiveFactor:i,occlusionTexture:n}){return t==null&&e==null&&o==null&&(i==null||_o(i,Xt))&&n==null&&(a==null||a===1)&&(r==null||r===1)}const vi=[1,1,.5],al=[0,.6,.2],il=[0,1,.2];let st=class extends ee{constructor(e,r){super(e,"vec2",D.Pass,((a,o,i)=>a.setUniform2fv(e,r(o,i))))}};function ua(t){t.varyings.add("linearDepth","float")}function gi(t){t.vertex.uniforms.add(new st("nearFar",((e,r)=>r.camera.nearFar)))}function xi(t){t.vertex.code.add(s`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function Ti(t,e){const{vertex:r}=t;switch(e.output){case B.Color:if(e.receiveShadows)return ua(t),void r.code.add(s`void forwardLinearDepth() { linearDepth = gl_Position.w; }`);break;case B.Shadow:case B.ShadowHighlight:case B.ShadowExcludeHighlight:case B.ViewshedShadow:return t.include(fi,e),ua(t),gi(t),xi(t),void r.code.add(s`void forwardLinearDepth() {
linearDepth = calculateLinearDepth(nearFar, vPosition_view.z);
}`)}r.code.add(s`void forwardLinearDepth() {}`)}function _i(t){t.vertex.code.add(s`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}function Ke(t,e){ol(t,e,new de("slicePlaneOrigin",((r,a)=>nl(e,r,a))),new de("slicePlaneBasis1",((r,a)=>{var o;return ha(e,r,a,(o=a.slicePlane)==null?void 0:o.basis1)})),new de("slicePlaneBasis2",((r,a)=>{var o;return ha(e,r,a,(o=a.slicePlane)==null?void 0:o.basis2)})))}function ol(t,e,...r){if(!e.hasSlicePlane){const n=s`#define rejectBySlice(_pos_) false
#define discardBySlice(_pos_) {}
#define highlightSlice(_color_, _pos_) (_color_)`;return e.hasSliceInVertexProgram&&t.vertex.code.add(n),void t.fragment.code.add(n)}e.hasSliceInVertexProgram&&t.vertex.uniforms.add(...r),t.fragment.uniforms.add(...r);const a=s`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
#define rejectBySlice(_pos_) sliceByPlane(_pos_)
#define discardBySlice(_pos_) { if (sliceByPlane(_pos_)) discard; }`,o=s`vec4 applySliceHighlight(vec4 color, vec3 pos) {
SliceFactors factors = calculateSliceFactors(pos);
const float HIGHLIGHT_WIDTH = 1.0;
const vec4 HIGHLIGHT_COLOR = vec4(0.0, 0.0, 0.0, 0.3);
factors.front /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.front);
factors.side0 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side0);
factors.side1 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side1);
factors.side2 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side2);
factors.side3 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side3);
if (sliceByFactors(factors)) {
return color;
}
float highlightFactor = (1.0 - step(0.5, factors.front))
* (1.0 - step(0.5, factors.side0))
* (1.0 - step(0.5, factors.side1))
* (1.0 - step(0.5, factors.side2))
* (1.0 - step(0.5, factors.side3));
return mix(color, vec4(HIGHLIGHT_COLOR.rgb, color.a), highlightFactor * HIGHLIGHT_COLOR.a);
}`,i=e.hasSliceHighlight?s`
        ${o}
        #define highlightSlice(_color_, _pos_) (sliceEnabled() ? applySliceHighlight(_color_, _pos_) : (_color_))
      `:s`#define highlightSlice(_color_, _pos_) (_color_)`;e.hasSliceInVertexProgram&&t.vertex.code.add(a),t.fragment.code.add(a),t.fragment.code.add(i)}function bi(t,e,r){return t.instancedDoublePrecision?j(sl,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]):e.slicePlaneLocalOrigin}function Si(t,e){return t!=null?Me(qt,e.origin,t):e.origin}function Ei(t,e,r){return t.hasSliceTranslatedView?e!=null?Tr(ll,r.camera.viewMatrix,e):r.camera.viewMatrix:null}function nl(t,e,r){if(r.slicePlane==null)return Xt;const a=bi(t,e,r),o=Si(a,r.slicePlane),i=Ei(t,a,r);return i!=null?Ce(qt,o,i):o}function ha(t,e,r,a){if(a==null||r.slicePlane==null)return Xt;const o=bi(t,e,r),i=Si(o,r.slicePlane),n=Ei(t,o,r);return n!=null?(me(ut,a,i),Ce(qt,i,n),Ce(ut,ut,n),Me(ut,ut,qt)):a}const sl=M(),qt=M(),ut=M(),ll=Zt();function Qe(t){xi(t),t.vertex.code.add(s`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),t.vertex.code.add(s`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}let cl=class extends ee{constructor(e,r){super(e,"mat4",D.Draw,((a,o,i)=>a.setUniformMatrix4fv(e,r(o,i))))}};function bt(t,e){e.instancedDoublePrecision?t.constants.add("cameraPosition","vec3",Xt):t.uniforms.add(new de("cameraPosition",((r,a)=>j(yi,a.camera.viewInverseTransposeMatrix[3]-r.origin[0],a.camera.viewInverseTransposeMatrix[7]-r.origin[1],a.camera.viewInverseTransposeMatrix[11]-r.origin[2]))))}function et(t,e){if(!e.instancedDoublePrecision)return void t.uniforms.add(new ot("proj",((a,o)=>o.camera.projectionMatrix)),new cl("view",((a,o)=>Tr(ma,o.camera.viewMatrix,a.origin))),new de("localOrigin",(a=>a.origin)));const r=a=>j(yi,a.camera.viewInverseTransposeMatrix[3],a.camera.viewInverseTransposeMatrix[7],a.camera.viewInverseTransposeMatrix[11]);t.uniforms.add(new ot("proj",((a,o)=>o.camera.projectionMatrix)),new ot("view",((a,o)=>Tr(ma,o.camera.viewMatrix,r(o)))),new Z("localOrigin",((a,o)=>r(o))))}const ma=Zt(),yi=M();function dl(t){t.uniforms.add(new ot("viewNormal",((e,r)=>r.camera.viewInverseTransposeMatrix)))}let ul=class extends Mt{constructor(){super(),this._key="",this._keyDirty=!1,this._parameterBits=this._parameterBits?this._parameterBits.map((()=>0)):[],this._parameterNames||(this._parameterNames=[])}get key(){return this._keyDirty&&(this._keyDirty=!1,this._key=String.fromCharCode.apply(String,this._parameterBits)),this._key}snapshot(){const e=this._parameterNames,r={key:this.key};for(const a of e)r[a]=this[a];return r}};function _(t={}){return(e,r)=>{if(e._parameterNames=e._parameterNames??[],e._parameterNames.push(r),t.constValue!=null)Object.defineProperty(e,r,{get:()=>t.constValue});else{const a=e._parameterNames.length-1,o=t.count||2,i=Math.ceil(Math.log2(o)),n=e._parameterBits??[0];let c=0;for(;n[c]+i>16;)c++,c>=n.length&&n.push(0);e._parameterBits=n;const l=n[c],u=(1<<i)-1<<l;n[c]+=i,Object.defineProperty(e,r,{get(){return this[a]},set(d){if(this[a]!==d&&(this[a]=d,this._keyDirty=!0,this._parameterBits[c]=this._parameterBits[c]&~u|+d<<l&u,typeof d!="number"&&typeof d!="boolean"))throw new Error("Configuration value for "+r+" must be boolean or number, got "+typeof d)}})}}}let yr=class extends ul{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}};m([_()],yr.prototype,"instancedDoublePrecision",void 0),m([_()],yr.prototype,"hasModelTransformation",void 0);const fa=yt();function Ai(t,e){const r=e.hasModelTransformation,a=e.instancedDoublePrecision;r&&(t.vertex.uniforms.add(new ot("model",(i=>i.modelTransformation??Ut))),t.vertex.uniforms.add(new ge("normalLocalOriginFromModel",(i=>($a(fa,i.modelTransformation??Ut),fa))))),e.instanced&&a&&(t.attributes.add(f.INSTANCEMODELORIGINHI,"vec3"),t.attributes.add(f.INSTANCEMODELORIGINLO,"vec3"),t.attributes.add(f.INSTANCEMODEL,"mat3"),t.attributes.add(f.INSTANCEMODELNORMAL,"mat3"));const o=t.vertex;a&&(o.include(Ya,e),o.uniforms.add(new de("viewOriginHi",((i,n)=>cn(j(Nt,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),Nt))),new de("viewOriginLo",((i,n)=>dn(j(Nt,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),Nt))))),o.code.add(s`
    vec3 getVertexInLocalOriginSpace() {
      return ${r?a?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":a?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${a?s`
          // Negated inputs are intentionally the first two arguments. The other way around the obfuscation in dpAdd() stopped
          // working for macOS 14+ and iOS 17+.
          // Issue: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(-instanceModelOriginHi, -instanceModelOriginLo, viewOriginHi, viewOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),o.code.add(s`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${r?a?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":a?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),e.output===B.Normal&&(dl(o),o.code.add(s`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${r?a?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":a?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),e.hasVertexTangents&&o.code.add(s`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${r?a?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":a?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const Nt=M();let wi=class extends ee{constructor(e,r){super(e,"int",D.Pass,((a,o,i)=>a.setUniform1i(e,r(o,i))))}};function Mi(t,e){e.hasSymbolColors?(t.include(un),t.attributes.add(f.SYMBOLCOLOR,"vec4"),t.varyings.add("colorMixMode","mediump float"),t.vertex.code.add(s`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(t.fragment.uniforms.add(new wi("colorMixMode",(r=>ds[r.colorMixMode]))),t.vertex.code.add(s`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}function Ci(t,e){e.hasVertexColors?(t.attributes.add(f.COLOR,"vec4"),t.varyings.add("vColor","vec4"),t.vertex.code.add(s`void forwardVertexColor() { vColor = color; }`),t.vertex.code.add(s`void forwardNormalizedVertexColor() { vColor = color * 0.003921568627451; }`)):t.vertex.code.add(s`void forwardVertexColor() {}
void forwardNormalizedVertexColor() {}`)}function hl(t){t.vertex.code.add(s`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),t.vertex.code.add(s`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),t.vertex.code.add(s`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),t.vertex.code.add(s`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),t.vertex.code.add(s`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),t.vertex.code.add(s`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function ml(t){t.uniforms.add(new Z("screenSizePerspectiveAlignment",(e=>fl(e.screenSizePerspectiveAlignment||e.screenSizePerspective))))}function fl(t){return j(pl,t.parameters.divisor,t.parameters.offset,t.minScaleFactor)}const pl=M();let te=class extends ee{constructor(e,r){super(e,"vec4",D.Pass,((a,o,i)=>a.setUniform4fv(e,r(o,i))))}};function Oi(t,e){const r=t.vertex;e.hasVerticalOffset?(gl(r),e.hasScreenSizePerspective&&(t.include(hl),ml(r),bt(t.vertex,e)),r.code.add(s`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${e.spherical?s`vec3 worldNormal = normalize(worldPos + localOrigin);`:s`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${e.hasScreenSizePerspective?s`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:s`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):r.code.add(s`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}const vl=Or();function gl(t){t.uniforms.add(new te("verticalOffset",((e,r)=>{const{minWorldLength:a,maxWorldLength:o,screenLength:i}=e.verticalOffset,n=Math.tan(.5*r.camera.fovY)/(.5*r.camera.fullViewport[3]),c=r.camera.pixelRatio||1;return ie(vl,i*c,n,a,o)})))}function xl(t,e){const r=e.output===B.ObjectAndLayerIdColor,a=e.objectAndLayerIdColorInstanced;r&&(t.varyings.add("objectAndLayerIdColorVarying","vec4"),a?t.attributes.add(f.INSTANCEOBJECTANDLAYERIDCOLOR,"vec4"):t.attributes.add(f.OBJECTANDLAYERIDCOLOR,"vec4")),t.vertex.code.add(s`
     void forwardObjectAndLayerIdColor() {
      ${r?a?s`objectAndLayerIdColorVarying = instanceObjectAndLayerIdColor * 0.003921568627451;`:s`objectAndLayerIdColorVarying = objectAndLayerIdColor * 0.003921568627451;`:s``} }`),t.fragment.code.add(s`
      void outputObjectAndLayerIdColor() {
        ${r?s`fragColor = objectAndLayerIdColorVarying;`:s``} }`)}function Ri(t){t.code.add(s`const float MAX_RGBA4_FLOAT =
15.0 / 16.0 +
15.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 / 16.0;
const vec4 FIXED_POINT_FACTORS_RGBA4 = vec4(1.0, 16.0, 16.0 * 16.0, 16.0 * 16.0 * 16.0);
vec4 floatToRgba4(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA4_FLOAT);
vec4 fixedPointU4 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS_RGBA4) * 16.0);
const float toU4AsFloat = 1.0 / 15.0;
return fixedPointU4 * toU4AsFloat;
}
const vec4 RGBA4_2_FLOAT_FACTORS = vec4(
15.0 / (16.0),
15.0 / (16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0 * 16.0)
);
float rgba4ToFloat(vec4 rgba) {
return dot(rgba, RGBA4_2_FLOAT_FACTORS);
}`)}function Tl(t,e){switch(e.output){case B.Shadow:case B.ShadowHighlight:case B.ShadowExcludeHighlight:case B.ViewshedShadow:t.fragment.include(Ri),t.fragment.code.add(s`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth) {
fragColor = floatToRgba4(_calculateFragDepth(_linearDepth));
}`)}}const _l=Rr(1,1,0,1),bl=Rr(1,0,1,1);function Sl(t){t.fragment.uniforms.add(new Q("depthTexture",((e,r)=>r.mainDepth))),t.fragment.constants.add("occludedHighlightFlag","vec4",_l).add("unoccludedHighlightFlag","vec4",bl),t.fragment.code.add(s`void outputHighlight() {
float sceneDepth = float(texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x);
if (gl_FragCoord.z > sceneDepth + 5e-7) {
fragColor = occludedHighlightFlag;
} else {
fragColor = unoccludedHighlightFlag;
}
}`)}let El=class extends ee{constructor(e,r,a){super(e,"vec4",D.Pass,((o,i,n)=>o.setUniform4fv(e,r(i,n))),a)}},yl=class extends ee{constructor(e,r,a){super(e,"float",D.Pass,((o,i,n)=>o.setUniform1fv(e,r(i,n))),a)}},W=class extends La{constructor(){super(...arguments),this.SCENEVIEW_HITTEST_RETURN_INTERSECTOR=!1,this.DECONFLICTOR_SHOW_VISIBLE=!1,this.DECONFLICTOR_SHOW_INVISIBLE=!1,this.DECONFLICTOR_SHOW_GRID=!1,this.LABELS_SHOW_BORDER=!1,this.TEXT_SHOW_BASELINE=!1,this.TEXT_SHOW_BORDER=!1,this.OVERLAY_DRAW_DEBUG_TEXTURE=!1,this.OVERLAY_SHOW_CENTER=!1,this.SHOW_POI=!1,this.TESTS_DISABLE_OPTIMIZATIONS=!1,this.TESTS_DISABLE_FAST_UPDATES=!1,this.DRAW_MESH_GEOMETRY_NORMALS=!1,this.FEATURE_TILE_FETCH_SHOW_TILES=!1,this.FEATURE_TILE_TREE_SHOW_TILES=!1,this.TERRAIN_TILE_TREE_SHOW_TILES=!1,this.I3S_TREE_SHOW_TILES=!1,this.I3S_SHOW_MODIFICATIONS=!1,this.LOD_INSTANCE_RENDERER_DISABLE_UPDATES=!1,this.LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL=!1,this.EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES=!1,this.LINE_WIREFRAMES=!1}};m([G()],W.prototype,"SCENEVIEW_HITTEST_RETURN_INTERSECTOR",void 0),m([G()],W.prototype,"DECONFLICTOR_SHOW_VISIBLE",void 0),m([G()],W.prototype,"DECONFLICTOR_SHOW_INVISIBLE",void 0),m([G()],W.prototype,"DECONFLICTOR_SHOW_GRID",void 0),m([G()],W.prototype,"LABELS_SHOW_BORDER",void 0),m([G()],W.prototype,"TEXT_SHOW_BASELINE",void 0),m([G()],W.prototype,"TEXT_SHOW_BORDER",void 0),m([G()],W.prototype,"OVERLAY_DRAW_DEBUG_TEXTURE",void 0),m([G()],W.prototype,"OVERLAY_SHOW_CENTER",void 0),m([G()],W.prototype,"SHOW_POI",void 0),m([G()],W.prototype,"TESTS_DISABLE_OPTIMIZATIONS",void 0),m([G()],W.prototype,"TESTS_DISABLE_FAST_UPDATES",void 0),m([G()],W.prototype,"DRAW_MESH_GEOMETRY_NORMALS",void 0),m([G()],W.prototype,"FEATURE_TILE_FETCH_SHOW_TILES",void 0),m([G()],W.prototype,"FEATURE_TILE_TREE_SHOW_TILES",void 0),m([G()],W.prototype,"TERRAIN_TILE_TREE_SHOW_TILES",void 0),m([G()],W.prototype,"I3S_TREE_SHOW_TILES",void 0),m([G()],W.prototype,"I3S_SHOW_MODIFICATIONS",void 0),m([G()],W.prototype,"LOD_INSTANCE_RENDERER_DISABLE_UPDATES",void 0),m([G()],W.prototype,"LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL",void 0),m([G()],W.prototype,"EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES",void 0),m([G()],W.prototype,"LINE_WIREFRAMES",void 0),W=m([Ir("esri.views.3d.support.debugFlags")],W);new W;var pa,va;(function(t){t[t.Undefined=0]="Undefined",t[t.DefinedSize=1]="DefinedSize",t[t.DefinedScale=2]="DefinedScale"})(pa||(pa={})),(function(t){t[t.Undefined=0]="Undefined",t[t.DefinedAngle=1]="DefinedAngle"})(va||(va={}));const fr=8;function _t(t,e){const{vertex:r,attributes:a}=t;e.hasVvInstancing&&(e.vvSize||e.vvColor)&&a.add(f.INSTANCEFEATUREATTRIBUTE,"vec4"),e.vvSize?(r.uniforms.add(new Z("vvSizeMinSize",(o=>o.vvSize.minSize))),r.uniforms.add(new Z("vvSizeMaxSize",(o=>o.vvSize.maxSize))),r.uniforms.add(new Z("vvSizeOffset",(o=>o.vvSize.offset))),r.uniforms.add(new Z("vvSizeFactor",(o=>o.vvSize.factor))),r.uniforms.add(new ge("vvSymbolRotationMatrix",(o=>o.vvSymbolRotationMatrix))),r.uniforms.add(new Z("vvSymbolAnchor",(o=>o.vvSymbolAnchor))),r.code.add(s`vec3 vvScale(vec4 _featureAttribute) {
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),r.code.add(s`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${e.hasVvInstancing?s`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):r.code.add(s`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),e.vvColor?(r.constants.add("vvColorNumber","int",fr),r.uniforms.add(new yl("vvColorValues",(o=>o.vvColor.values),fr),new El("vvColorColors",(o=>o.vvColor.colors),fr)),r.code.add(s`
      vec4 interpolateVVColor(float value) {
        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${e.hasVvInstancing?s`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):r.code.add(s`vec4 vvColor() { return vec4(1.0); }`)}function Al(t){t.fragment.code.add(s`
    #define discardOrAdjustAlpha(color) { if (color.a < ${s.float(Br)}) { discard; } }
  `)}function tt(t,e){wl(t,e,new se("textureAlphaCutoff",(r=>r.textureAlphaCutoff)))}function wl(t,e,r){const a=t.fragment;switch(e.alphaDiscardMode!==J.Mask&&e.alphaDiscardMode!==J.MaskBlend||a.uniforms.add(r),e.alphaDiscardMode){case J.Blend:return t.include(Al);case J.Opaque:a.code.add(s`void discardOrAdjustAlpha(inout vec4 color) {
color.a = 1.0;
}`);break;case J.Mask:a.code.add(s`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } else { color.a = 1.0; } }`);break;case J.MaskBlend:t.fragment.code.add(s`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } }`)}}function Ii(t,e){const{vertex:r,fragment:a}=t,o=e.hasColorTexture&&e.alphaDiscardMode!==J.Opaque;switch(e.output){case B.Depth:et(r,e),t.include(Qe,e),t.include(Ke,e),t.include(ze,e),o&&a.uniforms.add(new Q("tex",(i=>i.texture))),r.code.add(s`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();
}`),t.include(tt,e),a.code.add(s`
          void main(void) {
            discardBySlice(vpos);
            ${o?s`
                    vec4 texColor = texture(tex, ${e.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
          }
        `);break;case B.Shadow:case B.ShadowHighlight:case B.ShadowExcludeHighlight:case B.ViewshedShadow:case B.ObjectAndLayerIdColor:et(r,e),t.include(Qe,e),t.include(ze,e),t.include(_t,e),t.include(Tl,e),t.include(Ke,e),t.include(xl,e),gi(t),t.varyings.add("depth","float"),o&&a.uniforms.add(new Q("tex",(i=>i.texture))),r.code.add(s`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();
}`),t.include(tt,e),a.code.add(s`
          void main(void) {
            discardBySlice(vpos);
            ${o?s`
                    vec4 texColor = texture(tex, ${e.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            ${e.output===B.ObjectAndLayerIdColor?s`outputObjectAndLayerIdColor();`:s`outputDepth(depth);`}
          }
        `);break;case B.Normal:{et(r,e),t.include(Qe,e),t.include(Qt,e),t.include(pi,e),t.include(ze,e),t.include(_t,e),o&&a.uniforms.add(new Q("tex",(n=>n.texture))),e.normalType===K.ScreenDerivative&&t.varyings.add("vPositionView","vec3");const i=e.normalType===K.Attribute||e.normalType===K.Compressed;r.code.add(s`
          void main(void) {
            vpos = getVertexInLocalOriginSpace();

            ${i?s`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:s`
                  // Get vertex position in camera space for screen-space derivative normals
                  vPositionView = (view * vec4(vpos, 1.0)).xyz;
                `}
            vpos = subtractOrigin(vpos);
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            forwardTextureCoordinates();
          }
        `),t.include(Ke,e),t.include(tt,e),a.code.add(s`
          void main() {
            discardBySlice(vpos);
            ${o?s`
                    vec4 texColor = texture(tex, ${e.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}

            ${e.normalType===K.ScreenDerivative?s`vec3 normal = screenDerivativeNormal(vPositionView);`:s`
                  vec3 normal = normalize(vNormalWorld);
                  if (gl_FrontFacing == false){
                    normal = -normal;
                  }`}
            fragColor = vec4(0.5 + 0.5 * normal, 1.0);
          }
        `);break}case B.Highlight:et(r,e),t.include(Qe,e),t.include(ze,e),t.include(_t,e),o&&a.uniforms.add(new Q("tex",(i=>i.texture))),r.code.add(s`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();
}`),t.include(Ke,e),t.include(tt,e),t.include(Sl,e),a.code.add(s`
          void main() {
            discardBySlice(vpos);
            ${o?s`
                    vec4 texColor = texture(tex, ${e.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            outputHighlight();
          }
        `)}}function Ml(t,e){const r=t.fragment;e.hasVertexTangents?(t.attributes.add(f.TANGENT,"vec4"),t.varyings.add("vTangent","vec4"),e.doubleSidedMode===re.WindingOrder?r.code.add(s`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):r.code.add(s`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):r.code.add(s`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),e.textureCoordinateType!==Y.None&&(t.include(si,e),r.uniforms.add(e.pbrTextureBindType===D.Pass?new Q("normalTexture",(a=>a.textureNormal)):new gt("normalTexture",(a=>a.textureNormal))),e.hasNormalTextureTransform&&(r.uniforms.add(new st("scale",(a=>a.scale??Na))),r.uniforms.add(new ge("normalTextureTransformMatrix",(a=>a.normalTextureTransformMatrix??ct)))),r.code.add(s`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),e.hasNormalTextureTransform&&r.code.add(s`mat3 normalTextureRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalTextureRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),r.code.add(s`return tangentSpace * rawNormal;
}`))}var rt,ga;(function(t){t[t.RED=0]="RED",t[t.RG=1]="RG",t[t.RGBA4=2]="RGBA4",t[t.RGBA=3]="RGBA",t[t.RGBA_MIPMAP=4]="RGBA_MIPMAP",t[t.R16F=5]="R16F",t[t.RGBA16F=6]="RGBA16F"})(rt||(rt={})),(function(t){t[t.DEPTH_STENCIL_TEXTURE=0]="DEPTH_STENCIL_TEXTURE",t[t.DEPTH16_BUFFER=1]="DEPTH16_BUFFER"})(ga||(ga={}));let Je=class extends La{constructor(e){super(e),this.view=null,this.consumes={required:[]},this.produces="composite-color",this._context=null,this._dirty=!0}initialize(){this.addHandles([Da((()=>this.view.ready),(e=>{var r;e&&((r=this.view._stage)==null||r.renderer.addRenderNode(this))}),bo)])}destroy(){var e,r;(r=(e=this.view._stage)==null?void 0:e.renderer)==null||r.removeRenderNode(this)}render(){throw new St("RenderNode:render-function-not-implemented","render() is not implemented.")}get camera(){return this.view.state.camera.clone()}get sunLight(){return this.bindParameters.lighting.legacy}get gl(){return this.view._stage.renderView.renderingContext.gl}acquireOutputFramebuffer(){var a,o,i;const e=(o=(a=this._frameBuffer)==null?void 0:a.getTexture())==null?void 0:o.descriptor,r=this.view._stage.renderer.fboCache.acquire((e==null?void 0:e.width)??640,(e==null?void 0:e.height)??480,this.produces);return(i=r.fbo)==null||i.initializeAndBind(),r}bindRenderTarget(){var e,r;return(r=(e=this._frameBuffer)==null?void 0:e.fbo)==null||r.initializeAndBind(),this._frameBuffer}requestRender(e){var r;e===ja.UPDATE&&((r=this.view._stage)==null||r.renderView.requestRender(e)),this._dirty=!0}resetWebGLState(){var e;this.renderingContext.resetState(),this.renderingContext.bindFramebuffer((e=this._frameBuffer)==null?void 0:e.fbo)}get fboCache(){return this.view._stage.renderer.fboCache}get bindParameters(){return this._context.bindParameters}get renderingContext(){return this.view._stage.renderView.renderingContext}updateAnimation(){return!!this._dirty&&(this._dirty=!1,!0)}doRender(e,r){this._context=r,this._frameBuffer=e.find((({name:a})=>a===this.produces));try{return this.render(e)}finally{this._frameBuffer=null}}};m([G({constructOnly:!0})],Je.prototype,"view",void 0),m([G({constructOnly:!0})],Je.prototype,"consumes",void 0),m([G()],Je.prototype,"produces",void 0),Je=m([Ir("esri.views.3d.webgl.RenderNode")],Je);const Cl=Je,Ol=3e5,xa=5e5;function Pi(t,e=!0){t.attributes.add(f.POSITION,"vec2"),e&&t.varyings.add("uv","vec2"),t.vertex.code.add(s`
    void main(void) {
      gl_Position = vec4(position, 0.0, 1.0);
      ${e?s`uv = position * 0.5 + vec2(0.5);`:""}
    }
  `)}function Vr(t){t.uniforms.add(new st("zProjectionMap",((e,r)=>Rl(r.camera)))),t.code.add(s`float linearizeDepth(float depth) {
float depthNdc = depth * 2.0 - 1.0;
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
return -(c1 / (depthNdc + c2 + 1e-7));
}`),t.code.add(s`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
float depth = texelFetch(depthTexture, iuv, 0).r;
return depth;
}`),t.code.add(s`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function Rl(t){const e=t.projectionMatrix;return Ve(Il,e[14],e[10])}const Il=Jt();let Pl=class extends ee{constructor(e,r){super(e,"vec2",D.Draw,((a,o,i,n)=>a.setUniform2fv(e,r(o,i,n))))}};const $l=()=>Cr.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");let $i=class{constructor(){this._includedModules=new Map}include(e,r){this._includedModules.has(e)?this._includedModules.get(e):(this._includedModules.set(e,r),e(this.builder,r))}},rr=class extends $i{constructor(){super(...arguments),this.vertex=new Ta,this.fragment=new Ta,this.attributes=new Dl,this.varyings=new Fl,this.extensions=new lt,this.constants=new Li,this.outputs=new Ar}get fragmentUniforms(){return this.fragment.uniforms.entries}get builder(){return this}generate(e){const r=this.extensions.generateSource(e),a=this.attributes.generateSource(e),o=this.varyings.generateSource(e),i=e==="vertex"?this.vertex:this.fragment,n=i.uniforms.generateSource(),c=i.code.generateSource(),l=e==="vertex"?zl:Bl,u=this.constants.generateSource().concat(i.constants.generateSource()),d=this.outputs.generateSource(e);return`#version 300 es
${r.join(`
`)}

${l}

${u.join(`
`)}

${n.join(`
`)}

${a.join(`
`)}

${o.join(`
`)}

${d.join(`
`)}

${c.join(`
`)}`}generateBindPass(e){const r=new Map;this.vertex.uniforms.entries.forEach((i=>{const n=i.bind[D.Pass];n&&r.set(i.name,n)})),this.fragment.uniforms.entries.forEach((i=>{const n=i.bind[D.Pass];n&&r.set(i.name,n)}));const a=Array.from(r.values()),o=a.length;return(i,n)=>{for(let c=0;c<o;++c)a[c](e,i,n)}}generateBindDraw(e){const r=new Map;this.vertex.uniforms.entries.forEach((i=>{const n=i.bind[D.Draw];n&&r.set(i.name,n)})),this.fragment.uniforms.entries.forEach((i=>{const n=i.bind[D.Draw];n&&r.set(i.name,n)}));const a=Array.from(r.values()),o=a.length;return(i,n,c)=>{for(let l=0;l<o;++l)a[l](e,i,n,c)}}},Ll=class{constructor(e){this._stage=e,this._entries=new Map}add(...e){for(const r of e)this._add(r);return this._stage}get(e){return this._entries.get(e)}_add(e){if(e!=null){if(this._entries.has(e.name)&&!this._entries.get(e.name).equals(e))throw new St(`Duplicate uniform name ${e.name} for different uniform type`);this._entries.set(e.name,e)}else $l().error(`Trying to add null Uniform from ${new Error().stack}.`)}generateSource(){return Array.from(this._entries.values()).map((e=>e.arraySize!=null?`uniform ${e.type} ${e.name}[${e.arraySize}];`:`uniform ${e.type} ${e.name};`))}get entries(){return Array.from(this._entries.values())}},Nl=class{constructor(e){this._stage=e,this._entries=new Array}add(e){return this._entries.push(e),this._stage}generateSource(){return this._entries}},Ta=class extends $i{constructor(){super(...arguments),this.uniforms=new Ll(this),this.code=new Nl(this),this.constants=new Li}get builder(){return this}},Dl=class{constructor(){this._entries=new Array}add(e,r){this._entries.push([e,r])}generateSource(e){return e==="fragment"?[]:this._entries.map((r=>`in ${r[1]} ${r[0]};`))}},Fl=class{constructor(){this._entries=new Map}add(e,r){this._entries.has(e)&&q(this._entries.get(e)===r),this._entries.set(e,r)}generateSource(e){const r=new Array;return this._entries.forEach(((a,o)=>r.push(e==="vertex"?`out ${a} ${o};`:`in ${a} ${o};`))),r}};class lt{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const r=e==="vertex"?lt.ALLOWLIST_VERTEX:lt.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter((a=>r.includes(a))).map((a=>`#extension ${a} : enable`))}}lt.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],lt.ALLOWLIST_VERTEX=[];let Ar=class wr{constructor(){this._entries=new Map}add(e,r,a=0){const o=this._entries.get(a);o?q(o.name===e&&o.type===r,`Fragment shader output location ${a} occupied`):this._entries.set(a,{name:e,type:r})}generateSource(e){if(e==="vertex")return[];this._entries.size===0&&this._entries.set(0,{name:wr.DEFAULT_NAME,type:wr.DEFAULT_TYPE});const r=new Array;return this._entries.forEach(((a,o)=>r.push(`layout(location = ${o}) out ${a.type} ${a.name};`))),r}};Ar.DEFAULT_TYPE="vec4",Ar.DEFAULT_NAME="fragColor";let Li=class k{constructor(){this._entries=new Set}add(e,r,a){let o="ERROR_CONSTRUCTOR_STRING";switch(r){case"float":o=k._numberToFloatStr(a);break;case"int":o=k._numberToIntStr(a);break;case"bool":o=a.toString();break;case"vec2":o=`vec2(${k._numberToFloatStr(a[0])},                            ${k._numberToFloatStr(a[1])})`;break;case"vec3":o=`vec3(${k._numberToFloatStr(a[0])},                            ${k._numberToFloatStr(a[1])},                            ${k._numberToFloatStr(a[2])})`;break;case"vec4":o=`vec4(${k._numberToFloatStr(a[0])},                            ${k._numberToFloatStr(a[1])},                            ${k._numberToFloatStr(a[2])},                            ${k._numberToFloatStr(a[3])})`;break;case"ivec2":o=`ivec2(${k._numberToIntStr(a[0])},                             ${k._numberToIntStr(a[1])})`;break;case"ivec3":o=`ivec3(${k._numberToIntStr(a[0])},                             ${k._numberToIntStr(a[1])},                             ${k._numberToIntStr(a[2])})`;break;case"ivec4":o=`ivec4(${k._numberToIntStr(a[0])},                             ${k._numberToIntStr(a[1])},                             ${k._numberToIntStr(a[2])},                             ${k._numberToIntStr(a[3])})`;break;case"mat2":case"mat3":case"mat4":o=`${r}(${Array.prototype.map.call(a,(i=>k._numberToFloatStr(i))).join(", ")})`}return this._entries.add(`const ${r} ${e} = ${o};`),this}static _numberToIntStr(e){return e.toFixed(0)}static _numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}};const Bl=`#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp sampler2D;
#else
  precision mediump float;
  precision mediump sampler2D;
#endif`,zl=`precision highp float;
precision highp sampler2D;`,pr=4;function Ni(){const t=new rr,e=t.fragment;t.include(Pi);const r=(pr+1)/2,a=1/(2*r*r);return e.include(Vr),e.uniforms.add(new Q("depthMap",(o=>o.depthTexture)),new gt("tex",(o=>o.colorTexture)),new Pl("blurSize",(o=>o.blurSize)),new se("projScale",((o,i)=>{const n=So(i.camera.eye,i.camera.center);return n>5e4?Math.max(0,o.projScale-(n-5e4)):o.projScale}))),e.code.add(s`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${s.float(a)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),t.outputs.add("fragBlur","float"),e.code.add(s`
    void main(void) {
      float b = 0.0;
      float w_total = 0.0;

      float center_d = linearDepthFromTexture(depthMap, uv);

      float sharpness = -0.05 * projScale / center_d;
      for (int r = -${s.int(pr)}; r <= ${s.int(pr)}; ++r) {
        float rf = float(r);
        vec2 uvOffset = uv + rf * blurSize;
        blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
      }

      fragBlur = b / w_total;
    }
  `),t}const Gl=Object.freeze(Object.defineProperty({__proto__:null,build:Ni},Symbol.toStringTag,{value:"Module"}));let Di=class Fi extends zr{initializeProgram(e){return new Gr(e.rctx,Fi.shader.get().build(),er)}initializePipeline(){return Pr({colorWrite:$r})}};Di.shader=new tr(Gl,(()=>wt(()=>Promise.resolve().then(()=>Fc),void 0)));const Vl="eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM";let Ul=class extends Mt{constructor(){super(...arguments),this.projScale=1}},jl=class extends Ul{constructor(){super(...arguments),this.intensity=1}},Hl=class extends Mt{},Wl=class extends Hl{constructor(){super(...arguments),this.blurSize=Jt()}};function ql(t){t.fragment.uniforms.add(new te("projInfo",((e,r)=>kl(r.camera)))),t.fragment.uniforms.add(new st("zScale",((e,r)=>Yl(r.camera)))),t.fragment.code.add(s`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}function kl(t){const e=t.projectionMatrix;return e[11]===0?ie(_a,2/(t.fullWidth*e[0]),2/(t.fullHeight*e[5]),(1+e[12])/e[0],(1+e[13])/e[5]):ie(_a,-2/(t.fullWidth*e[0]),-2/(t.fullHeight*e[5]),(1-e[8])/e[0],(1-e[9])/e[5])}const _a=Or();function Yl(t){return t.projectionMatrix[11]===0?Ve(ba,0,1):Ve(ba,1,0)}const ba=Jt(),Sa=16;function Bi(){const t=new rr,e=t.fragment;return t.include(Pi),t.include(ql),e.include(Vr),e.uniforms.add(new se("radius",((r,a)=>ar(a.camera)))).code.add(s`vec3 sphere[16] = vec3[16](
vec3(0.186937, 0.0, 0.0),
vec3(0.700542, 0.0, 0.0),
vec3(-0.864858, -0.481795, -0.111713),
vec3(-0.624773, 0.102853, -0.730153),
vec3(-0.387172, 0.260319, 0.007229),
vec3(-0.222367, -0.642631, -0.707697),
vec3(-0.01336, -0.014956, 0.169662),
vec3(0.122575, 0.1544, -0.456944),
vec3(-0.177141, 0.85997, -0.42346),
vec3(-0.131631, 0.814545, 0.524355),
vec3(-0.779469, 0.007991, 0.624833),
vec3(0.308092, 0.209288,0.35969),
vec3(0.359331, -0.184533, -0.377458),
vec3(0.192633, -0.482999, -0.065284),
vec3(0.233538, 0.293706, -0.055139),
vec3(0.417709, -0.386701, 0.442449)
);
float fallOffFunction(float vv, float vn, float bias) {
float f = max(radius * radius - vv, 0.0);
return f * f * f * max(vn - bias, 0.0);
}`),e.code.add(s`float aoValueFromPositionsAndNormal(vec3 C, vec3 n_C, vec3 Q) {
vec3 v = Q - C;
float vv = dot(v, v);
float vn = dot(normalize(v), n_C);
return fallOffFunction(vv, vn, 0.1);
}`),e.uniforms.add(new Q("normalMap",(r=>r.normalTexture)),new Q("depthMap",(r=>r.depthTexture)),new se("projScale",(r=>r.projScale)),new Q("rnm",(r=>r.noiseTexture)),new st("rnmScale",((r,a)=>Ve(Ea,a.camera.fullWidth/r.noiseTexture.descriptor.width,a.camera.fullHeight/r.noiseTexture.descriptor.height))),new se("intensity",(r=>r.intensity)),new st("screenSize",((r,a)=>Ve(Ea,a.camera.fullWidth,a.camera.fullHeight)))),t.outputs.add("fragOcclusion","float"),e.code.add(s`
    void main(void) {
      float depth = depthFromTexture(depthMap, uv);

      // Early out if depth is out of range, such as in the sky
      if (depth >= 1.0 || depth <= 0.0) {
        fragOcclusion = 1.0;
        return;
      }

      // get the normal of current fragment
      vec4 norm4 = texture(normalMap, uv);
      if(norm4.a != 1.0) {
        fragOcclusion = 1.0;
        return;
      }
      vec3 norm = vec3(-1.0) + 2.0 * norm4.xyz;

      float currentPixelDepth = linearizeDepth(depth);
      vec3 currentPixelPos = reconstructPosition(gl_FragCoord.xy, currentPixelDepth);

      float sum = 0.0;
      vec3 tapPixelPos;

      vec3 fres = normalize(2.0 * texture(rnm, uv * rnmScale).xyz - 1.0);

      // note: the factor 2.0 should not be necessary, but makes ssao much nicer.
      // bug or deviation from CE somewhere else?
      float ps = projScale / (2.0 * currentPixelPos.z * zScale.x + zScale.y);

      for(int i = 0; i < ${s.int(Sa)}; ++i) {
        vec2 unitOffset = reflect(sphere[i], fres).xy;
        vec2 offset = vec2(-unitOffset * radius * ps);

        // don't use current or very nearby samples
        if( abs(offset.x) < 2.0 || abs(offset.y) < 2.0){
          continue;
        }

        vec2 tc = vec2(gl_FragCoord.xy + offset);
        if (tc.x < 0.0 || tc.y < 0.0 || tc.x > screenSize.x || tc.y > screenSize.y) continue;
        vec2 tcTap = tc / screenSize;
        float occluderFragmentDepth = linearDepthFromTexture(depthMap, tcTap);

        tapPixelPos = reconstructPosition(tc, occluderFragmentDepth);

        sum += aoValueFromPositionsAndNormal(currentPixelPos, norm, tapPixelPos);
      }

      // output the result
      float A = max(1.0 - sum * intensity / float(${s.int(Sa)}), 0.0);

      // Anti-tone map to reduce contrast and drag dark region farther: (x^0.2 + 1.2 * x^4) / 2.2
      A = (pow(A, 0.2) + 1.2 * A*A*A*A) / 2.2;

      fragOcclusion = A;
    }
  `),t}function ar(t){return Math.max(10,20*t.computeScreenPixelSizeAtDist(Math.abs(4*t.relativeElevation)))}const Ea=Jt(),Xl=Object.freeze(Object.defineProperty({__proto__:null,build:Bi,getRadius:ar},Symbol.toStringTag,{value:"Module"}));let zi=class Gi extends zr{initializeProgram(e){return new Gr(e.rctx,Gi.shader.get().build(),er)}initializePipeline(){return Pr({colorWrite:$r})}};zi.shader=new tr(Xl,(()=>wt(()=>Promise.resolve().then(()=>Bc),void 0)));const pt=2;let ke=class extends Cl{constructor(t){super(t),this.consumes={required:["normals"]},this.produces="ssao",this.isEnabled=()=>!1,this._enableTime=Ot(0),this._passParameters=new jl,this._drawParameters=new Wl}initialize(){const t=Uint8Array.from(atob(Vl),(r=>r.charCodeAt(0))),e=new qa;e.wrapMode=Ue.CLAMP_TO_EDGE,e.pixelFormat=Fe.RGB,e.wrapMode=Ue.REPEAT,e.hasMipmap=!0,e.width=32,e.height=32,this._passParameters.noiseTexture=new it(this.renderingContext,e,t),this._ssaoTechnique=this.techniques.acquire(zi),this._blurTechnique=this.techniques.acquire(Di),this.addHandles(Da((()=>this.isEnabled()),(()=>this._enableTime=Ot(0))))}destroy(){this._passParameters.noiseTexture=zt(this._passParameters.noiseTexture),this._blurTechnique.release(),this._ssaoTechnique.release()}render(t){const e=this.bindParameters,r=t.find((({name:N})=>N==="normals")),a=r==null?void 0:r.getTexture(),o=r==null?void 0:r.getTexture(en),i=this.fboCache,n=e.camera,c=n.fullViewport[2],l=n.fullViewport[3],u=Math.round(c/pt),d=Math.round(l/pt);if(!this._ssaoTechnique.compiled||!this._blurTechnique.compiled)return this._enableTime=Ot(performance.now()),this.requestRender(),i.acquire(u,d,"ssao",rt.RED);this._enableTime===0&&(this._enableTime=Ot(performance.now()));const h=this.renderingContext,p=this.view.qualitySettings.fadeDuration,v=n.relativeElevation,x=Ra((xa-v)/(xa-Ol),0,1),T=p>0?Math.min(p,performance.now()-this._enableTime)/p:1,g=T*x;this._passParameters.normalTexture=a,this._passParameters.depthTexture=o,this._passParameters.projScale=1/n.computeScreenPixelSizeAtDist(1),this._passParameters.intensity=4*Jl/ar(n)**6*g;const I=i.acquire(c,l,"ssao input",rt.RG);h.unbindTexture(I.fbo.colorTexture),h.bindFramebuffer(I.fbo),h.setViewport(0,0,c,l),h.bindTechnique(this._ssaoTechnique,e,this._passParameters,this._drawParameters),h.screen.draw();const C=i.acquire(u,d,"ssao blur",rt.RED);h.unbindTexture(C.fbo.colorTexture),h.bindFramebuffer(C.fbo),this._drawParameters.colorTexture=I.getTexture(),Ve(this._drawParameters.blurSize,0,pt/l),h.bindTechnique(this._blurTechnique,e,this._passParameters,this._drawParameters),h.setViewport(0,0,u,d),h.screen.draw(),I.release();const $=i.acquire(u,d,"ssao",rt.RED);return h.unbindTexture($.fbo.colorTexture),h.bindFramebuffer($.fbo),h.setViewport(0,0,c,l),h.setClearColor(1,1,1,0),h.clear(tn.COLOR_BUFFER_BIT),this._drawParameters.colorTexture=C.getTexture(),Ve(this._drawParameters.blurSize,pt/c,0),h.bindTechnique(this._blurTechnique,e,this._passParameters,this._drawParameters),h.setViewport(0,0,u,d),h.screen.draw(),h.setViewport4fv(n.fullViewport),C.release(),T<1&&this.requestRender(ja.UPDATE),$}};m([G()],ke.prototype,"consumes",void 0),m([G()],ke.prototype,"produces",void 0),m([G({constructOnly:!0})],ke.prototype,"techniques",void 0),m([G({constructOnly:!0})],ke.prototype,"isEnabled",void 0),ke=m([Ir("esri.views.3d.webgl-engine.effects.ssao.SSAO")],ke);const Jl=.5;function Ur(t,e){const r=t.fragment;e.receiveAmbientOcclusion?(r.uniforms.add(new Q("ssaoTex",((a,o)=>{var i;return(i=o.ssao)==null?void 0:i.getTexture()}))),r.constants.add("blurSizePixelsInverse","float",1/pt),r.code.add(s`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):r.code.add(s`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}function Zl(t,e){const r=t.fragment,a=e.lightingSphericalHarmonicsOrder!==void 0?e.lightingSphericalHarmonicsOrder:2;a===0?(r.uniforms.add(new Z("lightingAmbientSH0",((o,i)=>j(ya,i.lighting.sh.r[0],i.lighting.sh.g[0],i.lighting.sh.b[0])))),r.code.add(s`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
return ambientLight * (1.0 - ambientOcclusion);
}`)):a===1?(r.uniforms.add(new te("lightingAmbientSH_R",((o,i)=>ie(Te,i.lighting.sh.r[0],i.lighting.sh.r[1],i.lighting.sh.r[2],i.lighting.sh.r[3]))),new te("lightingAmbientSH_G",((o,i)=>ie(Te,i.lighting.sh.g[0],i.lighting.sh.g[1],i.lighting.sh.g[2],i.lighting.sh.g[3]))),new te("lightingAmbientSH_B",((o,i)=>ie(Te,i.lighting.sh.b[0],i.lighting.sh.b[1],i.lighting.sh.b[2],i.lighting.sh.b[3])))),r.code.add(s`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec4 sh0 = vec4(
0.282095,
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y
);
vec3 ambientLight = vec3(
dot(lightingAmbientSH_R, sh0),
dot(lightingAmbientSH_G, sh0),
dot(lightingAmbientSH_B, sh0)
);
return ambientLight * (1.0 - ambientOcclusion);
}`)):a===2&&(r.uniforms.add(new Z("lightingAmbientSH0",((o,i)=>j(ya,i.lighting.sh.r[0],i.lighting.sh.g[0],i.lighting.sh.b[0]))),new te("lightingAmbientSH_R1",((o,i)=>ie(Te,i.lighting.sh.r[1],i.lighting.sh.r[2],i.lighting.sh.r[3],i.lighting.sh.r[4]))),new te("lightingAmbientSH_G1",((o,i)=>ie(Te,i.lighting.sh.g[1],i.lighting.sh.g[2],i.lighting.sh.g[3],i.lighting.sh.g[4]))),new te("lightingAmbientSH_B1",((o,i)=>ie(Te,i.lighting.sh.b[1],i.lighting.sh.b[2],i.lighting.sh.b[3],i.lighting.sh.b[4]))),new te("lightingAmbientSH_R2",((o,i)=>ie(Te,i.lighting.sh.r[5],i.lighting.sh.r[6],i.lighting.sh.r[7],i.lighting.sh.r[8]))),new te("lightingAmbientSH_G2",((o,i)=>ie(Te,i.lighting.sh.g[5],i.lighting.sh.g[6],i.lighting.sh.g[7],i.lighting.sh.g[8]))),new te("lightingAmbientSH_B2",((o,i)=>ie(Te,i.lighting.sh.b[5],i.lighting.sh.b[6],i.lighting.sh.b[7],i.lighting.sh.b[8])))),r.code.add(s`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight * (1.0 - ambientOcclusion);
}`),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic||r.code.add(s`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance(float ambientOcclusion)
{
vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
}`))}const ya=M(),Te=Or();function jr(t){t.uniforms.add(new Z("mainLightDirection",((e,r)=>r.lighting.mainLight.direction)))}function ir(t){t.uniforms.add(new Z("mainLightIntensity",((e,r)=>r.lighting.mainLight.intensity)))}function Aa(t){jr(t.fragment),ir(t.fragment),t.fragment.code.add(s`vec3 evaluateMainLighting(vec3 normal_global, float shadowing) {
float dotVal = clamp(dot(normal_global, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadowing) * dotVal);
}`)}function Kl(t){const e=t.fragment.code;e.add(s`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
{
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),e.add(s`float integratedRadiance(float cosTheta2, float roughness)
{
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),e.add(s`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
{
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}function Vi(t){t.vertex.code.add(s`const float PI = 3.141592653589793;`),t.fragment.code.add(s`const float PI = 3.141592653589793;
const float LIGHT_NORMALIZATION = 1.0 / PI;
const float INV_PI = 0.3183098861837907;
const float HALF_PI = 1.570796326794897;`)}function Hr(t,e){const r=t.fragment.code;t.include(Vi),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic&&e.pbrMode!==L.Simplified&&e.pbrMode!==L.TerrainWithWater||(r.add(s`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),r.add(s`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`)),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic||(t.include(Kl),r.add(s`struct PBRShadingInfo
{
float NdotL;
float NdotV;
float NdotH;
float VdotH;
float LdotH;
float NdotNG;
float RdotNG;
float NdotAmbDir;
float NdotH_Horizon;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
float averageAmbientRadiance;
float ssao;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),r.add(s`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`),r.add(s`float gamutMapChanel(float x, vec2 p){
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),r.add(s`vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
vec3 outColor;
vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
outColor.x = gamutMapChanel(inColor.x, p) ;
outColor.y = gamutMapChanel(inColor.y, p) ;
outColor.z = gamutMapChanel(inColor.z, p) ;
return outColor;
}`))}let Ql=class extends ee{constructor(e,r){super(e,"bool",D.Pass,((a,o,i)=>a.setUniform1b(e,r(o,i))))}};const ec=.4;function Wr(t){t.constants.add("ambientBoostFactor","float",ec)}function qr(t){t.uniforms.add(new se("lightingGlobalFactor",((e,r)=>r.lighting.globalFactor)))}function Ui(t,e){const r=t.fragment;switch(t.include(Ur,e),e.pbrMode!==L.Disabled&&t.include(Hr,e),t.include(Zl,e),t.include(Vi),r.code.add(s`
    const float GAMMA_SRGB = 2.1;
    const float INV_GAMMA_SRGB = 0.4761904;
    ${e.pbrMode===L.Disabled?"":"const vec3 GROUND_REFLECTANCE = vec3(0.2);"}
  `),Wr(r),qr(r),jr(r),r.code.add(s`
    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float vndl = dot(${e.spherical?s`normalize(vPosWorld)`:s`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
    }
  `),ir(r),r.code.add(s`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`),e.pbrMode){case L.Disabled:case L.WaterOnIntegratedMesh:case L.Water:t.include(Aa),r.code.add(s`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight)
{
vec3 mainLighting = evaluateMainLighting(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ssao);
vec3 albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return pow(outColor, vec3(INV_GAMMA_SRGB));
}`);break;case L.Normal:case L.Schematic:r.code.add(s`const float fillLightIntensity = 0.25;
const float horizonLightDiffusion = 0.4;
const float additionalAmbientIrradianceFactor = 0.02;
vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDir, vec3 normalGround, vec3 mrr, vec3 _emission, float additionalAmbientIrradiance)
{
vec3 viewDirection = -viewDir;
vec3 h = normalize(viewDirection + mainLightDirection);
PBRShadingInfo inputs;
inputs.NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
inputs.NdotH = clamp(dot(normal, h), 0.0, 1.0);
inputs.VdotH = clamp(dot(viewDirection, h), 0.0, 1.0);
inputs.NdotNG = clamp(dot(normal, normalGround), -1.0, 1.0);
vec3 reflectedView = normalize(reflect(viewDirection, normal));
inputs.RdotNG = clamp(dot(reflectedView, normalGround), -1.0, 1.0);
inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
inputs.ssao = ssao;
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);`),r.code.add(s`inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);`),e.useFillLights?r.uniforms.add(new Ql("hasFillLights",((a,o)=>o.enableFillLights))):r.constants.add("hasFillLights","bool",!1),r.code.add(s`vec3 ambientDir = vec3(5.0 * normalGround[1] - normalGround[0] * normalGround[2], - 5.0 * normalGround[0] - normalGround[2] * normalGround[1], normalGround[1] * normalGround[1] + normalGround[0] * normalGround[0]);
ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));
inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;
vec3 mainLightIrradianceComponent = inputs.NdotL * (1.0 - shadow) * mainLightIntensity;
vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;
inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;`),r.uniforms.add(new se("lightingSpecularStrength",((a,o)=>o.lighting.mainLight.specularStrength)),new se("lightingEnvironmentStrength",((a,o)=>o.lighting.mainLight.environmentStrength))),r.code.add(s`vec3 horizonRingDir = inputs.RdotNG * normalGround - reflectedView;
vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
inputs.NdotH_Horizon = dot(normal, horizonRingH);
vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(inputs.NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;
vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance(ssao) + additionalLight;
float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotNG + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));
inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.groundRadianceToSurface = 0.5 * GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE[1]);`),r.code.add(s`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = _emission == vec3(0.0) ? _emission : pow(_emission, vec3(GAMMA_SRGB));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${e.pbrMode!==L.Schematic||e.hasColorTexture?s`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs), vec3(INV_GAMMA_SRGB));`:s`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `);break;case L.Simplified:case L.TerrainWithWater:t.include(Aa),r.code.add(s`const float roughnessTerrain = 0.5;
const float specularityTerrain = 0.5;
const vec3 fresnelReflectionTerrain = vec3(0.04);
vec3 evaluatePBRSimplifiedLighting(vec3 n, vec3 c, float shadow, float ssao, vec3 al, vec3 vd, vec3 nup) {
vec3 viewDirection = -vd;
vec3 h = normalize(viewDirection + mainLightDirection);
float NdotL = clamp(dot(n, mainLightDirection), 0.001, 1.0);
float NdotV = clamp(abs(dot(n, viewDirection)), 0.001, 1.0);
float NdotH = clamp(dot(n, h), 0.0, 1.0);
float NdotNG = clamp(dot(n, nup), -1.0, 1.0);
vec3 albedoLinear = pow(c, vec3(GAMMA_SRGB));
float lightness = 0.3 * albedoLinear[0] + 0.5 * albedoLinear[1] + 0.2 * albedoLinear[2];
vec3 f0 = (0.85 * lightness + 0.15) * fresnelReflectionTerrain;
vec3 f90 =  vec3(clamp(dot(f0, vec3(50.0 * 0.33)), 0.0, 1.0));
vec3 mainLightIrradianceComponent = (1. - shadow) * NdotL * mainLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(n, ssao) + al;
vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;
vec3 indirectDiffuse = ((1.0 - NdotNG) * mainLightIrradianceComponent + (1.0 + NdotNG ) * ambientSky) * 0.5;
vec3 outDiffColor = albedoLinear * (1.0 - f0) * indirectDiffuse / PI;
vec3 mainLightRadianceComponent = normalDistribution(NdotH, roughnessTerrain) * mainLightIntensity;
vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, NdotV);
vec3 specularColor = f0 * dfg.x + f90 * dfg.y;
vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;
vec3 outColorLinear = outDiffColor + specularComponent;
vec3 outColor = pow(outColorLinear, vec3(INV_GAMMA_SRGB));
return outColor;
}`);break;default:Et(e.pbrMode);case L.COUNT:}}function ji(t,e){if(!e.multipassEnabled)return;t.fragment.include(Vr),t.fragment.uniforms.add(new Q("terrainDepthTexture",((a,o)=>{var i;return(i=o.multipassTerrain.depth)==null?void 0:i.attachment})));const r=e.occlusionPass;t.fragment.code.add(s`
   ${r?"bool":"void"} terrainDepthTest(float fragmentDepth) {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${r?s`return fragmentDepth < linearDepth && depth < 1.0;`:s`
          if(fragmentDepth ${e.cullAboveGround?">":"<="} linearDepth){
            discard;
          }`}
    }`)}class tc extends ee{constructor(e,r,a){super(e,"mat4",D.Draw,((o,i,n,c)=>o.setUniformMatrix4fv(e,r(i,n,c))),a)}}let rc=class extends ee{constructor(e,r,a){super(e,"mat4",D.Pass,((o,i,n)=>o.setUniformMatrix4fv(e,r(i,n))),a)}};function Hi(t,e){e.receiveShadows&&(t.fragment.uniforms.add(new rc("shadowMapMatrix",((r,a)=>a.shadowMap.getShadowMapMatrices(r.origin)),4)),qi(t))}function Wi(t,e){e.receiveShadows&&(t.fragment.uniforms.add(new tc("shadowMapMatrix",((r,a)=>a.shadowMap.getShadowMapMatrices(r.origin)),4)),qi(t))}function qi(t){const e=t.fragment;e.include(Ri),e.uniforms.add(new Q("shadowMap",((r,a)=>a.shadowMap.depthTexture)),new wi("numCascades",((r,a)=>a.shadowMap.numCascades)),new te("cascadeDistances",((r,a)=>a.shadowMap.cascadeDistances))),e.code.add(s`int chooseCascade(float depth, out mat4 mat) {
vec4 distance = cascadeDistances;
int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;
mat = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
return i;
}
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
float readShadowMapDepth(ivec2 uv, sampler2D _depthTex) {
return rgba4ToFloat(texelFetch(_depthTex, uv, 0));
}
float posIsInShadow(ivec2 uv, vec3 lvpos, sampler2D _depthTex) {
return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
}
float filterShadow(vec2 uv, vec3 lvpos, ivec2 texSize, sampler2D _depthTex) {
vec2 st = fract(uv * vec2(texSize) + vec2(0.5));
ivec2 base = ivec2(uv * vec2(texSize) - vec2(0.5));
float s00 = posIsInShadow(ivec2(base.x, base.y), lvpos, _depthTex);
float s10 = posIsInShadow(ivec2(base.x + 1, base.y), lvpos, _depthTex);
float s11 = posIsInShadow(ivec2(base.x + 1, base.y + 1), lvpos, _depthTex);
float s01 = posIsInShadow(ivec2(base.x, base.y + 1), lvpos, _depthTex);
return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
}
float readShadowMap(const in vec3 _vpos, float _linearDepth) {
mat4 mat;
int i = chooseCascade(_linearDepth, mat);
if (i >= numCascades) { return 0.0; }
vec3 lvpos = lightSpacePosition(_vpos, mat);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }
ivec2 size = textureSize(shadowMap, 0);
vec2 uv = cascadeCoordinates(i, size, lvpos);
return filterShadow(uv, lvpos, size, shadowMap);
}`)}function ac(t,e){e.hasColorTextureTransform?(t.vertex.uniforms.add(new ge("colorTextureTransformMatrix",(r=>r.colorTextureTransformMatrix??ct))),t.varyings.add("colorUV","vec2"),t.vertex.code.add(s`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(s`void forwardColorUV(){}`)}function ic(t,e){e.hasNormalTextureTransform&&e.textureCoordinateType!==Y.None?(t.vertex.uniforms.add(new ge("normalTextureTransformMatrix",(r=>r.normalTextureTransformMatrix??ct))),t.varyings.add("normalUV","vec2"),t.vertex.code.add(s`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(s`void forwardNormalUV(){}`)}function oc(t,e){e.hasEmissionTextureTransform&&e.textureCoordinateType!==Y.None?(t.vertex.uniforms.add(new ge("emissiveTextureTransformMatrix",(r=>r.emissiveTextureTransformMatrix??ct))),t.varyings.add("emissiveUV","vec2"),t.vertex.code.add(s`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(s`void forwardEmissiveUV(){}`)}function nc(t,e){e.hasOcclusionTextureTransform&&e.textureCoordinateType!==Y.None?(t.vertex.uniforms.add(new ge("occlusionTextureTransformMatrix",(r=>r.occlusionTextureTransformMatrix??ct))),t.varyings.add("occlusionUV","vec2"),t.vertex.code.add(s`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(s`void forwardOcclusionUV(){}`)}function sc(t,e){e.hasMetallicRoughnessTextureTransform&&e.textureCoordinateType!==Y.None?(t.vertex.uniforms.add(new ge("metallicRoughnessTextureTransformMatrix",(r=>r.metallicRoughnessTextureTransformMatrix??ct))),t.varyings.add("metallicRoughnessUV","vec2"),t.vertex.code.add(s`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(s`void forwardMetallicRoughnessUV(){}`)}function lc(t){t.code.add(s`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}function ki(t){t.include(lc),t.code.add(s`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${s.int(be.Multiply)}) {
        return allMixed;
      }
      if (mode == ${s.int(be.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${s.int(be.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${s.int(be.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${s.int(be.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}function Yi(t){const e=new rr,{vertex:r,fragment:a,varyings:o}=e;if(et(r,t),e.include(Fr),o.add("vpos","vec3"),e.include(_t,t),e.include(Ai,t),e.include(Oi,t),e.include(ac,t),t.output===B.Color){e.include(ic,t),e.include(oc,t),e.include(nc,t),e.include(sc,t),bt(r,t),e.include(Qt,t),e.include(Qe,t);const i=t.normalType===K.Attribute||t.normalType===K.Compressed;i&&t.offsetBackfaces&&e.include(_i),e.include(Ml,t),e.include(pi,t),t.instancedColor&&e.attributes.add(f.INSTANCECOLOR,"vec4"),o.add("vPositionLocal","vec3"),e.include(ze,t),e.include(Ti,t),e.include(Mi,t),e.include(Ci,t),r.uniforms.add(new te("externalColor",(n=>n.externalColor))),o.add("vcolorExt","vec4"),t.multipassEnabled&&o.add("depth","float"),r.code.add(s`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${t.instancedColor?"vcolorExt *= instanceColor * 0.003921568627451;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${s.float(Br)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        } else {
          vpos = getVertexInLocalOriginSpace();
          vPositionLocal = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${i?s`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${t.hasVertexTangents?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${i&&t.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
        }

        ${t.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
        forwardColorUV();
        forwardNormalUV();
        forwardEmissiveUV();
        forwardOcclusionUV();
        forwardMetallicRoughnessUV();
      }
    `),e.include(Ke,t),e.include(Ui,t),e.include(Ur,t),e.include(tt,t),e.include(t.instancedDoublePrecision?Hi:Wi,t),e.include(ji,t),bt(a,t),a.uniforms.add(r.uniforms.get("localOrigin"),new Z("ambient",(n=>n.ambient)),new Z("diffuse",(n=>n.diffuse)),new se("opacity",(n=>n.opacity)),new se("layerOpacity",(n=>n.layerOpacity))),t.hasColorTexture&&a.uniforms.add(new Q("tex",(n=>n.texture))),e.include(li,t),e.include(Hr,t),a.include(ki),e.include(Kn,t),Wr(a),qr(a),ir(a),t.transparencyPassType===ae.ColorAlpha&&(e.outputs.add("fragColor","vec4",0),e.outputs.add("fragAlpha","float",1)),a.code.add(s`
      void main() {
        discardBySlice(vpos);
        ${t.multipassEnabled?"terrainDepthTest(depth);":""}
        ${t.hasColorTexture?s`
                vec4 texColor = texture(tex, ${t.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                ${t.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:s`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        ${t.normalType===K.ScreenDerivative?s`
                vec3 normal = screenDerivativeNormal(vPositionLocal);`:s`
                shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
        ${t.pbrMode===L.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

        vec3 posWorld = vpos + localOrigin;

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        float shadow = ${t.receiveShadows?"readShadowMap(vpos, linearDepth)":t.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

        vec3 matColor = max(ambient, diffuse);
        ${t.hasVertexColors?s`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:s`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${t.hasNormalTexture?s`
                mat3 tangentSpace = ${t.hasVertexTangents?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
                vec3 shadingNormal = computeTextureNormal(tangentSpace, ${t.hasNormalTextureTransform?s`normalUV`:"vuv0"});`:s`vec3 shadingNormal = normal;`}
        vec3 normalGround = ${t.spherical?s`normalize(posWorld);`:s`vec3(0.0, 0.0, 1.0);`}

        ${t.snowCover?s`
                float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
                albedo = mix(albedo, vec3(1), snow);
                shadingNormal = mix(shadingNormal, normal, snow);
                ssao = mix(ssao, 1.0, snow);`:""}

        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

        ${t.pbrMode===L.Normal||t.pbrMode===L.Schematic?s`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${t.snowCover?s`
                        mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
                        emission = mix(emission, vec3(0.0), snow);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:s`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${t.transparencyPassType===ae.ColorAlpha?s`
                  fragColor = premultiplyAlpha(fragColor);
                  fragAlpha = fragColor.a;`:""}
      }
    `)}return e.include(Ii,t),e}const cc=Object.freeze(Object.defineProperty({__proto__:null,build:Yi},Symbol.toStringTag,{value:"Module"}));let dc=class extends Zs{constructor(){super(...arguments),this.isSchematic=!1,this.usePBR=!1,this.mrrFactors=_r(vi),this.hasVertexColors=!1,this.hasSymbolColors=!1,this.doubleSided=!1,this.doubleSidedType="normal",this.cullFace=Re.Back,this.isInstanced=!1,this.hasInstancedColor=!1,this.emissiveFactor=Ge(0,0,0),this.instancedDoublePrecision=!1,this.normalType=K.Attribute,this.receiveShadows=!0,this.receiveAmbientOcclusion=!0,this.castShadows=!0,this.shadowMappingEnabled=!1,this.ambient=Ge(.2,.2,.2),this.diffuse=Ge(.8,.8,.8),this.externalColor=Rr(1,1,1,1),this.colorMixMode="multiply",this.opacity=1,this.layerOpacity=1,this.origin=M(),this.hasSlicePlane=!1,this.hasSliceHighlight=!0,this.offsetTransparentBackfaces=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.modelTransformation=null,this.transparent=!1,this.writeDepth=!0,this.customDepthTest=At.Less,this.textureAlphaMode=J.Blend,this.textureAlphaCutoff=Ks,this.textureAlphaPremultiplied=!1,this.hasOccludees=!1,this.renderOccluded=Er.Occlude,this.isDecoration=!1}},kr=class Xi extends zr{initializeConfiguration(e,r){r.spherical=e.viewingMode===Gt.Global,r.doublePrecisionRequiresObfuscation=e.rctx.driverTest.doublePrecisionRequiresObfuscation.result,r.textureCoordinateType=r.hasColorTexture||r.hasMetallicRoughnessTexture||r.hasEmissionTexture||r.hasOcclusionTexture||r.hasNormalTexture?Y.Default:Y.None,r.objectAndLayerIdColorInstanced=r.instanced}initializeProgram(e){return this._initializeProgram(e,Xi.shader)}_initializeProgram(e,r){return new Gr(e.rctx,r.get().build(this.configuration),er)}_makePipeline(e,r){const a=this.configuration,o=e===ae.NONE,i=e===ae.FrontFace;return Pr({blending:a.output===B.Color&&a.transparent?o?hs:fs(e):null,culling:hc(a)?ln(a.cullFace):null,depthTest:{func:xs(e,uc(a.customDepthTest))},depthWrite:(o||i)&&a.writeDepth?sn:null,drawBuffers:a.output===B.Depth?{buffers:[rn.NONE]}:Ts(e),colorWrite:$r,stencilWrite:a.hasOccludees?Qs:null,stencilTest:a.hasOccludees?r?tl:el:null,polygonOffset:o||i?null:gs(a.enableOffset)})}initializePipeline(){return this._occludeePipelineState=this._makePipeline(this.configuration.transparencyPassType,!0),this._makePipeline(this.configuration.transparencyPassType,!1)}getPipeline(e){return e?this._occludeePipelineState:super.getPipeline()}};function uc(t){return t===At.Lequal?ve.LEQUAL:ve.LESS}function hc(t){return t.cullFace!==Re.None||!t.hasSlicePlane&&!t.transparent&&!t.doubleSidedMode}kr.shader=new tr(cc,(()=>wt(()=>Promise.resolve().then(()=>zc),void 0)));let Bt=class extends yr{};m([_({constValue:!0})],Bt.prototype,"hasSliceHighlight",void 0),m([_({constValue:!1})],Bt.prototype,"hasSliceInVertexProgram",void 0),m([_({constValue:D.Pass})],Bt.prototype,"pbrTextureBindType",void 0);class y extends Bt{constructor(){super(...arguments),this.output=B.Color,this.alphaDiscardMode=J.Opaque,this.doubleSidedMode=re.None,this.pbrMode=L.Disabled,this.cullFace=Re.None,this.transparencyPassType=ae.NONE,this.normalType=K.Attribute,this.textureCoordinateType=Y.None,this.customDepthTest=At.Less,this.spherical=!1,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.hasVerticalOffset=!1,this.hasSlicePlane=!1,this.hasSliceHighlight=!0,this.hasColorTexture=!1,this.hasMetallicRoughnessTexture=!1,this.hasEmissionTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.hasScreenSizePerspective=!1,this.hasVertexTangents=!1,this.hasOccludees=!1,this.multipassEnabled=!1,this.hasModelTransformation=!1,this.offsetBackfaces=!1,this.vvSize=!1,this.vvColor=!1,this.receiveShadows=!1,this.receiveAmbientOcclusion=!1,this.textureAlphaPremultiplied=!1,this.instanced=!1,this.instancedColor=!1,this.objectAndLayerIdColorInstanced=!1,this.instancedDoublePrecision=!1,this.doublePrecisionRequiresObfuscation=!1,this.writeDepth=!0,this.transparent=!1,this.enableOffset=!0,this.cullAboveGround=!1,this.snowCover=!1,this.hasColorTextureTransform=!1,this.hasEmissionTextureTransform=!1,this.hasNormalTextureTransform=!1,this.hasOcclusionTextureTransform=!1,this.hasMetallicRoughnessTextureTransform=!1}}m([_({count:B.COUNT})],y.prototype,"output",void 0),m([_({count:J.COUNT})],y.prototype,"alphaDiscardMode",void 0),m([_({count:re.COUNT})],y.prototype,"doubleSidedMode",void 0),m([_({count:L.COUNT})],y.prototype,"pbrMode",void 0),m([_({count:Re.COUNT})],y.prototype,"cullFace",void 0),m([_({count:ae.COUNT})],y.prototype,"transparencyPassType",void 0),m([_({count:K.COUNT})],y.prototype,"normalType",void 0),m([_({count:Y.COUNT})],y.prototype,"textureCoordinateType",void 0),m([_({count:At.COUNT})],y.prototype,"customDepthTest",void 0),m([_()],y.prototype,"spherical",void 0),m([_()],y.prototype,"hasVertexColors",void 0),m([_()],y.prototype,"hasSymbolColors",void 0),m([_()],y.prototype,"hasVerticalOffset",void 0),m([_()],y.prototype,"hasSlicePlane",void 0),m([_()],y.prototype,"hasSliceHighlight",void 0),m([_()],y.prototype,"hasColorTexture",void 0),m([_()],y.prototype,"hasMetallicRoughnessTexture",void 0),m([_()],y.prototype,"hasEmissionTexture",void 0),m([_()],y.prototype,"hasOcclusionTexture",void 0),m([_()],y.prototype,"hasNormalTexture",void 0),m([_()],y.prototype,"hasScreenSizePerspective",void 0),m([_()],y.prototype,"hasVertexTangents",void 0),m([_()],y.prototype,"hasOccludees",void 0),m([_()],y.prototype,"multipassEnabled",void 0),m([_()],y.prototype,"hasModelTransformation",void 0),m([_()],y.prototype,"offsetBackfaces",void 0),m([_()],y.prototype,"vvSize",void 0),m([_()],y.prototype,"vvColor",void 0),m([_()],y.prototype,"receiveShadows",void 0),m([_()],y.prototype,"receiveAmbientOcclusion",void 0),m([_()],y.prototype,"textureAlphaPremultiplied",void 0),m([_()],y.prototype,"instanced",void 0),m([_()],y.prototype,"instancedColor",void 0),m([_()],y.prototype,"objectAndLayerIdColorInstanced",void 0),m([_()],y.prototype,"instancedDoublePrecision",void 0),m([_()],y.prototype,"doublePrecisionRequiresObfuscation",void 0),m([_()],y.prototype,"writeDepth",void 0),m([_()],y.prototype,"transparent",void 0),m([_()],y.prototype,"enableOffset",void 0),m([_()],y.prototype,"cullAboveGround",void 0),m([_()],y.prototype,"snowCover",void 0),m([_()],y.prototype,"hasColorTextureTransform",void 0),m([_()],y.prototype,"hasEmissionTextureTransform",void 0),m([_()],y.prototype,"hasNormalTextureTransform",void 0),m([_()],y.prototype,"hasOcclusionTextureTransform",void 0),m([_()],y.prototype,"hasMetallicRoughnessTextureTransform",void 0),m([_({constValue:!1})],y.prototype,"occlusionPass",void 0),m([_({constValue:!0})],y.prototype,"hasVvInstancing",void 0),m([_({constValue:!1})],y.prototype,"useCustomDTRExponentForWater",void 0),m([_({constValue:!1})],y.prototype,"supportsTextureAtlas",void 0),m([_({constValue:!0})],y.prototype,"useFillLights",void 0);function Ji(t){const e=new rr,{vertex:r,fragment:a,varyings:o}=e;return et(r,t),e.include(Fr),o.add("vpos","vec3"),e.include(_t,t),e.include(Ai,t),e.include(Oi,t),t.output===B.Color&&(bt(e.vertex,t),e.include(Qt,t),e.include(Qe,t),t.offsetBackfaces&&e.include(_i),t.instancedColor&&e.attributes.add(f.INSTANCECOLOR,"vec4"),o.add("vNormalWorld","vec3"),o.add("localvpos","vec3"),t.multipassEnabled&&o.add("depth","float"),e.include(ze,t),e.include(Ti,t),e.include(Mi,t),e.include(Ci,t),r.uniforms.add(new te("externalColor",(i=>i.externalColor))),o.add("vcolorExt","vec4"),r.code.add(s`
        void main(void) {
          forwardNormalizedVertexColor();
          vcolorExt = externalColor;
          ${t.instancedColor?"vcolorExt *= instanceColor * 0.003921568627451;":""}
          vcolorExt *= vvColor();
          vcolorExt *= getSymbolColor();
          forwardColorMixMode();

          if (vcolorExt.a < ${s.float(Br)}) {
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          } else {
            vpos = getVertexInLocalOriginSpace();
            localvpos = vpos - view[3].xyz;
            vpos = subtractOrigin(vpos);
            vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            ${t.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
          }
          ${t.multipassEnabled?s`depth = (view * vec4(vpos, 1.0)).z;`:""}
          forwardLinearDepth();
          forwardTextureCoordinates();
        }
      `)),t.output===B.Color&&(e.include(Ke,t),e.include(Ui,t),e.include(Ur,t),e.include(tt,t),e.include(t.instancedDoublePrecision?Hi:Wi,t),e.include(ji,t),bt(e.fragment,t),jr(a),Wr(a),qr(a),a.uniforms.add(r.uniforms.get("localOrigin"),r.uniforms.get("view"),new Z("ambient",(i=>i.ambient)),new Z("diffuse",(i=>i.diffuse)),new se("opacity",(i=>i.opacity)),new se("layerOpacity",(i=>i.layerOpacity))),t.hasColorTexture&&a.uniforms.add(new Q("tex",(i=>i.texture))),e.include(li,t),e.include(Hr,t),a.include(ki),t.transparencyPassType===ae.ColorAlpha&&(e.outputs.add("fragColor","vec4",0),e.outputs.add("fragAlpha","float",1)),ir(a),a.code.add(s`
      void main() {
        discardBySlice(vpos);
        ${t.multipassEnabled?s`terrainDepthTest(depth);`:""}
        ${t.hasColorTexture?s`
                vec4 texColor = texture(tex, ${t.hasColorTextureTransform?s`colorUV`:s`vuv0`});
                ${t.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:s`vec4 texColor = vec4(1.0);`}
        vec3 viewDirection = normalize(vpos - cameraPosition);
        ${t.pbrMode===L.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${t.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":t.spherical?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${t.hasVertexColors?s`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:s`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${t.snowCover?s`albedo = mix(albedo, vec3(1), 0.9);`:s``}
        ${s`
            vec3 shadingNormal = normalize(vNormalWorld);
            albedo *= 1.2;
            vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
            float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
            float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
            float treeRadialFalloff = vColor.r;
            float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
            additionalLight += backLightFactor * mainLightIntensity;`}
        ${t.pbrMode===L.Normal||t.pbrMode===L.Schematic?t.spherical?s`vec3 normalGround = normalize(vpos + localOrigin);`:s`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:s``}
        ${t.pbrMode===L.Normal||t.pbrMode===L.Schematic?s`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${t.snowCover?s`
                        mrr = vec3(0.0, 1.0, 0.04);
                        emission = vec3(0.0);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:s`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${t.transparencyPassType===ae.ColorAlpha?s`
                fragColor = premultiplyAlpha(fragColor);
                fragAlpha = fragColor.a;`:""}
      }
    `)),e.include(Ii,t),e}const mc=Object.freeze(Object.defineProperty({__proto__:null,build:Ji},Symbol.toStringTag,{value:"Module"}));class or extends kr{initializeConfiguration(e,r){super.initializeConfiguration(e,r),r.hasMetallicRoughnessTexture=!1,r.hasEmissionTexture=!1,r.hasOcclusionTexture=!1,r.hasNormalTexture=!1,r.hasModelTransformation=!1,r.normalType=K.Attribute,r.doubleSidedMode=re.WindingOrder,r.hasVertexTangents=!1}initializeProgram(e){return this._initializeProgram(e,or.shader)}}or.shader=new tr(mc,(()=>wt(()=>Promise.resolve().then(()=>Gc),void 0)));let kt=class extends us{constructor(e){super(e,vc),this.supportsEdges=!0,this.produces=new Map([[Tt.OPAQUE_MATERIAL,r=>(dr(r)||ur(r))&&!this.parameters.transparent],[Tt.TRANSPARENT_MATERIAL,r=>(dr(r)||ur(r))&&this.parameters.transparent&&this.parameters.writeDepth],[Tt.TRANSPARENT_DEPTH_WRITE_DISABLED_MATERIAL,r=>(dr(r)||ur(r))&&this.parameters.transparent&&!this.parameters.writeDepth]]),this._configuration=new y,this._vertexBufferLayout=gc(this.parameters)}isVisibleForOutput(e){return e!==B.Shadow&&e!==B.ShadowExcludeHighlight&&e!==B.ShadowHighlight||this.parameters.castShadows}isVisible(){const e=this.parameters;if(!super.isVisible()||e.layerOpacity===0)return!1;const{hasInstancedColor:r,hasVertexColors:a,hasSymbolColors:o,vvColor:i}=e,n=e.colorMixMode==="replace",c=e.opacity>0,l=e.externalColor&&e.externalColor[3]>0,u=r||i||o;return a&&u?n||c:a?n?l:c:u?n||c:n?l:c}getConfiguration(e,r){return this._configuration.output=e,this._configuration.hasNormalTexture=!!this.parameters.normalTextureId,this._configuration.hasColorTexture=!!this.parameters.textureId,this._configuration.hasVertexTangents=this.parameters.hasVertexTangents,this._configuration.instanced=this.parameters.isInstanced,this._configuration.instancedDoublePrecision=this.parameters.instancedDoublePrecision,this._configuration.vvSize=!!this.parameters.vvSize,this._configuration.hasVerticalOffset=this.parameters.verticalOffset!=null,this._configuration.hasScreenSizePerspective=this.parameters.screenSizePerspective!=null,this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasSliceHighlight=this.parameters.hasSliceHighlight,this._configuration.alphaDiscardMode=this.parameters.textureAlphaMode,this._configuration.normalType=this.parameters.normalType,this._configuration.transparent=this.parameters.transparent,this._configuration.writeDepth=this.parameters.writeDepth,this.parameters.customDepthTest!=null&&(this._configuration.customDepthTest=this.parameters.customDepthTest),this._configuration.hasOccludees=this.parameters.hasOccludees,this._configuration.cullFace=this.parameters.hasSlicePlane?Re.None:this.parameters.cullFace,this._configuration.multipassEnabled=r.multipassEnabled,this._configuration.cullAboveGround=r.multipassTerrain.cullAboveGround,this._configuration.hasModelTransformation=this.parameters.modelTransformation!=null,e===B.Color&&(this._configuration.hasVertexColors=this.parameters.hasVertexColors,this._configuration.hasSymbolColors=this.parameters.hasSymbolColors,this.parameters.treeRendering?this._configuration.doubleSidedMode=re.WindingOrder:this._configuration.doubleSidedMode=this.parameters.doubleSided&&this.parameters.doubleSidedType==="normal"?re.View:this.parameters.doubleSided&&this.parameters.doubleSidedType==="winding-order"?re.WindingOrder:re.None,this._configuration.instancedColor=this.parameters.hasInstancedColor,this._configuration.receiveShadows=this.parameters.receiveShadows&&this.parameters.shadowMappingEnabled,this._configuration.receiveAmbientOcclusion=this.parameters.receiveAmbientOcclusion&&r.ssao!=null,this._configuration.vvColor=!!this.parameters.vvColor,this._configuration.textureAlphaPremultiplied=!!this.parameters.textureAlphaPremultiplied,this._configuration.pbrMode=this.parameters.usePBR?this.parameters.isSchematic?L.Schematic:L.Normal:L.Disabled,this._configuration.hasMetallicRoughnessTexture=!!this.parameters.metallicRoughnessTextureId,this._configuration.hasEmissionTexture=!!this.parameters.emissiveTextureId,this._configuration.hasOcclusionTexture=!!this.parameters.occlusionTextureId,this._configuration.offsetBackfaces=!(!this.parameters.transparent||!this.parameters.offsetTransparentBackfaces),this._configuration.transparencyPassType=r.transparencyPassType,this._configuration.enableOffset=r.camera.relativeElevation<ps,this._configuration.snowCover=this.hasSnowCover(r),this._configuration.hasColorTextureTransform=!!this.parameters.colorTextureTransformMatrix,this._configuration.hasNormalTextureTransform=!!this.parameters.normalTextureTransformMatrix,this._configuration.hasEmissionTextureTransform=!!this.parameters.emissiveTextureTransformMatrix,this._configuration.hasOcclusionTextureTransform=!!this.parameters.occlusionTextureTransformMatrix,this._configuration.hasMetallicRoughnessTextureTransform=!!this.parameters.metallicRoughnessTextureTransformMatrix),this._configuration}hasSnowCover(e){return e.weather!=null&&e.weatherVisible&&e.weather.type==="snowy"&&e.weather.snowCover==="enabled"}intersect(e,r,a,o,i,n){if(this.parameters.verticalOffset!=null){const c=a.camera;j(gr,r[12],r[13],r[14]);let l=null;switch(a.viewingMode){case Gt.Global:l=Yt(wa,gr);break;case Gt.Local:l=Ft(wa,_c)}let u=0;const d=Me(bc,gr,c.eye),h=fe(d),p=pe(d,d,1/h);let v=null;this.parameters.screenSizePerspective&&(v=Eo(l,p)),u+=ss(c,h,this.parameters.verticalOffset,v??0,this.parameters.screenSizePerspective),pe(l,l,u),yo(vr,l,a.transform.inverseRotation),o=Me(xc,o,vr),i=Me(Tc,i,vr)}bs(e,a,o,i,zs(a.verticalOffset),n)}createGLMaterial(e){return new fc(e)}createBufferWriter(){return new Xs(this._vertexBufferLayout)}},fc=class extends ts{constructor(e){super({...e,...e.material.parameters})}_updateShadowState(e){e.shadowMap.enabled!==this._material.parameters.shadowMappingEnabled&&this._material.setParameters({shadowMappingEnabled:e.shadowMap.enabled})}_updateOccludeeState(e){e.hasOccludees!==this._material.parameters.hasOccludees&&this._material.setParameters({hasOccludees:e.hasOccludees})}beginSlot(e){this._output===B.Color&&(this._updateShadowState(e),this._updateOccludeeState(e));const r=this._material.parameters;this.updateTexture(r.textureId);const a=e.camera.viewInverseTransposeMatrix;return j(r.origin,a[3],a[7],a[11]),this._material.setParameters(this.textureBindParameters),this.ensureTechnique(r.treeRendering?or:kr,e)}};class pc extends dc{constructor(){super(...arguments),this.initTextureTransparent=!1,this.treeRendering=!1,this.hasVertexTangents=!1}}const vc=new pc;function gc(t){const e=nn().vec3f(f.POSITION);return t.normalType===K.Compressed?e.vec2i16(f.NORMALCOMPRESSED,{glNormalized:!0}):e.vec3f(f.NORMAL),t.hasVertexTangents&&e.vec4f(f.TANGENT),(t.textureId||t.normalTextureId||t.metallicRoughnessTextureId||t.emissiveTextureId||t.occlusionTextureId)&&e.vec2f(f.UV0),t.hasVertexColors&&e.vec4u8(f.COLOR),t.hasSymbolColors&&e.vec4u8(f.SYMBOLCOLOR),Ao("enable-feature:objectAndLayerId-rendering")&&e.vec4u8(f.OBJECTANDLAYERIDCOLOR),e}const xc=M(),Tc=M(),_c=Ge(0,0,1),wa=M(),vr=M(),gr=M(),bc=M(),_e=()=>Cr.getLogger("esri.views.3d.layers.graphics.objectResourceUtils");async function Sc(t,e){const r=await Ec(t,e),a=await Cc(r.textureDefinitions??{},e);let o=0;for(const i in a)if(a.hasOwnProperty(i)){const n=a[i];o+=n!=null&&n.image?n.image.width*n.image.height*4:0}return{resource:r,textures:a,size:o+wo(r)}}async function Ec(t,e){const r=e==null?void 0:e.streamDataRequester;if(r)return yc(t,r,e);const a=await Ba(Mo(t,e));if(a.ok===!0)return a.value.data;za(a.error),Zi(a.error)}async function yc(t,e,r){const a=await Ba(e.request(t,"json",r));if(a.ok===!0)return a.value;za(a.error),Zi(a.error.details.url)}function Zi(t){throw new St("",`Request for object resource failed: ${t}`)}function Ac(t){const e=t.params,r=e.topology;let a=!0;switch(e.vertexAttributes||(_e().warn("Geometry must specify vertex attributes"),a=!1),e.topology){case"PerAttributeArray":break;case"Indexed":case null:case void 0:{const i=e.faces;if(i){if(e.vertexAttributes)for(const n in e.vertexAttributes){const c=i[n];c!=null&&c.values?(c.valueType!=null&&c.valueType!=="UInt32"&&(_e().warn(`Unsupported indexed geometry indices type '${c.valueType}', only UInt32 is currently supported`),a=!1),c.valuesPerElement!=null&&c.valuesPerElement!==1&&(_e().warn(`Unsupported indexed geometry values per element '${c.valuesPerElement}', only 1 is currently supported`),a=!1)):(_e().warn(`Indexed geometry does not specify face indices for '${n}' attribute`),a=!1)}}else _e().warn("Indexed geometries must specify faces"),a=!1;break}default:_e().warn(`Unsupported topology '${r}'`),a=!1}t.params.material||(_e().warn("Geometry requires material"),a=!1);const o=t.params.vertexAttributes;for(const i in o)o[i].values||(_e().warn("Geometries with externally defined attributes are not yet supported"),a=!1);return a}function wc(t,e){var x,T;const r=new Array,a=new Array,o=new Array,i=new qo,n=t.resource,c=Fa.parse(n.version||"1.0","wosr");Rc.validate(c);const l=n.model.name,u=n.model.geometries,d=n.materialDefinitions??{},h=t.textures;let p=0;const v=new Map;for(let g=0;g<u.length;g++){const I=u[g];if(!Ac(I))continue;const C=Oc(I),$=I.params.vertexAttributes,N=[],V=P=>{if(I.params.topology==="PerAttributeArray")return null;const F=I.params.faces;for(const H in F)if(H===P)return F[H].values;return null},z=$[f.POSITION],w=z.values.length/z.valuesPerElement;for(const P in $){const F=$[P],H=F.values,le=V(P)??Va(w);N.push([P,new Xe(H,le,F.valuesPerElement,!0)])}const b=C.texture,A=h&&h[b];if(A&&!v.has(b)){const{image:P,parameters:F}=A,H=new oi(P,F);a.push(H),v.set(b,H)}const R=v.get(b),S=R?R.id:void 0,E=C.material;let O=i.get(E,b);if(O==null){const P=d[E.substring(E.lastIndexOf("/")+1)].params;P.transparency===1&&(P.transparency=0);const F=A&&A.alphaChannelUsage,H=P.transparency>0||F==="transparency"||F==="maskAndTransparency",le=A?Ki(A.alphaChannelUsage):void 0,he={ambient:_r(P.diffuse),diffuse:_r(P.diffuse),opacity:1-(P.transparency||0),transparent:H,textureAlphaMode:le,textureAlphaCutoff:.33,textureId:S,initTextureTransparent:!0,doubleSided:!0,cullFace:Re.None,colorMixMode:P.externalColorMixMode||"tint",textureAlphaPremultiplied:(A==null?void 0:A.parameters.preMultiplyAlpha)??!1};e!=null&&e.materialParameters&&Object.assign(he,e.materialParameters),O=new kt(he),i.set(E,b,O)}o.push(O);const U=new Za(O,N);p+=((T=(x=N.find((P=>P[0]===f.POSITION)))==null?void 0:x[1])==null?void 0:T.indices.length)??0,r.push(U)}return{engineResources:[{name:l,stageResources:{textures:a,materials:o,geometries:r},pivotOffset:n.model.pivotOffset,numberOfVertices:p,lodThreshold:null}],referenceBoundingBox:Mc(r)}}function Mc(t){const e=Ga();return t.forEach((r=>{const a=r.boundingInfo;a!=null&&(Vt(e,a.bbMin),Vt(e,a.bbMax))})),e}async function Cc(t,e){const r=new Array;for(const i in t){const n=t[i],c=n.images[0].data;if(!c){_e().warn("Externally referenced texture data is not yet supported");continue}const l=n.encoding+";base64,"+c,u="/textureDefinitions/"+i,d=n.channels==="rgba"?n.alphaChannelUsage||"transparency":"none",h={noUnpackFlip:!0,wrap:{s:Ue.REPEAT,t:Ue.REPEAT},preMultiplyAlpha:Ki(d)!==J.Opaque},p=e!=null&&e.disableTextures?Promise.resolve(null):Ua(l,e);r.push(p.then((v=>({refId:u,image:v,parameters:h,alphaChannelUsage:d}))))}const a=await Promise.all(r),o={};for(const i of a)o[i.refId]=i;return o}function Ki(t){switch(t){case"mask":return J.Mask;case"maskAndTransparency":return J.MaskBlend;case"none":return J.Opaque;default:return J.Blend}}function Oc(t){const e=t.params;return{id:1,material:e.material,texture:e.texture,region:e.texture}}const Rc=new Fa(1,2,"wosr");async function bu(t,e){var h;const r=Ic(Qi(t));if(r.fileType==="wosr"){const p=await(e.cache?e.cache.loadWOSR(r.url,e):Sc(r.url,e)),{engineResources:v,referenceBoundingBox:x}=wc(p,e);return{lods:v,referenceBoundingBox:x,isEsriSymbolResource:!1,isWosr:!0}}const a=await(e.cache?e.cache.loadGLTF(r.url,e,!!e.usePBR):Go(new Vo(e.streamDataRequester),r.url,e,e.usePBR)),o=(h=a.model.meta)==null?void 0:h.ESRI_proxyEllipsoid,i=a.meta.isEsriSymbolResource&&o!=null&&a.meta.ESRI_webstyle==="EsriRealisticTreesStyle";i&&!a.customMeta.esriTreeRendering&&(a.customMeta.esriTreeRendering=!0,Dc(a,o));const n=!!e.usePBR,c=a.meta.isEsriSymbolResource?{usePBR:n,isSchematic:!1,treeRendering:i,mrrFactors:[...il]}:{usePBR:n,isSchematic:!1,treeRendering:!1,mrrFactors:[...vi]},l={...e.materialParameters,treeRendering:i},{engineResources:u,referenceBoundingBox:d}=Pc(a,c,l,e.skipHighLods&&r.specifiedLodIndex==null?{skipHighLods:!0}:{skipHighLods:!1,singleLodIndex:r.specifiedLodIndex});return{lods:u,referenceBoundingBox:d,isEsriSymbolResource:a.meta.isEsriSymbolResource,isWosr:!1}}function Ic(t){const e=t.match(/(.*\.(gltf|glb))(\?lod=([0-9]+))?$/);return e?{fileType:"gltf",url:e[1],specifiedLodIndex:e[4]!=null?Number(e[4]):null}:t.match(/(.*\.(json|json\.gz))$/)?{fileType:"wosr",url:t,specifiedLodIndex:null}:{fileType:"unknown",url:t,specifiedLodIndex:null}}function Pc(t,e,r,a){const o=t.model,i=new Array,n=new Map,c=new Map,l=o.lods.length,u=Ga();return o.lods.forEach(((d,h)=>{const p=a.skipHighLods===!0&&(l>1&&h===0||l>3&&h===1)||a.skipHighLods===!1&&a.singleLodIndex!=null&&h!==a.singleLodIndex;if(p&&h!==0)return;const v=new mn(d.name,d.lodThreshold,[0,0,0]);d.parts.forEach((x=>{const T=p?new kt({}):$c(o,x,v,e,r,n,c),{geometry:g,vertexCount:I}=Lc(x,T??new kt({})),C=g.boundingInfo;C!=null&&h===0&&(Vt(u,C.bbMin),Vt(u,C.bbMax)),T!=null&&(v.stageResources.geometries.push(g),v.numberOfVertices+=I)})),p||i.push(v)})),{engineResources:i,referenceBoundingBox:u}}function $c(t,e,r,a,o,i,n){var v,x;const c=e.material+(e.attributes.normal?"_normal":"")+(e.attributes.color?"_color":"")+(e.attributes.texCoord0?"_texCoord0":"")+(e.attributes.tangent?"_tangent":""),l=t.materials.get(e.material),u=e.attributes.texCoord0!=null,d=e.attributes.normal!=null;if(l==null)return null;const h=Nc(l.alphaMode);if(!i.has(c)){if(u){const b=(A,R=!1)=>{if(A!=null&&!n.has(A)){const S=t.textures.get(A);if(S!=null){const E=S.data;n.set(A,new oi(cr(E)?E.data:E,{...S.parameters,preMultiplyAlpha:!cr(E)&&R,encoding:cr(E)&&E.encoding!=null?E.encoding:void 0}))}}};b(l.textureColor,h!==J.Opaque),b(l.textureNormal),b(l.textureOcclusion),b(l.textureEmissive),b(l.textureMetallicRoughness)}const T=l.color[0]**(1/qe),g=l.color[1]**(1/qe),I=l.color[2]**(1/qe),C=l.emissiveFactor[0]**(1/qe),$=l.emissiveFactor[1]**(1/qe),N=l.emissiveFactor[2]**(1/qe),V=l.textureColor!=null&&u?n.get(l.textureColor):null,z=rl({normalTexture:l.textureNormal,metallicRoughnessTexture:l.textureMetallicRoughness,metallicFactor:l.metallicFactor,roughnessFactor:l.roughnessFactor,emissiveTexture:l.textureEmissive,emissiveFactor:l.emissiveFactor,occlusionTexture:l.textureOcclusion}),w=((v=l.normalTextureTransform)==null?void 0:v.scale)!=null?(x=l.normalTextureTransform)==null?void 0:x.scale:Na;i.set(c,new kt({...a,transparent:h===J.Blend,customDepthTest:At.Lequal,textureAlphaMode:h,textureAlphaCutoff:l.alphaCutoff,diffuse:[T,g,I],ambient:[T,g,I],opacity:l.opacity,doubleSided:l.doubleSided,doubleSidedType:"winding-order",cullFace:l.doubleSided?Re.None:Re.Back,hasVertexColors:!!e.attributes.color,hasVertexTangents:!!e.attributes.tangent,normalType:d?K.Attribute:K.ScreenDerivative,castShadows:!0,receiveShadows:l.receiveShadows,receiveAmbientOcclusion:l.receiveAmbientOcclustion,textureId:V!=null?V.id:void 0,colorMixMode:l.colorMixMode,normalTextureId:l.textureNormal!=null&&u?n.get(l.textureNormal).id:void 0,textureAlphaPremultiplied:V!=null&&!!V.parameters.preMultiplyAlpha,occlusionTextureId:l.textureOcclusion!=null&&u?n.get(l.textureOcclusion).id:void 0,emissiveTextureId:l.textureEmissive!=null&&u?n.get(l.textureEmissive).id:void 0,metallicRoughnessTextureId:l.textureMetallicRoughness!=null&&u?n.get(l.textureMetallicRoughness).id:void 0,emissiveFactor:[C,$,N],mrrFactors:z?[...al]:[l.metallicFactor,l.roughnessFactor,a.mrrFactors[2]],isSchematic:z,colorTextureTransformMatrix:dt(l.colorTextureTransform),normalTextureTransformMatrix:dt(l.normalTextureTransform),scale:[w[0],w[1]],occlusionTextureTransformMatrix:dt(l.occlusionTextureTransform),emissiveTextureTransformMatrix:dt(l.emissiveTextureTransform),metallicRoughnessTextureTransformMatrix:dt(l.metallicRoughnessTextureTransform),...o}))}const p=i.get(c);if(r.stageResources.materials.push(p),u){const T=g=>{g!=null&&r.stageResources.textures.push(n.get(g))};T(l.textureColor),T(l.textureNormal),T(l.textureOcclusion),T(l.textureEmissive),T(l.textureMetallicRoughness)}return p}function Lc(t,e){const r=t.attributes.position.count,a=Uo(t.indices||r,t.primitiveType),o=Rt(3*r),{typedBuffer:i,typedBufferStride:n}=t.attributes.position;Fo(o,i,t.transform,3,n);const c=[[f.POSITION,new Xe(o,a,3,!0)]];if(t.attributes.normal!=null){const u=Rt(3*r),{typedBuffer:d,typedBufferStride:h}=t.attributes.normal;$a(Ye,t.transform),Bo(u,d,Ye,3,h),ra(Ye)&&aa(u,u),c.push([f.NORMAL,new Xe(u,a,3,!0)])}if(t.attributes.tangent!=null){const u=Rt(4*r),{typedBuffer:d,typedBufferStride:h}=t.attributes.tangent;Oo(Ye,t.transform),zo(u,d,Ye,4,h),ra(Ye)&&aa(u,u,4),c.push([f.TANGENT,new Xe(u,a,4,!0)])}if(t.attributes.texCoord0!=null){const u=Rt(2*r),{typedBuffer:d,typedBufferStride:h}=t.attributes.texCoord0;jo(u,d,2,h),c.push([f.UV0,new Xe(u,a,2,!0)])}const l=t.attributes.color;if(l!=null){const u=new Uint8Array(4*r);l.elementCount===4?l instanceof br?oa(u,l,255):l instanceof Kt?Ho(u,l):l instanceof Lo&&oa(u,l,1/256):(u.fill(255),l instanceof jt?ia(u,l.typedBuffer,255,4,l.typedBufferStride):t.attributes.color instanceof No?Wo(u,l.typedBuffer,4,t.attributes.color.typedBufferStride):t.attributes.color instanceof Do&&ia(u,l.typedBuffer,1/256,4,l.typedBufferStride)),c.push([f.COLOR,new Xe(u,a,4,!0)])}return{geometry:new Za(e,c),vertexCount:r}}const Ye=yt();function Nc(t){switch(t){case"BLEND":return J.Blend;case"MASK":return J.Mask;case"OPAQUE":case null:case void 0:return J.Opaque}}function Dc(t,e){for(let r=0;r<t.model.lods.length;++r){const a=t.model.lods[r];for(const o of a.parts){const i=o.attributes.normal;if(i==null)return;const n=o.attributes.position,c=n.count,l=M(),u=M(),d=M(),h=new Uint8Array(4*c),p=new Float64Array(3*c),v=Co(Zt(),o.transform);let x=0,T=0;for(let g=0;g<c;g++){n.getVec(g,u),i.getVec(g,l),Ce(u,u,o.transform),Me(d,u,e.center),ta(d,d,e.radius);const I=d[2],C=fe(d),$=Math.min(.45+.55*C*C,1);ta(d,d,e.radius),v!==null&&Ce(d,d,v),Yt(d,d),r+1!==t.model.lods.length&&t.model.lods.length>1&&xr(d,d,l,I>-1?.2:Math.min(-4*I-3.8,1)),p[x]=d[0],p[x+1]=d[1],p[x+2]=d[2],x+=3,h[T]=255*$,h[T+1]=255*$,h[T+2]=255*$,h[T+3]=255,T+=4}o.attributes.normal=new jt(p),o.attributes.color=new Kt(h)}}}const Fc=Object.freeze(Object.defineProperty({__proto__:null,build:Ni},Symbol.toStringTag,{value:"Module"})),Bc=Object.freeze(Object.defineProperty({__proto__:null,build:Bi,getRadius:ar},Symbol.toStringTag,{value:"Module"})),zc=Object.freeze(Object.defineProperty({__proto__:null,build:Yi},Symbol.toStringTag,{value:"Module"})),Gc=Object.freeze(Object.defineProperty({__proto__:null,build:Ji},Symbol.toStringTag,{value:"Module"}));export{bu as fetch,Pc as gltfToEngineResources,Ic as parseUrl};
