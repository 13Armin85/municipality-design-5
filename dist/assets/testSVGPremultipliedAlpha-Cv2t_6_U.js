import{m as w}from"./WGLContainer-BuvYBgUd.js";import{E as A,c as v}from"./Program-CDVbNLs5.js";import{D as m,L as p,F as X,_ as I,E as Q,G as R,U}from"./enums-Co1-zCx_.js";import{e as g,c as M}from"./Texture-DPnqwa3p.js";import{o as P}from"./ProgramTemplate-CtPFbjXs.js";import{fq as S}from"./Map-BTjbmh4q.js";class c{constructor(s,e,r,n,u,E,o,_,T){this.createQuery=s,this.deleteQuery=e,this.resultAvailable=r,this.getResult=n,this.disjoint=u,this.beginTimeElapsed=E,this.endTimeElapsed=o,this.createTimestamp=_,this.timestampBits=T}}let i=!1;function F(t,s){if(s.disjointTimerQuery)return null;let e=t.getExtension("EXT_disjoint_timer_query_webgl2");return e?new c((()=>t.createQuery()),(r=>{t.deleteQuery(r),i=!1}),(r=>t.getQueryParameter(r,t.QUERY_RESULT_AVAILABLE)),(r=>t.getQueryParameter(r,t.QUERY_RESULT)),(()=>t.getParameter(e.GPU_DISJOINT_EXT)),(r=>{i||(i=!0,t.beginQuery(e.TIME_ELAPSED_EXT,r))}),(()=>{t.endQuery(e.TIME_ELAPSED_EXT),i=!1}),(r=>e.queryCounterEXT(r,e.TIMESTAMP_EXT)),(()=>t.getQuery(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT))):(e=t.getExtension("EXT_disjoint_timer_query"),e?new c((()=>e.createQueryEXT()),(r=>{e.deleteQueryEXT(r),i=!1}),(r=>e.getQueryObjectEXT(r,e.QUERY_RESULT_AVAILABLE_EXT)),(r=>e.getQueryObjectEXT(r,e.QUERY_RESULT_EXT)),(()=>t.getParameter(e.GPU_DISJOINT_EXT)),(r=>{i||(i=!0,e.beginQueryEXT(e.TIME_ELAPSED_EXT,r))}),(()=>{e.endQueryEXT(e.TIME_ELAPSED_EXT),i=!1}),(r=>e.queryCounterEXT(r,e.TIMESTAMP_EXT)),(()=>e.getQueryEXT(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT))):null)}class x{constructor(){this._result=!1}dispose(){this._program=S(this._program)}get result(){return this._program!=null&&(this._result=this._test(this._program),this.dispose()),this._result}}class N extends x{constructor(s){super(),this._rctx=s;const e=`
    precision highp float;

    attribute vec2 a_pos;
    varying vec2 v_uv;

    void main() {
      v_uv = a_pos;
      gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);
    }
    `,r=`
    precision highp float;

    varying vec2 v_uv;

    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = texture2D(u_texture, v_uv);
    }
    `;this._program=s.programCache.acquire(e,r,new Map([["a_pos",0]]))}dispose(){super.dispose()}_test(s){const e=this._rctx;if(!e.gl)return s.dispose(),!0;const r=new g(1);r.wrapMode=m.CLAMP_TO_EDGE,r.samplingMode=p.NEAREST;const n=new A(e,r),u=v.createVertex(e,X.STATIC_DRAW,new Uint16Array([0,0,1,0,0,1,1,1])),E=new P(e,new Map([["a_pos",0]]),w,{geometry:u}),o=new g;o.samplingMode=p.LINEAR,o.wrapMode=m.CLAMP_TO_EDGE;const _=new M(e,o,a);e.useProgram(s),e.bindTexture(_,0),s.setUniform1i("u_texture",0);const T=e.getBoundFramebufferObject(),{x:d,y:h,width:f,height:y}=e.getViewport();e.bindFramebuffer(n),e.setViewport(0,0,1,1),e.setClearColor(0,0,0,0),e.setBlendingEnabled(!1),e.clear(I.COLOR_BUFFER_BIT),e.bindVAO(E),e.drawArrays(Q.TRIANGLE_STRIP,0,4);const l=new Uint8Array(4);return n.readPixels(0,0,1,1,R.RGBA,U.UNSIGNED_BYTE,l),E.dispose(),n.dispose(),_.dispose(),e.setViewport(d,h,f,y),e.bindFramebuffer(T),l[0]!==255}}const a=new Image;a.src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='5' height='5' version='1.1' viewBox='0 0 5 5' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='5' height='5' fill='%23f00' fill-opacity='.5'/%3E%3C/svg%3E%0A",a.width=5,a.height=5,a.decode();export{F as a,N as f,x as t};
