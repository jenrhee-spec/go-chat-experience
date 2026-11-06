import React,{useEffect} from 'react';
import './draft-window.css';

export default function DraftWindow(){
 useEffect(()=>{document.title='Draft email · Go'},[]);
 return <main className="pa-draft-window">
  <header className="pa-draft-window-header"><img src="shared/go-logo.svg" alt=""/><span>New message</span><span className="pa-draft-badge">Draft</span></header>
  <section className="pa-draft-window-fields" aria-label="Email details">
   <div><span>To</span><span>Alex Morgan</span></div>
   <div><span>Subject</span><span>Following up</span></div>
  </section>
  <article className="pa-draft-window-body">
   <p>Hi Alex,</p>
   <p>Thanks for sharing this with me. I’ll take a closer look and follow up with next steps soon.</p>
   <p>Best,<br/>Maya</p>
  </article>
 </main>;
}
