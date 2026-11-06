import React,{useEffect,useState} from 'react';
import './agent-demo.css';
// One recommendation surface. Agents supply a reason, work sample, and outcome.
const recommendations={
 product:{title:'Turn scattered planning into a clear brief.',reason:'Your product work spans team discussions and planning docs.',source:'Team discussions + planning notes',before:'“Teams get stuck in setup.”\n“Try a guided checklist.”\n“Track the first shared project.”',label:'A brief the team can act on',result:[['Goal','Help teams reach their first shared project.'],['Scope','A guided workspace setup.'],['Open decision','Which steps belong in the first release?']]},
 knowledge:{title:'Keep product updates aligned with the plan.',reason:'Your updates draw on shared plans that change over time.',source:'Product update + planning document',before:'Product update: Launch on October 15.\nPlanning document: Launch on October 22.',label:'One date, aligned with the source',result:[['Update','The launch is scheduled for October 22.'],['Source','The latest planning document.']]},
 grammar:{title:'Say what matters, in your own voice.',reason:'You prefer concise, direct updates with a clear next step.',source:'A note to your team',before:'“I just wanted to reach out to ask if you could share your feedback by Friday.”',label:'Concise, direct, and ready to share',result:[['','“Please share your feedback by Friday.”']]}
};
export default function AgentDemo({kind}){
 const content=recommendations[kind];
 const[ready,setReady]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');let timer;const start=()=>{clearTimeout(timer);setReady(media.matches);if(!media.matches)timer=setTimeout(()=>setReady(true),1000)};start();media.addEventListener('change',start);return()=>{clearTimeout(timer);media.removeEventListener('change',start)}},[kind]);
 return <article className="agent-recommendation" aria-label={content.title}>
 <header><h2>{content.title}</h2><p>{content.reason}</p></header>
 <div className="recommendation-example">
 <div className="recommendation-input"><span className="recommendation-label">{content.source}</span><p>{content.before}</p></div>
 <div className={'recommendation-outcome'+(ready?' is-ready':'')} aria-hidden={!ready}>
 <span className="recommendation-label">{content.label}</span>
 {content.result.map(([label,text])=><div className="recommendation-result-line" key={text}>{label&&<span>{label}</span>}<p>{text}</p></div>)}
 </div>
 </div>
 </article>
}
