(this["webpackJsonpmatx-react"]=this["webpackJsonpmatx-react"]||[]).push([[20],{1347:function(e,a,t){"use strict";var n=t(0),r=n.createContext();a.a=r},1364:function(e,a,t){"use strict";var n=t(0),r=n.createContext();a.a=r},1418:function(e,a,t){"use strict";var n=t(6),r=t(2),c=t(0),l=(t(5),t(8)),o=t(9),i=t(1364),s=c.forwardRef((function(e,a){var t=e.classes,o=e.className,s=e.component,d=void 0===s?"table":s,p=e.padding,m=void 0===p?"default":p,u=e.size,g=void 0===u?"medium":u,b=e.stickyHeader,f=void 0!==b&&b,h=Object(n.a)(e,["classes","className","component","padding","size","stickyHeader"]),v=c.useMemo((function(){return{padding:m,size:g,stickyHeader:f}}),[m,g,f]);return c.createElement(i.a.Provider,{value:v},c.createElement(d,Object(r.a)({role:"table"===d?null:"table",ref:a,className:Object(l.a)(t.root,o,f&&t.stickyHeader)},h)))}));a.a=Object(o.a)((function(e){return{root:{display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":Object(r.a)({},e.typography.body2,{padding:e.spacing(2),color:e.palette.text.secondary,textAlign:"left",captionSide:"bottom"})},stickyHeader:{borderCollapse:"separate"}}}),{name:"MuiTable"})(s)},1419:function(e,a,t){"use strict";var n=t(2),r=t(6),c=t(0),l=(t(5),t(8)),o=t(9),i=t(1347),s={variant:"head"},d=c.forwardRef((function(e,a){var t=e.classes,o=e.className,d=e.component,p=void 0===d?"thead":d,m=Object(r.a)(e,["classes","className","component"]);return c.createElement(i.a.Provider,{value:s},c.createElement(p,Object(n.a)({className:Object(l.a)(t.root,o),ref:a,role:"thead"===p?null:"rowgroup"},m)))}));a.a=Object(o.a)({root:{display:"table-header-group"}},{name:"MuiTableHead"})(d)},1420:function(e,a,t){"use strict";var n=t(2),r=t(6),c=t(0),l=(t(5),t(8)),o=t(9),i=t(1347),s=t(29),d=c.forwardRef((function(e,a){var t=e.classes,o=e.className,s=e.component,d=void 0===s?"tr":s,p=e.hover,m=void 0!==p&&p,u=e.selected,g=void 0!==u&&u,b=Object(r.a)(e,["classes","className","component","hover","selected"]),f=c.useContext(i.a);return c.createElement(d,Object(n.a)({ref:a,className:Object(l.a)(t.root,o,f&&{head:t.head,footer:t.footer}[f.variant],m&&t.hover,g&&t.selected),role:"tr"===d?null:"row"},b))}));a.a=Object(o.a)((function(e){return{root:{color:"inherit",display:"table-row",verticalAlign:"middle",outline:0,"&$hover:hover":{backgroundColor:e.palette.action.hover},"&$selected, &$selected:hover":{backgroundColor:Object(s.d)(e.palette.secondary.main,e.palette.action.selectedOpacity)}},selected:{},hover:{},head:{},footer:{}}}),{name:"MuiTableRow"})(d)},1421:function(e,a,t){"use strict";var n=t(6),r=t(2),c=t(0),l=(t(5),t(8)),o=t(9),i=t(12),s=t(29),d=t(1364),p=t(1347),m=c.forwardRef((function(e,a){var t,o,s=e.align,m=void 0===s?"inherit":s,u=e.classes,g=e.className,b=e.component,f=e.padding,h=e.scope,v=e.size,y=e.sortDirection,x=e.variant,j=Object(n.a)(e,["align","classes","className","component","padding","scope","size","sortDirection","variant"]),O=c.useContext(d.a),E=c.useContext(p.a),N=E&&"head"===E.variant;b?(o=b,t=N?"columnheader":"cell"):o=N?"th":"td";var w=h;!w&&N&&(w="col");var k=f||(O&&O.padding?O.padding:"default"),z=v||(O&&O.size?O.size:"medium"),C=x||E&&E.variant,R=null;return y&&(R="asc"===y?"ascending":"descending"),c.createElement(o,Object(r.a)({ref:a,className:Object(l.a)(u.root,u[C],g,"inherit"!==m&&u["align".concat(Object(i.a)(m))],"default"!==k&&u["padding".concat(Object(i.a)(k))],"medium"!==z&&u["size".concat(Object(i.a)(z))],"head"===C&&O&&O.stickyHeader&&u.stickyHeader),"aria-sort":R,role:t,scope:w},j))}));a.a=Object(o.a)((function(e){return{root:Object(r.a)({},e.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:"1px solid\n    ".concat("light"===e.palette.type?Object(s.i)(Object(s.d)(e.palette.divider,1),.88):Object(s.a)(Object(s.d)(e.palette.divider,1),.68)),textAlign:"left",padding:16}),head:{color:e.palette.text.primary,lineHeight:e.typography.pxToRem(24),fontWeight:e.typography.fontWeightMedium},body:{color:e.palette.text.primary},footer:{color:e.palette.text.secondary,lineHeight:e.typography.pxToRem(21),fontSize:e.typography.pxToRem(12)},sizeSmall:{padding:"6px 24px 6px 16px","&:last-child":{paddingRight:16},"&$paddingCheckbox":{width:24,padding:"0 12px 0 16px","&:last-child":{paddingLeft:12,paddingRight:16},"& > *":{padding:0}}},paddingCheckbox:{width:48,padding:"0 0 0 4px","&:last-child":{paddingLeft:0,paddingRight:4}},paddingNone:{padding:0,"&:last-child":{padding:0}},alignLeft:{textAlign:"left"},alignCenter:{textAlign:"center"},alignRight:{textAlign:"right",flexDirection:"row-reverse"},alignJustify:{textAlign:"justify"},stickyHeader:{position:"sticky",top:0,left:0,zIndex:2,backgroundColor:e.palette.background.default}}}),{name:"MuiTableCell"})(m)},1422:function(e,a,t){"use strict";var n=t(2),r=t(6),c=t(0),l=(t(5),t(8)),o=t(9),i=t(1347),s={variant:"body"},d=c.forwardRef((function(e,a){var t=e.classes,o=e.className,d=e.component,p=void 0===d?"tbody":d,m=Object(r.a)(e,["classes","className","component"]);return c.createElement(i.a.Provider,{value:s},c.createElement(p,Object(n.a)({className:Object(l.a)(t.root,o),ref:a,role:"tbody"===p?null:"rowgroup"},m)))}));a.a=Object(o.a)({root:{display:"table-row-group"}},{name:"MuiTableBody"})(d)},1955:function(e,a,t){"use strict";t.r(a);var n=t(15),r=t(0),c=t.n(r),l=t(1418),o=t(1419),i=t(1420),s=t(1421),d=t(1422),p=t(345);a.default=function(){return c.a.createElement("div",{className:"m-sm-30"},c.a.createElement("div",{className:"mb-sm-30"},c.a.createElement(p.a,{routeSegments:[{name:"Utilities",path:"/utilities"},{name:"Shadow"}]})),c.a.createElement(p.j,{title:"Shadow"},c.a.createElement("p",{className:"m-0"},"The classes are named using the format-",c.a.createElement("code",null,"elevation-z(size)")),c.a.createElement("p",null,"Where ",c.a.createElement("em",null,"size")," is one of:"),c.a.createElement("ul",null,c.a.createElement("li",null,c.a.createElement("code",{className:"whitespace-pre-wrap\\"},"[",Object(n.a)(Array(25).keys()).toString(),"]"))),c.a.createElement(l.a,{className:"whitespace-pre"},c.a.createElement(o.a,null,c.a.createElement(i.a,{className:"bg-default"},c.a.createElement(s.a,{className:"px-0"},"Class Name"),c.a.createElement(s.a,{className:"px-0",align:"center"},"Example"))),c.a.createElement(d.a,null,Object(n.a)(Array(25).keys()).map((function(e,a){return c.a.createElement(i.a,{key:a},c.a.createElement(s.a,{className:"px-0",align:"left"},"elevation-z",e),c.a.createElement(s.a,{className:"px-0",align:"left"},c.a.createElement("div",{className:"text-center px-20 py-4 my-2 elevation-z".concat(e)},"elevation-z".concat(e))))}))))))}}}]);