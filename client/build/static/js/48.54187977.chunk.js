(this["webpackJsonpnihongo-admin"]=this["webpackJsonpnihongo-admin"]||[]).push([[48],{1947:function(t,e,n){"use strict";n.r(e);var r=n(24),a=n(55),s=n.n(a),u=n(262),c=n(157),o=n(5),i=n.n(o);function p(t){return f.apply(this,arguments)}function f(){return(f=Object(c.a)(s.a.mark((function t(e){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",i.a.post("/user/register",e));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}e.default=Object(u.a)({namespace:"register",state:{status:void 0},effects:{submit:s.a.mark((function t(e,n){var r,a,u,c;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.payload,a=n.call,u=n.put,console.log(r),t.next=5,a(p,r);case 5:return c=t.sent,t.next=8,u({type:"registerHandle",payload:c});case 8:case"end":return t.stop()}}),t)}))},reducers:{registerHandle:function(t,e){var n=e.payload;return Object(r.a)({},t,{status:n.status})}}})}}]);
//# sourceMappingURL=48.54187977.chunk.js.map