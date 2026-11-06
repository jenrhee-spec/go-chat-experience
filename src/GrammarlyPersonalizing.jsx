import React, {useEffect,useRef,useState,useLayoutEffect} from 'react';
import AgentPersonalizing, {PERSONALIZING_MS} from './AgentPersonalizing';
import './agent-selection.css';

// Preserve the original Fall loader, including its dome and landing motion.
export default function GrammarlyPersonalizing({docking=false,onDocking,onLanded}){
 const [mounted,setMounted]=useState(false);
 useLayoutEffect(()=>{
  let cancelled=false,frame;
  const gradient=root.current.querySelector('.agent-tonal-art img');
  // Start the choreography only after the preloaded texture is decoded.
  gradient.decode().catch(()=>{}).then(()=>{
   if(!cancelled)frame=requestAnimationFrame(()=>setMounted(true));
  });
  return()=>{cancelled=true;cancelAnimationFrame(frame)};
 },[]);
 const root=useRef(null),callbacks=useRef({onDocking,onLanded});callbacks.current={onDocking,onLanded};
 const resolvePose=(card,i)=>{
  if(i>2)return null;
  const target=card.closest('.wc-embedded').querySelectorAll('.wc-progress button')[i];
  const from=card.getBoundingClientRect(),to=target.getBoundingClientRect();
  const scale=from.width/card.offsetWidth;
  const sx=to.width/from.width,sy=to.height/from.height;
  return {transform:`translate3d(${(to.x+to.width/2-from.x-from.width/2)/scale}px,${(to.y+to.height/2-from.y-from.height/2)/scale}px,0) scale(${sx},${sy})`,opacity:1,borderRadius:`${18/sx}px`,borderWidth:`${(i===0?3:1)/sx}px`,borderColor:i===0?'#8dcaf2':'#edebe5',background:'#f2f0eb'};
 };
 useEffect(()=>{
  if(!mounted)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dockingTimer=setTimeout(()=>callbacks.current.onDocking(),reduced?400:2250);
  const landedTimer=setTimeout(()=>{
   const cards=[...root.current.querySelectorAll('.agent-loading-candidate')].slice(0,3);
   const targets=[...root.current.parentElement.querySelectorAll('.wc-progress button')];
   const error=Math.max(...cards.map((card,i)=>{const a=card.getBoundingClientRect(),b=targets[i].getBoundingClientRect();return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.width-b.width),Math.abs(a.height-b.height))}));
   root.current.parentElement.dataset.landingError=error.toFixed(2);
   callbacks.current.onLanded();
  },reduced?700:PERSONALIZING_MS);
  return()=>{clearTimeout(dockingTimer);clearTimeout(landedTimer)};
 },[mounted]);
 return <div ref={root} className="ge-personalizing ge-direct-landing" data-docking={docking} data-asset-ready={mounted}><div className="screen"><section className="agent-carousel-screen figma-agents" data-ready="false" data-preview="false" aria-busy="true">
  <div className="agent-personalizing-text-fade" aria-hidden="true"/>
  <p className="agent-personalizing-headline" role="status"><span>Personalizing your agents…</span></p>
  <div className="agent-tonal agent-tonal-warm" aria-hidden="true"><div className="agent-tonal-art"><img src="assets/agents-3151/tonal.webp" alt=""/><div className="agent-tonal-wash"/></div></div>
  <div className="agent-carousel" data-ready="false">{mounted&&<AgentPersonalizing direction="dome" firstName="Maya" ready={false} resolvePose={resolvePose} icons={['assets/agents-3151/inkwell.svg','assets/writing-carousel-v2/proofreader.svg','assets/agents-3151/robot.svg']}/>}</div>
 </section></div></div>;
}
