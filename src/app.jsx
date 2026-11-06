import React,{useEffect,useLayoutEffect,useState,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Tag,Button,IconButton,Logo,Icon,LogoSuperhumanMarkColorPrimaryIcon,LogoGrammarlyMarkColorPrimaryIcon,ArrowRightIcon,ArrowLeftIcon,ArrowClockwiseIcon,CaretSmallRightIcon,ArrowUpIcon,GearIcon,AppsNotionIcon,AppsSlackIcon,AppsLinearIcon,AppsGoogleDocsIcon,PencilRulerIcon,ChartLineIcon,DollarSignIcon,CodeIcon,LightbulbIcon,UsersIcon,GraduationCapIcon,DotsThreeHorizontalIcon,PencilRaysIcon,FileArrowsClockwiseIcon,RobotIcon} from '@superhuman/origin';
import '@superhuman/origin/dist/index.css';
import '@superhuman/origin/tokens/superhuman/light.css';
import './styles.css';
import {Personalize,initialPersona,personaFrames,HeroMark,personas} from './Personalize';
import {DesktopIntro,DesktopBackdrop,introSteps,TrafficLights} from './DesktopIntro';
import './onboarding-system.css';
import MemoryProfile,{initialMemory} from './MemoryProfile';
import ConnectorStep from './ConnectorStep';
import AgentDemo from './AgentDemo';
import AgentBridge from './AgentBridge';
import MeetGo from './MeetGo';
import FocusedMeetGo from './FocusedMeetGo';
import HeadlineMeetGo from './HeadlineMeetGo';
import AgentSelection from './AgentSelection';
import PostAgents from './PostAgents';
import RecommendationStressChat,{chatScenarios} from './RecommendationStressChat';
import DraftWindow from './DraftWindow';
import {FigmaMeetAgents,FigmaGoPreview} from './FigmaReplacement';
import GoAnywhere from './GoAnywhere';
import './flow-consistency.css';
import './figma-layout.css';
import GrammarlyEntry from './GrammarlyEntry';

