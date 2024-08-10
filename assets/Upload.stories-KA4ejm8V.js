import{j as r}from"./jsx-runtime-DEdD30eg.js";import{U as d,B as S}from"./index-zmJbRG5A.js";import{r as n}from"./index-RYns6xqu.js";import"./index-rNTiGNI1.js";import"./inheritsLoose-Co2FXOuK.js";import"./index-D16Yfzz8.js";import"./client-ngufn95y.js";const B={title:"Component/Upload",component:d,tags:["autodocs"],parameters:{layout:"centered"}},g=e=>{const[t,u]=n.useState(!1),[f,U]=n.useState(0);return r.jsxs(r.Fragment,{children:[r.jsx(d,{...e,cancel:t,onProgress:x=>U(x)}),r.jsx(S,{onClick:()=>{u(!t)},children:t?"取消":"继续"}),r.jsxs("div",{children:["进度：",f,"%"]})]})},a={args:{maxFileSize:1e3,fragmentSize:100,cancel:!1,isUseFragmentUpload:!0},render:e=>g(e)},s={args:{maxFileSize:1e3,fragmentSize:100,cancel:!1,isUseFragmentUpload:!1},render:e=>g(e)};var o,m,l;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    maxFileSize: 1000,
    fragmentSize: 100,
    cancel: false,
    isUseFragmentUpload: true
  },
  render: args => {
    return Template(args);
  }
}`,...(l=(m=a.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var c,p,i;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    maxFileSize: 1000,
    fragmentSize: 100,
    cancel: false,
    isUseFragmentUpload: false
  },
  render: args => {
    return Template(args);
  }
}`,...(i=(p=s.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};const D=["FragmentUpload","DefaultUpload"];export{s as DefaultUpload,a as FragmentUpload,D as __namedExportsOrder,B as default};
