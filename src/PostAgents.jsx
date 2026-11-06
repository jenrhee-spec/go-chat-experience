import EmailAssistantSetup from './EmailAssistantSetup';
import HeroPicker,{HeroAvatar} from './HeroPicker';
import {HeroMark,heroPalettes} from './Personalize';
import React,{useEffect,useRef,useState} from 'react';
import {SmileyIcon,Button,IconButton,Checkbox,TextField,Flex,Logo,LogoGrammarlyMarkColorPrimaryIcon,ArrowUpIcon,PlusIcon,PencilSquircleIcon,SidebarLeftIcon,InfoIcon,SidebarRightIcon,CheckIcon,LogoSuperhumanMarkColorPrimaryIcon} from '@superhuman/origin';
import WritingAgentPreview from './WritingAgentPreview';
import EmailArtifact from './EmailArtifact';
import ExtensionArtifact from './ExtensionArtifact';
import './post-agents.css';
import './starter-setup.css';
import './in-product.css';
const A=({name,...props})=><img src={`assets/agent-finish/workspace-img${name}.svg`} alt="" {...props}/>;
const agents=['Email Assistant','Write Like Me','PRD Writer','Grammarly'];
const descriptions={
 'Write Like Me':'Learns your writing style to help drafts sound like you.',
 'Email Assistant':'Draft replies in your voice and keep the rest in a daily digest.',
 'PRD Writer':'PRD Writer keeps your writing aligned with your PRDs by flagging conflicting details as you write.',
 'Grammarly':'Grammarly keeps your writing error-free and polished.'
};
const AgentIcon=({name})=>name==='Grammarly'?<Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={20} accessibilityLabel=""/>:name==='Email Assistant'?<img src="assets/agent-carousel/custom-letter.svg" alt=""/>:<A name="CustomRobot"/>;
function revealChatContent(target){
 const container=target?.closest('.pa-conversation');
 if(!container||!container.clientHeight)return;
 const bounds=container.getBoundingClientRect(),scale=bounds.height/container.clientHeight;
 const bottom=(target.getBoundingClientRect().bottom-bounds.top)/scale+container.scrollTop;
 container.scrollTo({top:Math.max(0,bottom-container.clientHeight+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function SetupChatTurn({text,children,onReady,heading=false,leadingIcon}){
 const [count,setCount]=useState(0),[complete,setComplete]=useState(false);
 const root=useRef(null),callback=useRef(onReady);callback.current=onReady;
 useEffect(()=>{
  setCount(0);setComplete(false);
  const media=matchMedia('(prefers-reduced-motion: reduce)');let timer;
  let cursor=0;
  const finish=()=>{clearTimeout(timer);setCount(text.length);setComplete(true);callback.current?.()};
  const tick=()=>{
   cursor++;setCount(cursor);
   if(cursor>=text.length){timer=setTimeout(finish,423);return;}
   const character=text[cursor-1];
   timer=setTimeout(tick,/[.!?]/.test(character)?200:/[,;:]/.test(character)?100:22);
  };
  if(media.matches)finish();else timer=setTimeout(tick,500);
  const changed=()=>{if(media.matches)finish()};media.addEventListener('change',changed);
  return()=>{clearTimeout(timer);media.removeEventListener('change',changed)};
 },[text]);
 useEffect(()=>{if(complete)revealChatContent(root.current?.lastElementChild)},[complete,text]);
 const Text=heading?'h1':'p';
 return <section className="pa-setup-chat-turn" ref={root} data-speaking={!complete}><Text className={heading?'pa-home-greeting':'pa-setup-response'} aria-label={text}>{leadingIcon}<span aria-hidden="true">{text.slice(0,count)}{!complete&&<span className="pa-chat-caret"/>}</span></Text>{complete&&children}</section>
}

function UseAnywhere(){
 return <ExtensionArtifact/>;
}
function GoSurfaces(){
 return <ul className="pa-writing-style-list" aria-label="Where Go works">
  <li>In your documents and email: select text for help.</li>
  <li>Beside your work: open Go to chat without switching apps.</li>
  <li>As you write: get suggestions from your agents.</li>
 </ul>;
}
function GoIntro({heroName,heroChoice,afterCustomization=false,account,emailChoice,setEmailChoice,emailConfiguration,setEmailConfiguration}){
 const firstName=account.trim().split(/\s+/)[0]||'there';
 return <div className="pa-home-guide pa-go-intro">
  <SetupChatTurn heading text={afterCustomization?`${heroName} it is. Let’s get started, ${firstName}.`:`Hi ${firstName}, I’m ${heroName}.`}>
   <SetupChatTurn text="I bring your context and agents together to help you get work done, everywhere you work.">
    <SetupChatTurn text="Here’s where to expect me and your agents:">
     <GoSurfaces heroChoice={heroChoice}/>
     <SetupChatTurn text="Your starting agent lineup is Email Assistant, PRD Writer, and Grammarly.">
   <SetupChatTurn text="Here’s a sample reply Email Assistant can prepare in your voice. You can review and edit it before sending.">
    <EmailArtifact/>
    <SetupChatTurn text="How would you like Email Assistant to help with your inbox?">
     <EmailAssistantSetup configuration={emailConfiguration} setConfiguration={setEmailConfiguration} choice={emailChoice} onEnable={()=>setEmailChoice('enabled')} onDismiss={()=>setEmailChoice('later')}/>
     {emailChoice&&<SetupChatTurn text={emailChoice==='enabled'?'Your preferences are saved. Add the extension to use your agents wherever you work.':'You can set up Email Assistant later. Add the extension to use your other agents wherever you work.'}><UseAnywhere/></SetupChatTurn>}
    </SetupChatTurn>
   </SetupChatTurn>
     </SetupChatTurn>
    </SetupChatTurn>
   </SetupChatTurn>
  </SetupChatTurn>
 </div>;
}
function WritingStyleProfile({heroChoice}){
 const [editing,setEditing]=useState(false),[saved,setSaved]=useState(false);
 const [traits,setTraits]=useState(['You get to the point quickly, with short sentences and a clear next step.','Your tone is warm and conversational, with casual phrasing rather than formal language.','You make messages easy to scan with short paragraphs, bullets, and links for context.']);
 const [draft,setDraft]=useState(traits);
 return <SetupChatTurn text="Write Like Me uses the writing style we reviewed during setup.">
  <SetupChatTurn text="Here’s a quick reminder:">
   {editing?<div className="pa-writing-style-edit">{draft.map((trait,index)=><TextField key={index} label={`Writing preference ${index+1}`} value={trait} onChange={value=>setDraft(current=>current.map((item,i)=>i===index?value:item))}/>)}<Flex gap={2}><Button text="Save changes" size="small" isDisabled={draft.some(item=>!item.trim())} onClick={()=>{setTraits(draft.map(item=>item.trim()));setEditing(false);setSaved(true)}}/><Button text="Cancel" size="small" variant="tertiary" onClick={()=>setEditing(false)}/></Flex></div>:<ul className="pa-writing-style-list">{traits.map((trait,index)=><li key={index}>{trait}</li>)}</ul>}
   {!editing&&!saved&&<SetupChatTurn text="Still sound like you?">
    <Flex gap={2}><Button text="Looks right" size="small" onClick={()=>setSaved(true)}/><Button text="Adjust writing style" size="small" variant="secondary" onClick={()=>{setDraft(traits);setEditing(true)}}/></Flex>
   </SetupChatTurn>}
   {saved&&!editing&&<SetupChatTurn text="All set. Write Like Me will keep using this style to help your drafts sound like you."><ChatEverywhere heroChoice={heroChoice}/></SetupChatTurn>}
  </SetupChatTurn>
 </SetupChatTurn>;
}
function WriteLikeMeSetup({heroChoice}){
 return <SetupChatTurn text="Next, a quick check of your writing style for Write Like Me.">
  <WritingStyleProfile heroChoice={heroChoice}/>
 </SetupChatTurn>;
}
function ChatEverywhere({heroChoice}){
 return <section className="pa-everywhere-followup">
  <SetupChatTurn text="I’m here beyond this chat, too. Get help right in your documents, email, and the other apps you use.">
   <GoSurfaces/>
   <SetupChatTurn text="Add the Chrome extension to bring your agents into the apps you use.">
    <ExtensionArtifact expandable/>
    <SetupChatTurn text="You can always chat with me here in the app about whatever you’re working on, too."/>
   </SetupChatTurn>
  </SetupChatTurn>
 </section>;
}
function ChatNextSteps({heroName,heroChoice,personalized,onConfirmed,emailChoice,setEmailChoice,emailConfiguration,setEmailConfiguration}){
 const [confirmed,setConfirmed]=useState(false),[showAgent,setShowAgent]=useState(!personalized);
 useEffect(()=>{if(!confirmed)return;const timer=setTimeout(()=>setShowAgent(true),800);return()=>clearTimeout(timer)},[confirmed]);
 const agentIntro=<SetupChatTurn text="Here’s a sample reply Email Assistant can prepare in your voice. You can review and edit it before sending.">
  <EmailArtifact/>
  <SetupChatTurn text="How would you like Email Assistant to help with your inbox? Let’s start with what you’d like to auto-archive.">
   <EmailAssistantSetup twoStep configuration={emailConfiguration} setConfiguration={setEmailConfiguration} choice={emailChoice} onEnable={()=>setEmailChoice('enabled')} onDismiss={()=>setEmailChoice('later')}/>
   {emailChoice&&<SetupChatTurn text={emailChoice==='enabled'?'Your email preferences are saved. Let’s check in on Write Like Me next.':'No problem. You can set up Email Assistant later. Let’s check in on Write Like Me next.'}><WriteLikeMeSetup heroChoice={heroChoice}/></SetupChatTurn>}
  </SetupChatTurn>
 </SetupChatTurn>;
 return <div className="pa-home-guide pa-go-intro pa-chat-customize pa-next-steps">
  {personalized?<SetupChatTurn text={`${heroName} it is`} onReady={()=>{onConfirmed?.();setConfirmed(true)}}>{showAgent&&agentIntro}</SetupChatTurn>:agentIntro}
 </div>;
}
function ChatCustomize({stage,heroName,choice,setChoice,onDone,account}){
 const [open,setOpen]=useState(false),[draft,setDraft]=useState(choice);
 const trigger=useRef(null),dialog=useRef(null);
 const close=()=>{setOpen(false);trigger.current?.focus()};
 useEffect(()=>{if(open)dialog.current?.showModal();else if(dialog.current?.open)dialog.current.close()},[open]);
 const launch=()=>{setDraft({...choice,heroName:choice.heroName?.trim()||'Hero'});setOpen(true)};
 return <div className="pa-home-guide pa-go-intro pa-chat-customize">
  <SetupChatTurn heading text={`Hi ${account.trim().split(/\s+/)[0]}, I’m Go, your personal AI assistant.`}>
   <SetupChatTurn text="I bring your context and agents together to help you write, think, and get work done across your apps. The more we work together, the more tailored my help becomes.">
    <SetupChatTurn text="First, what would you like to call me?">
     <div className="pa-personalize-actions">
     <Button ref={trigger} className="pa-personalize-hero" size="small" variant="secondary" onClick={launch}>
      <SmileyIcon className="pa-personalize-smiley" width={20} height={20} aria-hidden="true"/>
      <span>Personalize Hero</span>
     </Button>
     {stage==='pending'&&<Button size="small" variant="tertiary" text="Not now" onClick={()=>onDone(false)}/>}
     </div>
    </SetupChatTurn>
   </SetupChatTurn>
  </SetupChatTurn>
  <dialog ref={dialog} className="hero-customize-dialog" aria-label="Customize Hero" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   <HeroPicker draft={draft} setDraft={setDraft} onClose={close} onSave={value=>{setChoice(value);close();onDone(true)}}/>
  </dialog>
 </div>
}
export default function PostAgents({agentsArrived=true,account='Maya Jones',customizeInChat=true,heroChoice:providedHeroChoice,setHeroChoice:providedSetHeroChoice}){
 const [localHeroChoice,setLocalHeroChoice]=useState({persona:3,color:0,heroName:'Hero'});
 const heroChoice=providedHeroChoice??localHeroChoice;
 const setHeroChoice=providedSetHeroChoice??setLocalHeroChoice;
 const [customizeStage,setCustomizeStage]=useState(customizeInChat?'pending':'done');
 const [navChoice,setNavChoice]=useState(customizeInChat?null:heroChoice);
 const customized=customizeStage!=='pending';
 const heroName=customized?(heroChoice.heroName?.trim()||'Hero'):'Hero';
 const [chosen,setChosen]=useState(null),[prompt,setPrompt]=useState(''),[sidebar,setSidebar]=useState(true),[message,setMessage]=useState(''),[restart,setRestart]=useState(0);
 const input=useRef(null);
 const [emailChoice,setEmailChoice]=useState(null),[emailConfiguration,setEmailConfiguration]=useState({draftReplies:true,dailyDigest:true});
 const emailSetupProps={configuration:emailConfiguration,setConfiguration:setEmailConfiguration,choice:emailChoice,onEnable:()=>setEmailChoice('enabled'),onDismiss:()=>setEmailChoice('later')};
 const start=()=>setChosen(null);
 return <section className="post-agents"><Flex className="pa-workspace"><aside className="pa-sidebar" hidden={!sidebar}>
  <Flex as="header" align="center" gap={2}><span>Go</span><IconButton icon={PencilSquircleIcon} accessibilityLabel="Create a new task" className="pa-compose" variant="tertiary" size="small" onClick={()=>input.current?.focus()}/></Flex>
  <nav aria-label="Go navigation"><Button variant="tertiary" className={"pa-hero-nav "+(!chosen?"pa-current":"")} aria-current={!chosen?"page":undefined} onClick={()=>setChosen(null)} data-go-target="true"><span key={JSON.stringify(navChoice)} className={"pa-nav-hero-icon"+(navChoice?" pa-nav-hero-updated":"")}>{navChoice?<HeroAvatar choice={navChoice}/>:<img src="shared/go-logo.svg" width="24" height="24" alt=""/>}</span><span>{navChoice?(navChoice.heroName?.trim()||heroName):'Hero'}</span></Button><h2>Agents</h2>{agents.map(name=><Button key={name} variant="tertiary" className={chosen===name?'pa-current':''} aria-current={chosen===name?'page':undefined} data-agent-target={name} onClick={()=>setChosen(name)}><AgentIcon name={name}/><span>{name}</span></Button>)}<Button className="pa-see-more" variant="tertiary" text="See more" onClick={()=>setMessage('Your recommended agents are shown above.')}/><h2>Tasks</h2><Button className={!chosen?'pa-current':''} variant="tertiary" text={'Get started'} aria-current={!chosen?'page':undefined} onClick={start}/><Button className="pa-muted" variant="tertiary" iconStart={PlusIcon} text="Create a new task" onClick={()=>input.current?.focus()}/><Button className="pa-connectors pa-muted" variant="tertiary" onClick={()=>setMessage('Manage your connected Google accounts and other tools from Connect your tools in the prototype menu.')}><A name="Connectors"/><span>Connectors</span></Button></nav>
  <Flex as="footer" align="center" gap={2}><span className="pa-avatar">{account.split(' ').map(n=>n[0]).join('').slice(0,2)}</span><span>{account}<small>Pro</small></span></Flex>
 </aside><Flex as="main" direction="column" align="center" className="pa-main"><Flex as="header" align="center" gap={2}><IconButton icon={SidebarLeftIcon} accessibilityLabel="Toggle sidebar" variant="tertiary" size="small" onClick={()=>setSidebar(s=>!s)}/><span>{chosen||'Get started'}</span><IconButton icon={InfoIcon} accessibilityLabel="Task information" variant="tertiary" size="small" onClick={()=>setMessage('See how I can help with your agents, then try a reply in your voice.')}/></Flex>
 <div className="pa-conversation">{chosen?<div className="pa-home-guide pa-home-agent"><h2>{chosen}</h2><p>{descriptions[chosen]}</p>{chosen==='Email Assistant'?<EmailAssistantSetup twoStep={customizeInChat} {...emailSetupProps}/>:<WritingAgentPreview key={chosen} agent={chosen==='PRD Writer'?'product':chosen==='Write Like Me'?'knowledge':'grammarly'}/>}<Button text="Back to getting started" variant="tertiary" onClick={()=>setChosen(null)}/></div>:null}<div hidden={!!chosen}>{agentsArrived&&<>{customizeInChat&&<ChatCustomize account={account} stage={customizeStage} heroName={heroName} choice={heroChoice} setChoice={setHeroChoice} onDone={saved=>setCustomizeStage(saved?'done':'skipped')}/>} {customized&& (customizeInChat?<ChatNextSteps key={restart} heroName={heroName} heroChoice={heroChoice} personalized={customizeStage==='done'} onConfirmed={()=>setNavChoice(heroChoice)} emailChoice={emailChoice} setEmailChoice={setEmailChoice} emailConfiguration={emailConfiguration} setEmailConfiguration={setEmailConfiguration}/>:<GoIntro heroChoice={heroChoice} afterCustomization={customizeInChat} heroName={heroName} key={restart} account={account} emailChoice={emailChoice} setEmailChoice={setEmailChoice} emailConfiguration={emailConfiguration} setEmailConfiguration={setEmailConfiguration}/>)}</>}</div></div>
 <Flex as="form" align="center" gap={2} className="pa-composer" onSubmit={e=>{e.preventDefault();if(prompt.trim()){setMessage('This prototype demonstrates the guided task above. Your message hasn’t been sent.');setPrompt('')}}}><IconButton icon={PlusIcon} variant="tertiary" size="small" accessibilityLabel="Add attachment" onClick={()=>setMessage('You can add context when you start working with your agent.')}/><TextField ref={input} label={`Ask ${heroName}`} labelDisplay="hidden" placeholder={`Ask ${heroName}`} value={prompt} onChange={setPrompt}/><IconButton icon={ArrowUpIcon} accessibilityLabel="Send message" size="small" type="submit" isDisabled={!prompt.trim()}/></Flex>{message&&<button className="pa-notice" role="status" onClick={()=>setMessage('')}>{message}</button>}
 </Flex></Flex></section>
}
