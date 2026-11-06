import React,{useState} from 'react';
import {Button,Flex} from '@superhuman/origin';
import './email-artifact.css';

const draft={to:'Alex Morgan',subject:'Following up'};
export default function EmailArtifact({onOpenDraft,onSkip,showSend=true}){
 const [sent,setSent]=useState(false);
 return <article className="pa-email-artifact" data-node-id="16697:122062" aria-label="Sample auto-draft from Email Assistant">
  <div className="pa-email-header">
   <span className="pa-email-field-label">To</span>
   <div className="pa-email-recipient"><span className="pa-email-avatar" aria-hidden="true">AM</span><span>{draft.to}</span></div>
  </div>
  <div className="pa-email-subject"><span className="pa-email-field-label">Subject</span><span>{draft.subject}</span></div>
  <div className="pa-email-body">
   <p>Hi Alex,</p>
   <p>Thanks for sharing this with me. I’ll take a closer look and follow up with next steps soon.</p>
   <p>Best,<br/>Maya</p>
  </div>
  <footer className="pa-email-footer">
   <Flex className="pa-email-actions" gap={2}>
    {showSend&&<Button text={sent?"Sent":"Send"} variant="primary" size="small" isDisabled={sent} onClick={()=>{setSent(true);onOpenDraft?.()}}/>}
    <Button text="Open draft" variant="secondary" size="small" onClick={()=>{const url=new URL(window.location.href);url.searchParams.set('draft-window','1');window.open(url.href,'_blank','noopener,noreferrer');onOpenDraft?.()}}/>
    {sent&&<span role="status">Sent in this prototype</span>}
    {onSkip&&<Button text="Skip" variant="tertiary" size="small" onClick={onSkip}/>}
   </Flex>
   <img className="pa-email-brand" src="assets/agent-carousel/custom-letter.svg" alt="Email Assistant"/>
  </footer>
 </article>;
}
