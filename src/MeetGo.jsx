import React,{useEffect,useRef,useState} from 'react';
import {AppsSlackIcon,ArrowClockwiseIcon} from '@superhuman/origin';
import './meet-go.css';
const asset=name=>`assets/meet-go/${name}`;
const smooth=value=>{const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x)};
function Storyboard({paused,setPaused}){
 const [time,setTime]=useState(0),[stopped,setStopped]=useState(false),[reduced,setReduced]=useState(false),[introControls,setIntroControls]=useState(true);
 const clock=useRef(0);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);const timer=setTimeout(()=>setIntroControls(false),2500);return()=>{media.removeEventListener('change',update);clearTimeout(timer)}},[]);
 useEffect(()=>{if(paused||stopped||reduced)return;let frame,last=performance.now();const tick=now=>{clock.current=(clock.current+now-last)%18000;last=now;setTime(clock.current);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[paused,stopped,reduced]);
 const t=reduced?12000:time;
 const enter=smooth((t-200)/850),spread=smooth((t-2200)/1400)*(1-smooth((t-16600)/1200));
 const pulse=(start,end)=>smooth((t-start)/850)*(1-smooth((t-end)/1000));
 const visibility=(start,end)=>spread*(.16+.84*pulse(start,end));
 const calendar=reduced?.6:visibility(4000,6600),email=reduced?.85:visibility(7100,10000),slack=reduced?.85:visibility(10800,14500);
 const replay=()=>{clock.current=0;setTime(0);setStopped(false);setPaused?.(false)};
 return <div className="meet-go-story" role="region" aria-label="Go learns about you and helps in Calendar, Gmail, and Slack" data-controls={introControls}>
  <div className="meet-go-tonal" aria-hidden="true"><img className="meet-go-warm" src={asset('warm.png')} alt=""/><img className="meet-go-dark" src={asset('dark.png')} alt=""/></div>
  <div className="meet-go-pair" style={{opacity:enter*(1-spread),transform:`translateY(${10*(1-enter)}px)`}} aria-hidden="true"><img src={asset('go-plus.svg')} alt=""/></div>
  <div className="meet-go-person" style={{maskImage:`url(${asset('mask.svg')})`,opacity:enter,transform:`translate(${-103*spread}px,${14*spread}px)`}}><img src={asset('maya.png')} alt="Maya"/></div>
  <div className="meet-go-context" style={{opacity:spread}} aria-hidden={spread<.05}>
   <section className="meet-go-slack" aria-label="Slack conversation" style={{opacity:slack}}>
    <header><AppsSlackIcon/><span>Slack</span><small># product-team</small></header>
    <div className="meet-go-slack-row"><div className="meet-go-daniel"><img src={asset('daniel.png')} alt=""/></div><div><strong>Daniel Lim</strong><p><span className="meet-go-mention">@Go</span> any news on yesterday’s critical bug?</p></div></div>
    <div className="meet-go-slack-row" style={{opacity:reduced?1:.35+.65*pulse(11250,14500)}}><img src={asset('slackGo.svg')} alt="Go"/><div><strong>Go</strong><p>DOH-163 was patched in nightly 14.70.</p></div></div>
   </section>
   <section className="meet-go-calendar" aria-label="Calendar example" style={{opacity:calendar}}><img src={asset('calendarGo.svg')} alt="Go"/><h3>Book meeting with Phil</h3><p><img src={asset('clock.svg')} alt=""/>June 23 <span>9:00 to 10:00</span></p><span className="meet-go-create">Create</span></section>
   <section className="meet-go-email" aria-label="Gmail draft" style={{opacity:email,maskImage:`url(${asset('emailmask.svg')})`}}><img className="meet-go-gmail" src={asset('gmail.svg')} alt="Gmail"/><p>I know this may not cover every detail, but it summarizes our progress so far.</p><img className="meet-go-email-line" src={asset('line.svg')} alt=""/></section>
   <div className="meet-go-prompt" style={{opacity:email}}><img src={asset('promptGo.svg')} alt="Go"/><span>Sound more confident</span></div>
  </div>
  {!reduced&&<div className="meet-go-playback"><button aria-label={paused||stopped?'Play Meet Go animation':'Pause Meet Go animation'} onClick={()=>paused?setPaused?.(false):setStopped(value=>!value)}>{paused||stopped?<svg viewBox="0 0 24 24"><path d="M8 5L19 12L8 19Z"/></svg>:<svg viewBox="0 0 24 24"><path d="M7 5H10V19H7ZM14 5H17V19H14Z"/></svg>}</button><button aria-label="Replay Meet Go animation" onClick={replay}><ArrowClockwiseIcon/></button></div>}
 </div>;
}
export default function MeetGo({next,back,Actions,Words,paused,setPaused}){return <section className="onboarding intro-onboarding meet-go-screen"><div className="copy"><h1><Words><strong>Go is AI that comes to you.</strong><span className="intro-heading-line">Learns how you work.<br/>Helps right in your apps.</span></Words></h1><Actions next={next} back={back}/></div><Storyboard paused={paused} setPaused={setPaused}/></section>}
