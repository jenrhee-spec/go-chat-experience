import React,{useEffect,useRef,useState} from 'react';
import {Button,ButtonAsLink,IconButton,ArrowUpIcon,PlusIcon,SidebarLeftIcon,InfoIcon,Logo,LogoGrammarlyMarkColorPrimaryIcon} from '@superhuman/origin';
import HeroPicker from './HeroPicker';
import AgentSpotlightQuestionnaire from './AgentSpotlightQuestionnaire';
import './post-agents.css';
import './in-product.css';
import './recommendation-stress-chat.css';

// Review-only content. The email previews and linked report template read no account data.
const extensionUrl='https://chromewebstore.google.com/detail/superhuman-go-ai-assistan/fiicfmbdhpbnebmbofpphmalhgofdakc';
const autoArchiveSettingsUrl='https://superhuman.com/mail/settings/archive';
const listNames=names=>names.length<2?names.join(''):names.length===2?names.join(' and '):`${names.slice(0,-1).join(', ')}, and ${names.at(-1)}`;
const agents={
 'Email Assistant':{mode:'direct',priority:100,description:'Drafts replies and helps handle inbox actions.',where:'It shows up in your inbox.'},
 'Report Builder':{mode:'direct',priority:90,description:'Turns your notes and context into a structured report.',where:'You can work with it here in Go.'},
 'Reader Reactions':{mode:'assist',description:'Shows questions readers may have about your draft.',where:'Open it from the side panel while you write.',title:'Two questions a reader may have',detail:'Example proposal · Audience: project team',body:'What changes for customers? · Who owns the next decision?',action:'Review example questions'},
 'Grammarly':{mode:'assist',description:'Catches writing issues and suggests edits.',where:'Look for underlines wherever you write.',title:'An inline suggestion',detail:'Example document · “Our team are ready”',body:'Underlined: “are” → Suggested: “is” · Subject–verb agreement',action:'Review example suggestion'},
 'AI Detector':{mode:'assist',description:'Flags passages to review before submission.',where:'It works wherever you write.',title:'Passages to review',detail:'Example paper excerpt · Interpret with care',body:'This passage uses repeated, general phrasing. Review it for clarity and make sure it reflects your own work. A detection result cannot prove authorship.',action:'Review example passage'},
 'Plagiarism Checker':{mode:'assist',description:'Checks a draft for possible source matches.',where:'It works wherever you write.',title:'Possible source match',detail:'Example draft · Limited source coverage',body:'A sentence resembles a published source. Compare the passage, check the citation, and revise if needed.',action:'Review example match'},
 'Humanizer':{mode:'assist',description:'Rewrites a passage in a more natural voice.',where:'Open it from the side panel while you write.',title:'A more natural version',detail:'Example paragraph',body:'Before: “I am writing to inform you that the work has been completed.”\nAfter: “Quick update: the work is done.”',action:'Review example rewrite'},
 'AI Rewriter':{mode:'assist',description:'Reworks text for a purpose or tone you choose.',where:'Open it from the side panel while you write.',title:'Two ways to say it',detail:'Example update',body:'Direct: “The plan is ready for review.”\nWarmer: “The plan is ready—take a look when you have a moment.”',action:'Review example rewrites'}
};
const roleWork={
 Product:'product work',Design:'design work',Sales:'sales work',Finance:'finance work',
 Engineering:'engineering work',Marketing:'marketing work','People & HR':'people and HR work',
 Operations:'operations work',Student:'coursework'
};
const goIntroduction=knownRole=>roleWork[knownRole]
 ?`I use what I know about how you work and the tools you use to help with your ${roleWork[knownRole]}. I bring in other agents when they’re useful, and I keep learning as we work together.`
 :'I get to know how you work and the tools you use, so I can help with your work and bring in other agents when they’re useful.';

export const chatScenarios={
 email:{label:'Inbox · Email Assistant',lineup:['Email Assistant','Reader Reactions','Grammarly']},
 writing:{label:'Reader Reactions · Report Builder',lineup:['Reader Reactions','Report Builder','Grammarly']},
 student:{label:'AI Detector · Report Builder',lineup:['AI Detector','Report Builder','Grammarly']},
 career:{label:'AI Rewriter · Email Assistant',lineup:['AI Rewriter','Email Assistant','Grammarly']},
 knowledge:{label:'Plagiarism Checker · Report Builder',lineup:['Plagiarism Checker','Report Builder','Grammarly']},
 assistOnly:{label:'Humanizer · Email Assistant',lineup:['Humanizer','Email Assistant','Grammarly']}
};

export function chooseSpotlight(lineup){
 return lineup.filter(name=>agents[name]?.mode==='direct').sort((a,b)=>(agents[b].priority||0)-(agents[a].priority||0))[0]||null;
}

