import StackedAgents from './StackedAgents';
import WritingAgentPreview from './WritingAgentPreview';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Button, CaretLargeLeftIcon, CaretLargeRightIcon, CaretSmallRightIcon, XIcon} from '@superhuman/origin';
import './agent-selection.css';
import AgentPersonalizing, {PERSONALIZING_MS} from './AgentPersonalizing';

const figmaIcons={'robot.svg':'3015-1349-imgCustomRobot.svg','grammarly.svg':'3015-1349-imgFrame2147264240.svg','checker.svg':'3015-1349-imgFirstPartyKnowledgeChecker.svg'};
const asset = name => figmaIcons[name]?`assets/figma/${figmaIcons[name]}`:`assets/agent-carousel/${name}`;
const agents = [
  {id:'email', name:'Email Assistant', icon:'custom-letter.svg', description:'Labels email, drafts replies, and archives\nlow-priority messages so you can focus.'},
  {id:'product', name:'PRD Writer', icon:'robot.svg', description:'Drafts and refines product requirements from your notes, decisions, and connected sources.'},
  {id:'grammarly', name:'Grammarly', icon:'grammarly.svg', description:'Keeps your product docs error-free and polished.\nCustomize it to how you write.'},
];
const wrap = value => (value % agents.length + agents.length) % agents.length;

// One spring drives the whole carousel. Retargeting preserves its position and
// velocity, so repeated selections never restart a CSS tween or replace a card.
function useCarouselSpring(root, target, instant) {
  const motion = useRef({position:0, velocity:0});
  useLayoutEffect(() => {
    const panel = root.current;
    const cards = [...panel.querySelectorAll('.agent-carousel-tile')];
    const green = panel.closest('.agent-carousel-screen').querySelector('.agent-tonal-green');
    const knowledge = panel.closest('.agent-carousel-screen').querySelector('.agent-tonal-knowledge');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame, lastTime;
    const paint = position => {
      for (let index = 0; index < cards.length; index++) {
        const angle = (index-position)*Math.PI*2/3;
        const depth = (1-Math.cos(angle))/1.5;
        // Neighbor centers sit outside the panel, revealing only their outer edges.
        const x = -Math.sin(angle)*340/Math.sin(Math.PI*2/3);
        const scale = 1-.12*depth;
        const card = cards[index];
        card.style.transform = `translate3d(${x}px,0px,0) rotate(0deg) scale(${scale})`;
        card.style.opacity = String(1-.8*Math.min(1,depth));
        card.style.zIndex = String(Math.round((2-depth)*100));
      }
      const phase = wrap(position);
      const weights = agents.map((_,index) => {
        const delta = Math.abs(phase-index);
        return Math.max(0,1-Math.min(delta,3-delta));
      });
      green.style.opacity = String(weights[agents.findIndex(agent=>agent.id==='grammarly')]);
      knowledge.style.opacity = String(weights[agents.findIndex(agent=>agent.id==='email')]);
    };
    const settle = () => {
      cancelAnimationFrame(frame);
      motion.current = {position:target,velocity:0};
      paint(target);
      panel.dataset.moving = 'false';
    };
    const tick = time => {
      // Integrate in small steps to stay stable at both 60 Hz and 120 Hz.
      let remaining = Math.min((time-(lastTime??time-16.667))/1000,.032);
      lastTime = time;
      const state = motion.current;
      while (remaining>0) {
        const dt = Math.min(remaining,1/240);
        state.velocity += (170*(target-state.position)-26*state.velocity)*dt;
        state.position += state.velocity*dt;
        remaining -= dt;
      }
      paint(state.position);
      if (Math.abs(target-state.position)<.0002 && Math.abs(state.velocity)<.003) settle();
      else frame=requestAnimationFrame(tick);
    };
    const onPreference = () => { if(media.matches) settle(); };
    if(instant || media.matches) settle();
    else {panel.dataset.moving='true';frame=requestAnimationFrame(tick);}
    media.addEventListener('change',onPreference);
    return ()=>{cancelAnimationFrame(frame);media.removeEventListener('change',onPreference);};
  },[target,instant,root]);
}

function PreviewBackIcon(){return <img src={asset('preview-back.svg')} alt=""/>;}

