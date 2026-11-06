import React from 'react';
import {Button,CaretSmallRightIcon} from '@superhuman/origin';
import './headline-meet-go.css';
const headline='Go gets to know you and helps wherever you work.';
const body='Writing that sounds like you.';
const casual="Stuck? No biggie, Go’s got ya.";
const polished='The right support, right when you need it.';
function RevealWords({text,offset=0}){
 return text.split(' ').map((word,i)=><React.Fragment key={i}><span className="motion-word" style={{'--word-delay':`${(offset+i)*26}ms`}}>{word}</span>{' '}</React.Fragment>);
}
export default function HeadlineMeetGo({next,back}){
 return <section className="onboarding headline-meet-screen figma-meet-go" aria-label="Meet Go">
  <div className="headline-meet-content">
   <div className="headline-meet-logo" role="img" aria-label="Go">
    <div className="headline-go-tile"/>
    <img className="headline-go-arrow" src="assets/meet-go-morph/Icon.svg" alt=""/>
    <img className="headline-go-dot" src="assets/meet-go-morph/Icon.svg" alt=""/>
   </div>
   <h1 aria-label={`${headline} ${body} ${polished}`}>
    <span aria-hidden="true"><strong><RevealWords text={headline}/></strong><span><RevealWords text={body} offset={11}/></span>
     <span className="headline-tone-demo">
      <span className="headline-tone-original">{casual.split(' ').map((word,i)=><React.Fragment key={i}><span className="motion-word" style={{'--word-delay':`${1350+i*320}ms`}}>{word}</span>{i<casual.split(' ').length-1?' ':null}</React.Fragment>)}</span>
      <span className="headline-tone-final">{polished}</span>
     </span>
    </span>
   </h1>
   
  </div>
  <footer className="figma-action-footer headline-meet-action"><Button size="xlarge" variant="tertiary" text="Back" onClick={back}/><Button size="xlarge" text="Continue" iconEnd={CaretSmallRightIcon} onClick={next}/></footer>
 </section>;
}