function AgentIcon({name}){
 if(name==='Grammarly')return <Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={20} accessibilityLabel=""/>;
 if(name==='Email Assistant')return <img src="assets/agent-carousel/custom-letter.svg" width="20" height="20" alt=""/>;
 return <img src="assets/agent-finish/workspace-imgCustomRobot.svg" width="20" height="20" alt=""/>;
}

function revealChatContent(target){
 const container=target?.closest('.pa-conversation');
 if(!container||!container.clientHeight)return;
 const bounds=container.getBoundingClientRect(),scale=bounds.height/container.clientHeight;
 const bottom=(target.getBoundingClientRect().bottom-bounds.top)/scale+container.scrollTop;
 container.scrollTo({top:Math.max(0,bottom-container.clientHeight+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

function TypedGoLine({text,onComplete,as:Element='p',className='pa-setup-response',prefix=''}){
 const [count,setCount]=useState(0);
 const [complete,setComplete]=useState(false);
 const callback=useRef(onComplete);
 const root=useRef(null);
 callback.current=onComplete;
 useEffect(()=>{
  setCount(0);
  setComplete(false);
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let timer,cursor=0;
  const finish=()=>{clearTimeout(timer);setCount(text.length);setComplete(true);callback.current?.()};
  const tick=()=>{
   cursor++;setCount(cursor);
   if(cursor>=text.length){timer=setTimeout(finish,423);return}
   const character=text[cursor-1];
   timer=setTimeout(tick,/[.!?]/.test(character)?200:/[,;:]/.test(character)?100:22);
  };
  if(media.matches)finish();else timer=setTimeout(tick,500);
  const changed=()=>{if(media.matches)finish()};
  media.addEventListener('change',changed);
  return()=>{clearTimeout(timer);media.removeEventListener('change',changed)};
 },[text]);
 useEffect(()=>{if(complete)revealChatContent(root.current)},[complete,text]);
 return <Element ref={root} className={className} aria-label={text}><span aria-hidden="true">{prefix?<><strong>{text.slice(0,Math.min(count,prefix.length))}</strong>{text.slice(prefix.length,count)}</>:text.slice(0,count)}{!complete&&<span className="pa-stress-typing-caret"/>}</span></Element>;
}

export default function RecommendationStressChat({account='Maya Jones',scenarioId='email',knownRole=null}){
 const scenario=chatScenarios[scenarioId]||chatScenarios.email;
 const spotlight=chooseSpotlight(scenario.lineup);
 const directAgents=scenario.lineup.filter(name=>agents[name].mode==='direct');
 const assistAgents=scenario.lineup.filter(name=>agents[name].mode==='assist');
 const assistNames=listNames(assistAgents);
 const firstName=account.trim().split(/\s+/)[0]||'there';
 const [stage,setStage]=useState('customize');
 const [choice,setChoice]=useState({heroName:'Go',color:0,texture:null});
 const [draft,setDraft]=useState(choice);
 const [pickerOpen,setPickerOpen]=useState(false);
 const [customized,setCustomized]=useState(false);
 const [selected,setSelected]=useState(spotlight);
 const [firstAgentTurn,setFirstAgentTurn]=useState(true);
 const [acted,setActed]=useState(false);
 const [sidebar,setSidebar]=useState(true);
 const [prompt,setPrompt]=useState('');
 const [notice,setNotice]=useState('');
 const [extensionSkipped,setExtensionSkipped]=useState(false);
 const [spotlightAnswers,setSpotlightAnswers]=useState(null);
 const [introReveal,setIntroReveal]=useState(0);
 const [reveal,setReveal]=useState(0);
 const dialog=useRef(null);
 const conversation=useRef(null);
 useEffect(()=>{if(pickerOpen)dialog.current?.showModal();else if(dialog.current?.open)dialog.current.close()},[pickerOpen]);
 useEffect(()=>{conversation.current?.scrollTo({top:conversation.current.scrollHeight,behavior:'instant'})},[stage,selected,acted,spotlightAnswers]);
 const beginSpotlight=(name=spotlight,first=false)=>{if(!name||agents[name].mode!=='direct'){setStage('extension');return}setSelected(name);setFirstAgentTurn(first);setActed(false);setSpotlightAnswers(null);setReveal(first?0:5);setStage('spotlight')};
 const handleNameSave=value=>{setChoice(value);setCustomized(true);setPickerOpen(false);beginSpotlight(spotlight,true)};
 const reportKinds={weekly:'Weekly update',project:'Project status report',research:'Research summary',client:'Client report'};
 const reportFocus={progress:'Progress and blockers',decisions:'Decisions and next steps',metrics:'Metrics and outcomes',takeaways:'Key takeaways'};
 const reportKind=spotlightAnswers?(reportKinds[spotlightAnswers.choices[0]?.[0]]||'Your report'):'';
 const reportEmphasis=spotlightAnswers?(reportFocus[spotlightAnswers.choices[1]?.[0]]||'Key points'):'';
 const reportTitles={weekly:'Weekly Update Template',project:'Project Status Report Template',research:'Research Summary Template',client:'Client Report Template'};
 const reportTitle=reportTitles[spotlightAnswers?.choices[0]?.[0]]||'Report Template';
 const reportHref=`report-template.html?type=${encodeURIComponent(spotlightAnswers?.choices[0]?.[0]||'general')}&focus=${encodeURIComponent(spotlightAnswers?.choices[1]?.[0]||'general')}`;
 const emailSpotlight=selected==='Email Assistant';
 const extensionStart=emailSpotlight?9:7;
 const bridgeMessage=emailSpotlight?`That’s what to look for in your inbox. ${assistNames} can help where you write.`:'That’s a starting template for the report you want to build.';
 const extensionMessage=assistAgents.length?(emailSpotlight?'Add the Go extension to see them and other agents at work.':`${assistNames} can help where you write. Add the Go extension to see them and other agents at work.`):'Add the Go extension to bring Go into the apps you use.';
 return <section className="post-agents pa-stress-chat" data-scenario={scenarioId} data-stage={stage}>
  <div className="pa-workspace">
   <aside className="pa-sidebar" hidden={!sidebar}>
    <header><span>Go</span><IconButton className="pa-compose" icon={PlusIcon} accessibilityLabel="Create a new task" variant="tertiary" size="small" onClick={()=>setNotice('This review mode focuses on the first chat.')}/></header>
    <nav aria-label="Go navigation">
     <button className={stage!=='spotlight'?'pa-current':''} onClick={()=>setStage(spotlight?'spotlight':'extension')}><img src="shared/go-logo.svg" width="20" height="20" alt=""/><span>{choice.heroName||'Go'}</span></button>
     <h2>Agents</h2>
     {scenario.lineup.map(name=><button key={name} className={stage==='spotlight'&&selected===name?'pa-current':''} aria-current={stage==='spotlight'&&selected===name?'page':undefined} onClick={()=>beginSpotlight(name)}><AgentIcon name={name}/><span>{name}</span></button>)}
     <h2>Tasks</h2><button onClick={()=>setStage(spotlight?'spotlight':'extension')}>Get started</button>
    </nav>
    <footer><span className="pa-avatar">{account.split(' ').map(part=>part[0]).join('').slice(0,2)}</span><span>{account}<small>Prototype</small></span></footer>
   </aside>
   <main className="pa-main">
    <header><IconButton icon={SidebarLeftIcon} accessibilityLabel="Toggle sidebar" variant="tertiary" size="small" onClick={()=>setSidebar(value=>!value)}/><span>{stage==='spotlight'?selected:'Get started'}</span><IconButton icon={InfoIcon} accessibilityLabel="Task information" variant="tertiary" size="small" onClick={()=>setNotice('Review scenario: all agent results are examples.')}/></header>
    <div className="pa-conversation" ref={conversation}>
     <div className="pa-stress-turn"><TypedGoLine as="h1" className="pa-home-greeting" text={`Hi ${firstName}, I’m Go, your main assistant for work.`} onComplete={()=>setIntroReveal(value=>Math.max(value,1))}/>{introReveal>=1&&<TypedGoLine text={goIntroduction(knownRole)} onComplete={()=>setIntroReveal(value=>Math.max(value,2))}/>}</div>
     {introReveal>=2&&<div className="pa-stress-turn"><TypedGoLine text="First, what would you like to call me?" onComplete={()=>setIntroReveal(value=>Math.max(value,3))}/>{introReveal>=3&&(stage==='customize'?<div className="pa-stress-actions"><Button text="Customize Go" variant="secondary" size="small" onClick={()=>{setDraft(choice);setPickerOpen(true)}}/><Button text="Not now" variant="tertiary" size="small" onClick={()=>beginSpotlight(spotlight,true)}/></div>:<TypedGoLine text={customized?`Perfect, ${choice.heroName||'Go'} it is. I’ll go by ${choice.heroName||'Go'} from here on.`:'I’ll stay Go for now. You can customize me anytime.'} onComplete={()=>setReveal(value=>Math.max(value,1))}/>)}</div>}
     {stage!=='customize'&&reveal>=1&&<div className="pa-stress-turn"><TypedGoLine text="Here’s a quick recap of the agents we recommended for you:" onComplete={()=>setReveal(value=>Math.max(value,2))}/>{reveal>=2&&<ul className="pa-stress-lineup">{scenario.lineup.map((name,index)=>reveal>=index+2&&<TypedGoLine key={name} as="li" className="pa-stress-agent-bullet" prefix={name} text={`${name} — ${agents[name].description} ${agents[name].where}`} onComplete={()=>setReveal(value=>Math.max(value,index+3))}/>)}</ul>}</div>}
     {stage==='spotlight'&&reveal>=5&&<div className="pa-stress-turn">
      <TypedGoLine text={firstAgentTurn?`Now, let’s take a look at your first agent: ${selected}.`:`Let’s take a look at ${selected}.`} onComplete={()=>setReveal(value=>Math.max(value,6))}/>
      {reveal>=6&&(emailSpotlight?<>
       <TypedGoLine text="Email Assistant adds labels to incoming messages, so you’ll see what needs a reply, what’s FYI, and what you’re waiting on." onComplete={()=>setReveal(value=>Math.max(value,7))}/>
       {reveal>=7&&<TypedGoLine text="It also prepares replies in your voice as drafts. You can review, edit, and send them when you’re ready." onComplete={()=>setReveal(value=>Math.max(value,8))}/>}
       {reveal>=8&&<TypedGoLine text="Want to auto-archive lower-priority mail? You can turn that on in your settings." onComplete={()=>setReveal(value=>Math.max(value,9))}/>}
       {reveal>=9&&<p className="pa-stress-settings-link"><a href={autoArchiveSettingsUrl} target="_blank" rel="noopener noreferrer">Open Auto Archive settings</a></p>}
      </>:!spotlightAnswers?<AgentSpotlightQuestionnaire key={selected} agent={selected} onComplete={answers=>{setSpotlightAnswers(answers);setReveal(7)}}/>:<>
       <p className="pa-stress-created">Created your <a href={reportHref} target="_blank" rel="noopener noreferrer" onClick={()=>setActed(true)}>{reportTitle}</a> with fill-in prompts for {reportEmphasis.toLowerCase()}, context, and next steps.</p>
       {directAgents.length>1&&<div className="pa-stress-actions pa-stress-next-agent"><Button text="Try another agent" variant="tertiary" size="small" onClick={()=>{const next=directAgents[(directAgents.indexOf(selected)+1)%directAgents.length];beginSpotlight(next)}}/></div>}
       {acted&&<p className="pa-stress-confirm" role="status">This review shows an example; no account action was taken.</p>}
      </>)}
     </div>}
     {((stage==='spotlight'&&reveal>=extensionStart&&(emailSpotlight||!!spotlightAnswers))||stage==='extension')&&<div className="pa-stress-turn pa-stress-extension">{stage==='extension'?<p className="pa-setup-response">{assistAgents.length?`Add the Go extension to see ${assistNames} at work in your apps.`:'Add the Go extension to bring Go into the apps you use.'}</p>:<><TypedGoLine text={bridgeMessage} onComplete={()=>setReveal(value=>Math.max(value,extensionStart+1))}/>{reveal>=extensionStart+1&&<TypedGoLine text={extensionMessage} onComplete={()=>setReveal(value=>Math.max(value,extensionStart+2))}/>}</>}{(stage==='extension'||reveal>=extensionStart+2)&&<div className="pa-stress-actions"><ButtonAsLink text="Add extension" variant="primary" size="small" href={extensionUrl} target="_blank"/>{!extensionSkipped&&<Button text="Not now" variant="tertiary" size="small" onClick={()=>setExtensionSkipped(true)}/>}</div>}{extensionSkipped&&<p className="pa-stress-confirm" role="status">You can add the extension later.</p>}</div>}
    </div>
    <form className="pa-composer" onSubmit={event=>{event.preventDefault();if(prompt.trim()){setNotice('Freeform chat is outside this review scenario.');setPrompt('')}}}><IconButton icon={PlusIcon} variant="tertiary" size="small" accessibilityLabel="Add attachment" onClick={()=>setNotice('Attachments are outside this review scenario.')}/><input aria-label="Ask Go" placeholder="Ask Go" value={prompt} onChange={event=>setPrompt(event.target.value)}/><IconButton icon={ArrowUpIcon} accessibilityLabel="Send message" size="small" type="submit" isDisabled={!prompt.trim()}/></form>
    {notice&&<button className="pa-notice" role="status" onClick={()=>setNotice('')}>{notice}</button>}
   </main>
  </div>
  <dialog ref={dialog} className="hero-customize-dialog" aria-label="Customize Go" onCancel={event=>{event.preventDefault();setPickerOpen(false)}} onClick={event=>{if(event.target===event.currentTarget)setPickerOpen(false)}}><HeroPicker draft={draft} setDraft={setDraft} onClose={()=>setPickerOpen(false)} onSave={handleNameSave} subject="Go"/></dialog>
 </section>;
}