export default function AgentSelection({next, back, account='Maya Jones', Words=React.Fragment,Chrome,initialPreview=false,onClosePreview}) {
  const [position, setPosition] = useState(initialPreview?agents.findIndex(agent=>agent.id==='product'):0);
  const dots = useRef([]);
  const [preview, setPreview] = useState(initialPreview);
  const [ready, setReady] = useState(initialPreview);
  const loadingDirection = new URLSearchParams(window.location.search).get('loading')==='shuffle'?'shuffle':'dome';
  const firstName = account.trim().split(/\s+/)[0] || 'you';
  useEffect(() => {
    if(initialPreview){setReady(true);return;}
    setReady(false);
    const timer = setTimeout(()=>setReady(true),PERSONALIZING_MS);
    return ()=>clearTimeout(timer);
  }, [account,initialPreview]);
  const panel = useRef(null);
  const [instant, setInstant] = useState(false);
  useCarouselSpring(panel, position, instant);
  const selected = wrap(position);
  function select(index, keyboard=false) {
    setInstant(keyboard);
    setPosition(current => {
      const distance = wrap(index - wrap(current));
      return current + (distance === 2 ? -1 : distance);
    });
  }
  function onKeyDown(event) {
    if (!ready) return;
    if (preview) {
      if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); (onClosePreview?onClosePreview():setPreview(false));}
      return;
    }
    let index;
    if (event.key === 'ArrowRight') index = wrap(selected + 1);
    if (event.key === 'ArrowLeft') index = wrap(selected - 1);
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = agents.length - 1;
    if (index === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    select(index, true);
    dots.current[index]?.focus({preventScroll:true});
  }
  return <section className="agent-carousel-screen figma-agents stacked-agent-flow" data-ready={ready} data-preview={preview} onKeyDown={onKeyDown}>
      {Chrome&&<Chrome/>}
      {!ready&&<div className="agent-personalizing-text-fade" aria-hidden="true"/>}
      {!ready&&<p className="agent-personalizing-headline" role="status"><span>I’m setting some agents up just for you</span></p>}
      <div className="agent-tonal agent-tonal-warm" aria-hidden="true"><div className="agent-tonal-art"><img src={'assets/figma/3015-1349-imgTonalBackground.png'} alt=""/><div className="agent-tonal-wash"/></div></div>
      <div className="agent-tonal agent-tonal-green" aria-hidden="true"><div className="agent-tonal-art"><img src={'assets/figma/3015-1349-imgTonalBackground.png'} alt=""/><img className="agent-green-art" src={asset('green.png')} alt=""/><div className="agent-tonal-wash"/></div></div>

      <div className="agent-tonal agent-tonal-knowledge" aria-hidden="true"/>

    <div className="agent-carousel-intro" aria-hidden={!ready} inert={ready?undefined:''}>
      <h1>{ready&&<Words>Meet your agents.<span>Specialists to work in the tools you use.</span></Words>}</h1>
      </div>
      <div className="agent-carousel-actions figma-action-footer" aria-hidden={!ready||preview} inert={!ready||preview?'':undefined}>
        <Button size="xlarge" text="Finish setup" iconEnd={CaretSmallRightIcon} isDisabled={!ready} onClick={next}/>
        <Button size="xlarge" variant="tertiary" text="Back" onClick={back}/>
      </div>
    <section ref={panel} className="agent-carousel" data-ready={ready} aria-busy={!ready} data-preview={preview} data-instant={instant} data-agent={agents[selected].id} aria-label="Meet your agents" aria-roledescription="carousel" onKeyDown={onKeyDown}>
      <div className="agent-carousel-track" aria-hidden={preview||!ready} inert={preview||!ready?'':undefined}>
        {agents.map((item,index) => <button key={item.id} type="button" className="agent-carousel-tile" data-icon={item.id} data-active={selected===index} aria-label={`Show ${item.name}`} aria-pressed={selected===index} onClick={event=>select(index,event.detail===0)}>
          <span className="agent-carousel-icon" data-agent-source={!ready?item.name:undefined}><img src={asset(item.icon)} alt=""/></span>
          <span className="agent-carousel-name">{item.name}</span>
        </button>)}
      </div>
      <div className="agent-carousel-details" aria-hidden={preview||!ready} inert={preview||!ready?'':undefined}>
        <div className="agent-carousel-navigation">
        <button type="button" className="agent-carousel-arrow" aria-label="Previous agent" onClick={()=>select(selected-1)}><CaretLargeLeftIcon/></button>
        <div className="agent-carousel-dots" role="tablist" aria-label="Choose an agent">
          {agents.map((item,index)=><button key={item.id} ref={el=>dots.current[index]=el} type="button" role="tab" id={`agent-dot-${item.id}`} aria-label={item.name} aria-selected={selected===index} aria-controls={`agent-description-${item.id}`} tabIndex={selected===index?0:-1} onClick={event=>select(index,event.detail===0)}/>)}
        </div>
        <button type="button" className="agent-carousel-arrow" aria-label="Next agent" onClick={()=>select(selected+1)}><CaretLargeRightIcon/></button>
        </div>
        <div className="agent-carousel-descriptions" aria-live="polite">
          {agents.map((item,index)=><p key={item.id} role="tabpanel" id={`agent-description-${item.id}`} aria-labelledby={`agent-dot-${item.id}`} aria-hidden={selected!==index} data-active={selected===index}>{item.description.split('\n').map((line,i)=><React.Fragment key={line}>{i>0&&<br/>}{line}</React.Fragment>)}</p>)}
        </div>
      </div>
      <div className="product-preview-background" aria-hidden="true">
        <div className="product-preview-base"><img src={'assets/figma/3015-1349-imgTonalBackground.png'} alt=""/><div/></div>
        <img className="product-preview-dark" src={asset('preview-dark.png')} alt=""/>
      </div>
      <section className="product-agent-preview" aria-label={`${agents[selected].name} preview`} aria-hidden={!preview} inert={preview?undefined:''}>
        {preview&&<WritingAgentPreview key={agents[selected].id} agent={agents[selected].id}/>}
      </section>
      <AgentPersonalizing stacked direction={loadingDirection} firstName={firstName} ready={ready}/>
    </section>
    {!preview&&<StackedAgents agents={agents} position={position} select={select} asset={asset} ready={ready}/>}
    {preview&&<div className="agent-preview-close" aria-hidden={!ready} inert={ready?undefined:''}>
      <Button text="Close Preview" size="xlarge" iconStart={XIcon} onClick={()=>onClosePreview?onClosePreview():setPreview(false)}/>
    </div>}
  </section>;
}
