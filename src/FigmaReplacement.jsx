import React from 'react';
import AgentSelection from './AgentSelection';
import './figma-replacement.css';
export function FigmaMeetAgents(props){return <AgentSelection {...props}/>;}
export function FigmaGoPreview({back,...props}){return <AgentSelection {...props} back={back} initialPreview onClosePreview={back}/>;}
