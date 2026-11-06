import React,{useEffect,useRef,useState} from 'react';
import {Button,IconButton,XIcon,ArrowUpIcon,CopyIcon,ThumbsUpIcon,ThumbsDownIcon} from '@superhuman/origin';
import './grammarly-handoff.css';
const asset=name=>`assets/grammarly-handoff/${name}.svg`;
const welcome='Hi Maya, I’m Go, the updated Grammarly experience. Your familiar writing help is still here, with more agents to help you take your writing further.';
const agentIntro='Your agents live here. Write Like Me is ready to help this retrospective sound like you.';
const contextIntro='You’re writing about how design, engineering, and product got out of sync. I can help you make the takeaway clear, in your direct, conversational style.';
const opening='This project slipped because design, engineering, and product were working toward different goals. Each team made reasonable decisions on its own, but we didn’t have a shared way to make tradeoffs. By the time we brought the work together, the gaps had turned into rework and delays.';
const update='Quick retrospective: our project slowed down because design, engineering, and product were making decisions separately. The lesson is to align on tradeoffs earlier, not add more checkpoints later.\n\nFor the next project, let’s agree on shared goals, name a decision owner, and bring the three teams together before work branches off. What would help us make that stick?';
const choices=['Suggest a clearer alternative to “checkpoints”','Clarify the reference to Conway’s Law','Make “scope and timelines” more specific'];
const documentSuggestions={
 'Suggest a clearer alternative to “checkpoints”':'“Alignment reviews” is more specific here and reinforces the need for teams to coordinate earlier.',
 'Clarify the reference to Conway’s Law':'You could add a brief explanation: “The way our teams were organized shaped the systems we built.”',
 'Make “scope and timelines” more specific':'Try “delivery dates and project scope” to make the product team’s priorities clearer.'
};
// Word reveal and completion timing reused from Assist onboarding’s PanelIntro.
function PanelIntro({text,onComplete}){
 const complete=useRef(onComplete);complete.current=onComplete;
 const words=text.match(/\S+\s*/g)||[];
 const [shown,setShown]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches?words.length:0);
 useEffect(()=>{if(shown>=words.length){const t=setTimeout(()=>complete.current?.(),250);return()=>clearTimeout(t)}const t=setTimeout(()=>setShown(n=>n+1),shown===0?300:38);return()=>clearTimeout(t)},[shown,words.length]);
 return <p className="gh-greeting" aria-label={text}><span aria-hidden="true">{words.map((word,i)=><span key={i} className={i<shown?'gh-word shown':'gh-word'}>{word}</span>)}</span></p>;
}
export default function GrammarlyHandoff({open,onClose,onApply,arrived=true}){
 const [phase,setPhase]=useState('intro'),[menu,setMenu]=useState(false),[prompt,setPrompt]=useState(''),[reply,setReply]=useState(null),[applied,setApplied]=useState(false),[feedback,setFeedback]=useState(null),[notice,setNotice]=useState('');
 const input=useRef(null),conversation=useRef(null);
 useEffect(()=>{if(phase!=='pause'&&phase!=='highlight')return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const timer=setTimeout(()=>setPhase(phase==='pause'?'agents':'context'),reduced?0:phase==='pause'?650:2200);return()=>clearTimeout(timer)},[phase]);
 useEffect(()=>{if(reply)conversation.current?.scrollTo({top:conversation.current.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})},[reply]);
 useEffect(()=>{if(!open)return;const escape=e=>{if(e.key==='Escape'){if(menu)setMenu(false);else onClose()}};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape)},[open,menu,onClose]);
 const ask=request=>{const suggestion=documentSuggestions[request];if(suggestion){setReply({request,text:suggestion,kind:'suggestion'});}else{const team=/team|update|summari/i.test(request);setReply({request,text:team?update:opening,kind:team?'update':'opening'});}setPrompt('');setApplied(false);setPhase('ready');setMenu(false)};
 const copy=async text=>{try{await navigator.clipboard.writeText(text);setNotice('Copied')}catch{setNotice('Select the draft text to copy it.')}};
 return <aside className={`gh-panel ${open?'is-open':''} ${phase==='highlight'?'is-highlighting':''}`} aria-label="Superhuman Go side panel" aria-hidden={!open} inert={open?undefined:''}>
  <header className="gh-header"><img src={asset('panel-logo')} alt=""/><span>Superhuman Go</span><img className="gh-pin" src={asset('panel-pin')} alt=""/><IconButton variant="tertiary" size="small" icon={XIcon} accessibilityLabel="Close Go side panel" onClick={onClose}/></header>
  <div className="gh-body"><div className="gh-agent-row"><button className="gh-agent-stack" aria-label="Your active agents" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}><img src={asset('notch-go')} alt="Go"/><img data-handoff-agent="Grammarly" src="assets/writing-carousel-v2/proofreader.svg" alt="Grammarly"/><span className="gh-voice-icon"><img data-handoff-agent="Write Like Me" src="assets/writing-agents/inkwell-large.svg" alt="Write Like Me"/></span><img data-handoff-agent="PRD Writer" src="assets/writing-carousel-v2/robot.svg" alt="PRD Writer"/><img className="gh-caret" src={asset('panel-caret')} alt=""/></button></div>
  {menu&&<div className="gh-agent-menu"><p>Your active agents</p>{['Grammarly','Write Like Me','PRD Writer'].map(name=><button key={name} onClick={()=>{setPrompt(name==='Write Like Me'?choices[0]:name==='PRD Writer'?'Summarize the project’s decision-making gaps':'Make the retrospective clearer');setMenu(false);input.current?.focus()}}>{name}<span>Active</span></button>)}</div>}
  <div className="gh-conversation" ref={conversation}>
   {arrived&&<PanelIntro text={welcome} onComplete={()=>setPhase(p=>p==='intro'?'pause':p)}/>}
   {!['intro','pause'].includes(phase)&&<PanelIntro text={agentIntro} onComplete={()=>setPhase(p=>p==='agents'?'highlight':p)}/>}
   {['context','ready'].includes(phase)&&<PanelIntro text={contextIntro} onComplete={()=>setPhase('ready')}/>}
   {phase==='ready'&&!reply&&<div className="gh-requests" aria-label="Suggested requests">{choices.map(c=><button key={c} onClick={()=>ask(c)}>{c}</button>)}<button onClick={()=>{setReply({kind:'skip',text:'No problem. Keep writing—I’m here when you need me.'})}}>I’ll keep writing</button></div>}
   {phase==='ready'&&<div className="gh-feedback"><IconButton icon={CopyIcon} variant="tertiary" size="small" accessibilityLabel="Copy introduction" onClick={()=>copy(welcome+'\n\n'+agentIntro+'\n\n'+contextIntro)}/><IconButton icon={ThumbsUpIcon} variant={feedback==='up'?'secondary':'tertiary'} size="small" accessibilityLabel="Helpful introduction" onClick={()=>setFeedback(v=>v==='up'?null:'up')}/><IconButton icon={ThumbsDownIcon} variant={feedback==='down'?'secondary':'tertiary'} size="small" accessibilityLabel="Unhelpful introduction" onClick={()=>setFeedback(v=>v==='down'?null:'down')}/></div>}
   {reply&&<div className="gh-reply" role="status">{reply.request&&<p className="gh-user-message">{reply.request}</p>}{reply.kind!=='skip'&&<p className="gh-reply-attribution"><img src="assets/writing-agents/inkwell-large.svg" alt=""/>{reply.kind==='suggestion'?'Grammarly':'Write Like Me'}</p>}<p>{reply.text}</p>{reply.kind!=='skip'&&reply.kind!=='suggestion'&&<div className="gh-draft-actions">{reply.kind==='opening'&&<Button text={applied?'Added to document':'Replace opening'} variant="secondary" size="small" isDisabled={applied} onClick={()=>{onApply(opening);setApplied(true)}}/>}<Button text="Copy draft" variant="tertiary" size="small" onClick={()=>copy(reply.text)}/></div>}</div>}
  </div>
  <form className="gh-composer" onSubmit={e=>{e.preventDefault();if(prompt.trim())ask(prompt.trim())}}><input ref={input} aria-label="Ask Go" placeholder="Start a task or ask anything" value={prompt} onChange={e=>setPrompt(e.target.value)}/><IconButton icon={ArrowUpIcon} size="small" accessibilityLabel="Send request" type="submit" isDisabled={!prompt.trim()}/></form>{notice&&<p className="gh-notice" role="status">{notice}</p>}
  </div>
 </aside>;
}