const steps=[['665:72466','Welcome'],['3012:632','Meet Go'],['713:20716','Functions'],['3008:52','Learned profile'],['3015:1349','Meet your agents'],['714:25857','Meet your Go'],['1218:53776','Choose your first agent'],['3012:1096','Connect your tools'],['agent-intro','How agents help'],['1218:58874','Get started with Go'],['1227:64573','Go anywhere'],['3015:1450','PRD Writer preview']];
const screenOrder=[-9,-8,-7,-6,-5,-4,-3,-2,-1,0,7,3,4,11,9,10];
const adjacentStep=(step,direction)=>screenOrder[Math.max(0,Math.min(screenOrder.length-1,screenOrder.indexOf(step)+direction))];
const roles=['Product','Design','Sales','Finance','Engineering','Marketing','People & HR','Student','Other'];
const roleIcons={Design:PencilRulerIcon,Sales:ChartLineIcon,Finance:DollarSignIcon,Engineering:CodeIcon,Product:LightbulbIcon,'People & HR':UsersIcon,Student:GraduationCapIcon,Other:DotsThreeHorizontalIcon};
const art=(name)=>`assets/${name}`;
const Img=({name,size=20,className='',alt=''})=><img src={art(name)} width={size} height={size} className={className} alt={alt}/>;
const Shared=({name,size=20,className=''})=><img src={`shared/${name}.svg`} width={size} height={size} className={className} alt=""/>;
const IB=({icon,label,disabled,...props})=><IconButton isDisabled={disabled} variant="tertiary" size="small" icon={icon} accessibilityLabel={label} {...props}/>;
// Preserve emphasis and layout while revealing copy in reading order.
function Words({children}){
 let index=0;
 const reveal=node=>{
  if(typeof node==='string')return node.split(/(\s+)/).map((word,i)=>/\S/.test(word)?<span className="motion-word" key={i+'-'+word} style={{'--word-delay':`${index++*26}ms`}}>{word}</span>:word);
  if(React.isValidElement(node)&&node.props.children)return React.cloneElement(node,{},React.Children.map(node.props.children,reveal));
  return node;
 };
 return React.Children.map(children,reveal);
}
function Chrome(){return <header className="chrome" aria-hidden="true"><div className="tabs"><Shared name="login-window-buttons" size={94}/><div className="tab"><Logo src={LogoSuperhumanMarkColorPrimaryIcon} width={16} accessibilityLabel=""/><span>Superhuman Go</span><Shared name="login-x" size={8}/></div></div><div className="address-row"><Icon icon={ArrowLeftIcon} accessibilityLabel=""/><Icon icon={ArrowRightIcon} accessibilityLabel=""/><Icon icon={ArrowClockwiseIcon} accessibilityLabel=""/><div className="address"><Shared name="login-lock" size={16}/><span>https://go.superhuman.com</span></div><Shared name="login-user" size={22}/><Shared name="login-dots"/></div></header>}
function Actions({next,back,finish=false,label}){return <div className="actions"><Button size="xlarge" text={label||(finish?'Finish setup':'Continue')} iconEnd={CaretSmallRightIcon} onClick={next}/><Button size="xlarge" variant="tertiary" text="Back" onClick={back}/></div>}
function Welcome({next,account,switchAccount,previewOnly=false}){return <><section className="welcome"><div className="welcome-content"><div className="welcome-logo"><Img name="535-12441-OriginLogoGo.svg" size={92}/></div><h1><Words><span className="welcome-line">Go gets to know you, then gets to work.</span><span className="welcome-line">I’ll show you around.</span></Words></h1><div className="account-actions"><Button size="xlarge" isDisabled={previewOnly} text={`Continue as ${account}`} iconEnd={ArrowRightIcon} onClick={next}/><Button size="xlarge" variant="tertiary" isDisabled={previewOnly} text="Switch accounts" onClick={switchAccount}/></div></div></section></>}
function FirstWelcome({next,account,switchAccount,previewOnly=false}){
 const benefits=[{icon:<Icon icon={PencilRaysIcon} accessibilityLabel=""/>,title:'Best Grammarly yet',copy:'Same Grammarly suggestions with an updated design.'},{icon:<Icon icon={FileArrowsClockwiseIcon} accessibilityLabel=""/>,title:'No lost functionality',copy:'Your docs and settings will be saved and transferred.'},{icon:<Icon icon={RobotIcon} accessibilityLabel=""/>,title:'More AI features',copy:'Get help from specialized AI assistants.'}];
 return <section className="welcome welcome-v2" data-figma-node="3131:27599"><div className="welcome-v2-hero"><div className="welcome-v2-logo"><Img name="535-12441-OriginLogoGo.svg" size={68}/></div><h1><Words>Take your writing<br/>further with Go</Words></h1><p><Words>Go helps you write better at no extra cost. <a className="welcome-v2-learn-more" href="https://superhuman.com/go" target="_blank" rel="noreferrer">Learn more</a></Words></p></div><div className="welcome-v2-benefits">{benefits.map(item=><div className="welcome-v2-benefit" key={item.title}><span className="welcome-v2-icon">{item.icon}</span><div><h2><Words>{item.title}</Words></h2><p><Words>{item.copy}</Words></p></div></div>)}</div><div className="welcome-v2-actions"><Button size="large" isDisabled={previewOnly} text={`Continue as ${account}`} iconEnd={ArrowRightIcon} onClick={next}/><Button size="small" variant="tertiary" text="Switch account" onClick={switchAccount}/></div></section>;
}
function IntroVisual(){return <div className="preview-panel intro-static"><img src={art('intro-meeting-prep.png')} width="515" height="430" alt="Placeholder product UI showing Go preparing for a meeting using Google Drive context."/><p className="intro-preview-label">Placeholder preview</p></div>}

function Intro({next,back}){return <section className="onboarding intro-onboarding"><div className="copy"><h1><Words><strong>Go is the AI that gets to know you.</strong><span className="intro-heading-line">Learns how you work. Meets you in your apps. Understands your context.</span></Words></h1><Actions {...{next,back}} label="Continue"/></div><IntroVisual/></section>}

function Agents({next,back}){
 const [expanded,setExpanded]=useState(0);
 const agents=[
  {name:'Product Assistant',subtitle:'Your all-in-one product buddy',icon:<Img name="593-30044-CustomRobot.svg"/>},
  {name:'Knowledge Checker',subtitle:'Double-check your data in every project update.',icon:<Img name="593-30044-FirstPartyKnowledgeChecker.svg"/>},
  {name:'Grammarly',subtitle:'Keep your product docs clear and confident.',icon:<Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={20} accessibilityLabel=""/>}
 ];
 return <><section className="onboarding toolkit"><div className="copy"><h1><Words><strong>Go is set up for product work.</strong><br/>These agents are the best fit to help you get started.</Words></h1><Actions {...{next,back}} finish/></div><div className="agent-list accordion">{agents.map((agent,i)=>{
  const open=expanded===i;
  return <article className={'agent-card accordion-card '+(open?'expanded':'')} key={agent.name}>
   <h2 className="agent-toggle-heading"><button className="agent-toggle" id={'agent-toggle-'+i} aria-expanded={open} aria-controls={'agent-panel-'+i} onClick={()=>setExpanded(i)}><span className="agent-icon" data-agent-source={agent.name.toLowerCase()}>{agent.icon}</span><span className="agent-label"><span className="agent-name">{agent.name}<span className="agent-caret"><Icon icon={CaretSmallRightIcon} variant="inherit" accessibilityLabel=""/></span></span><span className="agent-subtitle" aria-hidden={open}>{agent.subtitle}</span></span></button></h2>
   <div className="accordion-body" id={'agent-panel-'+i} role="region" aria-labelledby={'agent-toggle-'+i} aria-hidden={!open} inert={!open}><div className="accordion-clip"><div className="agent-details">
   {i===0?<React.Fragment><div className="prd-preview"><Img name="593-30044-Tonal08.png" size={1999} className="tonal"/><div className="document"><p>The system shall support user authentication via OAuth 2.0 to ensure secure access. All data transmissions must be encrypted using TLS 1.3 to protect user privacy. The application will provide a responsive UI compatible with desktop and mobile devices, ensuring accessibility standards are met. Performance requirements include a maximum page load time of 2 seconds under standard network conditions. The backend API must handle at least 10,000 concurrent requests with 99.9% uptime. Error logging and monitoring will be implemented using centralized tools to facilitate rapid issue resolution.</p></div><span className="prompt-bubble">Create a PRD from these sources</span></div><p className="agent-description">Generate PRDs, track action items, and prioritize feedback.</p><div className="tags"><span><Img name="593-30044-Group39988.svg" size={11}/>Jira</span><span><Img name="593-30044-Github.svg" size={13}/>Github</span><span><Icon icon={AppsGoogleDocsIcon} accessibilityLabel=""/>Docs</span></div></React.Fragment>:i===1?<>
    <div className="agent-example knowledge-example"><span className="example-tag">Check your facts</span><div className="example-document"><p>Our launch is scheduled for <mark>October 15</mark>.</p><div className="fact-check"><Img name="593-30044-FirstPartyKnowledgeChecker.svg" size={18}/><span>The latest project brief says <strong>October 22</strong>.</span></div></div></div>
    <p className="agent-description">Catch outdated details and check claims against your connected sources, right where you write.</p><div className="tags"><span><Img name="chat-slack.png" size={13}/>Slack</span><span><Img name="chat-drive.png" size={13}/>Google Drive</span></div>
   </>:<>
    <div className="agent-example grammar-example"><span className="example-tag">A little polish, everywhere</span><div className="example-document"><p>The product updates <del>is</del> <ins>are</ins> ready for review.</p><div className="grammar-note"><Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={18} accessibilityLabel=""/><span>Make every sentence clear and correct.</span></div></div></div>
    <p className="agent-description">Get grammar, spelling, and clarity suggestions as you write, so every document is ready to share.</p><div className="tags"><span>Grammar</span><span>Spelling</span><span>Clarity</span></div>
   </>}
   </div></div></div>
  </article>
 })}</div></section></>
}
function ChatTyping({text,delay=0,onComplete}){
 const [count,setCount]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches?text.length:0);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');let timer;const start=()=>{clearInterval(timer);if(media.matches){setCount(text.length);onComplete?.(true);return}setCount(0);const began=performance.now();timer=setInterval(()=>{const next=Math.min(text.length,Math.max(0,Math.floor((performance.now()-began-delay)/7)));setCount(next);if(next===text.length){clearInterval(timer);onComplete?.(true)}},28)};start();media.addEventListener('change',start);return()=>{clearInterval(timer);media.removeEventListener('change',start)}},[text,delay,onComplete]);
 return <p className="chat-typing" aria-label={text}><span aria-hidden="true">{text.slice(0,count)}<span style={{visibility:'hidden'}}>{text.slice(count)}</span></span></p>
}
function SetupChat({account,expanded,onExpanded,onDialog,choice,arrived}){
 const [connections,setConnections]=useState({}),[progress,setProgress]=useState('review'),[opened,setOpened]=useState(false),[reviewed,setReviewed]=useState(false);
 const [briefReady,setBriefReady]=useState(false),[connectorsReady,setConnectorsReady]=useState(false);
 useEffect(()=>{if(progress!=='connectors')setConnectorsReady(false)},[progress]);
 const [activeAgent,setActiveAgent]=useState('Product Assistant');
 const advanceTimer=useRef(null);
 useEffect(()=>()=>clearTimeout(advanceTimer.current),[]);
 const connectTool=name=>{setConnections(v=>({...v,[name]:!v[name]}));if(!connections[name]&&activeAgent==='Product Assistant'){clearTimeout(advanceTimer.current);advanceTimer.current=setTimeout(()=>{setActiveAgent('Knowledge Checker');setProgress('connectors');setConnectorsReady(false)},650)}};
 const first=account.split(' ')[0];
 const greeting=[`Hey ${first}! Want a head start on your next review?`,`Welcome, ${first}. Ready to review your first brief?`,`Ready, ${first}? Let’s make your next product review count.`,`Welcome, ${first}. Here’s a head start on your next product review.`][choice.persona??0];
 const message='Your Product Assistant put together a product review brief. Here’s an example of how it can turn meeting details and product docs into a useful starting point.';
 const row=(name,icon)=><div className="setup-connector" key={name}><span className="connector-icon">{icon}</span><span>{name}</span><button aria-label={`${connections[name]?'Disconnect':'Connect'} ${name}`} onClick={()=>connectTool(name)}>{connections[name]?'Connected':'Connect'}</button></div>;
 return <><div className="setup-chat-scroll"><div className="setup-chat-copy" style={{'--card-delay':'0ms'}}>{arrived&&<>{activeAgent==='Product Assistant'&&<><ChatTyping text={greeting} delay={160}/><ChatTyping text={message} delay={160+greeting.length*7+100} onComplete={setBriefReady}/>{briefReady&&<article className="setup-agent-card artifact-review"><header><Img name="593-30044-CustomRobot.svg" size={24}/><h2>Your product review brief is ready</h2><span className="artifact-example-label">Example</span></header><dl><dt>Meeting</dt><dd>Checkout review · Tomorrow, 10 AM</dd><dt>Sources</dt><dd>Calendar event + Checkout PRD</dd><dt>Inside</dt><dd>3 open questions · 2 decisions to discuss</dd></dl>{opened&&<div className="brief-preview"><h3>Checkout product review</h3><p>Align on the next checkout iteration and what the team needs to validate.</p><h4>Open questions</h4><ul><li>Where are customers dropping out of checkout?</li><li>What evidence supports simplifying the form?</li><li>Which dependencies could affect the rollout?</li></ul><h4>Decisions to discuss</h4><ul><li>Choose the scope of the first experiment.</li><li>Agree on a success metric and an owner.</li></ul><small>Illustrative brief for this prototype.</small></div>}<div className="artifact-actions">{!opened?<Button text="Review brief" size="small" onClick={()=>setOpened(true)}/>:<Button text={reviewed?'Continue to connectors':'Looks good — continue'} size="small" onClick={()=>{setReviewed(true);setProgress('connectors')}}/>}<Button variant="tertiary" size="small" text="Dismiss" onClick={()=>{setReviewed(true);setProgress('connectors')}}/></div></article>}</>}{progress==='connectors'&&<div className="connector-next-step" key={activeAgent}><ChatTyping text={activeAgent==='Product Assistant'?"Now let’s connect the tools you use so your Product Assistant can create briefs from your own work. Which tools would you like to connect?":"Your Product Assistant is connected. Next up: Knowledge Checker. Connect the sources it should use to check facts and catch outdated details as you write."} delay={100} onComplete={setConnectorsReady}/>{connectorsReady&&<article className="setup-agent-card"><header><Img name={activeAgent==='Product Assistant'?"593-30044-CustomRobot.svg":"593-30044-FirstPartyKnowledgeChecker.svg"} size={24}/><h2>{activeAgent==='Product Assistant'?'Connect your tools':'Set up Knowledge Checker'}</h2></header>{row('Google Drive',<Img name="chat-drive.png" size={24}/>)}{row('Google Calendar',<Img name="chat-calendar.png" size={24}/>)}{row('Slack',<Img name="chat-slack.png" size={24}/>)}{row('Jira',<Img name="593-30044-Group39988.svg" size={24}/>)}</article>}</div>}</>}</div></div><aside className="setup-context" aria-label="Task context"><h2>Agents</h2>{['Product Assistant','Knowledge Checker'].map(agent=><button key={agent} className={activeAgent===agent?'selected':''} onClick={()=>{clearTimeout(advanceTimer.current);setActiveAgent(agent);setProgress(agent==='Product Assistant'?'review':'connectors');setConnectorsReady(false)}}><Img name={agent==='Product Assistant'?'593-30044-CustomRobot.svg':'593-30044-FirstPartyKnowledgeChecker.svg'}/>{agent}</button>)}<div className="setup-progress"><h2>Progress</h2>{activeAgent==='Product Assistant'&&<button className={progress==='review'?'current':''} onClick={()=>setProgress('review')}><i/>{reviewed?'✓ ':''}Review artifact</button>}<button className={progress==='connectors'?'current':''} onClick={()=>{setReviewed(true);setProgress('connectors')}}><i/>Connector set up</button></div></aside></>
}
function Workspace({account,onDialog,variation='home',choice,arrived=true}){
 const persona=choice.persona??0,color=choice.color??persona,name=choice.customName||personas[persona].name,first=account.split(' ')[0];
 const welcome=[`Hey ${first}! What’s on your mind today?`,`Welcome, ${first}. What shall we work on together?`,`Ready, ${first}? What’s one thing you want to move forward?`,`Welcome, ${first}. What would you like to work on?`][persona];
 const goIcon=<span className="product-persona-icon" aria-label={name+' · '+personas[persona].label}><HeroMark index={color}/></span>;

 const [chat,setChat]=useState(variation!=='home'),[expanded,setExpanded]=useState(variation==='extra');
 const openChat=()=>{setChat(true);setActive(-1);history.replaceState(null,'','#'+(expanded?'613-53334':'602-50367'))};
 const changeExpanded=value=>{setExpanded(value);history.replaceState(null,'','#'+(value?'613-53334':'602-50367'))};
 const [bannerVisible,setBannerVisible]=useState(true);
 const [hidden,setHidden]=useState(false),[more,setMore]=useState(false),[prompt,setPrompt]=useState(''),[tasks,setTasks]=useState([]),[active,setActive]=useState(-1),[attachment,setAttachment]=useState('');
 const input=useRef(null),file=useRef(null);
 const newTask=()=>{setBannerVisible(true);setChat(false);history.replaceState(null,'','#602-47545');setActive(-1);setPrompt('');setAttachment('');input.current?.focus()};
 const send=e=>{e.preventDefault();if(!prompt.trim())return;setChat(false);setTasks(t=>[...t,{prompt:prompt.trim(),attachment}]);setActive(tasks.length);setPrompt('');setAttachment('')};
 const item=(icon,label,click)=> <button className="side-item" data-agent-target={label.toLowerCase()} onClick={click}>{typeof icon==='string'?<Img name={icon}/>:<Logo src={icon} width={20} accessibilityLabel=""/>}<span>{label}</span></button>;
 return <section className={'workspace workspace-refresh '+(chat?'task-chat-workspace ':'')+(hidden?'sidebar-hidden':'')}><aside className="sidebar" aria-label="Go navigation"><header><button className="brand" onClick={newTask}>{goIcon}<span>Go</span><Img name="595-32842-CaretSmallDown.svg" size={16}/></button><button className="compose" aria-label="Create a new task" onClick={newTask}><Img name="595-32842-PencilSquircle.svg" size={18}/></button></header><nav><h2>Agents</h2>{item(LogoGrammarlyMarkColorPrimaryIcon,'Grammarly',()=>onDialog('Grammarly'))}{item('593-30044-FirstPartyKnowledgeChecker.svg','Knowledge Checker',()=>onDialog('Knowledge Checker'))}{item('593-30044-CustomRobot.svg','Product assistant',()=>onDialog('Product Assistant'))}{item('ws-2.svg','Onboarding buddy',()=>onDialog('Onboarding buddy'))}<button className="see-more" onClick={()=>setMore(!more)} aria-expanded={more}>{more?'See less':'See more'}</button>{more&&<>{item('595-32842-KnowledgeCheckerIcon.svg','AI Detector',()=>onDialog('AI Detector'))}{item('595-32842-ParaphraserIcon.svg','AI Rewriter',()=>onDialog('AI Rewriter'))}</>}<h2 className="tasks-label">Tasks</h2>{<button className={"task-item "+(chat?"active":"")} onClick={openChat}>Review all of my remaining tasks</button>}{item('595-32842-Plus.svg','Create a new task',newTask)}{tasks.map((t,i)=><button key={i} className={'task-item '+(active===i?'active':'')} onClick={()=>setActive(i)}>{t.prompt}</button>)}<div className="workspace-connectors">{item('595-32842-Connectors.svg','Connectors',()=>onDialog('Connectors'))}</div></nav><footer><button className="workspace-account" onClick={()=>onDialog('Your account')}><span className="account-initials">{account.split(' ').map(n=>n[0]).join('').slice(0,2)}</span><span>{account}<small>Pro</small></span></button></footer></aside><div className="workspace-main"><header><button className="sidebar-toggle" aria-label={hidden?'Show sidebar':'Hide sidebar'} onClick={()=>setHidden(!hidden)}><Img name="595-32842-SidebarLeft.svg" size={18}/></button>{chat&&<><span className="setup-task-title">Review all of my remaining tasks</span><button className="setup-info" aria-label="Toggle task context" onClick={e=>e.currentTarget.closest('.workspace-main').classList.toggle('context-hidden')}><Img name="chat-info.svg" size={18}/></button></>}</header><div className={'workspace-content '+(active>=0?'has-task':'')}>
 {chat?<SetupChat arrived={arrived} choice={choice} account={account} expanded={expanded} onExpanded={changeExpanded} onDialog={onDialog}/>:active<0?<div className="workspace-home"><div className="workspace-welcome"><div className="welcome-go personalized-welcome"><span className="home-go-customized"><span className="home-go-vector" aria-hidden="true"><img src={art("go-neutral-squircle-background.svg")} width="80" height="80" alt=""/></span>{goIcon}</span></div><h1>{arrived&&<Words>{welcome}</Words>}</h1></div>{bannerVisible&&<div className="workspace-promo"><div className="promo-text"><h2>Go works wherever you do.</h2><p>Add the extension to bring Go into the apps you already use.</p><a className="extension-cta" href="https://chromewebstore.google.com/detail/superhuman-go-ai-assistan/fiicfmbdhpbnebmbofpphmalhgofdakc" target="_blank" rel="noopener noreferrer">Add extension</a></div><div className="promo-art"><Img name="intro-meeting-prep.png" size={391} alt="Go helps prepare for a meeting in your apps."/></div><button className="dismiss-promo" aria-label="Dismiss welcome banner" onClick={()=>setBannerVisible(false)}>×</button></div>}<h2 className="home-tasks-label">Tasks</h2><div className="starter-task"><Img name="ws-2.svg" size={24}/><div><p>Finish setting up your agents</p><small>from Onboarding buddy</small></div><button onClick={openChat}>Finish setup</button></div><div className="starter-task"><Img name="593-30044-CustomRobot.svg" size={24}/><div><p>Catching up on yesterday...</p><small>Product assistant</small></div><span className="scan-status"><Img name="ws-6.svg" size={16}/>Scanning...</span></div></div>:<div className="conversation"><div className="user-message">{tasks[active].prompt}{tasks[active].attachment&&<small>Attached: {tasks[active].attachment}</small>}</div><div className="assistant-message">{goIcon}<div><h2>Your task is ready</h2><p>This prototype has captured your request. In Go, your assistant would use your connected tools to help you work through it.</p><span className="demo-label">Prototype response</span></div></div></div>}
 <form className="composer" onSubmit={send}><button type="button" aria-label="Attach a file" onClick={()=>file.current.click()}><Img name="595-32842-Plus.svg" size={18}/></button><input ref={input} value={prompt} onChange={e=>setPrompt(e.target.value)} aria-label="Start a task or ask anything" placeholder={chat?"Ask Daily briefing":"Start a task or ask anything"}/><IconButton icon={ArrowUpIcon} accessibilityLabel="Send task" type="submit" size="small" isDisabled={!prompt.trim()}/><input ref={file} type="file" hidden onChange={e=>setAttachment(e.target.files?.[0]?.name||'')}/></form>{attachment&&<div className="attachment">{attachment}<button onClick={()=>{setAttachment('');file.current.value=''}}>Remove</button></div>}</div></div></section>
}
function Modal({name,close,account,setAccount,role,preferences,setPreferences}){
 const ref=useRef(null),[value,setValue]=useState(account);
 const connected=preferences.connections||{},setConnected=connections=>setPreferences(p=>({...p,connections}));
 const enabled=preferences[name]!==false,setEnabled=value=>setPreferences(p=>({...p,[name]:value}));
 useEffect(()=>{ref.current.showModal();const d=ref.current;return()=>d.close()},[]);
 const descriptions={'Onboarding buddy':'Get your agents ready and connect the tools you work in.','Grammarly':'Keeps your writing error-free and polished.','AI Detector':'Review text for patterns that may indicate AI-generated writing.','AI Rewriter':'Rewrite a draft to make it clearer and more effective.','Product Assistant':'Generate a PRD or spec with context from your connected tools.','Knowledge Checker':'Check facts and data across your documents.'};
 return <dialog ref={ref} onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="dialog-header"><h2>{name}</h2><button aria-label="Close dialog" onClick={close}>×</button></div>{name==='Switch accounts'?<form onSubmit={e=>{e.preventDefault();if(value.trim()){setAccount(value.trim());close()}}}><p>Choose a display name for this prototype.</p><label>Account name<input value={value} onChange={e=>setValue(e.target.value)} required maxLength={50} autoFocus/></label><Button text="Continue" size="large" type="submit"/></form>:name==='Connectors'?<><p>Try connecting tools for your agents.</p>{['Jira','Github','Google Docs'].map(n=><div className="connection" key={n}><span>{n}</span><Button text={connected[n]?'Connected':'Connect'} variant="secondary" onClick={()=>setConnected({...connected,[n]:!connected[n]})}/></div>)}<small>Demo connections only.</small></>:name==='Your account'?<><p>{account}</p><p>Role: {role}</p></>:name==='Finish setting up your agents'?<><p>Choose an agent to finish setting up.</p>{['Grammarly','Knowledge Checker','Product Assistant'].map(agent=><label className="setting" key={agent}><input type="checkbox" checked={preferences[agent]!==false} onChange={e=>setPreferences(p=>({...p,[agent]:e.target.checked}))}/>{agent}</label>)}<small>You can connect your tools from Connectors in the sidebar.</small></>:name==='Go settings'?<label className="setting"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/>Show writing feedback</label>:<><p>{descriptions[name]}</p><label className="setting"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/>Enable this agent</label></>}<Button text="Done" variant="tertiary" onClick={close}/></dialog>
}
function AgentPreview({card}){
 return <div className={'tile-preview '+card.kind} role="img" aria-label={`${card.name} example: ${card.kind==='product'?'Create a PRD from connected sources':card.kind==='knowledge'?'Check a launch date against the latest brief':'Polish a product update'}`}>
 <div className="preview-after" aria-hidden="true">{card.kind==='product'?<><div className="mini-paper"><b>Product requirements</b><p>Overview</p><i/><i/><p>Requirements</p><i/><i/></div><div className="mini-prompt">Create a PRD from these sources</div></>:card.kind==='knowledge'?<><div className="mini-paper"><b>Launch plan</b><p>Launch date: <mark>October 15</mark></p><i/><i/></div><div className="mini-suggestion"><Img name="593-30044-FirstPartyKnowledgeChecker.svg" size={14}/><span>Latest brief: October 22</span></div></>:<><div className="mini-paper"><b>Product update</b><p>The updates <del>is</del> <ins>are</ins><br/>ready for review.</p><i/><i/></div><div className="mini-suggestion"><Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={14} accessibilityLabel=""/><span>Clear and ready to share</span></div></>}</div></div>
}
function AgentCards({next,back}){
 const cards=[
 {name:'Product Assistant',icon:<Img name="593-30044-CustomRobot.svg" size={28}/>,description:'I’ll pull open decisions from your roadmap discussions and draft a brief for your next planning meeting.',timing:'Starts after setup'},
 {name:'Knowledge Checker',icon:<Img name="593-30044-FirstPartyKnowledgeChecker.svg" size={28}/>,description:'I’ll flag metrics and milestones in your PRDs that don’t match the latest source docs.',timing:'As you write'},
 {name:'Grammarly',icon:<Logo src={LogoGrammarlyMarkColorPrimaryIcon} width={28} accessibilityLabel=""/>,description:'I’ll tighten your stakeholder updates and keep them in your concise, direct style.',timing:'As you write'}];
 return <section className="onboarding cards-variation commitment-agents"><div className="copy"><h1><Words><strong>Agents picked for you.</strong><br/>Ready to move your work forward.</Words></h1><Actions {...{next,back}} label="Finish set up"/></div><div className="commitment-panel" aria-label="Recommended agents">{cards.map((card)=><div className="commitment-row" key={card.name}><div className="commitment-header"><div className="commitment-identity"><span className="commitment-icon">{card.icon}</span><h2>{card.name}</h2></div><Tag label={card.timing} shape="squircle" style="subdued" variant="neutral" showIcon={false}/></div><div className="commitment-text"><p>{card.description}</p></div></div>)}</div></section>
}


