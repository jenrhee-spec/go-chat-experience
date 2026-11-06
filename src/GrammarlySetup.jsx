import React, {useLayoutEffect, useRef, useState} from 'react';
import {Button, Logo, LogoGrammarlyMarkColorPrimaryIcon, CaretSmallRightIcon} from '@superhuman/origin';
import './grammarly-setup.css';
const asset=(name)=>`assets/grammarly-refresh/${name}`;

function Footer({back,next,loading=false}) {
 return <footer className="gs-footer"><Button variant="tertiary" size="xlarge" text="Back" onClick={back}/><Button size="xlarge" text="Continue" isDisabled={loading} iconEnd={CaretSmallRightIcon} onClick={next}/></footer>;
}
export function CarryOver({back,next,connections,setConnections}) {
 const rows=[['Grammarly','Your writing style and grammar preferences'],['Gmail','Your conversations and email writing style','OriginIcon.svg'],['Google Calendar','Your meetings and daily schedule','OriginIcon1.svg']];
 return <section className="gs-screen" data-figma-node="3089:28266"><header className="gs-heading"><h1>Give Go a fuller picture</h1><p>Your Grammarly experience has shaped your writing profile. Connect your email and calendar to personalize how Go helps across your work.</p></header><div className="gs-connectors">{rows.map(([name,copy,icon],i)=><React.Fragment key={name}>{i>0&&<img className="gs-connector-divider" src={asset('Line4.svg')} alt=""/>}<div className="gs-connector"><span className="gs-connector-icon">{icon?<img src={asset(icon)} alt=""/>:<Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={24} accessibilityLabel=""/>}</span><div className="gs-connector-copy"><h2>{name}</h2><p>{copy}</p></div>{name==='Grammarly'||connections[name]?<span className="gs-connected" role="status">Connected <img src={asset('Check.svg')} alt=""/></span>:<Button variant="secondary" size="large" text="Connect" accessibilityLabel={`Connect ${name}`} onClick={()=>setConnections(c=>({...c,[name]:true}))}/>}</div></React.Fragment>)}</div><Footer back={back} next={next}/></section>;
}
function ProfileSection({title,value,onSave,children,connected,onConnect}) {
 const [editing,setEditing]=useState(false),[draft,setDraft]=useState(value);
 return <section className="gs-profile-section"><header><h2>{title}</h2>{onConnect&&!connected?<button className="gs-gmail-connect" onClick={onConnect}><img src="assets/meet-go/gmail.svg" alt=""/>Connect</button>:<Button variant="secondary" size="small" text={editing?'Save':'Edit'} accessibilityLabel={`${editing?'Save':'Edit'} ${title.toLowerCase()}`} onClick={()=>{if(editing)onSave(draft.trim()||value);else setDraft(value);setEditing(!editing)}}/>}</header>{editing?<textarea autoFocus aria-label={title} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Escape'){setEditing(false);e.stopPropagation()}}}/>:children||<p>{value}</p>}</section>;
}
export const initialGrammarlyProfile={overview:'Connect Gmail to see this section.',writing:'In email, you’re concise and direct. You open with context, get to the ask fast, and end with a clear next step.\nFor example: “Quick thought” · “Next steps” · “Sounds good to me”\nYour tone is warm and matter-of-fact. You use everyday language and contractions, and avoid formal introductions.\nYou make longer updates easy to scan with short paragraphs, bullets, and clear next steps.\nYou prefer active voice and specific wording. You trim filler and keep punctuation simple.',responsibilities:'Connect Gmail to see this section.'};
export function GrammarlyProfile({back,next,profile,setProfile,role,setRole,connections={},setConnections}) {
 const update=(key)=>(value)=>setProfile(p=>({...p,[key]:value}));
 const connectGmail=()=>{setConnections(c=>({...c,Gmail:true}));setProfile(p=>({...p,overview:'Maya works at Northstar on model routing and evaluation, and helps keep Assistant Intelligence running.',responsibilities:'Leads model routing and evaluation, and coordinates cross-functional work to keep Assistant Intelligence running.'}))};
 useLayoutEffect(()=>{if(connections.Gmail)setProfile(p=>({...p,overview:p.overview.startsWith('Connect Gmail')?'Maya works at Northstar on model routing and evaluation, and helps keep Assistant Intelligence running.':p.overview,responsibilities:p.responsibilities.startsWith('Connect Gmail')?'Leads model routing and evaluation, and coordinates cross-functional work to keep Assistant Intelligence running.':p.responsibilities}))},[connections.Gmail]);
 const profileScroll=useRef(null),scrollTimer=useRef(null);
 const [scrolling,setScrolling]=useState(false);
 useLayoutEffect(()=>{if(profileScroll.current)profileScroll.current.scrollTop=0;return()=>clearTimeout(scrollTimer.current)},[]);
 const handleScroll=()=>{setScrolling(true);clearTimeout(scrollTimer.current);scrollTimer.current=setTimeout(()=>setScrolling(false),900)};
 return <section className="gs-screen" data-figma-node="3096:33377">
  <header className="gs-heading"><h1>Go’s first impression of you.</h1><p>Your profile grows over time, and you can edit it any time.</p></header>
  <div className="gs-profile-frame">
   <div className="gs-profile-art" aria-hidden="true"><div className="gs-tech"><img src={asset('Tech.svg')} alt=""/></div><div className="gs-writing"><img src={asset('Image17302356091.png')} alt=""/></div></div>
   <div ref={profileScroll} className={'gs-profile-scroll'+(scrolling?' is-scrolling':'')} role="region" aria-label="Your profile" tabIndex={0} onScroll={handleScroll}>
    <aside className="gs-role"><label htmlFor="gs-role">Maya’s role</label><div><select id="gs-role" value={role} onChange={e=>setRole(e.target.value)}>{['Product','Design','Engineering','Marketing','Sales','Operations','Other'].map(r=><option key={r}>{r}</option>)}</select><img src={asset('CaretLargeLeft.svg')} alt=""/></div><img src={asset('Line3.svg')} alt=""/></aside>
    <div className="gs-profile-sections"><ProfileSection title="Overview" value={profile.overview} onSave={update('overview')} connected={connections.Gmail} onConnect={connectGmail}/><img className="gs-profile-divider" src={asset('Line1.svg')} alt=""/><ProfileSection title="Writing style" value={profile.writing} onSave={update('writing')}><ul>{profile.writing.split('\n').map((line,i)=><li key={i}>{line}</li>)}</ul></ProfileSection><img className="gs-profile-divider" src={asset('Line1.svg')} alt=""/><ProfileSection title="Responsibilities" value={profile.responsibilities} onSave={update('responsibilities')} connected={connections.Gmail} onConnect={connectGmail}/></div>
   </div>
   <div className="gs-profile-fade" aria-hidden="true"/>
  </div>
  <Footer back={back} next={next}/>
 </section>;
}

export function ProfileLoading({back}) {
 return <section className="gs-screen gs-loading" aria-busy="true"><header className="gs-heading"><h1 role="status">Getting to know you…</h1><p>Bringing your writing style and preferences together.</p></header><div className="gs-loading-card" aria-hidden="true"><div className="gs-loading-role"><i/><b/></div><div className="gs-loading-sections">{[0,1,2].map(i=><div key={i}><b/><i/><i/><i/></div>)}</div></div><Footer back={back} loading/></section>;
}
