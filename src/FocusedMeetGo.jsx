import React,{useEffect,useRef,useState} from 'react';
import {Button,ArrowClockwiseIcon,Logo,LogoGrammarlyMarkColorPrimaryIcon,AppsGoogleDocsIcon} from '@superhuman/origin';
import './focused-meet-go.css';
const asset=(n,e='svg')=>`assets/meet-go-morph/${n}.${e}`;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
const mix=(a,b,p)=>a+(b-a)*p;
// Smooth, front-loaded expansion with a long settle, sampled from the reference.
const morphEase=v=>{if(v<=0)return 0;if(v>=1)return 1;let lo=0,hi=1;for(let i=0;i<12;i++){const t=(lo+hi)/2,x=3*(1-t)*(1-t)*t*.22+3*(1-t)*t*t*.36+t*t*t;if(x<v)lo=t;else hi=t}const t=(lo+hi)/2;return 1-Math.pow(1-t,3)};
export default function FocusedMeetGo({next,back,Actions,Words,paused,setPaused}){
 const [time,setTime]=useState(0),[stopped,setStopped]=useState(false),[reduced,setReduced]=useState(false),[playback,setPlayback]=useState(0),[manual,setManual]=useState(false);
 const elapsed=useRef(0);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[]);
 useEffect(()=>{if(stopped||paused||reduced)return;let frame,last=performance.now();const tick=now=>{elapsed.current=elapsed.current+now-last;if(elapsed.current>=9600)elapsed.current=1950+(elapsed.current-9600);last=now;setTime(elapsed.current);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[stopped,paused,reduced,playback]);
 const t=reduced?(manual?8000:4500):time;
 const returning=morphEase((t-8350)/1000),returnContent=ease((t-8700)/420);
 const morph=morphEase((t-3100)/1000)*(1-returning);
 const suggestion=Math.max(ease((t-1550)/400)*(1-ease((t-3010)/200)),returnContent);
 const panel=ease((t-3480)/420)*(1-ease((t-8200)/350)),chosen=t>=5500,answer=ease((t-5700)/250);
 const choose=()=>{elapsed.current=5500;setTime(5500);setManual(true);setStopped(false);setPaused?.(false);setPlayback(v=>v+1)};
 const replay=()=>{elapsed.current=0;setTime(0);setManual(false);setStopped(false);setPaused?.(false);setPlayback(v=>v+1)};
 const background=ease(t/750),documentIn=ease((t-180)/750),cueIn=ease((t-1150)/380);
 const documentArrival=ease((t-3280)/650),documentUnderline=ease((t-4020)/500);
 const detected=ease((t-4510)/240),chipOpen=morphEase((t-4750)/520),chipTitle=ease((t-4900)/300);
 const reply="Lead with the customer benefit, then make the next step clear.".split(" ");
 const rewrite="Turn ideas into a first draft faster. Try dictation in your next document.".split(" ");
 return <section className="onboarding intro-onboarding focused-meet-screen"><div className="copy"><h1><Words><strong>Go works where you do.</strong><span className="intro-heading-line">Helps across your tools.<br/>Writes in your voice.</span></Words></h1><Actions next={next} back={back}/></div>
 <div className="morph-stage" data-phase={returning>0?'return':chosen?'response':morph===1?'panel':morph>0?'morph':'suggestion'} data-time={Math.round(t)} role="region" aria-label="Go changes from an inline suggestion to a contextual side panel">
  <img className="morph-gradient" src={asset('Tonal07','png')} alt="" style={{opacity:background}}/>
  <div className="morph-document-shade" style={{opacity:morph}} aria-hidden="true"/>
  <div className="morph-document morph-document-short" aria-hidden="true" style={{opacity:.5*documentIn*(1-morph)}}><u style={{'--underline-progress':ease((t-750)/450)}}>I know this may not</u><br/><u style={{'--underline-progress':ease((t-920)/450)}}>cover every detail</u></div>
  <div className="morph-document-marine" aria-hidden="true" style={{opacity:.3*morph*documentArrival,transform:`translateY(${reduced?0:8*(1-documentArrival)}px)`}}>Our fall launch introduces a faster way to turn ideas into finished work. The campaign will reach customers through email, social, and our product blog. Each message should focus on a clear customer benefit and show the feature in action. <u style={{backgroundSize:`${documentUnderline*100}% 2.5px`}}>Our new dictation feature helps you capture ideas and create a first draft faster.</u> Invite customers to try it in their next document. Keep the tone confident, useful, and approachable. Our fall launch introduces a faster way to turn ideas into finished work. The campaign will reach customers through email, social, and our product blog. Each message should focus on a clear customer benefit and show the feature in action.</div>
  <div className="morph-glass" style={{opacity:ease((t-1500)/350),left:mix(50,264,morph),top:mix(186,20,morph),width:mix(500,316,morph),height:mix(184,532,morph),borderRadius:17+24*Math.sin(Math.PI*morph)}}>
   <div className="morph-inline" style={{opacity:suggestion,filter:`blur(${2*(1-suggestion)}px)`,visibility:suggestion===0?'hidden':'visible'}} aria-hidden={suggestion===0}><header><img src={asset('AgentIconWrapper')} alt=""/><strong>Sound more confident</strong></header><p>This update clearly summarizes our progress so far.</p><footer><Button size="medium" text="Use this version" onClick={()=>{elapsed.current=3100;setTime(3100)}}/><Button size="medium" variant="tertiary" text="Dismiss" onClick={()=>{elapsed.current=3100;setTime(3100)}}/></footer></div>
   <div className="morph-panel" style={{opacity:panel,transform:`translateY(${10*(1-panel)}px)`,visibility:panel===0?'hidden':'visible'}} aria-hidden={panel===0}>
    <div className="morph-prompts" style={{opacity:chosen?0:1,visibility:chosen?'hidden':'visible'}}><h2>Good morning, Maya</h2><div className="morph-prompt-row"><Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={16} accessibilityLabel="Grammarly"/>Review 21 writing suggestions</div><button className="morph-messaging" data-highlight={t>=5250} onClick={choose}><img src={asset('Icon1')} alt=""/>Suggest messaging improvements</button><div className="morph-prompt-row"><img src={asset('Icon2')} alt=""/>Identify launch assets needed</div></div>
    <div className="morph-conversation" style={{opacity:ease((t-5500)/220),visibility:chosen?'visible':'hidden'}} aria-hidden={!chosen}><div className="morph-user" style={{transform:`translateY(${8*(1-ease((t-5500)/250))}px)`}}>Suggest messaging improvements</div><div className="morph-reply" style={{opacity:answer}}><header><img src={asset('Icon2')} alt=""/><span>Go</span></header>{t<6250?<div className="morph-typing" aria-label="Go is typing">{[0,1,2].map(i=><i key={i} style={{opacity:.35+.65*(.5+.5*Math.sin(t/160-i*1.3))}}/>)}</div>:<><p>{reply.map((word,i)=><span key={i} style={{opacity:ease((t-6250-i*35)/130)}}>{word} </span>)}</p><p className="morph-rewrite" style={{opacity:ease((t-6780)/160)}}>“{rewrite.map((word,i)=><span key={i} style={{opacity:ease((t-6780-i*50)/150)}}>{word} </span>)}”</p></>}</div></div>
    <div className="morph-composer"><span className="morph-attachment" aria-label="Detected Google Doc: Fall launch messaging" style={{opacity:detected,width:mix(29,177,chipOpen),transform:`translateY(${reduced?0:3*(1-detected)}px)`}}><AppsGoogleDocsIcon/><span style={{opacity:chipTitle}}>Fall launch messaging</span></span><div>Assign a task or ask anything<img src={asset('ArrowUp')} alt=""/></div></div>
   </div>
  </div>
  <div className="morph-cue" style={{opacity:cueIn,transform:`translate3d(${mix(475,287,morph)}px,${mix(112,46,morph)+6*(1-cueIn)}px,0) scale(${mix(.7912,.488,morph)*mix(.96,1,cueIn)})`}}><img src={asset('Icon')} alt="Go"/></div>
  <div className="morph-cursor" aria-hidden="true" style={{opacity:reduced?0:ease((t-4700)/250)*(1-ease((t-5650)/250)),transform:`translate3d(${mix(540,484,ease((t-4700)/600))}px,${mix(433,355,ease((t-4700)/600))}px,0)`}}><svg width="25" height="31" viewBox="0 0 25 31"><path d="M3 2L22 18L13 19L9 28Z" fill="#fff" stroke="#40233d" strokeWidth="2" strokeLinejoin="round"/></svg></div>
  <div className="morph-controls"><button aria-label={stopped||paused?'Play animation':'Pause animation'} disabled={reduced} onClick={()=>paused?setPaused?.(false):setStopped(v=>!v)}>{stopped||paused?'▶':'Ⅱ'}</button><button aria-label="Replay animation" onClick={replay}><ArrowClockwiseIcon/></button></div>
 </div></section>;
}
