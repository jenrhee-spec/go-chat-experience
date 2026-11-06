import {useLayoutEffect,useRef} from 'react';
// Reuse the Fall onboarding bowed flight, depth, timing, and stagger.
export default function useAgentHandoff(finished,transfer,onLanded){
 const complete=useRef(onLanded);complete.current=onLanded;
 useLayoutEffect(()=>{
  if(!finished)return;
  const items=transfer.current;transfer.current=[];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!items.length){complete.current();return}
  const panel=document.querySelector('.gh-panel'),stage=document.querySelector('.ge-stage');
  if(!panel||!stage){complete.current();return}
  const panelShift=new DOMMatrixReadOnly(getComputedStyle(panel).transform).m41;
  const screenScale=stage.getBoundingClientRect().width/1280;
  const flights=[],ghosts=[],targets=[];let cancelled=false;
  for(const [i,item] of items.entries()){
   const icon=panel.querySelector(`[data-handoff-agent="${item.name}"]`);if(!icon)continue;
   const bounds=icon.getBoundingClientRect(),end={left:bounds.left-panelShift*screenScale,top:bounds.top,width:bounds.width,height:bounds.height},start=item.rect;
   const ghost=document.createElement('img');ghost.src=item.src;ghost.alt='';ghost.className='gh-flying-agent';ghost.setAttribute('aria-hidden','true');
   Object.assign(ghost.style,{position:'fixed',left:start.left+'px',top:start.top+'px',width:start.width+'px',height:start.height+'px',zIndex:'10000',pointerEvents:'none',transformOrigin:'0 0',objectFit:'contain'});
   document.body.append(ghost);ghosts.push(ghost);icon.style.visibility='hidden';targets.push(icon);
   const dx=end.left+end.width/2-start.left-start.width/2,dy=end.top+end.height/2-start.top-start.height/2,landScale=end.width/start.width;
   const frames=Array.from({length:81},(_,j)=>{
    const t=j/80,p=t*t*t*(t*(t*6-15)+10),depth=Math.pow(Math.sin(Math.PI*t),2);
    const scale=1+(landScale-1)*p+1.05*depth,arc=Math.sin(Math.PI*p)*Math.min(130,Math.abs(dx)*.22);
    const x=dx*p+start.width*(1-scale)/2,y=dy*p-arc+start.height*(1-scale)/2;
    return {offset:t,transform:`translate(${x}px,${y}px) perspective(900px) rotateY(${-14*depth}deg) rotate(${-7*depth}deg) scale(${scale})`,opacity:1};
   });
   const animation=ghost.animate(frames,{duration:1500,delay:i*110,easing:'linear',fill:'both'});flights.push(animation);
   animation.finished.then(()=>{icon.style.visibility='';ghost.remove()}).catch(()=>{});
  }
  Promise.all(flights.map(a=>a.finished)).then(()=>{if(!cancelled)complete.current()}).catch(()=>{});
  return()=>{cancelled=true;flights.forEach(a=>a.cancel());ghosts.forEach(g=>g.remove());targets.forEach(i=>i.style.visibility='')};
 },[finished,transfer]);
}
