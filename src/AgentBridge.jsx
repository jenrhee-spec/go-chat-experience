import React,{useEffect,useRef,useState} from 'react';
import './agent-movie.css';
import {FlagFillIcon,ArrowClockwiseIcon} from '@superhuman/origin';
const asset=name=>`assets/agent-movie/${name}`;
const extras=['compass','calendar','book','graph','detective','octopus','coffee','beaker','elephant','pinwheel','hourglass','telescope'];
const rewritten='Here’s what’s new this week.';
const introDuration=1600;
const loopDuration=17250;
function AgentMovie({paused,setPaused}){
 const [time,setTime]=useState(0);
 const [localPaused,setLocalPaused]=useState(false);
 const [playback,setPlayback]=useState(0);
 const [showInitialControls,setShowInitialControls]=useState(true);
 const replay=()=>{elapsed.current=0;setTime(0);setLocalPaused(false);setPaused?.(false);setPlayback(value=>value+1);};
 const [artReady,setArtReady]=useState(false);
 const elapsed=useRef(0);
 useEffect(()=>{
  if(!artReady)return;
  const timer=setTimeout(()=>setShowInitialControls(false),2500);
  return()=>clearTimeout(timer);
 },[artReady]);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  if(paused||localPaused||reduced||!artReady)return;
  let frame,last=performance.now();
  function tick(now){const next=elapsed.current+now-last;elapsed.current=next%loopDuration;last=now;setTime(elapsed.current);frame=requestAnimationFrame(tick);}
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[paused,localPaused,reduced,artReady,playback]);
 // Compress the introductory field only; retain reading time in each product example.
 const t=reduced?15900:time<introDuration?time*2400/introDuration:time+800;
 const phase=t<2400?'field':t<6800?'document':t<10700?'email':t<16400?'slack':t<17500?'ending':'reset';
 const ease=n=>1-Math.pow(1-Math.max(0,Math.min(1,n)),3);
 const arrival=(delay,opacity=1)=>{const progress=ease((t-delay)/650);return {opacity:opacity*progress,transform:`translateY(${18*(1-progress)}px) scale(${.76+.24*progress})`};};
 const zoom=reduced?1:t<2400?.82+.26*ease(t/2400):1.08-.08*ease((t-2400)/1000);
 const highlight=i=>({opacity:phase==='field'?1:phase==='ending'||phase==='reset'?.5:['document','email','slack'][i]===phase?1:0});
 const writing=t>=4700;
 const writerApplied=t>=5900;
 const coachApplied=t>=15000;
 const text=writerApplied?rewritten:"I’m ecstatic for this week’s blog.";
 return <div className="agents-movie" data-first-play={showInitialControls} data-flag-action={t>=11600&&phase==='slack'} data-writer-action={t>=3300&&phase==='document'} data-email-action={t>=7350&&phase==='email'} style={{'--email-action-y':`${-72.95+Math.max(0,Math.min(5,Math.floor((t-7600)/300)))*67.106}px`}} data-art-ready={artReady} data-phase={phase} data-reduced={reduced} role="region" aria-label="Agents working in your document, inbox, and Slack">
  <div className="agents-movie-tonal" aria-hidden="true"><img className="agents-movie-warm" src={asset('warm.png')} alt=""/><img className="agents-movie-dark" onLoad={()=>setArtReady(true)} src={asset('dark.png')} alt=""/></div>
  <div className="agents-movie-icon-camera" style={{transform:`scale(${zoom})`}}>
  <div className="agents-movie-field" aria-hidden="true">{Array.from({length:25},(_,i)=>{
   const column=i%5,row=Math.floor(i/5);if(column===2&&row>0&&row<4)return null;
   return <div className="agents-movie-orb agents-movie-extra" key={i} style={{left:6+column*125,top:row*114,...arrival(160+((i*7)%25)*65,1)}}><img src={`assets/agent-carousel/custom-${extras[(i+row*3)%extras.length]}.svg`} alt=""/></div>;
  })}</div>
  <div className="agents-movie-chosen" aria-hidden="true">
   <div className="agents-movie-writer-position" style={arrival(200)}><div className="agents-movie-orb agents-movie-writer" style={highlight(0)}><img src={asset('pencil.svg')} alt=""/><span className="agents-action-cursor"/></div></div>
   <div className="agents-movie-email-position" style={arrival(600)}><div className="agents-movie-orb agents-movie-secondary agents-movie-email-agent" style={highlight(1)}><img src={asset('letter.svg')} alt=""/><span className="agents-action-cursor"/></div></div>
   <div className="agents-movie-flag-position" style={arrival(1000)}><div className="agents-movie-orb agents-movie-secondary agents-movie-flag-agent" style={highlight(2)}><FlagFillIcon/><span className="agents-action-cursor"/></div></div>
  </div>
  </div>
  <article className="agents-movie-document" aria-hidden={phase!=='document'}>
   <header><img src={asset('doc.svg')} alt="Google Docs"/><h2>August Blog Post</h2><span className="agents-movie-share">Share</span></header>
   <p className="agents-movie-muted agents-movie-feature">Feature announcements</p>
   <div className="agents-movie-sentence" data-writing={writing&&!writerApplied} data-done={writerApplied}>
    <p key={writerApplied?'revised':'original'} className={writerApplied?'movie-applied-text':undefined}>{text}<span className="agents-movie-caret" aria-hidden="true"/></p>
    <img src={asset('underline.svg')} alt=""/>
   </div>
   <p className="agents-movie-muted">Our latest dictation feature will become available for all AcmeCo users starting August 21.</p>
   <p className="agents-movie-muted">Economic models have become increasingly important in evaluating sustainability. By combining theoretical frameworks with real-world data, economists can assess the long-term impacts of economic activity.</p>
  </article>
  <aside className="movie-coach-suggestion movie-writer-suggestion" aria-label="Write Like Me suggestion" aria-hidden={phase!=='document'||!writing||writerApplied} style={{opacity:phase==='document'?ease((t-4700)/450)*(1-ease((t-5900)/250)):0,transform:`translateY(${10*(1-ease((t-4700)/450))}px)`}}>
   <div className="movie-coach-heading"><h3>Sound more like you</h3><span className="movie-coach-tools" aria-hidden="true"><span>×</span><span>···</span></span></div>
   <p>{rewritten}</p>
   <div className="movie-coach-attribution"><span className="movie-writer-avatar"><img src={asset('pencil.svg')} alt=""/></span>Write Like Me</div>
  </aside>
  <section className="agents-movie-email" aria-label="Email Assistant organizing Gmail" aria-hidden={phase!=='email'}>
   <header><div className="movie-gmail-brand"><img src={asset('gmail-logo.svg')} alt=""/><img src={asset('gmail-name.png')} alt="Gmail"/></div><div className="movie-mail-search"><img src={asset('mail-search.svg')} alt=""/><span>Search mail</span></div></header>
   <div className="movie-mail-rows">{[
    ['Laura Shea','Respond','respond','Re: Enterprise Tier Feature',135.581],
    ['Asana','Notifications','neutral','5 tasks assigned to you',95.865],
    ['Chris Wu','Waiting','waiting','Enterprise Contract Template',117.777],
    ['Figma','Notifications','neutral','3 new comments in Figma',95.865],
    ['Jordan Lee','Comments','neutral','Product planning',136.95],
    ['Riley Chen','FYI','fyi','Updates to GTM Plan',131.472],
   ].map(([sender,label,color,subject,width],i)=>{
    const progress=reduced?1:ease((t-7850-i*300)/460);
    return <div className="movie-mail-row" key={sender}><div className="movie-mail-sender" style={{width}}><img src={asset(`mail-check-${i}.svg`)} alt=""/><span>{sender}</span></div><span className={`movie-mail-label ${color}`} data-added={progress===1} style={{opacity:progress,transform:`translateY(${7*(1-progress)}px) scale(${.9+.1*progress})`}}>{label}</span><span className="movie-mail-subject">{subject}</span></div>;
   })}</div>
  </section>
  <section className="agents-movie-slack" aria-label="Slack writing feedback" aria-hidden={phase!=='slack'}>
   <header># product-planning</header>
   <div className="movie-slack-message muted"><div className="movie-slack-avatar"><img src={asset('slack-muriel.png')} alt=""/></div><div><strong>Muriel Quesada</strong><p>Can we revisit shared pools after launch?</p></div></div>
   <div className="movie-slack-message"><div className="movie-slack-avatar daniel"><img src={asset('slack-daniel.png')} alt=""/></div><div><strong>Daniel Lim</strong><p key={coachApplied?'revised':'original'} className={coachApplied?'movie-applied-text':undefined}>{coachApplied?<>We can revisit shared pools<br/>after launch.</>:<>Deferring shared pools<br/><span className="movie-slack-highlight" style={{'--underline-progress':ease((t-12100)/650)}}>is not a one-way door</span>.</>}</p></div></div>
   <div className="movie-slack-compose"><span>Reply</span><div><img src={asset('slack-at.svg')} alt=""/><img src={asset('slack-smiley.svg')} alt=""/><img src={asset('slack-clip.svg')} alt=""/></div><aside><img src={asset('slack-send.svg')} alt=""/><img src={asset('slack-caret.svg')} alt=""/></aside></div>
  </section>
  <aside className="movie-coach-suggestion" aria-label="Writing suggestion" aria-hidden={phase!=='slack'||t<13100||coachApplied} style={{opacity:phase==='slack'?ease((t-13100)/550)*(1-ease((t-15000)/250)):0,transform:`translateY(${10*(1-ease((t-13100)/550))}px)`}}>
   <div className="movie-coach-heading"><h3>Clarify the one-way-door framing</h3><span className="movie-coach-tools" aria-hidden="true"><span>×</span><span>···</span></span></div>
   <p>We can revisit shared pools<br/>after launch.</p>
   <div className="movie-coach-attribution"><span><FlagFillIcon/></span>Writing coach</div>
  </aside>
  <div className="agents-movie-controls">
   <button type="button" className="agents-movie-pause" aria-label={localPaused||paused?'Play animation':'Pause animation'} onClick={()=>(paused?setPaused?.(false):setLocalPaused(value=>!value))}>
    {localPaused||paused?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5L19 12L8 19Z"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5H10V19H7ZM14 5H17V19H14Z"/></svg>}
   </button>
   <button type="button" className="agents-movie-replay" aria-label="Replay animation" title="Replay animation" onClick={replay}><ArrowClockwiseIcon/></button>
  </div>
  {!reduced&&<div className="agents-movie-progress" role="progressbar" aria-label="Animation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(time/loopDuration,1)*100)}><span style={{transform:`scaleX(${Math.min(time/loopDuration,1)})`}}/></div>}
 </div>;
}
export default function AgentBridge({next,back,Actions,Words,paused=false,setPaused}){
 return <section className="onboarding intro-onboarding agents-movie-screen"><div className="copy"><h1><Words><strong>Agents are specialists for work.</strong><span className="intro-heading-line">Ready to help in the tools you already use.</span></Words></h1><Actions next={next} back={back} label="Meet your agents"/></div><AgentMovie paused={paused} setPaused={setPaused}/></section>;
}
