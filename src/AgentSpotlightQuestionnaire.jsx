import React,{useState} from 'react';
import {Button,CaretSmallLeftIcon,CaretSmallRightIcon} from '@superhuman/origin';

const questions={
 'Report Builder':[
  {title:'What kind of report would you like to build?',hint:'Choose a starting point.',multiple:false,options:[['weekly','Weekly update'],['project','Project status report'],['research','Research summary'],['client','Client report']]},
  {title:'What should the report focus on?',hint:'Choose the most useful emphasis.',multiple:false,options:[['progress','Progress and blockers'],['decisions','Decisions and next steps'],['metrics','Metrics and outcomes'],['takeaways','Key takeaways']]}
 ]
};

export default function AgentSpotlightQuestionnaire({agent,onComplete}){
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState([[],[]]);
 const question=questions[agent]?.[step];
 if(!question)return null;
 const select=value=>setAnswers(previous=>previous.map((items,index)=>index!==step?items:question.multiple?(items.includes(value)?items.filter(item=>item!==value):[...items,value]):[value]));
 const next=skip=>{
  const result=answers.map((items,index)=>index===step&&skip?[]:items);
  if(skip)setAnswers(result);
  if(step===0)setStep(1);
  else onComplete({choices:result});
 };
 return <div className="pa-agent-questionnaire-wrap">
  <article className="pa-agent-questionnaire" aria-label={`${agent} setup question ${step+1} of 2`}>
   <header><h2>{question.title}</h2><nav aria-label="Question navigation"><button type="button" aria-label="Previous question" disabled={step===0} onClick={()=>setStep(0)}><CaretSmallLeftIcon/></button><span>{step+1} of 2</span><button type="button" aria-label="Next question" disabled={step===1} onClick={()=>setStep(1)}><CaretSmallRightIcon/></button></nav></header>
   <p className="pa-agent-questionnaire-hint">{question.hint}</p>
   <div className="pa-agent-questionnaire-options" role="group" aria-label={question.title}>{question.options.map(([value,label])=><label key={value}><input type={question.multiple?'checkbox':'radio'} name={`${agent}-${step}`} checked={answers[step].includes(value)} onChange={()=>select(value)}/><span>{label}</span></label>)}</div>
   <footer><div><Button text="Skip" variant="secondary" size="small" onClick={()=>next(true)}/><Button text="Continue" variant="primary" size="small" onClick={()=>next(false)}/></div></footer>
  </article>
 </div>;
}
