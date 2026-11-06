import React,{useState} from 'react';
import {Button,Checkbox,Flex} from '@superhuman/origin';
export default function EmailAssistantSetup({configuration,setConfiguration,choice,onEnable,onDismiss,twoStep=false}){
 const [step,setStep]=useState(1);
 const update=(key,value)=>setConfiguration(current=>({...current,[key]:value}));
 const archiveOptions=[['archiveNotifications','Notifications','Updates from apps and services.'],['archiveNews','News','Digests and newsletters.'],['archivePromotions','Promotions','Sales, marketing, and cold pitches.']];
 const skipStep=()=>{if(step===1){setConfiguration(current=>({...current,archiveNotifications:false,archiveNews:false,archivePromotions:false}));setStep(2)}else onDismiss()};
 const question=step===1?'What would you like to auto-archive?':'How else can Email Assistant help?';
 const options=step===1?archiveOptions:[['draftReplies','Draft replies in my voice','Nothing sends without your OK.'],['autoLabels','Label my emails','Separate what needs a reply from what’s just FYI.']];
 if(twoStep)return <article className="pa-email-assistant-setup pa-email-question-card" aria-label="Email Assistant setup">
  <header className="pa-email-question-header">
   <h2>{question}</h2>
   <nav className="pa-email-pagination" aria-label="Setup questions">
    <button aria-label="Previous question" disabled={step===1||!!choice} onClick={()=>setStep(1)}>‹</button>
    <span>{step} of 2</span>
    <button aria-label="Next question" disabled={step===2||!!choice} onClick={()=>setStep(2)}>›</button>
   </nav>
  </header>
  <p className="pa-email-step-description">{step===1?'Move these emails out of your inbox without deleting them. Select all that apply.':'Select all that apply.'}</p>
  <Flex direction="column" gap={3} className="pa-email-assistant-options">{options.map(([key,label,helper])=><Checkbox key={key} isSelected={key==='autoLabels'?configuration[key]!==false:!!configuration[key]} isDisabled={!!choice} onChange={value=>update(key,value)} helperMessage={helper}>{label}</Checkbox>)}</Flex>
  <footer className="pa-email-question-footer">
   {choice?<span role="status">{choice==='enabled'?'Preferences saved':'Setup skipped'}</span>:<>
    <Button text="Skip" size="small" variant="secondary" onClick={skipStep}/>
    <Button text="Continue" size="small" variant="primary" onClick={()=>step===1?setStep(2):onEnable()}/>
   </>}
  </footer>
 </article>;
 return <article className="pa-email-assistant-setup">
  <Flex as="header" align="center" gap={3}><span className="pa-email-assistant-icon"><img src="assets/agent-carousel/custom-letter.svg" alt=""/></span><h2>Email Assistant</h2>{choice&&<span className={`pa-email-assistant-status ${choice==='enabled'?'is-on':''}`}>{choice==='enabled'?'On':'Not now'}</span>}</Flex>
  <Flex direction="column" gap={3} className="pa-email-assistant-options">
   <Checkbox isSelected={configuration.draftReplies} isDisabled={!!choice} onChange={value=>update('draftReplies',value)} helperMessage="Nothing sends without your OK.">Draft replies in your voice</Checkbox>
   <Checkbox isSelected={configuration.dailyDigest} isDisabled={!!choice} onChange={value=>update('dailyDigest',value)} helperMessage="Archived and summed up at 5:00 PM.">Daily digest of lower-priority email</Checkbox>
  </Flex>
  {!choice&&<Flex as="footer" gap={2}><Button text="Approve" variant="primary" size="small" onClick={onEnable} isDisabled={!configuration.draftReplies&&!configuration.dailyDigest}/><Button text="Not now" variant="tertiary" size="small" onClick={onDismiss}/></Flex>}
 </article>;
}
