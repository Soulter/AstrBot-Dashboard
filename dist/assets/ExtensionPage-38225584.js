import{q as $,o as p,b as c,w as e,c as a,u as i,H as m,a as o,t as f,E as h,D as d,a0 as S,A as B,a1 as F,I as k,G as x,l as V,K as _,P as C,a2 as G,F as v,z as u,L as g,n as H,J as b,O as w,m as E,M as T,a3 as U,f as q}from"./index-7e5a38e4.js";import{_ as D}from"./ConfigDetailCard-5542b7f5.js";const z={class:"d-sm-flex align-center justify-space-between"},y=$({__name:"ExtensionCard",props:{title:String,link:String},setup(s){const t=s,n=l=>{window.open(l,"_blank")};return(l,r)=>(p(),c(x,{variant:"outlined",elevation:"0",class:"withbg"},{default:e(()=>[a(S,{style:{padding:"10px 20px"}},{default:e(()=>[i("div",z,[a(m,null,{default:e(()=>[o(f(t.title),1)]),_:1}),a(h),a(d,{icon:"mdi-link",variant:"plain",onClick:r[0]||(r[0]=Q=>n(t.link))})])]),_:1}),a(B),a(k,null,{default:e(()=>[F(l.$slots,"default")]),_:3})]),_:3}))}}),I=i("div",{style:{"background-color":"white",width:"100%",padding:"16px","border-radius":"10px"}},[i("h3",null,"🧩 已安装的插件")],-1),N={style:{"min-height":"180px","max-height":"180px",overflow:"hidden"}},P={class:"d-flex align-center gap-2"},j=i("div",{style:{"background-color":"white",width:"100%",padding:"16px","border-radius":"10px"}},[i("h3",null,"🧩 插件市场 [待开发]")],-1),A=i("span",{class:"text-h5"},"插件配置",-1),L=i("span",{class:"text-h5"},"安装插件",-1),O=i("h3",null,"从 GitHub 上在线下载",-1),J=i("small",null,"请输入合法的 GitHub 仓库链接，当前仅支持 GitHub。如：https://github.com/Soulter/astrbot_plugin_aiocqhttp",-1),K=i("h3",null,"从本机上传 .zip 压缩包",-1),M=i("small",null,"请保证插件文件存在压缩包根目录中的第一个文件夹中（即类似于从 GitHub 仓库页上下载的 Zip 压缩包的格式）。",-1),R=i("br",null,null,-1),Z={name:"ExtensionPage",components:{ExtensionCard:y,ConfigDetailCard:D},data(){return{extension_data:{data:[]},extension_url:"",status:"",dialog:!1,snack_message:"",snack_show:!1,snack_success:"success",install_loading:!1,uninstall_loading:!1,configDialog:!1,extension_config:{},upload_file:null}},mounted(){this.getExtensions()},methods:{toast(s,t){this.snack_message=s,this.snack_show=!0,this.snack_success=t},getExtensions(){u.get("/api/plugin/get").then(s=>{this.extension_data.data=s.data.data,console.log(this.extension_data)})},newExtension(){if(this.extension_url===""&&this.upload_file===null){this.toast("请填写插件链接或上传插件文件","error");return}if(this.extension_url!==""&&this.upload_file!==null){this.toast("请不要同时填写插件链接和上传插件文件","error");return}if(this.install_loading=!0,this.upload_file!==null){const s=new FormData;s.append("file",this.upload_file[0]),u.post("/api/plugin/install-upload",s,{headers:{"Content-Type":"multipart/form-data"}}).then(t=>{if(this.install_loading=!1,t.data.status==="error"){this.toast(t.data.message,"error");return}this.extension_data.data=t.data.data,console.log(this.extension_data),this.upload_file="",this.toast(t.data.message,"success"),this.dialog=!1,this.getExtensions()}).catch(t=>{this.install_loading=!1,this.toast(t,"error")});return}else u.post("/api/plugin/install",{url:this.extension_url}).then(s=>{if(this.install_loading=!1,s.data.status==="error"){this.toast(s.data.message,"error");return}this.extension_data.data=s.data.data,console.log(this.extension_data),this.extension_url="",this.toast(s.data.message,"success"),this.dialog=!1,this.getExtensions()}).catch(s=>{this.install_loading=!1,this.toast(s,"error")})},uninstallExtension(s){this.uninstall_loading=!0,u.post("/api/plugin/uninstall",{name:s}).then(t=>{if(this.uninstall_loading=!1,t.data.status==="error"){this.toast(t.data.message,"error");return}this.extension_data.data=t.data.data,console.log(this.extension_data),this.toast(t.data.message,"success"),this.dialog=!1,this.getExtensions()}).catch(t=>{this.uninstall_loading=!1,this.toast(t,"error")})},updateExtension(s){this.update_loading=!0,u.post("/api/plugin/update",{name:s}).then(t=>{if(this.update_loading=!1,t.data.status==="error"){this.toast(t.data.message,"error");return}this.extension_data.data=t.data.data,console.log(this.extension_data),this.toast(t.data.message,"success"),this.dialog=!1,this.getExtensions()}).catch(t=>{this.update_loading=!1,this.toast(t,"error")})},openExtensionConfig(s){this.curr_namespace=s,this.configDialog=!0,u.get("/api/config/get?namespace="+s).then(t=>{this.extension_config=t.data.data,console.log(this.extension_config)}).catch(t=>{this.toast(t,"error")})},updateConfig(){u.post("/api/plugin/update",{config:this.extension_config,namespace:this.curr_namespace}).then(s=>{s.data.status==="success"?this.toast(s.data.message,"success"):this.toast(s.data.message,"error")}).catch(s=>{this.toast(s,"error")})}}},Y=Object.assign(Z,{setup(s){return(t,n)=>(p(),V(v,null,[a(_,null,{default:e(()=>[a(g,{cols:"12",md:"12"},{default:e(()=>[I]),_:1}),(p(!0),V(v,null,H(t.extension_data.data,l=>(p(),c(g,{cols:"12",md:"6",lg:"4"},{default:e(()=>[(p(),c(y,{key:l.name,title:l.name,link:l.repo,style:{"margin-bottom":"16px"}},{default:e(()=>[i("p",N,f(l.desc),1),i("div",P,[a(q,null,{default:e(()=>[o("mdi-account")]),_:1}),i("span",null,f(l.author),1),a(h),a(d,E({variant:"plain",onClick:r=>t.openExtensionConfig(l.name)},t.props),{default:e(()=>[o("配置")]),_:2},1040,["onClick"]),a(d,{variant:"plain",onClick:r=>t.updateExtension(l.name),loading:t.update_loading},{default:e(()=>[o("更新")]),_:2},1032,["onClick","loading"]),a(d,{variant:"plain",onClick:r=>t.uninstallExtension(l.name),loading:t.uninstall_loading},{default:e(()=>[o("卸载")]),_:2},1032,["onClick","loading"])])]),_:2},1032,["title","link"]))]),_:2},1024))),256)),a(g,{cols:"12",md:"12"},{default:e(()=>[j]),_:1})]),_:1}),a(C,{modelValue:t.configDialog,"onUpdate:modelValue":n[1]||(n[1]=l=>t.configDialog=l),width:"750"},{activator:e(({props:l})=>[]),default:e(()=>[a(x,null,{default:e(()=>[a(m,null,{default:e(()=>[A]),_:1}),a(k,null,{default:e(()=>[a(b,null,{default:e(()=>[a(D,{config:t.extension_config},null,8,["config"])]),_:1})]),_:1}),a(w,null,{default:e(()=>[a(h),a(d,{color:"blue-darken-1",variant:"text",onClick:t.updateConfig},{default:e(()=>[o(" 保存并关闭 ")]),_:1},8,["onClick"]),a(d,{color:"blue-darken-1",variant:"text",onClick:n[0]||(n[0]=l=>t.configDialog=!1)},{default:e(()=>[o(" 关闭 ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),a(C,{modelValue:t.dialog,"onUpdate:modelValue":n[6]||(n[6]=l=>t.dialog=l),persistent:"",width:"700"},{activator:e(({props:l})=>[a(d,E(l,{icon:"mdi-plus",size:"x-large",style:{position:"fixed",right:"52px",bottom:"52px"},color:"darkprimary"}),null,16)]),default:e(()=>[a(x,null,{default:e(()=>[a(m,null,{default:e(()=>[L]),_:1}),a(k,null,{default:e(()=>[a(b,null,{default:e(()=>[a(_,null,{default:e(()=>[O,a(g,{cols:"12"},{default:e(()=>[J,a(T,{label:"仓库链接",modelValue:t.extension_url,"onUpdate:modelValue":n[2]||(n[2]=l=>t.extension_url=l),variant:"outlined",required:""},null,8,["modelValue"])]),_:1})]),_:1}),a(_,null,{default:e(()=>[K,a(g,{cols:"12"},{default:e(()=>[M,a(U,{label:"选择文件",modelValue:t.upload_file,"onUpdate:modelValue":n[3]||(n[3]=l=>t.upload_file=l),accept:".zip",outlined:"",required:""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),R,i("small",null,f(t.status),1)]),_:1}),a(w,null,{default:e(()=>[a(h),a(d,{color:"blue-darken-1",variant:"text",onClick:n[4]||(n[4]=l=>t.dialog=!1)},{default:e(()=>[o(" 关闭 ")]),_:1}),a(d,{color:"blue-darken-1",variant:"text",loading:t.install_loading,onClick:n[5]||(n[5]=l=>t.newExtension(t.extension_url))},{default:e(()=>[o(" 安装 ")]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),a(G,{timeout:2e3,elevation:"24",color:t.snack_success,modelValue:t.snack_show,"onUpdate:modelValue":n[7]||(n[7]=l=>t.snack_show=l)},{default:e(()=>[o(f(t.snack_message),1)]),_:1},8,["color","modelValue"])],64))}});export{Y as default};
