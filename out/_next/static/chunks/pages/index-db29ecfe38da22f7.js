(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8581:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(4694)}])},4694:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return j},default:function(){return g}});var r=n(8520),a=n.n(r),s=n(5893),i=n(9008),c=n(5675),o=n(214),l=n.n(o),d=n(9669),u=n.n(d),p=n(1664),m=n(7294);var h=null;console.log(h);var x=n(1980),f=n(1163);n(7315);function _(e,t,n,r,a,s,i){try{var c=e[s](i),o=c.value}catch(l){return void n(l)}c.done?t(o):Promise.resolve(o).then(r,a)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var s=e.apply(t,n);function i(e){_(s,r,a,i,c,"next",e)}function c(e){_(s,r,a,i,c,"throw",e)}i(void 0)}))}}var j=!0;function g(e){var t=(0,m.useContext)(x.StateContext);return(0,m.useEffect)((function(){function e(){return(e=v(a().mark((function e(){var n,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n={headers:{"Content-Type":"application/json"},withCredentials:!0},e.next=4,u().get("/api/users/currentUser",n);case 4:r=e.sent.data,console.log("data in index.js ",r.currentUser),r.currentUser?(t.dispatch({type:"authenticate",payload:r.currentUser}),1==r.currentUser.userRole&&f.default.push("/doctor/dashboard")):t.dispatch({type:"unauthenticate",payload:null}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),(0,s.jsxs)("div",{className:l().container,children:[(0,s.jsxs)(i.default,{children:[(0,s.jsx)("title",{children:"Create Next App"}),(0,s.jsx)("meta",{name:"description",content:"Generated by create next app"}),(0,s.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,s.jsx)("div",{className:"divide-y divide-gray-100",children:(0,s.jsx)("ul",{className:"divide-y divide-gray-100",children:e.pageProps.data.map((function(e,t){return(0,s.jsx)("article",{className:"flex items-start space-x-2 p-1",children:(0,s.jsxs)("div",{className:"min-w-0 relative flex-auto",children:[(0,s.jsx)("h2",{className:"font-semibold text-gray-900 truncate pr-20",children:e.name}),(0,s.jsxs)("dl",{className:"mt-2 flex flex-wrap text-sm leading-6 font-medium",children:[(0,s.jsxs)("div",{className:"absolute top-0 right-0 flex items-center space-x-1",children:[(0,s.jsxs)("dt",{className:"text-sky-500",children:[(0,s.jsx)("span",{className:"sr-only",children:"Star rating"}),(0,s.jsx)("svg",{width:"16",height:"20",fill:"currentColor",children:(0,s.jsx)("path",{d:"M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z"})})]}),(0,s.jsx)("dd",{children:e.speciality})]}),e.chambers.map((function(e,t){return(0,s.jsxs)("div",{className:"flex-none w-full mt-2 font-normal",children:[(0,s.jsx)("dt",{className:"sr-only",children:"Cast"}),(0,s.jsxs)("dd",{className:"text-gray-800",children:["Chamber address :- ",e.address]}),(0,s.jsxs)("dd",{className:"text-gray-500",children:["Timing :- ",e.timing]}),(0,s.jsxs)("dd",{className:"text-gray-500",children:["weekdays :- ",e.weekdays.map((function(e){return e+","}))]})]},e._id)})),(0,s.jsx)(p.default,{href:"/appointment/[id]",as:"/appointment/".concat(e._id),children:(0,s.jsx)("a",{className:"text-1xl",children:"Book Appointment"})})]})]})},e._id)}))})}),(0,s.jsx)("footer",{className:l().footer,children:(0,s.jsxs)("a",{href:"https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",target:"_blank",rel:"noopener noreferrer",children:["Powered by"," ",(0,s.jsx)("span",{className:l().logo,children:(0,s.jsx)(c.default,{src:"/vercel.svg",alt:"Vercel Logo",width:72,height:16})})]})})]})}},214:function(e){e.exports={container:"Home_container__bCOhY",main:"Home_main__nLjiQ",footer:"Home_footer____T7K",title:"Home_title__T09hD",description:"Home_description__41Owk",code:"Home_code__suPER",grid:"Home_grid__GxQ85",card:"Home_card___LpL1",logo:"Home_logo__27_tb"}}},function(e){e.O(0,[391,774,888,179],(function(){return t=8581,e(e.s=t);var t}));var t=e.O();_N_E=t}]);