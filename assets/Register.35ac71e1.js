import{p as B}from"./axios.e9d7530e.js";import{d as h,u as x,r as V,a as m,U as k,E as g,i,o as w,c as D,e as s,l as f,j as t,k as r,A as R,B as S,_ as y}from"./index.5263889d.js";import"./axios.1cbd2f54.js";const F=n=>(R("data-v-9475bcf3"),n=n(),S(),n),U={class:"container"},E=F(()=>s("div",{class:"box1"},null,-1)),I={class:"box2"},q={class:"loginBlock"},N=F(()=>s("h2",null,"\u6CE8\u518C",-1)),A={class:"loginForm"},T=h({__name:"Register",setup(n){const p=x(),_=V(),u=m({username:"",user_nickname:"",password:""}),d=m({rules:{username:[{required:!0,message:"\u8BF7\u8F93\u5165\u7528\u6237\u540D",trigger:"blur"}],nickname:[{required:!0,message:"\u8BF7\u8F93\u5165\u6635\u79F0",trigger:"blur"}],password:[{required:!0,message:"\u8BF7\u8F93\u5165\u5BC6\u7801",trigger:"blur"}]},onSaveSuccess:async o=>{!o||await o.validate((e,a)=>{e&&d.onRegister()})},onRegister:()=>{B("/register",u).then(o=>{console.log("register",o),k.isUndefined(o)||(console.log(typeof o),g.success("\u6CE8\u518C\u6210\u529F"),p.push("/login"))}).catch(o=>{g.error("\u6CE8\u518C\u5931\u8D25"),console.log(o)})}});function v(){p.push("/login")}return(o,e)=>{const a=i("el-input"),c=i("el-form-item"),C=i("el-form"),b=i("el-button");return w(),D("div",U,[E,s("div",I,[s("div",q,[s("div",{class:"loginDescription"},[N,s("div",null,[f("\u5982\u679C\u60A8\u5DF2\u6709\u8D26\u53F7\uFF0C\u8BF7 "),s("a",{onClick:v,style:{height:"100px",width:"300px",border:"1px solid #ccc",cursor:"pointer"}}," \u767B\u5F55 ")])]),s("div",A,[t(C,{ref_key:"registerFormRef",ref:_,model:u,"label-position":"top",rules:d.rules,"label-width":"80px"},{default:r(()=>[t(c,{label:"\u8D26\u53F7",prop:"username"},{default:r(()=>[t(a,{modelValue:u.username,"onUpdate:modelValue":e[0]||(e[0]=l=>u.username=l),placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u540D"},null,8,["modelValue"])]),_:1}),t(c,{label:"\u6635\u79F0",prop:"username"},{default:r(()=>[t(a,{modelValue:u.user_nickname,"onUpdate:modelValue":e[1]||(e[1]=l=>u.user_nickname=l),placeholder:"\u8BF7\u8F93\u5165\u6635\u79F0"},null,8,["modelValue"])]),_:1}),t(c,{label:"\u5BC6\u7801",prop:"password"},{default:r(()=>[t(a,{type:"password",modelValue:u.password,"onUpdate:modelValue":e[2]||(e[2]=l=>u.password=l),placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"]),s("div",null,[t(b,{onClick:e[3]||(e[3]=l=>d.onSaveSuccess(_.value))},{default:r(()=>[f(" \u6CE8\u518C ")]),_:1})])])])])])}}});const $=y(T,[["__scopeId","data-v-9475bcf3"]]);export{$ as default};
