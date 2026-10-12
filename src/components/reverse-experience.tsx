'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTextileProject } from './textile-project';
import { ReverseSurface, type ReverseSurfaceHandle } from './reverse-surface';
import { CrossingStudy, yarnName } from './crossing-study';
import { useClothCanvas } from './use-cloth-canvas';
import { LIFT_POSITION, clampCrossing, revealPhase, visibleCrossing, type CrossingPoint, type RevealPhase } from '@/lib/reveal';
import { clothDescription, STRUCTURES, type Artwork, type Face } from '@/lib/weave';

type Timeline=ReturnType<typeof import('gsap').gsap.timeline>;
const phaseNames:Record<RevealPhase,string>={surface:'The visible surface',edge:'The edge rises',construction:'The construction beneath',reverse:'The other face'};
function FaceSwitch({progress,ready,onChange,className=''}:{progress:number;ready:boolean;onChange:(position:number)=>void;className?:string}) {
  return <div className={`reverse-face-switch ${className}`} role='group' aria-label='Change the face'><button disabled={!ready} aria-pressed={progress<.02} onClick={()=>onChange(0)}>Front</button><button disabled={!ready} aria-pressed={progress>.98} onClick={()=>onChange(1)}>Reverse</button></div>;
}
function CrossingLens({artwork,point,face,zoom}:{artwork:Artwork;point:CrossingPoint;face:Face;zoom:number}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const {ready,error}=useClothCanvas(canvas,artwork,{face,bottomUp:true,zoom:zoom*Math.max(artwork.warp.length,artwork.weft.length)/10,focus:point});
  return <div className='reverse-lens-surface'><canvas ref={canvas} className={ready?'is-ready':''} role='img' aria-label={`Magnified ${face} of the selected actual yarn crossing. The same original end and pick stay centered on both faces.`}/>{!ready&&!error&&<p>Looking closer…</p>}{error&&<p role='alert'>The magnifier is unavailable. The crossing diagram and yarn description remain available.</p>}</div>;
}
export function ReverseExperience() {
  const {artwork,zoom,setZoom}=useTextileProject();
  const [ready,setReady]=useState(false),[phase,setPhase]=useState<RevealPhase>('surface'),[position,setPosition]=useState(0),[busy,setBusy]=useState(false);
  const [selected,setSelected]=useState<CrossingPoint>({end:31,pick:17}),[face,setFace]=useState<Face>('front'),[lensOpen,setLensOpen]=useState(false);
  const point=clampCrossing(artwork,selected),crossing=visibleCrossing(artwork,point,face);
  const surface=useRef<ReverseSurfaceHandle>(null),timeline=useRef<Timeline|null>(null),pose=useRef({progress:0}),request=useRef(0),mounted=useRef(true),dialog=useRef<HTMLDialogElement>(null);
  const edgeCue=useRef<HTMLButtonElement>(null);
  const lastPhase=useRef<RevealPhase>('surface'),lastFace=useRef<Face>('front');
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current++;timeline.current?.kill();};},[]);
  const updatePose=useCallback(()=>{
    const p=pose.current.progress,currentPhase=revealPhase(p),currentFace=surface.current?.paint(p)??'front';
    if(lastPhase.current!==currentPhase){lastPhase.current=currentPhase;setPhase(currentPhase);}
    if(lastFace.current!==currentFace){lastFace.current=currentFace;setFace(currentFace);}
  },[]);
  useEffect(()=>{updatePose();},[selected,artwork,ready,updatePose]);
  const turn=useCallback(async(target:number)=>{
    if(!ready)return;
    const id=++request.current;timeline.current?.kill();
    setBusy(true);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){pose.current.progress=target;updatePose();setPosition(target);setBusy(false);return;}
    try {
      const {gsap}=await import('gsap');if(id!==request.current||!mounted.current)return;
      const distance=Math.abs(target-pose.current.progress);
      if(distance<.002){setBusy(false);return;}
      timeline.current=gsap.timeline({onUpdate:updatePose,onComplete:()=>{if(!mounted.current)return;setPosition(target);setBusy(false);}})
        .to(pose.current,{progress:target,duration:Math.max(.85,distance*2.9),ease:target===LIFT_POSITION?'power2.inOut':'sine.inOut'});
    } catch {
      if(id!==request.current||!mounted.current)return;
      pose.current.progress=target;updatePose();setPosition(target);setBusy(false);
    }
  },[ready,updatePose]);
  const nextTarget=position<.1?LIFT_POSITION:position<.9?1:0;
  const action=position<.1?'Lift the edge':position<.9?'Turn to reverse':'Lay the front down';
  function lift(){void turn(nextTarget);}
  function moveCrossing(key:string){
    if(key==='Enter'||key===' '){lift();return;}
    const amount=key==='ArrowLeft'?-1:key==='ArrowRight'?1:0;
    setSelected(current=>clampCrossing(artwork,{end:current.end+amount*(face==='front'?1:-1),pick:current.pick+(key==='ArrowUp'?1:key==='ArrowDown'?-1:0)}));
  }
  function inspect(){dialog.current?.showModal();setLensOpen(true);}
  const caption=crossing.weft?`${yarnName(crossing.warp.color)} warp ${crossing.warpAbove?'passes over':'passes under'} ${yarnName(crossing.weft.color)} weft.`:'There are no woven crossings yet.';
  return <main id='main-content' tabIndex={-1} className='reverse-page' data-phase={phase} data-face={face}>
    <div className='reverse-gallery'>
      <div className='reverse-editorial'><h1 aria-label='THE OTHER FACE'><span>THE</span><span>OTHER</span><span>FACE</span></h1><p className='reverse-dek'>The back tells<br/>another story.</p><p className='reverse-introduction'>Look closer at the<br/>paths threads take<br/>across the material.</p><button className='reverse-lift-action' onClick={lift} disabled={!ready} aria-controls='reverse-stage'><span aria-hidden='true'>↗</span>{action}</button><p className='reverse-room-note'>Your cloth. Both faces.</p></div>
      <section id='reverse-stage' className='reverse-stage' aria-label='Physical textile reveal' aria-busy={busy}>
        <ReverseSurface ref={surface} edgeCue={edgeCue} artwork={artwork} selection={point} onSelect={setSelected} onReady={setReady} onKeyboard={moveCrossing}/>
        <div className='reverse-mobile-title'><h2 aria-hidden='true'>THE<br/><span>REVERSE</span></h2><p>A different kind of beauty.</p></div>
        <div className='reverse-stage-caption'><span>{phaseNames[phase]}</span><span>{clothDescription(artwork)}</span></div>
        <button ref={edgeCue} className='reverse-edge-cue' disabled={!ready||busy} onClick={lift} aria-label={action}><span aria-hidden='true'>↗</span><span>{position<.1?'Lift here':position<.9?'Keep turning':'Turn back'}</span></button>
        <FaceSwitch progress={position} ready={ready} onChange={target=>void turn(target)} className='reverse-mobile-faces'/>
      </section>
      <aside className='reverse-construction' aria-label='The selected crossing'><p className='eyebrow reverse-under-over'>Under / over</p><CrossingStudy artwork={artwork} point={point} face={face}/><div className='reverse-crossing-copy'><p className='eyebrow'>This crossing</p><h2>{crossing.weft?(crossing.warpAbove?'Warp above.':'Weft above.'):'Unwoven.'}</h2><p className='reverse-yarn-description'>{caption}</p><p className='reverse-rule-note'>{crossing.weft?STRUCTURES[artwork.pickStructures[point.pick]].label:'Warp threads'}<br/>One cloth, seen from the {face}.</p></div><div className='reverse-desktop-face-controls'><p className='eyebrow'>Change the face</p><FaceSwitch progress={position} ready={ready} onChange={target=>void turn(target)}/></div><button className='reverse-inspect' disabled={!ready} onClick={inspect}>Inspect this crossing <span aria-hidden='true'>⌕</span></button><p className='reverse-selection-hint'>Tap the cloth to choose a point.<br/>Arrow keys follow the yarns.</p><details className='reverse-explanation'><summary>How the faces relate</summary><p>The same warp and weft continue through the fold. Turning the cloth mirrors its ends and exchanges the yarn above every crossing.</p><p>Depth, weight and light are visual approximations. The interlacement comes from your woven rows.</p></details><Link href='/loom' className='reverse-back-to-loom' prefetch={false}>Back to your Loom ↗</Link></aside>
    </div>
    <p className='reverse-live-state sr-only' role='status'>{busy?phaseNames[phase]:`${phaseNames[phase]}. ${caption}`}</p>
    <noscript><section className='reverse-static-explanation'><h2>One cloth. Two faces.</h2><p>These are the front and mathematically reversed face of the initial cloth. The same ends are mirrored, and every crossing is inverted. Enable JavaScript to lift your edge and inspect individual yarns.</p><div><figure><Image src='/images/reverse-surface-front.webp' width={760} height={920} alt='Front of the original initial woven model.'/><figcaption>Front</figcaption></figure><figure><Image src='/images/reverse-surface-back.webp' width={760} height={920} alt='Same initial woven model, mirrored with above and below exchanged.'/><figcaption>Reverse</figcaption></figure></div></section></noscript>
    <dialog ref={dialog} className='reverse-magnifier' aria-labelledby='reverse-lens-title' onClose={()=>setLensOpen(false)}><header><div><p className='eyebrow'>Follow a yarn</p><h2 id='reverse-lens-title'>{crossing.warpAbove?'Warp over weft.':'Weft over warp.'}</h2></div><button aria-label='Close yarn examination' onClick={()=>dialog.current?.close()}>×</button></header>{lensOpen&&<CrossingLens artwork={artwork} point={point} face={face} zoom={zoom}/>}<div className='reverse-lens-toolbar'><div className='reverse-crossing-arrows' role='group' aria-label='Choose a neighboring crossing'>{(['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'] as const).map((key,i)=><button key={key} aria-label={['Crossing to the left','Crossing above','Crossing below','Crossing to the right'][i]} onClick={()=>moveCrossing(key)}>{['←','↑','↓','→'][i]}</button>)}</div><div className='reverse-lens-faces' role='group' aria-label='Examine face'>{(['front','reverse'] as const).map(side=><button key={side} aria-pressed={face===side} onClick={()=>{pose.current.progress=side==='front'?0:1;timeline.current?.kill();request.current++;updatePose();setPosition(pose.current.progress);setBusy(false);}}>{side==='front'?'Front':'Reverse'}</button>)}</div></div><label className='reverse-zoom' htmlFor='reverse-zoom'>Magnify<input id='reverse-zoom' type='range' min='1' max='5' step='.1' value={zoom} onChange={event=>setZoom(Number(event.target.value))}/><output htmlFor='reverse-zoom'>{zoom.toFixed(1)}×</output></label><p className='reverse-lens-note'>{caption} Same physical crossing on both faces.</p></dialog>
  </main>;
}
