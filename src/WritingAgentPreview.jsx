import React, {useState} from 'react';
import {Button,CheckIcon} from '@superhuman/origin';
const examples={
 grammarly:{name:'Grammarly',title:'Fall product launch',issues:[
  {before:'Our team are',after:'Our team is',label:'Subject–verb agreement',note:'Use “is” with the singular noun “team”.'},
  {before:'it’s',after:'its',label:'Use the possessive form',note:'“Its” shows possession; “it’s” means “it is”.'},
  {before:'recieve',after:'receive',label:'Correct the spelling',note:'The correct spelling is “receive”.'}]},
 product:{name:'PRD Writer',title:'Team setup · Product requirements',issues:[
  {before:'setup takes too long',after:'setup takes more than 3 minutes',label:'Make this requirement measurable',note:'A clear success measure helps the team know when this requirement is met.',source:'Suggestion · Success criteria'},
  {before:'a short time',after:'under 3 minutes',label:'Make the success measure specific',note:'A measurable outcome makes it easier to evaluate whether setup is getting faster.',source:'Suggestion · Success criteria'},
  {before:'all teams',after:'new teams creating their first project',label:'Define who this is for',note:'A clear audience helps keep the first release focused.',source:'Suggestion · Target user'}]},
 knowledge:{name:'Write Like Me',title:'Reply to the launch team',issues:[
  {before:'I am writing to inform you',after:'Quick update',label:'Keep it direct',note:'Your Google writing samples tend to get straight to the point.'},
  {before:'at your earliest convenience',after:'when you have a moment',label:'Make it sound more natural',note:'Your usual tone is warm and conversational.'},
  {before:'I would be most appreciative',after:'Thanks for your help',label:'Close in your voice',note:'You usually wrap up with a short, friendly thank-you.'}]}
};
function WritingSuggestions({agent}){
 const example=examples[agent];
 const [accepted,setAccepted]=useState([]),[active,setActive]=useState(0);
 const issue=example.issues[active];
 const phrase=index=>accepted.includes(index)?<span className="writing-preview-applied">{example.issues[index].after}</span>:<button className="writing-preview-underline" data-active={active===index} aria-label={`Review ${example.issues[index].before}`} onClick={()=>setActive(index)}>{example.issues[index].before}</button>;
 function accept(){const updated=[...accepted,active];setAccepted(updated);setActive(example.issues.findIndex((_,i)=>!updated.includes(i)));}
 return <div className={'writing-agent-preview'+(agent==='product'?' prd-writing-preview':'')}>
  <article className="writing-preview-doc" aria-label={agent==='product'?'Example PRD draft':'Example Google document'}>
   <header><img src="assets/agent-movie/doc.svg" alt="Google Docs"/><span>{example.title}</span><small>Example</small></header>
   {agent==='product'?<>
    <p className="prd-writing-kicker">PRODUCT REQUIREMENTS</p>
    <h3>Help new teams reach their first shared result</h3>
    <h4>Problem</h4><p>New teams lose momentum when <>{phrase(0)}</> and project context is spread across tools.</p>
    <h4>Proposed approach</h4><p>Guide {phrase(2)} through a short checklist that brings their next steps and project context together.</p>
    <h4>Success measure</h4><p>Users can complete setup in {phrase(1)}.</p>
   </>:<><h3>{agent==='knowledge'?'Reply draft':'Feature announcements'}</h3>
    <p>{agent==='grammarly'?<>{phrase(0)} preparing for {phrase(1)} fall launch. Starting October 28, customers will {phrase(2)} new tools to turn ideas into action.</>:<>{phrase(0)}: the launch draft is ready. Take a look {phrase(1)}. {phrase(2)}!</>}</p></>}
  </article>
  <section className="writing-preview-suggestion" aria-label={`${example.name} inline suggestion`}>
   {issue?<><header><span>{example.name}</span><span>{accepted.length+1} of {example.issues.length}</span></header><h3>{issue.label}</h3><p className="writing-preview-replacement"><del>{issue.before}</del><span> → </span><strong>{issue.after}</strong></p><p className="writing-preview-note">{issue.source||issue.note}</p><Button size="small" text="Accept suggestion" onClick={accept}/></>:<div className="writing-preview-complete" role="status"><CheckIcon/><p>PRD strengthened with {example.issues.length} inline suggestions</p><button onClick={()=>{setAccepted([]);setActive(0)}}>Try again</button></div>}
  </section>
 </div>;
}

function EmailAssistantPreview(){
 const [opened,setOpened]=useState(false);
 return <div className="writing-agent-preview">
  <article className="writing-preview-doc" aria-label="Example email inbox">
   <header><img src="assets/agent-carousel/preview-gmail.svg" alt="Gmail"/><span>Your inbox</span><small>Example</small></header>
   <h3>{opened?'Reply to Laura Shea':'Stay on top of your email'}</h3>
   {opened?<><p>Hi Laura,</p><p>Thanks for sending the proposal. I’ll review it with the team and get back to you by Friday.</p><p>Best,<br/>Maya</p></>:<><p><strong>Respond · Laura Shea</strong><br/>Can you review the proposal by Friday?</p><p><strong>Waiting · Chris Wu</strong><br/>Enterprise contract feedback</p><p><strong>FYI · Riley Chen</strong><br/>Updates to the launch plan</p></>}
  </article>
  <section className="writing-preview-suggestion" aria-label="Email Assistant preview">
   <header><span>Email Assistant</span></header>
   <h3>{opened?'A reply ready for your review':'Focus on what matters'}</h3>
   <p className="writing-preview-note">{opened?'Review and edit your draft before sending.':'Automatically labels your email, drafts replies, and archives low-priority messages without deleting them.'}</p>
   <Button size="small" text={opened?'Back to inbox':'Preview reply draft'} onClick={()=>setOpened(!opened)}/>
  </section>
 </div>;
}
export default function WritingAgentPreview({agent}){
 return agent==='email'?<EmailAssistantPreview/>:<WritingSuggestions agent={agent}/>;
}
