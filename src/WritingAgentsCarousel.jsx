import React, {useEffect, useRef, useState} from 'react';
import {Button, CaretSmallRightIcon, Logo, LogoGrammarlyMarkColorPrimaryIcon} from '@superhuman/origin';
import GrammarlyPersonalizing from './GrammarlyPersonalizing';
import {BrowserChrome} from './WritingAgentsCompare';
import './writing-agents-carousel.css';

const agents = [
  {name: 'PRD Writer', kind: 'prd', description: 'Flags vague or incomplete requirements in line, with suggestions to make your PRD stronger as you write.', icon: 'assets/agents-3151/robot.svg'},
  {name: 'Grammarly', kind: 'grammar', title: 'Launch announcement', description: 'I’m already in your writing tools. Tell me what to improve or ignore, and I’ll remember.', prefix: 'Our team ', before: 'are', after: 'is', suffix: ' ready for the fall launch.', note: '“Team” is singular, so use “is.”', action: 'Accept suggestion'},
  {name: 'Write Like Me', kind: 'voice', description: 'Learns your voice from your writing and helps your documents, messages, and more sound like you.', icon: 'assets/agents-3151/inkwell.svg'},
];

function AgentIcon({agent}) {
  return agent.kind==='grammar'?<Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={28} accessibilityLabel=""/>:<img src={agent.icon} alt=""/>;
}

export default function WritingAgentsCarousel({onBack,onFinish,embedded=false,personalizing=false,onPersonalized}={}) {
  const [phase,setPhase]=useState(personalizing?'loading':'ready');
  const completed=useRef(onPersonalized);completed.current=onPersonalized;
  useEffect(()=>{if(personalizing)setPhase('loading')},[personalizing]);
  useEffect(()=>{
    if(phase!=='landed')return;
    const timer=setTimeout(()=>{setPhase('ready');completed.current?.()},180);
    return()=>clearTimeout(timer);
  },[phase]);
  const [position, setPosition] = useState(0);
  const active = ((position % agents.length) + agents.length) % agents.length;
  const [scale, setScale] = useState(1);
  const [instant, setInstant] = useState(false);

  useEffect(()=>{document.title='Meet your writing agents · Go';const fit=()=>setScale(Math.max(.1,Math.min(1,(innerWidth-48)/1280,(innerHeight-48)/832)));fit();addEventListener('resize',fit);return()=>removeEventListener('resize',fit)},[]);
  const choose = (offset, keyboard=false) => {setInstant(keyboard);setPosition(index=>index+offset)};
  const agent = agents[active];
  const content = <section className="wa-screen">
    <header className="wa-heading"><h1>Meet your writing agents.</h1><p>Specialists ready to help you improve your writing in the tools you already use.</p></header>
    <section className="wc-carousel" data-instant={instant} aria-label="Writing agents" aria-roledescription="carousel" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(e.key==='ArrowRight'?1:-1,true)}}}>
      <div className="wc-tonal" aria-hidden="true"><img src="assets/agents-3151/tonal.webp" alt=""/><div/></div>
      {[-1,0,1].map(offset=>{
        const slot=position+offset;
        const index=((slot%agents.length)+agents.length)%agents.length;
        const selected=offset===0;
        return <article key={slot} className="wc-card wc-slide" data-offset={offset}
          style={{transform:`translateX(${offset*481}px)`,opacity:selected?1:.3}}
          aria-hidden={!selected} inert={selected?undefined:''}
          aria-roledescription="slide" aria-label={`${index+1} of ${agents.length}: ${agents[index].name}`}>
        </article>;
      })}
      <button className="wa-arrow wc-prev" aria-label="Previous agent" onClick={()=>choose(-1)}><img src="assets/agents-3151/previous.svg" alt=""/></button>
      <button className="wa-arrow wc-next" aria-label="Next agent" onClick={()=>choose(1)}><img src="assets/agents-3151/next.svg" alt=""/></button>
      <div className="wc-caption" aria-live="polite"><h2>{agent.name}</h2><p>{agent.description}</p></div>
      <nav className="wc-progress" aria-label="Choose a writing agent">
        {agents.map((item,index)=><button key={item.kind} data-agent-name={item.name} data-agent-src={item.kind==='grammar'?'assets/writing-carousel-v2/proofreader.svg':item.icon} type="button" aria-label={`Go to ${item.name}`} aria-current={index===active?'true':undefined} onClick={()=>{const offset=(index-active+agents.length)%agents.length;if(offset)choose(offset===2?-1:1)}}><AgentIcon agent={item}/></button>)}

      </nav>
      <span className="wc-sr-only" aria-live="polite">{agent.name}, {active+1} of {agents.length}</span>
    </section>
    <footer className="wa-actions"><Button variant="tertiary" size="xlarge" text="Back" onClick={onBack||(()=>location.href='?research&preview=writing-profile')}/><Button size="xlarge" text="Continue" iconEnd={CaretSmallRightIcon} onClick={onFinish||(()=>location.href='?research&preview=agent-chat')}/></footer>
  </section>;
  if(embedded)return <div className="wc-browser wc-embedded" data-intro={phase}>
    <div className="wc-destination" inert={phase==='ready'?undefined:''}>{content}</div>
    {(phase==='loading'||phase==='docking')&&<GrammarlyPersonalizing docking={phase==='docking'} onDocking={()=>setPhase('docking')} onLanded={()=>setPhase('landed')}/>}
  </div>;
  return <main className="wa-review wc-review"><div className="wa-fit" style={{width:1280*scale,height:832*scale}}><div className="wa-browser wc-browser" style={{transform:`scale(${scale})`}} data-figma-node="3151:34565"><BrowserChrome assetBase="assets/writing-carousel/" actionsImage="assets/writing-carousel/browser-actions.png"/>{content}</div></div></main>;
}
