(this["webpackJsonpnihongo-admin"]=this["webpackJsonpnihongo-admin"]||[]).push([[44],{1938:function(e,a,t){"use strict";t.r(a);var r=t(55),n=t.n(r),c=t(262),s=t(135),u=!1;a.default=Object(c.a)({namespace:"crud",state:{pageData:s.a.create(),employees:[]},subscriptions:{setup:function(e){var a=e.dispatch;e.history.listen((function(e){"/crud"!==e.pathname||u||(u=!0,a({type:"init"}))}))}},effects:{init:n.a.mark((function e(a,t){var r,c,s,u;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.payload,t.call,r=t.put,c=t.select,e.next=4,c((function(e){return e.crud}));case 4:return s=e.sent,u=s.pageData,e.next=8,r({type:"getPageInfo",payload:{pageData:u.startPage(1,10)}});case 8:return e.next=10,r({type:"getEmployees"});case 10:case"end":return e.stop()}}),e)})),getPageInfo:n.a.mark((function e(a,t){var r,c,s;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.payload,t.call,c=t.put,s=r.pageData,e.next=5,c({type:"@request",payload:{valueField:"pageData",url:"/crud/getList",pageInfo:s}});case 5:case"end":return e.stop()}}),e)})),save:n.a.mark((function e(a,t){var r,c,s,u,p,o,i;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.payload,t.call,c=t.put,s=t.select,t.take,u=r.values,p=r.success,e.next=5,s((function(e){return e.crud}));case 5:return o=e.sent,i=o.pageData,e.next=9,c.resolve({type:"@request",payload:{notice:!0,url:"/crud/save",data:u}});case 9:return e.next=11,c({type:"getPageInfo",payload:{pageData:i}});case 11:p();case 12:case"end":return e.stop()}}),e)})),update:n.a.mark((function e(a,t){return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.payload,t.call,t.put;case 2:case"end":return e.stop()}}),e)})),remove:n.a.mark((function e(a,t){var r,c,s,u,p,o,i;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.payload,t.call,c=t.put,s=t.select,u=r.records,p=r.success,e.next=5,s((function(e){return e.crud}));case 5:return o=e.sent,i=o.pageData,e.next=9,c({type:"@request",payload:{notice:!0,url:"/crud/bathDelete",data:u.map((function(e){return e.id}))}});case 9:return e.next=11,c({type:"getPageInfo",payload:{pageData:i}});case 11:p();case 12:case"end":return e.stop()}}),e)})),getEmployees:n.a.mark((function e(a,t){var r;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.payload,t.call,r=t.put,e.next=4,r({type:"@request",afterResponse:function(e){return e.data},payload:{valueField:"employees",url:"/crud/getWorkEmployee"}});case 4:case"end":return e.stop()}}),e)}))},reducers:{}})}}]);
//# sourceMappingURL=44.117203a6.chunk.js.map