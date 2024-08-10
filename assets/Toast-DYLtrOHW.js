import{j as n}from"./jsx-runtime-DEdD30eg.js";import{useMDXComponents as c}from"./index-CcnH5Kt0.js";import{B as o,t as r}from"./index-zmJbRG5A.js";import"./index-RYns6xqu.js";import"./index-rNTiGNI1.js";import"./inheritsLoose-Co2FXOuK.js";import"./index-D16Yfzz8.js";import"./client-ngufn95y.js";function s(e){const t={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...c(),...e.components};return n.jsxs(n.Fragment,{children:[`
`,`
`,n.jsx(t.h1,{id:"toast-组件",children:"Toast 组件"}),`
`,n.jsxs(t.p,{children:[n.jsx(t.code,{children:"Toast"})," 组件用于显示简短的消息通知。"]}),`
`,n.jsx(t.h2,{id:"使用示例",children:"使用示例"}),`
`,n.jsx(t.pre,{children:n.jsx(t.code,{className:"language-jsx",children:`import React from 'react';
import { toast, Button } from '@xb-onepiece/components';

export default function Example() {
  const showToast = () => {
    toast({
      type: 'success',
      content: '成功'
    })
  }

  return (
    <div>
      <Button onClick={() => }/>
    </div>
  );
}
`})}),`
`,n.jsx(o,{btnType:"success",onClick:()=>r({type:"success",content:"success"}),children:"success"}),`
`,n.jsx(o,{btnType:"warning",onClick:()=>r({type:"warning",content:"warning"}),children:"warning"}),`
`,n.jsx(o,{btnType:"default",onClick:()=>r({type:"default",content:"default"}),children:"default"}),`
`,n.jsx(o,{btnType:"danger",onClick:()=>r({type:"error",content:"error"}),children:"error"})]})}function h(e={}){const{wrapper:t}={...c(),...e.components};return t?n.jsx(t,{...e,children:n.jsx(s,{...e})}):s(e)}export{h as default};
