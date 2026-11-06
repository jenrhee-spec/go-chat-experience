import React, {useEffect,useState} from 'react';
const asset=name=>`assets/agent-carousel/${name}`;
const messages=[
 {className:'product-preview-slack',text:'Reading 23 Slack messages from #Product-Review',start:1300},
 {className:'product-preview-github',text:'Checking 4 GitHub PRs waiting for you',start:2700},
];
function TypingDots(){return <span className="product-typing-dots" aria-hidden="true"><i/><i/><i/></span>;}
export default function ProductAgentPreview({firstName}){
 const [elapsed,setElapsed]=useState(0);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  setReduced(preference.matches);
  const start=performance.now();
  const timer=setInterval(()=>{const time=performance.now()-start;setElapsed(time);if(time>=4100)clearInterval(timer);},40);
  return()=>clearInterval(timer);
 },[]);
 return <>
  {elapsed<1300?<div className="product-preview-working" role="status"><img src={asset('preview-robot.svg')} alt=""/><p>Working for {firstName}…</p><TypingDots/></div>:
   <div className="product-preview-messages">
    {messages.map(({className,text,start})=>{
     if(!reduced&&elapsed<start)return null;
     const count=reduced?text.length:Math.max(0,Math.floor((elapsed-start-280)/20));
     return <div className={`product-preview-bubble ${className}`} key={className}>
      <div className="product-preview-identity"><img src={asset('preview-robot.svg')} alt=""/><span>Product Assistant</span></div>
      <p aria-label={text}>{count===0?<TypingDots/>:<span aria-hidden="true">{text.slice(0,count)}{count<text.length&&<span className="product-typing-caret"/>}</span>}</p>
     </div>;
    })}
    {(reduced||elapsed>=4000)&&<div className="product-preview-bubble product-preview-result"><img src={'assets/figma/3015-1450-imgGmailIcon.svg'} alt=""/><p>PRD brief · Approved</p></div>}
   </div>}
 </>;
}
