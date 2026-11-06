import React,{useEffect,useRef,useState} from 'react';
import {Button,CheckIcon,QuestionSquircleIcon,CaretSmallLeftIcon,CaretSmallRightIcon,AppsGoogleChromeIcon,AppsGoogleDocsIcon,AppsGmailIcon,AppsSlackIcon,AppsNotionIcon,AppsLinearIcon} from '@superhuman/origin';
import './chat-questionnaire.css';
const welcome=['Hi Maya!','Let’s make sure your starter agents are ready to work for you. Three quick questions, one for each agent.'];
function TypedWelcome({onComplete,enabled=true}){
 const [count,setCount]=useState(0);
 useEffect(()=>{if(!enabled){setCount(0);onComplete(false);return}const media=matchMedia('(prefers-reduced-motion: reduce)');let timer;const total=welcome.join('\n\n').length;const start=()=>{clearInterval(timer);if(media.matches){setCount(total);onComplete(true);return}setCount(0);onComplete(false);const began=performance.now();timer=setInterval(()=>{const n=Math.min(total,Math.max(0,Math.floor((performance.now()-began-240)/17)));setCount(n);if(n===total){clearInterval(timer);onComplete(true)}},30)};start();media.addEventListener('change',start);return()=>{clearInterval(timer);media.removeEventListener('change',start)}},[onComplete,enabled]);
 let offset=0;return <div className="pa-welcome" aria-label={welcome.join(' ')}>{welcome.map((p,i)=>{const n=Math.max(0,Math.min(p.length,count-offset));offset+=p.length+2;return <p key={i} aria-hidden="true">{p.slice(0,n)}<span style={{visibility:'hidden'}}>{p.slice(n)}</span></p>})}</div>
}
const setupSteps=[
 {agent:'Product Assistant',description:'Product Assistant brings together decisions and updates from your tools to help you plan your next move. Use it here in the Go app.',question:'Does most of your product work live in Gmail and Google Docs?',hint:'You’ve connected Google. Confirm these or choose any other places you work.',options:['Gmail','Google Docs','Slack','Notion','Linear'],multiple:true},
 {agent:'Knowledge Checker',description:'Knowledge Checker checks the details against sources you trust and offers suggestions wherever you write.',question:'What would you like Knowledge Checker to use as a source?',hint:'Choose the places your team keeps trusted information.',options:['Notion','Google Drive','Slack'],multiple:true},
 {agent:'Grammarly',description:'Grammarly helps you write clearly and confidently with suggestions as you type in your everyday tools.',question:'Where would you like Grammarly to help?',hint:'Get writing help across the sites and tools you use.',options:['Everywhere I write','In emails only','In documents only','I’ll decide later'],multiple:false}
];
const appIcons={'Slack':AppsSlackIcon,'Notion':AppsNotionIcon,'Linear':AppsLinearIcon,'Google Docs':AppsGoogleDocsIcon,'Gmail':AppsGmailIcon};
function SetupAppIcon({name}){const Component=appIcons[name];return Component?<Component/>:<img src="shared/google.svg" width="20" height="20" alt=""/>}
function SetupChatTurn({text,children,onReady}){
 const [count,setCount]=useState(0),[complete,setComplete]=useState(false);
 const root=useRef(null),callback=useRef(onReady);callback.current=onReady;
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let timer;
  const finish=()=>{setCount(text.length);setComplete(true);callback.current?.();clearInterval(timer)};
  const start=performance.now();
  if(media.matches)finish();else timer=setInterval(()=>{const value=Math.min(text.length,Math.max(0,Math.floor((performance.now()-start-240)/17)));setCount(value);if(value===text.length)finish()},30);
  const changed=()=>{if(media.matches)finish()};media.addEventListener('change',changed);
  root.current?.scrollIntoView({block:'nearest',behavior:media.matches?'auto':'smooth'});
  return()=>{clearInterval(timer);media.removeEventListener('change',changed)};
 },[text]);
 useEffect(()=>{if(complete)root.current?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})},[complete]);
 return <section className="pa-setup-chat-turn" ref={root} data-speaking={!complete}><p className="pa-setup-response" aria-label={text}><span aria-hidden="true">{text.slice(0,count)}{!complete&&<span className="pa-chat-caret"/>}</span></p>{complete&&children}</section>
}
function SetupArtifact({connections={},setConnections=()=>{}}){
 const [step,setStep]=useState(0),[answers,setAnswers]=useState([['Gmail','Google Docs'],[],[]]),[stage,setStage]=useState('questions'),[extension,setExtension]=useState(false),[localConnections,setLocalConnections]=useState({});
 const [otherResponses,setOtherResponses]=useState(['','','']);
 const card=useRef(null),mounted=useRef(false);
 useEffect(()=>{if(mounted.current)card.current?.querySelector('h2')?.focus({preventScroll:true});mounted.current=true},[step,stage]);
 const current=setupSteps[step];
 const choose=value=>setAnswers(previous=>previous.map((items,i)=>i!==step?items:current.multiple?(items.includes(value)?items.filter(item=>item!==value):[...items,value]):[value]));
 const supportedApps=['Slack','Notion','Linear','Google Drive','Google Docs','Gmail'];
 const requested=[...new Set([...answers[0],...answers[1]].filter(name=>supportedApps.includes(name)).map(name=>name==='Google Docs'?'Google Drive':name))];
 const connected=name=>Boolean(connections[name]||localConnections[name]);
 const allConnected=requested.length>0&&requested.every(connected);
 const canContinue=answers[step].length>0&&(!answers[step].includes('Other')||Boolean(otherResponses[step].trim()));
 const next=(skip=false)=>{
  const updated=skip?answers.map((items,i)=>i===step?[]:items):answers;
  if(skip)setAnswers(updated);
  if(step<2)setStep(step+1);
  else{
   const saved=updated.map((items,i)=>items.map(value=>value==='Other'?otherResponses[i].trim():value));
   sessionStorage.setItem('go-starter-agent-preferences',JSON.stringify(saved));
   setStage([...updated[0],...updated[1]].some(name=>supportedApps.includes(name))?'connect':'extension');
  }
 };
 return <div className="pa-starter-setup" ref={card}>
 {stage==='questions'?<div key={step}>
  <p className="pa-agent-explanation">{current.description}</p>
  <article className="pa-artifact pa-questionnaire">
   <header className="pa-question-header"><QuestionSquircleIcon/><span>Question</span><nav aria-label="Question navigation"><button type="button" aria-label="Previous question" disabled={step===0} onClick={()=>setStep(step-1)}><CaretSmallLeftIcon/></button><span>{step+1} of 3</span><button type="button" aria-label="Next question" disabled={step===2||!canContinue} onClick={()=>next()}><CaretSmallRightIcon/></button></nav></header>
   <h2 tabIndex={-1}>{current.question}</h2><p className="pa-setup-hint">{current.hint}</p>
   <div className="pa-setup-options" role="group" aria-label={current.question}>{current.options.map((value,i)=><label className="pa-setup-option" key={value}><input type={current.multiple?'checkbox':'radio'} name={'starter-step-'+step} checked={answers[step].includes(value)} onChange={()=>choose(value)}/><span className="pa-option-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span><span>{value}</span></label>)}</div>
   <div className="pa-question-footer"><label className="pa-inline-reply"><span className="pa-option-letter" aria-hidden="true">{String.fromCharCode(65+current.options.length)}</span><input type="text" aria-label="Other — your reply" placeholder="Your reply" value={otherResponses[step]} onChange={e=>{const text=e.target.value;setOtherResponses(previous=>previous.map((value,i)=>i===step?text:value));setAnswers(previous=>previous.map((items,i)=>i!==step?items:text.trim()?(current.multiple?[...items.filter(value=>value!=='Other'),'Other']:['Other']):items.filter(value=>value!=='Other')));}}/></label>
    <div className="pa-setup-actions"><Button text="Skip" variant="secondary" size="small" onClick={()=>next(true)}/><Button text={step===2?'Finish':'Next'} size="small" isDisabled={!canContinue} onClick={()=>next()}/></div>
   </div>
  </article>
 </div>:<>
  <div className="pa-setup-answer-summary"><span>Starter agent preferences saved</span><Button text="Edit" size="small" variant="tertiary" onClick={()=>{setStage('questions')}}/></div>
  {requested.length>0&&<SetupChatTurn text="Thanks, Maya. Let’s connect the apps you selected so your agents can use your work and trusted sources.">
   <article className="pa-artifact"><h2 tabIndex={-1}>Connect your apps</h2>
    {requested.map(name=><div className="pa-setup-connection" key={name}><SetupAppIcon name={name}/><div><strong>{name}</strong></div>{connected(name)?<span className="pa-setup-connected"><CheckIcon/>Connected</span>:stage==='connect'?<Button text="Connect" accessibilityLabel={'Connect '+name} size="small" variant="secondary" onClick={()=>{setLocalConnections(previous=>({...previous,[name]:true}));setConnections(previous=>({...previous,[name]:true}))}}/>:<span className="pa-setup-hint">Not connected</span>}</div>)}
    {stage==='connect'&&<div className="pa-setup-actions"><Button text="Skip" variant="secondary" size="small" onClick={()=>setStage('extension')}/><Button text="Continue" variant="primary" size="small" isDisabled={!allConnected} onClick={()=>setStage('extension')}/></div>}
   </article>
  </SetupChatTurn>}
  {(stage==='extension'||stage==='done')&&<SetupChatTurn text={answers[2][0]==='I’ll decide later'?'Your preferences are saved. Add the extension to use Knowledge Checker where you write. You can choose when Grammarly helps later.':'Next, add the extension to bring Knowledge Checker and Grammarly into the places you write.'}>
   <article className="pa-artifact"><header><AppsGoogleChromeIcon/><h2 tabIndex={-1}>Bring your agents into your browser</h2></header><p className="pa-setup-hint">Get suggestions in your docs, email, and other writing tools.</p>
    {stage==='extension'?<div className="pa-setup-actions"><Button text="Skip" variant="secondary" size="small" onClick={()=>setStage('done')}/><Button text="Add extension" size="small" onClick={()=>{setExtension(true);setStage('done')}}/></div>:<span className="pa-setup-connected">{extension?'Extension added':'You can add this later'}</span>}
   </article>
  </SetupChatTurn>}
  {stage==='done'&&<SetupChatTurn text={extension&&requested.every(connected)?'Your starter agents are ready.':'Your preferences are saved.'}>
   <div className="pa-setup-complete">
    <p><strong>Product Assistant</strong> is in your Go sidebar. Open it to bring together updates, decisions, and next steps.</p>
    <p><strong>Knowledge Checker</strong> {extension?'offers suggestions as you write, checking details against your selected sources.':'will offer suggestions as you write once you add the extension.'}</p>
    <p><strong>Grammarly</strong> {answers[2][0]==='I’ll decide later'?'is ready when you want it. You can choose where it helps later.':!extension?'will offer writing suggestions once you add the extension.':answers[2][0]==='In emails only'?'offers suggestions as you write emails.':answers[2][0]==='In documents only'?'offers suggestions as you write documents.':'offers suggestions wherever you write.'}</p>
    {!requested.every(connected)&&<p className="pa-setup-hint">Connect your selected apps to finish giving your agents context.</p>}
   </div>
  </SetupChatTurn>}
 </>}

 </div>
}

export default function ChatQuestionnaire({connections={},setConnections=()=>{}}){
 const [ready,setReady]=useState(false);
 return <div className="pa-chat-questionnaire"><TypedWelcome onComplete={setReady}/>{ready&&<SetupArtifact connections={connections} setConnections={setConnections}/>}</div>;
}
