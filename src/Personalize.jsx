import React,{useEffect,useRef,useState,useId} from 'react';
import {Button,CaretSmallRightIcon,Icon,UsersIcon} from '@superhuman/origin';
import marks from './hero-marks.json';
import './personalize.css';
export const personaFrames={empty:'714-25857',description:'708-19251',creating:'709-20278',ready:'709-19994'};
export const heroPalettes=[['var(--origin-mulberry-20)','var(--origin-purple-20)'],['var(--origin-blue-40)','var(--origin-green-40)'],['var(--origin-mulberry-100)','var(--origin-purple-100)'],['var(--origin-orange-20)','var(--origin-mulberry-30)'],['var(--origin-green-20)','var(--origin-green-80)'],['var(--origin-neutral-40)','var(--origin-neutral-90)']];
export const personas=[
 {id:'friend',label:'Friend',name:'Lumi',description:'I’ll keep things warm, casual, and easy to talk through.',creating:'your friendly thought partner.',voice:'Hey Maya, let’s get you ready. Want a quick catch-up on what’s changed before your meeting?'},
 {id:'colleague',label:'Colleague',name:'Relay',description:'I’ll keep things clear, collaborative, and focused on the work.',creating:'your collaborative work partner.',voice:'Maya, I can pull together the latest updates and open questions for your meeting. Want a quick brief?'},
 {id:'coach',label:'Coach',name:'Stride',description:'I’ll be direct and encouraging, helping you take the next step.',creating:'your encouraging coach.',voice:'Let’s get you ready, Maya. What do you want to leave this meeting having decided?'},
 {id:'your-style',label:'Your style',name:'Go',description:'Based on how you communicate.',creating:'your personal work partner.',voice:'Here’s what changed before your meeting: two decisions to review and one open question.'}
];
export function initialPersona(){try{const c=JSON.parse(localStorage.getItem('go-persona')||'null');if(c&&c.personaVersion===2&&[0,1,2,3].includes(c.persona))return {...c,customName:c.customNames?.[c.persona]??(c.customName?.trim()&&!personas.some(p=>p.name===c.customName.trim())?c.customName:undefined),color:c.colorCustomized&&[0,1,2,3,4,5].includes(c.color)?c.color:undefined,stage:'ready'}}catch{}return {persona:3,personaVersion:2,stage:'ready'}}
export function HeroMark({index=0,neutral=false,thinking=false,paused=false,personality=0}){
 const ref=useRef(null),uid=useId().replaceAll(':','');
 const mark=marks[0].replaceAll('stop-color="#FFDCF3"','style="stop-color:var(--hero-color-a)"').replaceAll('stop-color="#E6E4FF"','style="stop-color:var(--hero-color-b)"').replace(/id="([^"]+)"/g,'id="'+uid+'-$1"').replace(/url\(#([^)]+)\)/g,'url(#'+uid+'-$1)');
 useEffect(()=>{const svg=ref.current?.querySelector('svg'),mq=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{if(!svg)return;if(paused||mq.matches){svg.pauseAnimations();if(mq.matches)svg.setCurrentTime(0)}else svg.unpauseAnimations()};update();mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update)},[index,paused]);
 const previous=useRef(personality);
 useEffect(()=>{if(previous.current===personality)return;previous.current=personality;if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const motion=ref.current.animate([{transform:'scale(1,1)'},{transform:'scale(.96,1.04)',offset:.4},{transform:'scale(1,1)'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'});return()=>motion.cancel()},[personality,paused]);
 const colors=heroPalettes[index];
 return <div ref={ref} style={{'--hero-color-a':colors[0],'--hero-color-b':colors[1]}} className={'personal-hero'+(neutral?' neutral':'')+(thinking?' thinking':'')+(paused?' motion-paused':'')} dangerouslySetInnerHTML={{__html:mark}}/>;
}
const paletteNames=['Daydream','Lagoon','After hours','Golden hour','Grove','Graphite'];
const descriptors=['Casual, excited, warm','Calm, supportive, and focused','Energetic and reassuring','Based on how you communicate.'];
const voices=["Hey Maya, want a quick catch-up before your meeting? I can pull together what’s changed.","Maya, I can summarize what’s changed before your meeting. Would you like a brief?","Maya, let’s get you prepared. Want a quick brief on what’s changed before your meeting?","Here’s what changed before your meeting: two decisions to review and one open question."];
function PreviewText({index,account}){return <><div className="town-descriptor">{descriptors[index]}</div><h2>{personas[index].label}</h2><p>{voices[index].replaceAll('Maya',(account||'Maya').split(' ')[0])}</p></>}
function TownText({persona,account,paused}){
 const ref=useRef(null),prior=useRef(persona),previousMarkup=useRef('');
 useEffect(()=>{const node=ref.current,oldMarkup=previousMarkup.current;previousMarkup.current=node.innerHTML;if(prior.current===persona)return;prior.current=persona;if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const outgoing=document.createElement('div');outgoing.className='town-outgoing';outgoing.setAttribute('aria-hidden','true');outgoing.innerHTML=oldMarkup;node.parentElement.append(outgoing);
 const fadeOut=outgoing.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out'}),fadeIn=node.animate([{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'});fadeOut.onfinish=()=>outgoing.remove();return()=>{fadeOut.cancel();fadeIn.cancel();outgoing.remove()};
 },[persona,paused]);
 return <div className="town-copy"><div ref={ref} className="town-current"><PreviewText index={persona} account={account}/></div>{personas.map((p,i)=><div className="town-measure" aria-hidden="true" key={p.id}><PreviewText index={i} account={account}/></div>)}</div>
}
export function Personalize({next,back,choice,setChoice,Chrome,paused,account,Words=React.Fragment}){
 const persona=choice.persona??3,color=choice.color??0;
 useEffect(()=>{history.replaceState(null,'','#'+personaFrames.ready)},[]);
 const select=i=>setChoice(c=>({...c,persona:i,personaVersion:2,stage:'ready'}));
 return <><Chrome/><section className="onboarding personalize integrated-personalize" data-persona-stage="ready">
 <div className="copy"><h1><Words><strong>Meet Go.</strong><span>Go brings your agents together to help you throughout your day.</span></Words></h1><div className="actions"><Button size="xlarge" text="Start with Go" iconEnd={CaretSmallRightIcon} onClick={()=>{setChoice(c=>({...c,persona,color,stage:'ready'}));next()}}/><Button size="xlarge" variant="tertiary" text="Back" onClick={back}/></div></div>
 <div className="town-card"><div className="town-stage"><TownText persona={persona} account={account} paused={paused}/><div className={'town-mark'+(paused?' town-paused':'')}><HeroMark index={color} paused={paused}/></div></div>
 <div className="town-eyebrow" id="town-personality">Make Go your own.</div><div className="town-choices" role="radiogroup" aria-labelledby="town-personality">{[3,0,1,2].map(i=>{const p=personas[i];return <button type="button" key={p.id} role="radio" aria-checked={persona===i} tabIndex={persona===i?0:-1} onClick={()=>select(i)} onKeyDown={e=>{let n;if(['ArrowRight','ArrowDown'].includes(e.key))n=[3,0,1,2][([3,0,1,2].indexOf(i)+1)%4];if(['ArrowLeft','ArrowUp'].includes(e.key))n=[3,0,1,2][([3,0,1,2].indexOf(i)+3)%4];if(e.key==='Home')n=3;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();e.stopPropagation();e.currentTarget.parentElement.children[[3,0,1,2].indexOf(n)].focus();select(n)}}}>{i===0?<Icon icon={UsersIcon} accessibilityLabel=""/>:<img src={'assets/persona-'+(i===3?'friend':p.id)+'.svg'} alt=""/>}{p.label}</button>})}</div>
 <div className="town-eyebrow" id="town-color">Color</div><div className="town-swatches" role="group" aria-labelledby="town-color">{paletteNames.map((label,i)=><button type="button" key={label} aria-label={label} aria-pressed={color===i} style={{'--swatch-a':heroPalettes[i][0],'--swatch-b':heroPalettes[i][1]}} onClick={()=>setChoice(c=>({...c,color:i,colorCustomized:true}))}><span className="town-tooltip" aria-hidden="true">{label}</span></button>)}</div>
 </div></section></>
}
