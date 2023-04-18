(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["PopularGame"],{"0081":function(t,e,n){"use strict";n("abcc")},"08f9":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],class:t.buttonClass,attrs:{role:"checkbox","aria-labelledby":t.ariaLabelledBy,"aria-checked":t.value,tabindex:t.$attrs.disabled?null:"0"},on:{click:function(e){return t.onClick(e)}}},[t.hasIcon?n("span",{class:t.iconClass}):t._e(),n("span",{staticClass:"p-button-label"},[t._v(t._s(t.label))])])},a=[],r=n("15f1"),s=n.n(r),o={props:{value:Boolean,onIcon:String,offIcon:String,onLabel:String,offLabel:String,iconPos:{type:String,default:"left"},ariaLabelledBy:String},methods:{onClick:function(t){this.$attrs.disabled||(this.$emit("click",t),this.$emit("input",!this.value),this.$emit("change",t))}},computed:{buttonClass:function(){return{"p-button p-togglebutton p-component":!0,"p-button-icon-only":this.hasIcon&&!this.hasLabel,"p-disabled":this.$attrs.disabled,"p-highlight":!0===this.value}},iconClass:function(){return[this.value?this.onIcon:this.offIcon,"p-button-icon",{"p-button-icon-left":"left"===this.iconPos&&this.label,"p-button-icon-right":"right"===this.iconPos&&this.label}]},hasLabel:function(){return this.onLabel&&this.onLabel.length>0&&this.offLabel&&this.offLabel.length>0},hasIcon:function(){return this.onIcon&&this.onIcon.length>0&&this.offIcon&&this.offIcon.length>0},label:function(){return this.hasLabel?this.value?this.onLabel:this.offLabel:"&nbsp;"}},directives:{ripple:s.a}},l=o,c=n("2877"),d=Object(c["a"])(l,i,a,!1,null,null,null);e["default"]=d.exports},"0d44":function(t,e,n){"use strict";t.exports=n("3fed")},"26da":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{key:t.userInfo.token,staticClass:"viewBox routerviewHeight",attrs:{id:"populargame"}},[i("Title",{scopedSlots:t._u([{key:"text",fn:function(){return[t._v(" 熱門遊戲 ")]},proxy:!0}])}),i("div",{staticClass:"row g-5"},t._l(t.gameList,(function(e){return i("div",{key:e._id,staticClass:"col-12 col-md-6 col-lg-4 col-xl-3"},[i("Card",{scopedSlots:t._u([{key:"header",fn:function(){return[e.image?i("img",{attrs:{src:e.image},on:{click:function(n){return t.showDialog(e._id)}}}):i("img",{attrs:{src:n("04d5")},on:{click:function(n){return t.showDialog(e._id)}}})]},proxy:!0},{key:"title",fn:function(){return[t._v(" "+t._s(e.name)+" ")]},proxy:!0},{key:"content",fn:function(){return[i("Rating",{attrs:{value:t.countStar(e.likes),readonly:!0,cancel:!1}})]},proxy:!0},{key:"footer",fn:function(){return[i("ToggleButton",{attrs:{disabled:!Boolean(t.userInfo.token),onIcon:"pi pi-heart-fill",offIcon:"pi pi-heart"},on:{change:function(n){return t.setFavGame(e.likedByUser,e._id,e.name)}},model:{value:e.likedByUser,callback:function(n){t.$set(e,"likedByUser",n)},expression:"game.likedByUser"}})]},proxy:!0}],null,!0)})],1)})),0),i("InfiniteLoading",{on:{infinite:t.infiniteHandler},scopedSlots:t._u([{key:"spinner",fn:function(){return[i("div",[t._v("載入中...")])]},proxy:!0},{key:"no-more",fn:function(){return[i("div",{staticClass:"mt-4"},[t._v("資料已全部載入")])]},proxy:!0},{key:"no-results",fn:function(){return[i("div",{staticClass:"mt-4"},[t._v("無資料")])]},proxy:!0}])}),i("Dialog",{attrs:{visible:t.dialogDisplay,position:"center",showHeader:!1,modal:"",dismissableMask:""},on:{"update:visible":function(e){t.dialogDisplay=e},hide:function(e){t.stepIndex=""}}},[t.name?t._e():i("div",{staticStyle:{background:"#5A7AB5"}},[i("img",{staticStyle:{width:"150px",height:"150px"},attrs:{src:n("afd7")}})]),t.name?i("div",{staticStyle:{"max-height":"70vh","max-width":"800px"}},[t.image?i("img",{attrs:{src:t.image}}):i("img",{attrs:{src:n("04d5")}}),i("div",{staticClass:"dialogText mb-5"},[i("h1",[t._v(t._s(t.name))]),i("h4",[t._v("遊玩人數: "+t._s(t.playerRange[0])+" ~ "+t._s(t.playerRange[1]))]),i("p",{staticStyle:{"max-width":"800px",padding:"0 2rem"}},[t._v(t._s(t.description))]),i("div",{staticClass:"goodCamp",staticStyle:{display:"inline-block"}},[t._v("好人陣營")]),i("p",t._l(t.goodCampRoleList,(function(e,n){return i("span",{key:e.id},[t._v(t._s(e.name)),n!==t.goodCampRoleList.length-1?i("span",[t._v(" / ")]):t._e()])})),0),i("div",{staticClass:"badCamp",staticStyle:{display:"inline-block"}},[t._v("壞人陣營")]),i("p",t._l(t.badCampRoleList,(function(e,n){return i("span",{key:e.id},[t._v(t._s(e.name)),n!==t.badCampRoleList.length-1?i("span",[t._v(" / ")]):t._e()])})),0),t.enableFunRole?i("div",{staticClass:"funRole",staticStyle:{display:"inline-block"}},[t._v("功能身分")]):t._e(),t.enableFunRole?i("p",t._l(t.funRoleList,(function(e,n){return i("span",{key:e.id},[t._v(t._s(e.name)),n!==t.funRoleList.length-1?i("span",[t._v(" / ")]):t._e()])})),0):t._e()]),i("div",{staticClass:"dialogStep pb-5"},[i("h1",{staticClass:"mb-3"},[t._v("遊戲流程")]),i("VueSelect",{staticClass:"VueSelectWidth mx-auto mb-4",attrs:{options:t.stepListDisplayHelper,reduce:function(e){return t.stepListDisplayHelper.findIndex((function(t){return t.id===e.id}))},label:"name",placeholder:"選擇流程"},model:{value:t.stepIndex,callback:function(e){t.stepIndex=e},expression:"stepIndex"}}),t.stepListDisplayHelper[t.stepIndex]?i("h2",{staticClass:"stepHeader"},[t._v(t._s(t.stepListDisplayHelper[t.stepIndex].name))]):t._e(),t.stepListDisplayHelper[t.stepIndex]?i("StepList",{attrs:{data:t.stepListDisplayHelper[t.stepIndex].rules}}):t._e()],1)]):t._e()])],1)},a=[],r=n("5530"),s=n("2909"),o=n("b85c"),l=n("1da1"),c=(n("96cf"),n("e9c4"),n("0d44")),d=n.n(c),u=n("896c"),p=n.n(u),f=n("e166"),h=n.n(f),b=n("7f84"),m=n("2f62"),g={name:"PopularGame",components:{Rating:d.a,ToggleButton:p.a,InfiniteLoading:h.a,StepList:b["a"]},data:function(){return{dialogDisplay:!1,stepIndex:"",page:1,gameList:[]}},methods:{showDialog:function(t){this.$store.commit("game/reset"),this.$store.dispatch("game/getOneGame",t),this.dialogDisplay=!this.dialogDisplay},countStar:function(t){return Math.round(t/this.mostLike*5)},setFavGame:function(t,e,n){t?this.$store.dispatch("user/addFavGame",{gameId:e,gameName:n}):this.$store.dispatch("user/removeFavGame",e)},infiniteHandler:function(t){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function n(){var i,a,r,l,c,d,u,p,f,h;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,e.serverAPI.get("/games",{params:{page:e.page}});case 3:if(i=n.sent,a=i.data,!a.result.length){n.next=47;break}e.page++,l=JSON.parse(JSON.stringify(e.userInfo.favoriteGame)),c=Object(o["a"])(a.result),n.prev=9,c.s();case 11:if((d=c.n()).done){n.next=35;break}u=d.value,u.likedByUser=!1,p=Object(o["a"])(l),n.prev=15,p.s();case 17:if((f=p.n()).done){n.next=25;break}if(h=f.value,u.likedByUser=!1,u._id!==h.game){n.next=23;break}return u.likedByUser=!0,n.abrupt("break",25);case 23:n.next=17;break;case 25:n.next=30;break;case 27:n.prev=27,n.t0=n["catch"](15),p.e(n.t0);case 30:return n.prev=30,p.f(),n.finish(30);case 33:n.next=11;break;case 35:n.next=40;break;case 37:n.prev=37,n.t1=n["catch"](9),c.e(n.t1);case 40:return n.prev=40,c.f(),n.finish(40);case 43:(r=e.gameList).push.apply(r,Object(s["a"])(a.result)),t.loaded(),n.next=48;break;case 47:t.complete();case 48:n.next=53;break;case 50:n.prev=50,n.t2=n["catch"](0),e.$swal({icon:"error",title:"失敗",text:"取得失敗"});case 53:case"end":return n.stop()}}),n,null,[[0,50],[9,37,40,43],[15,27,30,33]])})))()}},computed:Object(r["a"])(Object(r["a"])({mostLike:function(){return this.gameList[0].likes}},Object(m["c"])("game",["name","description","image","playerRange","goodCampRoleList","badCampRoleList","enableFunRole","funRoleList","stepList"])),Object(m["b"])("game",["stepListDisplayHelper"])),beforeRouteEnter:function(t,e,n){n((function(t){t.$store.commit("game/reset")}))}},v=g,y=(n("0081"),n("2877")),x=Object(y["a"])(v,i,a,!1,null,null,null);e["default"]=x.exports},"3fed":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.containerClass},[t.cancel?n("span",{staticClass:"p-rating-icon p-rating-cancel pi pi-ban",attrs:{tabindex:t.focusIndex},on:{click:t.onCancelClick}}):t._e(),t._l(t.stars,(function(e){return n("span",{key:e,class:["p-rating-icon",{"pi pi-star":e>t.value,"pi pi-star-fill":e<=t.value}],attrs:{tabindex:t.focusIndex},on:{click:function(n){return t.onStarClick(n,e)},keydown:function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"enter",13,n.key,"Enter")?null:(n.preventDefault(),t.onStarClick(n,e))}}})}))],2)},a=[],r=(n("a9e3"),{props:{value:{type:Number,default:null},disabled:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},stars:{type:Number,default:5},cancel:{type:Boolean,default:!0}},methods:{onStarClick:function(t,e){this.readonly||this.disabled||this.updateModel(t,e)},onCancelClick:function(){this.readonly||this.disabled||this.updateModel(event,null)},updateModel:function(t,e){this.$emit("input",e),this.$emit("change",{originalEvent:t,value:e})}},computed:{containerClass:function(){return["p-rating",{"p-readonly":this.readonly,"p-disabled":this.disabled}]},focusIndex:function(){return this.disabled||this.readonly?null:"0"}}}),s=r,o=(n("6185"),n("2877")),l=Object(o["a"])(s,i,a,!1,null,null,null);e["default"]=l.exports},6185:function(t,e,n){"use strict";n("ae1a")},"896c":function(t,e,n){"use strict";t.exports=n("08f9")},abcc:function(t,e,n){},ae1a:function(t,e,n){},e166:function(t,e,n){
/*!
 * vue-infinite-loading v2.4.5
 * (c) 2016-2020 PeachScript
 * MIT License
 */
!function(e,n){t.exports=n()}(0,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var a=e[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(i,a,function(e){return t[e]}.bind(null,a));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=9)}([function(t,e,n){var i=n(6);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals),(0,n(3).default)("6223ff68",i,!0,{})},function(t,e,n){var i=n(8);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals),(0,n(3).default)("27f0e51f",i,!0,{})},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n,i=t[1]||"",a=t[3];if(!a)return i;if(e&&"function"==typeof btoa){var r=(n=a,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"),s=a.sources.map((function(t){return"/*# sourceURL="+a.sourceRoot+t+" */"}));return[i].concat(s).concat([r]).join("\n")}return[i].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n})).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var i={},a=0;a<this.length;a++){var r=this[a][0];"number"==typeof r&&(i[r]=!0)}for(a=0;a<t.length;a++){var s=t[a];"number"==typeof s[0]&&i[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),e.push(s))}},e}},function(t,e,n){"use strict";function i(t,e){for(var n=[],i={},a=0;a<e.length;a++){var r=e[a],s=r[0],o={id:t+":"+a,css:r[1],media:r[2],sourceMap:r[3]};i[s]?i[s].parts.push(o):n.push(i[s]={id:s,parts:[o]})}return n}n.r(e),n.d(e,"default",(function(){return f}));var a="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var r={},s=a&&(document.head||document.getElementsByTagName("head")[0]),o=null,l=0,c=!1,d=function(){},u=null,p="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function f(t,e,n,a){c=n,u=a||{};var s=i(t,e);return h(s),function(e){for(var n=[],a=0;a<s.length;a++){var o=s[a];(l=r[o.id]).refs--,n.push(l)}for(e?h(s=i(t,e)):s=[],a=0;a<n.length;a++){var l;if(0===(l=n[a]).refs){for(var c=0;c<l.parts.length;c++)l.parts[c]();delete r[l.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],i=r[n.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](n.parts[a]);for(;a<n.parts.length;a++)i.parts.push(m(n.parts[a]));i.parts.length>n.parts.length&&(i.parts.length=n.parts.length)}else{var s=[];for(a=0;a<n.parts.length;a++)s.push(m(n.parts[a]));r[n.id]={id:n.id,refs:1,parts:s}}}}function b(){var t=document.createElement("style");return t.type="text/css",s.appendChild(t),t}function m(t){var e,n,i=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(i){if(c)return d;i.parentNode.removeChild(i)}if(p){var a=l++;i=o||(o=b()),e=y.bind(null,i,a,!1),n=y.bind(null,i,a,!0)}else i=b(),e=x.bind(null,i),n=function(){i.parentNode.removeChild(i)};return e(t),function(i){if(i){if(i.css===t.css&&i.media===t.media&&i.sourceMap===t.sourceMap)return;e(t=i)}else n()}}var g,v=(g=[],function(t,e){return g[t]=e,g.filter(Boolean).join("\n")});function y(t,e,n,i){var a=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=v(e,a);else{var r=document.createTextNode(a),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(r,s[e]):t.appendChild(r)}}function x(t,e){var n=e.css,i=e.media,a=e.sourceMap;if(i&&t.setAttribute("media",i),u.ssrId&&t.setAttribute("data-vue-ssr-id",e.id),a&&(n+="\n/*# sourceURL="+a.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},function(t,e){function n(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=n=function(t){return typeof t}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(e)}t.exports=n},function(t,e,n){"use strict";n.r(e);var i=n(0),a=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e.default=a.a},function(t,e,n){(t.exports=n(2)(!1)).push([t.i,'.loading-wave-dots[data-v-46b20d22]{position:relative}.loading-wave-dots[data-v-46b20d22] .wave-item{position:absolute;top:50%;left:50%;display:inline-block;margin-top:-4px;width:8px;height:8px;border-radius:50%;-webkit-animation:loading-wave-dots-data-v-46b20d22 linear 2.8s infinite;animation:loading-wave-dots-data-v-46b20d22 linear 2.8s infinite}.loading-wave-dots[data-v-46b20d22] .wave-item:first-child{margin-left:-36px}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(2){margin-left:-20px;-webkit-animation-delay:.14s;animation-delay:.14s}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(3){margin-left:-4px;-webkit-animation-delay:.28s;animation-delay:.28s}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(4){margin-left:12px;-webkit-animation-delay:.42s;animation-delay:.42s}.loading-wave-dots[data-v-46b20d22] .wave-item:last-child{margin-left:28px;-webkit-animation-delay:.56s;animation-delay:.56s}@-webkit-keyframes loading-wave-dots-data-v-46b20d22{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}@keyframes loading-wave-dots-data-v-46b20d22{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}.loading-circles[data-v-46b20d22] .circle-item{width:5px;height:5px;-webkit-animation:loading-circles-data-v-46b20d22 linear .75s infinite;animation:loading-circles-data-v-46b20d22 linear .75s infinite}.loading-circles[data-v-46b20d22] .circle-item:first-child{margin-top:-14.5px;margin-left:-2.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(2){margin-top:-11.26px;margin-left:6.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(3){margin-top:-2.5px;margin-left:9.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(4){margin-top:6.26px;margin-left:6.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(5){margin-top:9.5px;margin-left:-2.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(6){margin-top:6.26px;margin-left:-11.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(7){margin-top:-2.5px;margin-left:-14.5px}.loading-circles[data-v-46b20d22] .circle-item:last-child{margin-top:-11.26px;margin-left:-11.26px}@-webkit-keyframes loading-circles-data-v-46b20d22{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}@keyframes loading-circles-data-v-46b20d22{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}.loading-bubbles[data-v-46b20d22] .bubble-item{background:#666;-webkit-animation:loading-bubbles-data-v-46b20d22 linear .75s infinite;animation:loading-bubbles-data-v-46b20d22 linear .75s infinite}.loading-bubbles[data-v-46b20d22] .bubble-item:first-child{margin-top:-12.5px;margin-left:-.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(2){margin-top:-9.26px;margin-left:8.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(3){margin-top:-.5px;margin-left:11.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(4){margin-top:8.26px;margin-left:8.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(5){margin-top:11.5px;margin-left:-.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(6){margin-top:8.26px;margin-left:-9.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(7){margin-top:-.5px;margin-left:-12.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:last-child{margin-top:-9.26px;margin-left:-9.26px}@-webkit-keyframes loading-bubbles-data-v-46b20d22{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}@keyframes loading-bubbles-data-v-46b20d22{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}.loading-default[data-v-46b20d22]{position:relative;border:1px solid #999;-webkit-animation:loading-rotating-data-v-46b20d22 ease 1.5s infinite;animation:loading-rotating-data-v-46b20d22 ease 1.5s infinite}.loading-default[data-v-46b20d22]:before{content:"";position:absolute;display:block;top:0;left:50%;margin-top:-3px;margin-left:-3px;width:6px;height:6px;background-color:#999;border-radius:50%}.loading-spiral[data-v-46b20d22]{border:2px solid #777;border-right-color:transparent;-webkit-animation:loading-rotating-data-v-46b20d22 linear .85s infinite;animation:loading-rotating-data-v-46b20d22 linear .85s infinite}@-webkit-keyframes loading-rotating-data-v-46b20d22{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes loading-rotating-data-v-46b20d22{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.loading-bubbles[data-v-46b20d22],.loading-circles[data-v-46b20d22]{position:relative}.loading-bubbles[data-v-46b20d22] .bubble-item,.loading-circles[data-v-46b20d22] .circle-item{position:absolute;top:50%;left:50%;display:inline-block;border-radius:50%}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(2),.loading-circles[data-v-46b20d22] .circle-item:nth-child(2){-webkit-animation-delay:93ms;animation-delay:93ms}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(3),.loading-circles[data-v-46b20d22] .circle-item:nth-child(3){-webkit-animation-delay:.186s;animation-delay:.186s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(4),.loading-circles[data-v-46b20d22] .circle-item:nth-child(4){-webkit-animation-delay:.279s;animation-delay:.279s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(5),.loading-circles[data-v-46b20d22] .circle-item:nth-child(5){-webkit-animation-delay:.372s;animation-delay:.372s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(6),.loading-circles[data-v-46b20d22] .circle-item:nth-child(6){-webkit-animation-delay:.465s;animation-delay:.465s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(7),.loading-circles[data-v-46b20d22] .circle-item:nth-child(7){-webkit-animation-delay:.558s;animation-delay:.558s}.loading-bubbles[data-v-46b20d22] .bubble-item:last-child,.loading-circles[data-v-46b20d22] .circle-item:last-child{-webkit-animation-delay:.651s;animation-delay:.651s}',""])},function(t,e,n){"use strict";n.r(e);var i=n(1),a=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e.default=a.a},function(t,e,n){(t.exports=n(2)(!1)).push([t.i,".infinite-loading-container[data-v-644ea9c9]{clear:both;text-align:center}.infinite-loading-container[data-v-644ea9c9] [class^=loading-]{display:inline-block;margin:5px 0;width:28px;height:28px;font-size:28px;line-height:28px;border-radius:50%}.btn-try-infinite[data-v-644ea9c9]{margin-top:5px;padding:5px 10px;color:#999;font-size:14px;line-height:1;background:transparent;border:1px solid #ccc;border-radius:3px;outline:none;cursor:pointer}.btn-try-infinite[data-v-644ea9c9]:not(:active):hover{opacity:.8}",""])},function(t,e,n){"use strict";n.r(e);var i={throttleLimit:50,loopCheckTimeout:1e3,loopCheckMaxCalls:10},a=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){return t={passive:!0},!0}});window.addEventListener("testpassive",e,e),window.remove("testpassive",e,e)}catch(t){}return t}(),r={STATE_CHANGER:["emit `loaded` and `complete` event through component instance of `$refs` may cause error, so it will be deprecated soon, please use the `$state` argument instead (`$state` just the special `$event` variable):","\ntemplate:",'<infinite-loading @infinite="infiniteHandler"></infinite-loading>',"\nscript:\n...\ninfiniteHandler($state) {\n  ajax('https://www.example.com/api/news')\n    .then((res) => {\n      if (res.data.length) {\n        $state.loaded();\n      } else {\n        $state.complete();\n      }\n    });\n}\n...","","more details: https://github.com/PeachScript/vue-infinite-loading/issues/57#issuecomment-324370549"].join("\n"),INFINITE_EVENT:"`:on-infinite` property will be deprecated soon, please use `@infinite` event instead.",IDENTIFIER:"the `reset` event will be deprecated soon, please reset this component by change the `identifier` property."},s={INFINITE_LOOP:["executed the callback function more than ".concat(i.loopCheckMaxCalls," times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper ranther than automatic searching, you can do this:"),'\n\x3c!-- add a special attribute for the real scroll wrapper --\x3e\n<div infinite-wrapper>\n  ...\n  \x3c!-- set force-use-infinite-wrapper --\x3e\n  <infinite-loading force-use-infinite-wrapper></infinite-loading>\n</div>\nor\n<div class="infinite-wrapper">\n  ...\n  \x3c!-- set force-use-infinite-wrapper as css selector of the real scroll wrapper --\x3e\n  <infinite-loading force-use-infinite-wrapper=".infinite-wrapper"></infinite-loading>\n</div>\n    ',"more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169"].join("\n")},o={READY:0,LOADING:1,COMPLETE:2,ERROR:3},l={color:"#666",fontSize:"14px",padding:"10px 0"},c={mode:"development",props:{spinner:"default",distance:100,forceUseInfiniteWrapper:!1},system:i,slots:{noResults:"No results :(",noMore:"No more data :)",error:"Opps, something went wrong :(",errorBtnText:"Retry",spinner:""},WARNINGS:r,ERRORS:s,STATUS:o},d=n(4),u=n.n(d),p={BUBBLES:{render:function(t){return t("span",{attrs:{class:"loading-bubbles"}},Array.apply(Array,Array(8)).map((function(){return t("span",{attrs:{class:"bubble-item"}})})))}},CIRCLES:{render:function(t){return t("span",{attrs:{class:"loading-circles"}},Array.apply(Array,Array(8)).map((function(){return t("span",{attrs:{class:"circle-item"}})})))}},DEFAULT:{render:function(t){return t("i",{attrs:{class:"loading-default"}})}},SPIRAL:{render:function(t){return t("i",{attrs:{class:"loading-spiral"}})}},WAVEDOTS:{render:function(t){return t("span",{attrs:{class:"loading-wave-dots"}},Array.apply(Array,Array(5)).map((function(){return t("span",{attrs:{class:"wave-item"}})})))}}};function f(t,e,n,i,a,r,s,o){var l,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=n,c._compiled=!0),i&&(c.functional=!0),r&&(c._scopeId="data-v-"+r),s?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),a&&a.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(s)},c._ssrRegister=l):a&&(l=o?function(){a.call(this,this.$root.$options.shadowRoot)}:a),l)if(c.functional){c._injectStyles=l;var d=c.render;c.render=function(t,e){return l.call(e),d(t,e)}}else{var u=c.beforeCreate;c.beforeCreate=u?[].concat(u,l):[l]}return{exports:t,options:c}}var h=f({name:"Spinner",computed:{spinnerView:function(){return p[(this.$attrs.spinner||"").toUpperCase()]||this.spinnerInConfig},spinnerInConfig:function(){return c.slots.spinner&&"string"==typeof c.slots.spinner?{render:function(){return this._v(c.slots.spinner)}}:"object"===u()(c.slots.spinner)?c.slots.spinner:p[c.props.spinner.toUpperCase()]||p.DEFAULT}}},(function(){var t=this.$createElement;return(this._self._c||t)(this.spinnerView,{tag:"component"})}),[],!1,(function(t){var e=n(5);e.__inject__&&e.__inject__(t)}),"46b20d22",null).exports;function b(t){"production"!==c.mode&&console.warn("[Vue-infinite-loading warn]: ".concat(t))}function m(t){console.error("[Vue-infinite-loading error]: ".concat(t))}var g={timers:[],caches:[],throttle:function(t){var e=this;-1===this.caches.indexOf(t)&&(this.caches.push(t),this.timers.push(setTimeout((function(){t(),e.caches.splice(e.caches.indexOf(t),1),e.timers.shift()}),c.system.throttleLimit)))},reset:function(){this.timers.forEach((function(t){clearTimeout(t)})),this.timers.length=0,this.caches=[]}},v={isChecked:!1,timer:null,times:0,track:function(){var t=this;this.times+=1,clearTimeout(this.timer),this.timer=setTimeout((function(){t.isChecked=!0}),c.system.loopCheckTimeout),this.times>c.system.loopCheckMaxCalls&&(m(s.INFINITE_LOOP),this.isChecked=!0)}},y={key:"_infiniteScrollHeight",getScrollElm:function(t){return t===window?document.documentElement:t},save:function(t){var e=this.getScrollElm(t);e[this.key]=e.scrollHeight},restore:function(t){var e=this.getScrollElm(t);"number"==typeof e[this.key]&&(e.scrollTop=e.scrollHeight-e[this.key]+e.scrollTop),this.remove(e)},remove:function(t){void 0!==t[this.key]&&delete t[this.key]}};function x(t){return t.replace(/[A-Z]/g,(function(t){return"-".concat(t.toLowerCase())}))}function w(t){return t.offsetWidth+t.offsetHeight>0}var k=f({name:"InfiniteLoading",data:function(){return{scrollParent:null,scrollHandler:null,isFirstLoad:!0,status:o.READY,slots:c.slots}},components:{Spinner:h},computed:{isShowSpinner:function(){return this.status===o.LOADING},isShowError:function(){return this.status===o.ERROR},isShowNoResults:function(){return this.status===o.COMPLETE&&this.isFirstLoad},isShowNoMore:function(){return this.status===o.COMPLETE&&!this.isFirstLoad},slotStyles:function(){var t=this,e={};return Object.keys(c.slots).forEach((function(n){var i=x(n);(!t.$slots[i]&&!c.slots[n].render||t.$slots[i]&&!t.$slots[i][0].tag)&&(e[n]=l)})),e}},props:{distance:{type:Number,default:c.props.distance},spinner:String,direction:{type:String,default:"bottom"},forceUseInfiniteWrapper:{type:[Boolean,String],default:c.props.forceUseInfiniteWrapper},identifier:{default:+new Date},onInfinite:Function},watch:{identifier:function(){this.stateChanger.reset()}},mounted:function(){var t=this;this.$watch("forceUseInfiniteWrapper",(function(){t.scrollParent=t.getScrollParent()}),{immediate:!0}),this.scrollHandler=function(e){t.status===o.READY&&(e&&e.constructor===Event&&w(t.$el)?g.throttle(t.attemptLoad):t.attemptLoad())},setTimeout((function(){t.scrollHandler(),t.scrollParent.addEventListener("scroll",t.scrollHandler,a)}),1),this.$on("$InfiniteLoading:loaded",(function(e){t.isFirstLoad=!1,"top"===t.direction&&t.$nextTick((function(){y.restore(t.scrollParent)})),t.status===o.LOADING&&t.$nextTick(t.attemptLoad.bind(null,!0)),e&&e.target===t||b(r.STATE_CHANGER)})),this.$on("$InfiniteLoading:complete",(function(e){t.status=o.COMPLETE,t.$nextTick((function(){t.$forceUpdate()})),t.scrollParent.removeEventListener("scroll",t.scrollHandler,a),e&&e.target===t||b(r.STATE_CHANGER)})),this.$on("$InfiniteLoading:reset",(function(e){t.status=o.READY,t.isFirstLoad=!0,y.remove(t.scrollParent),t.scrollParent.addEventListener("scroll",t.scrollHandler,a),setTimeout((function(){g.reset(),t.scrollHandler()}),1),e&&e.target===t||b(r.IDENTIFIER)})),this.stateChanger={loaded:function(){t.$emit("$InfiniteLoading:loaded",{target:t})},complete:function(){t.$emit("$InfiniteLoading:complete",{target:t})},reset:function(){t.$emit("$InfiniteLoading:reset",{target:t})},error:function(){t.status=o.ERROR,g.reset()}},this.onInfinite&&b(r.INFINITE_EVENT)},deactivated:function(){this.status===o.LOADING&&(this.status=o.READY),this.scrollParent.removeEventListener("scroll",this.scrollHandler,a)},activated:function(){this.scrollParent.addEventListener("scroll",this.scrollHandler,a)},methods:{attemptLoad:function(t){var e=this;this.status!==o.COMPLETE&&w(this.$el)&&this.getCurrentDistance()<=this.distance?(this.status=o.LOADING,"top"===this.direction&&this.$nextTick((function(){y.save(e.scrollParent)})),"function"==typeof this.onInfinite?this.onInfinite.call(null,this.stateChanger):this.$emit("infinite",this.stateChanger),!t||this.forceUseInfiniteWrapper||v.isChecked||v.track()):this.status===o.LOADING&&(this.status=o.READY)},getCurrentDistance:function(){var t;return t="top"===this.direction?"number"==typeof this.scrollParent.scrollTop?this.scrollParent.scrollTop:this.scrollParent.pageYOffset:this.$el.getBoundingClientRect().top-(this.scrollParent===window?window.innerHeight:this.scrollParent.getBoundingClientRect().bottom),t},getScrollParent:function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.$el;return"string"==typeof this.forceUseInfiniteWrapper&&(t=document.querySelector(this.forceUseInfiniteWrapper)),t||("BODY"===e.tagName?t=window:(!this.forceUseInfiniteWrapper&&["scroll","auto"].indexOf(getComputedStyle(e).overflowY)>-1||e.hasAttribute("infinite-wrapper")||e.hasAttribute("data-infinite-wrapper"))&&(t=e)),t||this.getScrollParent(e.parentNode)}},destroyed:function(){!this.status!==o.COMPLETE&&(g.reset(),y.remove(this.scrollParent),this.scrollParent.removeEventListener("scroll",this.scrollHandler,a))}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"infinite-loading-container"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowSpinner,expression:"isShowSpinner"}],staticClass:"infinite-status-prompt",style:t.slotStyles.spinner},[t._t("spinner",[n("spinner",{attrs:{spinner:t.spinner}})])],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowNoResults,expression:"isShowNoResults"}],staticClass:"infinite-status-prompt",style:t.slotStyles.noResults},[t._t("no-results",[t.slots.noResults.render?n(t.slots.noResults,{tag:"component"}):[t._v(t._s(t.slots.noResults))]])],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowNoMore,expression:"isShowNoMore"}],staticClass:"infinite-status-prompt",style:t.slotStyles.noMore},[t._t("no-more",[t.slots.noMore.render?n(t.slots.noMore,{tag:"component"}):[t._v(t._s(t.slots.noMore))]])],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowError,expression:"isShowError"}],staticClass:"infinite-status-prompt",style:t.slotStyles.error},[t._t("error",[t.slots.error.render?n(t.slots.error,{tag:"component",attrs:{trigger:t.attemptLoad}}):[t._v("\n        "+t._s(t.slots.error)+"\n        "),n("br"),t._v(" "),n("button",{staticClass:"btn-try-infinite",domProps:{textContent:t._s(t.slots.errorBtnText)},on:{click:t.attemptLoad}})]],{trigger:t.attemptLoad})],2)])}),[],!1,(function(t){var e=n(7);e.__inject__&&e.__inject__(t)}),"644ea9c9",null).exports;function _(t){c.mode=t.config.productionTip?"development":"production"}Object.defineProperty(k,"install",{configurable:!1,enumerable:!1,value:function(t,e){Object.assign(c.props,e&&e.props),Object.assign(c.slots,e&&e.slots),Object.assign(c.system,e&&e.system),t.component("infinite-loading",k),_(t)}}),"undefined"!=typeof window&&window.Vue&&(window.Vue.component("infinite-loading",k),_(window.Vue)),e.default=k}])}))}}]);
//# sourceMappingURL=PopularGame.e7a2065d.js.map