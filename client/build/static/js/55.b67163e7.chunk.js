(this["webpackJsonpnihongo-admin"]=this["webpackJsonpnihongo-admin"]||[]).push([[55],{1928:function(e,a,t){"use strict";t.r(a);var n=t(262);a.default=Object(n.a)({namespace:"transferTree",state:{dataSource:[],asyncDataSource:[],customAsyncDataSource:[]},subscriptions:{setup:function(e){var a=e.dispatch;e.history.listen((function(e){"/transferTree"===e.pathname&&a({type:"@request",afterResponse:function(e){return e.data},payload:[{valueField:"dataSource",url:"/tree/getData"},{valueField:"asyncDataSource",url:"/tree/getAsyncData"},{valueField:"customAsyncDataSource",url:"/tree/getCustomAsyncData"}]})}))}}})}}]);
//# sourceMappingURL=55.b67163e7.chunk.js.map