(this["webpackJsonpmatx-react"]=this["webpackJsonpmatx-react"]||[]).push([[41],{1989:function(a,e,t){"use strict";t.r(e);var n=t(0),c=t.n(n),l=t(1418),m=t(1419),s=t(1420),r=t(1421),o=t(1422),u=t(1281),p=t(1336),i=[{name:"john doe",date:"18 january, 2019",amount:1e3,status:"close",company:"ABC Fintech LTD."},{name:"kessy bryan",date:"10 january, 2019",amount:9e3,status:"open",company:"My Fintech LTD."},{name:"james cassegne",date:"8 january, 2019",amount:5e3,status:"close",company:"Collboy Tech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."}],y=function(){return c.a.createElement("div",{className:"w-full overflow-auto"},c.a.createElement(l.a,{className:"whitespace-pre"},c.a.createElement(m.a,null,c.a.createElement(s.a,null,c.a.createElement(r.a,{className:"px-0"},"Name"),c.a.createElement(r.a,{className:"px-0"},"Company"),c.a.createElement(r.a,{className:"px-0"},"Start Date"),c.a.createElement(r.a,{className:"px-0"},"Status"),c.a.createElement(r.a,{className:"px-0"},"Amount"),c.a.createElement(r.a,{className:"px-0"},"Action"))),c.a.createElement(o.a,null,i.map((function(a,e){return c.a.createElement(s.a,{key:e},c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.name),c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.company),c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.date),c.a.createElement(r.a,{className:"px-0 capitalize"},a.status),c.a.createElement(r.a,{className:"px-0 capitalize"},"$",a.amount),c.a.createElement(r.a,{className:"px-0"},c.a.createElement(u.a,null,c.a.createElement(p.a,{color:"error"},"close"))))})))))},E=t(110),N=t(1987),x=[{name:"john doe",date:"18 january, 2019",amount:1e3,status:"close",company:"ABC Fintech LTD."},{name:"kessy bryan",date:"10 january, 2019",amount:9e3,status:"open",company:"My Fintech LTD."},{name:"kessy bryan",date:"10 january, 2019",amount:9e3,status:"open",company:"My Fintech LTD."},{name:"james cassegne",date:"8 january, 2019",amount:5e3,status:"close",company:"Collboy Tech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."},{name:"lucy brown",date:"1 january, 2019",amount:89e3,status:"open",company:"ABC Fintech LTD."}],d=function(){var a=c.a.useState(5),e=Object(E.a)(a,2),t=e[0],n=e[1],i=c.a.useState(0),y=Object(E.a)(i,2),d=y[0],h=y[1];return c.a.createElement("div",{className:"w-full overflow-auto"},c.a.createElement(l.a,{className:"whitespace-pre"},c.a.createElement(m.a,null,c.a.createElement(s.a,null,c.a.createElement(r.a,{className:"px-0"},"Name"),c.a.createElement(r.a,{className:"px-0"},"Company"),c.a.createElement(r.a,{className:"px-0"},"Start Date"),c.a.createElement(r.a,{className:"px-0"},"Status"),c.a.createElement(r.a,{className:"px-0"},"Amount"),c.a.createElement(r.a,{className:"px-0"},"Action"))),c.a.createElement(o.a,null,x.slice(d*t,d*t+t).map((function(a,e){return c.a.createElement(s.a,{key:e},c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.name),c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.company),c.a.createElement(r.a,{className:"px-0 capitalize",align:"left"},a.date),c.a.createElement(r.a,{className:"px-0 capitalize"},a.status),c.a.createElement(r.a,{className:"px-0 capitalize"},"$",a.amount),c.a.createElement(r.a,{className:"px-0"},c.a.createElement(u.a,null,c.a.createElement(p.a,{color:"error"},"close"))))})))),c.a.createElement(N.a,{className:"px-4",rowsPerPageOptions:[5,10,25],component:"div",count:x.length,rowsPerPage:t,page:d,backIconButtonProps:{"aria-label":"Previous Page"},nextIconButtonProps:{"aria-label":"Next Page"},onChangePage:function(a,e){h(e)},onChangeRowsPerPage:function(a){n(+a.target.value)}}))},h=t(345);e.default=function(){return c.a.createElement("div",{className:"m-sm-30"},c.a.createElement("div",{className:"mb-sm-30"},c.a.createElement(h.a,{routeSegments:[{name:"Material",path:"/material"},{name:"Table"}]})),c.a.createElement(h.j,{title:"Simple Table"},c.a.createElement(y,null)),c.a.createElement("div",{className:"py-3"}),c.a.createElement(h.j,{title:"Pagination Table"},c.a.createElement(d,null)))}}}]);