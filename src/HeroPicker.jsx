import React,{useId} from 'react';
import './hero-picker.css';
// Brand-in-product-guidelines: 2041:14456 (30-grade palette), 2010:11165 (tonal artwork).
export const colors=['Purple 30','Blue 30','Green 30','Orange 30','Red 30','Neutral 30','Yellow 30','Mulberry 30'];
export const colorStops=['var(--origin-purple-30,#bea1f5)','var(--origin-blue-30,#8dcaf2)','var(--origin-green-30,#3ac7a1)','var(--origin-orange-30,#ff9d56)','var(--origin-red-30,#ff565e)','var(--origin-neutral-30,#bfbcb6)','var(--origin-yellow-30,#f9d255)','var(--origin-mulberry-30,#da7cb4)'];
export const textures=['Tonal 06','Tonal 02','Tonal 03','Tonal 35','Tonal 15','Tonal 20','Tonal 08','Tonal 40'];
export const textureFills=['06','02','03','35','15','20','08','40'].map(id=>`url("assets/hero-textures/tonal-${id}.png") center / cover no-repeat`);
export function HeroAvatar({choice={}}){
 const id=useId().replaceAll(':','');
 const surface=Number.isInteger(choice.texture)?textureFills[choice.texture]:colorStops[choice.color??0];
 return <div className={'hero-tile'+(choice.texture===3?' hero-tile-stretched':'')} style={{'--hero-surface':surface}} role="img" aria-label={`${choice.heroName?.trim()||'Hero'}, ${Number.isInteger(choice.texture)?textures[choice.texture]:colors[choice.color??0]}`}><svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id={id+'dot'} cx="33%" cy="24%"><stop stopColor="#a09199"/><stop offset=".35" stopColor="#483039"/><stop offset=".8" stopColor="#241820"/><stop offset="1" stopColor="#110c12"/></radialGradient><linearGradient id={id+'cape'}><stop stopColor="#786575"/><stop offset="1" stopColor="#31222e"/></linearGradient></defs><circle cx="100" cy="53" r="19" fill={`url(#${id}dot)`}/><path d="M100 82 L58 151 Q53 160 63 155 L100 137 L137 155 Q147 160 142 151Z" fill={`url(#${id}cape)`} stroke="#46313f" strokeWidth="2"/><path d="M100 82 L100 137 L137 155 Q147 160 142 151Z" fill="#30232f"/></svg></div>
}
export default function HeroPicker({draft,setDraft,onSave,onClose,showSave=true,subject='Hero'}){
 const id=useId();
 return <form className="hero-picker" onSubmit={e=>{e.preventDefault();onSave({...draft,heroName:draft.heroName?.trim()||subject})}}>
 <div className="hero-picker-options"><h2 id={id}>Customize your {subject}</h2><fieldset><legend>Colors</legend><div className="hero-picker-swatches">{colors.map((name,i)=><button type="button" key={name} aria-label={name} aria-pressed={draft.texture==null&&(draft.color??0)===i} style={{background:colorStops[i]}} onClick={()=>setDraft(d=>({...d,color:i,colorCustomized:true,texture:null}))}/>)}</div></fieldset><fieldset><legend>Textures</legend><div className="hero-picker-swatches">{textures.map((name,i)=><button type="button" key={name} aria-label={name} aria-pressed={draft.texture===i} style={{background:textureFills[i]}} onClick={()=>setDraft(d=>({...d,texture:i}))}/>)}</div></fieldset></div>
 <div className="hero-picker-preview">{onClose&&<button type="button" className="hero-picker-close" aria-label="Close customization" onClick={onClose}>×</button>}<input aria-label={`Your name for ${subject}`} value={draft.heroName??subject} maxLength={32} placeholder={subject} autoComplete="off" onChange={e=>setDraft(d=>({...d,heroName:e.target.value}))}/><div className="hero-picker-avatar"><HeroAvatar choice={draft}/></div>{showSave&&<button type="submit" className="hero-picker-save">Save</button>}</div></form>
}
