import React, {useLayoutEffect, useRef} from 'react';
const candidates=['compass','calendar','book','graph','detective','octopus','coffee','beaker','elephant','pinwheel','hourglass','telescope'].map(name=>`custom-${name}.svg`);
const figmaIcons={'robot.svg':'3015-1349-imgCustomRobot.svg','grammarly.svg':'3015-1349-imgFrame2147264240.svg','checker.svg':'3015-1349-imgFirstPartyKnowledgeChecker.svg'};
const files=['custom-letter.svg','robot.svg','grammarly.svg'];
export const PERSONALIZING_MS=3600;
function finalPose(index){return {transform:`translate3d(${index===1?-340:index===2?340:0}px,0px,0) scale(${index===0?1:.88})`,opacity:index===0?1:index<3?.2:0};}

export default function AgentPersonalizing({direction,firstName,ready,stacked=false}){
 const field=useRef(null);
 const landingPose=index=>stacked?{transform:`translate3d(${260+(index===1?166.875:index===2?-166.875:0)}px,${index===0?190:239.5}px,0) scale(${index===0?.86:.6})`,opacity:index<3?1:0}:finalPose(index);
 useLayoutEffect(()=>{
  if(ready)return;
  const nodes=[...field.current.children];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let animations=[];
  const settle=()=>{animations.forEach(a=>a.cancel());nodes.forEach((node,i)=>Object.assign(node.style,landingPose(i)));};
  if(reduced.matches){settle();return;}
  if(direction==='shuffle'){
   // Pass real candidates through the foreground, then preserve the chosen trio.
   const order=[3,4,5,6,7,8,2,1,0];
   nodes.forEach((node,index)=>{
    const frames=order.map((active,step)=>{
     let distance=(index-active+nodes.length)%nodes.length;
     if(distance>nodes.length/2)distance-=nodes.length;
     const depth=Math.min(Math.abs(distance),3);
     return {offset:step*.0875,transform:`translate3d(${-distance*68}px,${depth*9}px,${-depth*30}px) scale(${1-depth*.085})`,opacity:depth===0?1:depth===1?.38:depth===2?.13:0,easing:'cubic-bezier(.22,1,.36,1)'};
    });
    frames.push({...landingPose(index),offset:.95},{...landingPose(index),offset:1});
    animations.push(node.animate(frames,{duration:PERSONALIZING_MS,fill:'both'}));
   });
  } else {
   nodes.forEach((node,index)=>{
    const frames=[];
    // Fibonacci distribution makes a rounded field instead of flat rotating rows.
    const latitude=Math.asin(1-2*(index+.5)/nodes.length);
    const longitude=index*Math.PI*(3-Math.sqrt(5));
    for(let step=0;step<=160;step++){
     const t=step/160;
     // Keep a gentle drift rather than fitting a full revolution into onboarding.
     const angle=longitude+t*.75;
     const radius=330;
     const z=Math.cos(angle)*Math.cos(latitude)*radius;
     frames.push({offset:t*.625,transform:`translate3d(${255+Math.sin(angle)*Math.cos(latitude)*365}px,${205+Math.sin(latitude)*180}px,${z}px) rotateX(${-Math.sin(latitude)*24}deg) rotateY(${Math.sin(angle)*32}deg) rotateZ(${Math.sin(longitude)*7}deg) scale(.46)`,opacity:.32+.68*(z/radius+1)/2,boxShadow:"8px 12px 0 rgba(137,116,153,.16), 16px 22px 34px rgba(78,55,104,.16)"});
    }
    frames[frames.length-1].easing='cubic-bezier(.4,0,.2,1)';
    frames.push({...landingPose(index),boxShadow:"0px 0px 0 rgba(137,116,153,0), 0px 0px 0px rgba(78,55,104,0)",offset:.97},{...landingPose(index),offset:1});
    // Retire unselected candidates early instead of carrying translucent ghosts
    // through the entire landing. Keep their transform path uninterrupted.
    const opacityFrames=index>2
      ? [...frames.filter(frame=>frame.offset<=.625).map(({offset,opacity})=>({offset,opacity})),{offset:.72,opacity:0},{offset:1,opacity:0}]
      : null;
    if(opacityFrames)frames.forEach(frame=>delete frame.opacity);
    animations.push(node.animate(frames,{duration:PERSONALIZING_MS,fill:'both'}));
    if(opacityFrames)animations.push(node.animate(opacityFrames,{duration:PERSONALIZING_MS,fill:'both'}));
   });
  }
  const onPreference=()=>{if(reduced.matches)settle();};
  reduced.addEventListener('change',onPreference);
  return()=>{settle();reduced.removeEventListener('change',onPreference);};
 },[direction,ready,stacked]);
 return <div className="agent-personalizing agent-loading-exploration" data-direction={direction} aria-hidden={ready}>
  <div ref={field} className="agent-loading-field" aria-hidden="true">
   {[...files,...(direction==='dome'?candidates.slice(0,8):candidates)].map((item,index)=><div key={index} className="agent-loading-candidate" data-kind={index<3?index:'custom'}>
    <span className="agent-loading-symbol"><img src={figmaIcons[item]?`assets/figma/${figmaIcons[item]}`:`assets/agent-carousel/${item}`} alt=""/></span>
   </div>)}
  </div>
 </div>;
}