function Framing({next}){
 return <section className="framing-slide" aria-label="Framing"><header><Img name="framing-go.svg" size={48}/><h1>Framing</h1></header><Img name="framing-maya.png" size={99} className="framing-avatar" alt="Maya"/><p>During this session, we will be referring to <em>Maya</em> as the primary user.<br/><br/>They are a <em>product manager at Northstar.</em></p><div className="framing-continue"><Button size="xlarge" text="Continue" iconEnd={CaretSmallRightIcon} onClick={next}/></div></section>
}
function App(){

 const isResearch=new URLSearchParams(location.search).has("research");

 const [profileMemory,setProfileMemory]=useState(initialMemory);
 const [profileReady,setProfileReady]=useState(false);
 const [connectorsReady,setConnectorsReady]=useState(false);
 const [profileConnections,setProfileConnections]=useState({});
 const [goPersona,setGoPersona]=useState(initialPersona);
 useEffect(()=>{try{localStorage.setItem('go-persona',JSON.stringify(goPersona))}catch{}},[goPersona]);
 const [workspaceVariation,setWorkspaceVariation]=useState(location.hash==='#613-53334'?'extra':location.hash==='#602-47545'?'home':'chat');
 const [agentVariation,setAgentVariation]=useState('cards');
 const fromHash=()=>{if(location.hash==='#3012-632')return 3;if(location.hash==='#1218-53776')return 9;if(location.hash==="#742-44006")return -9;if(['#556-26703','#713-20716'].includes(location.hash))return 3;const introIndex=introSteps.findIndex(s=>s[0].replace(':','-')===location.hash.slice(1));if(introIndex>=0)return isResearch&&introIndex===0?-7:introIndex-8;if(location.hash==='#535-12441')return 0;if(location.hash==='#602-48579')return 3;if(['#595-32842','#595-32817','#602-50367','#613-53334'].includes(location.hash))return 6;if(Object.values(personaFrames).some(id=>'#'+id===location.hash))return 6;if(location.hash==='#602-49070')return 4;const i=steps.findIndex(s=>s[0].replace(':','-')===location.hash.slice(1));return i<0?0:i===8?4:(i===5||i===6)?9:i};
 const [step,setStep]=useState(fromHash),[scale,setScale]=useState(1),[paused,setPaused]=useState(false),[replay,setReplay]=useState(0),[role,setRole]=useState('Product'),[account,setAccount]=useState('Maya Jones'),[modal,setModal]=useState(null),[preferences,setPreferences]=useState({});
 const chatScenario=new URLSearchParams(location.search).get('chatScenario');
 const reviewRole=new URLSearchParams(location.search).get('knownRole');
 const knownRole=reviewRole==='unknown'?null:reviewRole||(profileReady?role:null);
 const transferRef=useRef([]),flyingRef=useRef([]),heroFlight=useRef(null);
 const [heroArrived,setHeroArrived]=useState(true);
 const [agentsArrived,setAgentsArrived]=useState(true);
 const screenRef=useRef(null),exitRef=useRef(null),navigationRef=useRef(0);
 const go=(n,instant=false)=>{
  n=Math.max(-9,Math.min(steps.length-1,n));
  if(n===6)n=9;
  // Function confirmation now lives in the profile; preserve existing screen IDs.
  if(n===2)n=step>2?7:3;
  if(n===1)n=3;
  if(isResearch&&n===-8)n=step===-9?-7:-9;
  flyingRef.current.forEach(node=>node.remove());flyingRef.current=[];transferRef.current=[];
  setAgentsArrived(true);
  if(step===4&&n===9&&!instant&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const agents=Array.from(screenRef.current.querySelectorAll('[data-agent-source]')).map(node=>{const icon=node.querySelector('img,svg');return icon?{name:node.dataset.agentSource,icon:icon.cloneNode(true),rect:icon.getBoundingClientRect()}:null}).filter(Boolean);
   const goNode=screenRef.current.querySelector('.chrome .tab img,.chrome .tab svg');
   const goIcon=goNode?{name:'__go__',icon:goNode.cloneNode(true),rect:goNode.getBoundingClientRect()}:null;
   transferRef.current=goIcon?[goIcon,...agents]:agents;
   setAgentsArrived(transferRef.current.length===0);
  }
  heroFlight.current=null;setHeroArrived(true);
  if(step===5&&n===6&&!instant&&!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const source=screenRef.current?.querySelector('.personal-hero');
   if(source){heroFlight.current={node:source.cloneNode(true),rect:source.getBoundingClientRect()};setHeroArrived(false)}
  }
  const ticket=++navigationRef.current;
  exitRef.current?.cancel();
  if(n===step)return;
  const commit=()=>{if(ticket!==navigationRef.current)return;if(n!==3&&n!==7)document.documentElement.classList.remove('profile-carryover');setStep(n);if(n===6)setWorkspaceVariation('chat');history.replaceState(null,'','#'+(n===-9?'742-44006':n<0?introSteps[n+8][0].replace(':','-'):n===6?'1218-53776':n===4&&agentVariation==='cards'?'602-49070':steps[n][0].replace(':','-')))};
  if(((step===3&&n===7)||(step===7&&n===3))&&!instant&&!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&document.startViewTransition){
   document.documentElement.classList.add('profile-carryover');
   const transition=document.startViewTransition(()=>flushSync(commit));
   transition.finished.catch(()=>{});
   return;
  }
  if(((step===3&&n===7)||(step===7&&n===3))&&!instant&&!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const source=screenRef.current?.querySelector(step===3?'.memory-frame':'.connector-profile-pill');
   const from=source?.getBoundingClientRect();
   flushSync(commit);
   const target=screenRef.current?.querySelector(n===7?'.connector-profile-pill':'.memory-frame');
   if(from&&target){
    const to=target.getBoundingClientRect();
    const shell=document.createElement('div');
    Object.assign(shell.style,{position:'fixed',zIndex:'9999',pointerEvents:'none',background:'#fffefa',border:'1px solid rgba(255,255,255,.85)',boxShadow:'0 8px 28px rgba(96,82,112,.10)',borderRadius:n===7?'16px':'22px',left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',boxSizing:'border-box'});
    document.body.appendChild(shell);
    const flight=shell.animate([{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',borderRadius:n===7?'16px':'22px'},{left:to.left+'px',top:to.top+'px',width:to.width+'px',height:to.height+'px',borderRadius:n===7?'22px':'16px'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
    target.animate([{opacity:0},{opacity:1}],{duration:160,delay:200,fill:'backwards'});
    flight.finished.finally(()=>shell.remove());
   }
   return;
  }
  if(step===4&&n===9&&transferRef.current.length){commit();return}
  const content=screenRef.current?.querySelector('section');
  if(instant||matchMedia('(prefers-reduced-motion: reduce)').matches||!content){commit();return}
  const animation=content.animate([{opacity:1},{opacity:0}],{duration:130,easing:'ease-out',fill:'forwards'});
  exitRef.current=animation;
  animation.finished.then(commit).catch(()=>{});
 };
 useLayoutEffect(()=>{
  if(step!==6||!heroFlight.current)return;
  const source=heroFlight.current;heroFlight.current=null;
  const target=screenRef.current?.querySelector('.product-persona-icon .personal-hero');
  if(!target){setHeroArrived(true);return}
  const end=target.getBoundingClientRect(),start=source.rect;
  const ghost=source.node;ghost.classList.add('hero-transfer');
  // Isolate the flying SVG’s gradient IDs from the destination.
  ghost.innerHTML=ghost.innerHTML.replace(/id="([^"]+)"/g,'id="flight-$1"').replace(/url\(#([^)]+)\)/g,'url(#flight-$1)');
  Object.assign(ghost.style,{position:'fixed',left:start.left+'px',top:start.top+'px',width:start.width+'px',height:start.height+'px',margin:'0',zIndex:'10000',pointerEvents:'none',transformOrigin:'0 0'});
  document.body.append(ghost);target.style.visibility='hidden';
  const dx=end.left-start.left,dy=end.top-start.top,finishScale=Math.min(end.width/start.width,end.height/start.height);
  const direction=dx<0?-1:1;
  // A continuous bowed flight path; uniform scale preserves the Hero silhouette.
  const frames=Array.from({length:41},(_,i)=>{
   const t=i/40,travel=t*t*(3-2*t),arc=Math.sin(Math.PI*travel)*Math.min(90,Math.abs(dx)*.15);
   const scale=1+(finishScale-1)*travel;
   const lean=direction*18*Math.sin(Math.PI*t)*Math.sin(Math.PI*Math.min(1,t*1.5));
   return {offset:t,transform:`translate(${dx*travel}px,${dy*travel-arc}px) rotate(${lean}deg) scale(${scale})`};
  });
  const flight=ghost.animate(frames,{duration:1050,easing:'linear',fill:'forwards'});
  flight.finished.then(()=>{target.style.visibility='';ghost.remove();setHeroArrived(true)}).catch(()=>{});
  return()=>{flight.cancel();ghost.remove();target.style.visibility=''};
 },[step]);
 useLayoutEffect(()=>{
  if(step!==9||!transferRef.current.length)return;
  const items=transferRef.current;transferRef.current=[];
  const flights=[],targets=[];let cancelled=false;
  const workspace=screenRef.current.querySelector('.pa-workspace');
  items.forEach((item,i)=>{
   const target=item.name==='__go__'?screenRef.current.querySelector('[data-go-target]'):screenRef.current.querySelector(`[data-agent-target="${item.name}"]`);
   const icon=target?.querySelector('img,svg');if(!icon)return;
   const end=icon.getBoundingClientRect(),start=item.rect;
   const ghost=document.createElement('div');ghost.setAttribute('aria-hidden','true');ghost.append(item.icon);
   Object.assign(ghost.style,{position:'fixed',left:start.left+'px',top:start.top+'px',width:start.width+'px',height:start.height+'px',zIndex:'10000',pointerEvents:'none',transformOrigin:'0 0'});
   Object.assign(item.icon.style,{width:'100%',height:'100%',maxWidth:'none',transform:'none',objectFit:'contain'});
   document.body.append(ghost);flyingRef.current.push(ghost);icon.style.visibility='hidden';targets.push(icon);
   const dx=end.left+end.width/2-start.left-start.width/2,dy=end.top+end.height/2-start.top-start.height/2,landScale=end.width/start.width;
   const frames=Array.from({length:81},(_,j)=>{
    const t=j/80,p=t*t*t*(t*(t*6-15)+10),depth=Math.pow(Math.sin(Math.PI*t),2);
    const scale=1+(landScale-1)*p+1.05*depth;
    const arc=Math.sin(Math.PI*p)*Math.min(130,Math.abs(dx)*.22);
    const x=dx*p+start.width*(1-scale)/2,y=dy*p-arc+start.height*(1-scale)/2;
    return {offset:t,transform:`translate(${x}px,${y}px) perspective(900px) rotateY(${-14*depth}deg) rotate(${-7*depth}deg) scale(${scale})`,opacity:1};
   });
   const animation=ghost.animate(frames,{duration:item.name==='__go__'?950:1500,delay:i*110,easing:'linear',fill:'both'});
   flights.push(animation);
   animation.finished.then(()=>{icon.style.visibility='';ghost.remove()}).catch(()=>{});
  });
  const reveal=workspace?.animate([{opacity:0,transform:'scale(.975)'},{opacity:1,transform:'scale(1)'}],{duration:950,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  Promise.all(flights.map(a=>a.finished)).then(()=>{if(!cancelled)setAgentsArrived(true)}).catch(()=>{});
  return()=>{cancelled=true;reveal?.cancel();flights.forEach(a=>a.cancel());targets.forEach(icon=>icon.style.visibility='');flyingRef.current.forEach(node=>node.remove());flyingRef.current=[]};
 },[step]);
 useEffect(()=>()=>{navigationRef.current++;exitRef.current?.cancel()},[]);
 useEffect(()=>{const fit=()=>setScale(Math.max(.15,Math.min((innerWidth-32)/1440,(innerHeight-80)/1024,1)));fit();addEventListener('resize',fit);return()=>removeEventListener('resize',fit)},[]);

 useEffect(()=>{const key=e=>{if(modal||document.querySelector('.pa-modal')||e.target.closest('input,textarea,button,select,a,[contenteditable],.memory-scroll,.toolkit-scroll,.profile-details'))return;if(e.key==='ArrowRight'){e.preventDefault();go(adjacentStep(step,1),true)}if(e.key==='ArrowLeft'){e.preventDefault();go(adjacentStep(step,-1),true)}if(e.code==='Space'){e.preventDefault();setPaused(p=>!p)}};const hash=()=>{if(Object.values(personaFrames).some(id=>'#'+id===location.hash))setGoPersona(initialPersona());if(location.hash==='#602-50367')setWorkspaceVariation('chat');else if(location.hash==='#613-53334')setWorkspaceVariation('extra');else if(location.hash==='#602-47545')setWorkspaceVariation('home');if(location.hash==='#602-49070')setAgentVariation('cards');else if(location.hash==='#593-30044')setAgentVariation('cards');setStep(fromHash())};addEventListener('keydown',key);addEventListener('hashchange',hash);return()=>{removeEventListener('keydown',key);removeEventListener('hashchange',hash)}},[step,modal,workspaceVariation,agentVariation]);
 useEffect(()=>{const receive=e=>{if((location.protocol!=='file:'&&e.origin!==location.origin)||e.source!==screenRef.current?.querySelector('iframe')?.contentWindow||e.data?.type!=='go-preview-navigate'||![4,6].includes(e.data.step))return;if(e.data.choice)setGoPersona(e.data.choice);go(e.data.step,true)};addEventListener('message',receive);return()=>removeEventListener('message',receive)},[step]);
 const props={next:()=>go(step===4?9:adjacentStep(step,1)),back:()=>go(step===9||step===11?4:adjacentStep(step,-1))};
 const currentStep=step===-9?['742:44006','Framing']:step<0?introSteps[step+8]:steps[step];
 const allSteps=[['742:44006','Framing'],...introSteps.slice(isResearch?1:0),...steps].map(([id,label],i)=>({id,label,value:isResearch?(i===0?-9:i-8):i-9})).filter(s=>screenOrder.includes(s.value)).sort((a,b)=>screenOrder.indexOf(a.value)-screenOrder.indexOf(b.value));
 return <main className={paused?'is-paused':''}><div className="canvas-wrap" style={{width:1440*scale,height:1024*scale}}><div className="desktop-stage" style={{transform:`scale(${scale})`,'--preview-scale':scale}}>{step!==-9&&<DesktopBackdrop/>}<div className={"canvas "+(step===-9?"framing-window":step===-2?"drag-window":step===-1?"hub-window":step<0?"browser-window":(step<=5||step===7||step===8)?"native-window onboarding-app":"native-window")} data-figma-node={currentStep[0]}>{step>=0&&!([3,4,9].includes(step))&&(step<=5||step===7||step===8)&&<div className="app-window-controls traffic" aria-hidden="true"><i/><i/><i/></div>}<div className="screen" ref={screenRef} data-screen={step} key={step+'-'+replay}>{step===-9?<Framing next={props.next}/>:step<0?<DesktopIntro step={step} next={props.next} go={go} Chrome={Chrome}/>:step===0?<Welcome {...props} account={account} switchAccount={()=>setModal('Switch accounts')}/>:step===1?(new URLSearchParams(location.search).get('direction')==='headline'?<HeadlineMeetGo {...props} Words={Words}/>:<FocusedMeetGo {...props} Actions={Actions} Words={Words} paused={paused} setPaused={setPaused}/>):step===3?<MemoryProfile {...props} Chrome={Chrome} role={role} setRole={setRole} memory={profileMemory} setMemory={setProfileMemory} ready={profileReady} setReady={setProfileReady} Actions={Actions} Words={Words}/>:step===7?<ConnectorStep {...props} ready={connectorsReady} setReady={setConnectorsReady} memory={profileMemory} connections={profileConnections} setConnections={setProfileConnections} Actions={Actions} Words={Words}/>:step===4?<AgentSelection {...props} Chrome={Chrome} account={account} Words={Words}/>:step===5?(!isResearch?<iframe title="Customize your Go" src={location.protocol==='file:'?'../go-living-preview/index.html?embedded#709-19994':'/go-living-preview/index.html?embedded#709-19994'} style={{width:'100%',height:'100%',border:0,display:'block'}}/>:<Personalize {...props} Words={Words} choice={goPersona} setChoice={setGoPersona} Chrome={Chrome} paused={paused} account={account} role={role}/>) :step===11?<FigmaGoPreview {...props} Chrome={Chrome}/>:step===10?<GoAnywhere/>:(chatScenario?<RecommendationStressChat account={account} scenarioId={chatScenario} knownRole={knownRole}/>:<PostAgents account={account} connections={profileConnections} setConnections={setProfileConnections} agentsArrived={agentsArrived} showChooser={false} onProduct={()=>go(9)} onOwnDoc={()=>go(10)}/>)}</div></div></div></div><nav className="review" aria-label="Prototype controls"><a href="?flow=grammarly">Grammarly user flow</a><IB icon={ArrowLeftIcon} label="Previous screen" onClick={()=>go(adjacentStep(step,-1))} disabled={step===-9}/><select aria-label="Prototype screen" value={step} onChange={e=>go(Number(e.target.value),true)}>{allSteps.map(({id,label,value},i)=><option key={id} value={value}>{i+1}. {label}</option>)}</select><IB icon={ArrowRightIcon} label="Next screen" onClick={()=>go(adjacentStep(step,1))} disabled={step===10}/><span className="step-label" aria-live="polite">{allSteps.findIndex(s=>s.value===step)+1} / {allSteps.length} · {currentStep[1]}</span>{step===9&&<select aria-label="Chat recommendation scenario" value={chatScenario||"current"} onChange={e=>{const url=new URL(location.href);if(e.target.value==="current")url.searchParams.delete("chatScenario");else url.searchParams.set("chatScenario",e.target.value);location.href=url.href}}><option value="current">Current chat</option>{Object.entries(chatScenarios).map(([id,scenario])=><option key={id} value={id}>{scenario.label}</option>)}</select>}<button onClick={()=>setReplay(r=>r+1)}>Replay</button><button onClick={()=>{setRole('Product');setProfileMemory(initialMemory);setProfileReady(false);setConnectorsReady(false);setProfileConnections({});setAccount('Maya Jones');setPaused(false);setPreferences({});setWorkspaceVariation('chat');setGoPersona({persona:3,personaVersion:2,stage:'ready'});go(0)}}>Restart</button>{step!==7&&step!==8&&<a href={`https://www.figma.com/design/${[1,3,4,7,9].includes(step)?"YRZ1nhCi3nPPWSrfqhYIYD":"QSQdeN8X7BJWW8YQ1yiihU"}/Fall---Go-Onboarding-Sprint?node-id=${step===-9?'742-44006':step<0?introSteps[step+8][0].replace(':','-'):step===5?personaFrames[goPersona.stage]:steps[step][0].replace(':','-')}`} target="_blank" rel="noreferrer">Figma ↗</a>}</nav>{modal&&<Modal key={modal} name={modal} close={()=>setModal(null)} account={account} setAccount={setAccount} role={role} preferences={preferences} setPreferences={setPreferences}/>}</main>
}
const query=new URLSearchParams(location.search);
createRoot(document.getElementById('root')).render(query.get('draft-window')==='1'?<DraftWindow/>:query.get('flow')==='grammarly'?<GrammarlyEntry FirstWelcome={FirstWelcome}/>:<App/>);
