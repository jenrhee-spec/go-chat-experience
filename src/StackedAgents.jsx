import React,{useRef,useLayoutEffect} from 'react';
import {CaretLargeLeftIcon,CaretLargeRightIcon} from '@superhuman/origin';
import './stacked-agents.css';
const layouts={stacked:{width:414,height:371,side:245,distance:222.5,radius:86,alpha:.7}};
const wrap=n=>(n%3+3)%3;
function useShuffle(ref,target,layout){
 const state=useRef({position:0,velocity:0});
 useLayoutEffect(()=>{
  const root=ref.current,cards=[...root.querySelectorAll('.card')],cfg=layouts[layout],media=matchMedia('(prefers-reduced-motion: reduce)');let raf,last;
  function paint(p){
   cards.forEach((card,i)=>{
    const angle=(i-p)*2*Math.PI/3,depth=(1-Math.cos(angle))/1.5,weight=Math.max(0,1-depth),side=Math.min(1,depth);
    const x=Math.sin(angle)*cfg.distance/Math.sin(2*Math.PI/3),w=cfg.width+(cfg.side-cfg.width)*side,h=cfg.height+(cfg.side-cfg.height)*side;
    const centerOffset=layout==='circles'?14*side:0;
    const inwardTurn=layout==='stacked'?-35*Math.sin(angle)/Math.sin(2*Math.PI/3):0;
    card.style.width=w+'px';card.style.height=h+'px';card.style.transform=`perspective(1000px) translate3d(${x}px,${centerOffset}px,0) rotateY(${inwardTurn}deg)`;card.style.zIndex=String(Math.round(100*(2-depth)));
    card.querySelector('.surface').style.opacity=1-(1-cfg.alpha)*side;
    const radius=layout==='stacked'?cfg.radius*h/cfg.height:cfg.radius;
    card.style.setProperty('--card-radius',radius+'px');
    card.querySelector('.surface').style.borderRadius=layout.startsWith('circles')?'50%':radius+'px';
    card.querySelector('.surface').style.filter='none';
    card.style.setProperty('--edge-softness',weight);
    card.style.setProperty('--edge-blur',`${3+9*weight}px`);
    const shadowStrength=layout==='stacked'?.5+.5*weight:1;
    card.querySelector('.surface').style.boxShadow=`0 ${12+8*weight}px ${32+16*weight}px -12px rgba(40,30,65,${(.12+.04*weight)*shadowStrength}), 0 4px 12px rgba(40,30,65,${(.035+.01*weight)*shadowStrength})`;
    card.style.setProperty('--card-shadow',card.querySelector('.surface').style.boxShadow);
    const icon=card.querySelector('.mark');
    // Native asset dimensions stay intact; the wrapper scales with depth.
    const native=103;
    const activeSize=103,sideSize=layout==='circles'?54.6185:72.2911;
    icon.style.transform=`translate(-50%,-50%) translateY(${-66*weight}px) scale(${(sideSize+(activeSize-sideSize)*weight)/native})`;
    icon.style.opacity=i===wrap(target)?1:1-(1-cfg.alpha)*side;
    card.querySelector('.card-copy').style.opacity=Math.pow(weight,4);
    card.querySelector('.card-copy').style.transform=`translate(-50%,${14*(1-weight)}px)`;
   });root.dataset.position=p.toFixed(4);
  }
  function settle(){cancelAnimationFrame(raf);state.current={position:target,velocity:0};paint(target);root.dataset.moving='false';}
  function tick(t){let dt=Math.min((t-(last??t-16.67))/1000,.032);last=t;const s=state.current;
   while(dt>0){const step=Math.min(dt,1/240);s.velocity+=(210*(target-s.position)-28*s.velocity)*step;s.position+=s.velocity*step;dt-=step;}
   paint(s.position);if(Math.abs(target-s.position)<.0003&&Math.abs(s.velocity)<.003)settle();else raf=requestAnimationFrame(tick);
  }
  const preference=()=>{if(media.matches)settle()};media.addEventListener('change',preference);
  if(media.matches)settle();else{paint(state.current.position);root.dataset.moving='true';raf=requestAnimationFrame(tick)}
  return()=>{cancelAnimationFrame(raf);media.removeEventListener('change',preference)};
 },[target,layout]);
}
export default function StackedAgents({agents,position,select,asset,ready}){
 const root=useRef(null),pointer=useRef(null);
 const selected=wrap(position);
 useShuffle(root,position,'stacked');
 return <div className="stacked-agents" data-ready={ready} aria-hidden={!ready} inert={!ready?'':undefined}>
 <section ref={root} className="stacked-carousel" aria-label="Choose an agent" aria-roledescription="carousel"
 onPointerDown={e=>{pointer.current={x:e.clientX,y:e.clientY}}}
 onPointerUp={e=>{const start=pointer.current;pointer.current=null;if(start&&Math.abs(e.clientX-start.x)>35&&Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)){select(selected+(e.clientX<start.x?1:-1));root.current.dataset.swiped='true';setTimeout(()=>{if(root.current)root.current.dataset.swiped='false'},0)}}} onPointerCancel={()=>pointer.current=null}>
 {agents.map((agent,i)=><button key={agent.id} className="card" aria-label={`Show ${agent.name}`} aria-pressed={selected===i} onClick={()=>{if(root.current.dataset.swiped!=='true')select(i)}}>
 <span className="surface"><span className="stacked-soft-bottom"/></span>
 <span className="mark" data-agent-source={ready?agent.name:undefined}><img src={asset(agent.icon)} draggable="false" alt=""/></span>
 <span className="card-copy" aria-hidden={selected!==i}><strong>{agent.name}</strong><span>{agent.description}</span></span>
 </button>)}
 </section>
 <div className="stacked-arrows"><button aria-label="Previous agent" onClick={()=>select(selected-1)}><CaretLargeLeftIcon/></button><button aria-label="Next agent" onClick={()=>select(selected+1)}><CaretLargeRightIcon/></button></div>
 <span className="stacked-announcement" aria-live="polite">{ready&&`${agents[selected].name}. ${agents[selected].description}`}</span>
 </div>;
}
