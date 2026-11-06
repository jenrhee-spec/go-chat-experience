import React from 'react';
import {ButtonAsLink,AppsGoogleChromeIcon} from '@superhuman/origin';
import './extension-artifact.css';

const extensionUrl='https://chromewebstore.google.com/detail/superhuman-go-ai-assistan/fiicfmbdhpbnebmbofpphmalhgofdakc';

export default function ExtensionArtifact({expandable=false,title='Install Chrome extension',description='Get writing help wherever you write.',buttonText='Install'}){
 if(expandable)return <article className="pa-extension-disclosure" aria-label="Install Chrome extension">
  <div className="pa-extension-install-row">
   <AppsGoogleChromeIcon className="pa-chrome-logo" width={32} height={32} aria-hidden="true"/>
   <span className="pa-extension-copy"><strong>{title}</strong><span>{description}</span></span>
   <ButtonAsLink text={buttonText} variant="primary" size="small" href={extensionUrl} target="_blank"/>
  </div>
 </article>;

 return <article className="pa-extension-artifact" data-node-id="10955:7489" aria-label="Add the Hero extension">
  <span className="pa-extension-icon" aria-hidden="true"><img src="shared/figma-superhuman-icon.svg" alt=""/></span>
  <span className="pa-extension-copy">
   <strong>Hero</strong>
   <span>Bring Grammarly and PRD Writer into the apps you use</span>
  </span>
  <ButtonAsLink text="Add extension" variant="primary" size="small" href={extensionUrl} target="_blank"/>
 </article>;
}
