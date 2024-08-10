import{j as e}from"./jsx-runtime-DEdD30eg.js";import{M as m,a as r,S as p}from"./index-WgaPEjkK.js";import"./index-RYns6xqu.js";import"./index-rNTiGNI1.js";import"./inheritsLoose-Co2FXOuK.js";import"./index-D16Yfzz8.js";import"./client-ngufn95y.js";const b={title:"Component/Menu",component:m,tags:["autodocs"],parameters:{layout:"centered"},subcomponents:{MenuItem:r,SubMenu:p}},u=t=>e.jsxs(m,{...t,children:[e.jsx(r,{children:"cool link"}),e.jsx(r,{disabled:!0,children:"cool link 2"}),e.jsx(r,{children:"cool link3"}),e.jsxs(p,{title:"dropdown",children:[e.jsx(r,{children:"dropdown 1"}),e.jsx(r,{children:"dropdown 2"}),e.jsx(r,{children:"dropdown 3"})]})]}),n={args:{defaultIndex:"0",mode:"horizontal",onSelect:t=>{console.log(t)}},render:u},o={args:{defaultIndex:"0",mode:"vertical",defaultOpenSubMenus:["3"]},render:u};var s,a,d;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    defaultIndex: '0',
    mode: 'horizontal',
    onSelect: (index: string) => {
      console.log(index);
    }
  },
  render: Template
}`,...(d=(a=n.parameters)==null?void 0:a.docs)==null?void 0:d.source}}};var l,c,i;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    defaultIndex: '0',
    mode: 'vertical',
    defaultOpenSubMenus: ['3']
  },
  render: Template
}`,...(i=(c=o.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const I=["Horizontal","Vertical"];export{n as Horizontal,o as Vertical,I as __namedExportsOrder,b as default};
