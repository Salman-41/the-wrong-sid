'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { useClothCanvas } from './use-cloth-canvas';
import { clampCrossing, hitCrossing, pointOnMesh, type CrossingPoint, type RevealMesh } from '@/lib/reveal';
import { contourPath, paintReveal } from '@/lib/reveal-renderer';
import type { Artwork, Face } from '@/lib/weave';
import { makeLoomArtwork } from '@/lib/construction';

const initialMaterial=makeLoomArtwork();
function hasInitialMaterial(art:Artwork){
  return art.seed===initialMaterial.seed && art.pickStructures.every(rule=>rule==='plain') && (['warp','weft'] as const).every(axis=>
    art[axis].length===initialMaterial[axis].length && art[axis].every((thread,i)=>thread.color===initialMaterial[axis][i].color&&thread.thickness===initialMaterial[axis][i].thickness));
}

export interface ReverseSurfaceHandle { paint: (progress: number) => Face; }
export function ReverseSurface({artwork, selection, onSelect, onReady, onKeyboard, edgeCue, ref}: {
  artwork:Artwork;selection:CrossingPoint;onSelect:(point:CrossingPoint)=>void;onReady:(ready:boolean)=>void;
  onKeyboard:(key:string)=>void;ref:Ref<ReverseSurfaceHandle>;
  edgeCue: { current: HTMLButtonElement | null };
}) {
  const canvas=useRef<HTMLCanvasElement>(null), front=useRef<HTMLCanvasElement>(null), reverse=useRef<HTMLCanvasElement>(null);
  const overlay=useRef<SVGSVGElement>(null), edge=useRef<SVGPathElement>(null), marker=useRef<SVGCircleElement>(null);
  const fringe=useRef<Map<string,SVGPathElement>>(new Map());
  const mesh=useRef<RevealMesh|null>(null), progress=useRef(0);
  const economy=useRef(false);
  const [paintCount,setPaintCount]=useState(0),[surfaceError,setSurfaceError]=useState(false);
  const painted=useCallback(()=>setPaintCount(current=>current+1),[]);
  const frontRender=useClothCanvas(front,artwork,{face:'front',zoom:1,fit:'stretch',transparent:true,bottomUp:true,onPaint:painted});
  const backRender=useClothCanvas(reverse,artwork,{face:'reverse',zoom:1,fit:'stretch',transparent:true,bottomUp:true,onPaint:painted});
  const ready=frontRender.ready&&backRender.ready&&!surfaceError&&artwork.weft.length>0;
  const paint=useCallback((next:number):Face=>{
    progress.current=next;
    if(!canvas.current||!front.current||!reverse.current) return next>.5?'reverse':'front';
    const bounds=canvas.current.getBoundingClientRect();if(bounds.width<1||bounds.height<1)return 'front';
    try {
      const started=performance.now();
      const shape=paintReveal(canvas.current,front.current,reverse.current,next,bounds.width,bounds.height,economy.current||navigator.hardwareConcurrency<=4);mesh.current=shape;
      if(performance.now()-started>32)economy.current=true;
      canvas.current.dataset.progress=next.toFixed(4);canvas.current.dataset.rows=String(artwork.weft.length);
      if(overlay.current)overlay.current.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
      if(edge.current) {edge.current.setAttribute('d',contourPath(shape.points.map(line=>line[shape.columns])));edge.current.style.opacity=String(Math.sin(Math.PI*next)*.8);}
      const liftPoint=pointOnMesh(shape,1,.61),stage=canvas.current.closest('.reverse-stage')?.getBoundingClientRect();
      if(edgeCue.current&&stage){
        const left=Math.max(edgeCue.current.offsetWidth+15,Math.min(stage.width-18,liftPoint.screenX+bounds.left-stage.left));
        const top=Math.max(100,Math.min(stage.height-125,liftPoint.screenY+bounds.top-stage.top));
        Object.assign(edgeCue.current.style,{left:`${left}px`,top:`${top}px`,right:'auto',bottom:'auto',transform:'translate(-100%,-50%)'});
      }
      const selected=clampCrossing(artwork,selection),u=(selected.end+.5)/artwork.warp.length,v=1-(selected.pick+.5)/Math.max(1,artwork.weft.length);
      const point=pointOnMesh(shape,u,v), hit=hitCrossing(shape,point.screenX,point.screenY,artwork);
      if(marker.current){marker.current.setAttribute('cx',String(point.screenX));marker.current.setAttribute('cy',String(point.screenY));marker.current.style.opacity=hit&&Math.abs(hit.end-selected.end)<2&&Math.abs(hit.pick-selected.pick)<2?'1':'0';}
      const paths=new Map<string,string>();
      const add=(color:string,path:string)=>paths.set(color,(paths.get(color)??'')+path);
      const yarnStep=Math.max(1,Math.ceil(artwork.warp.length/72));
      artwork.warp.forEach((thread,i)=>{
        if(i%yarnStep)return;
        const u=(i+.5)/artwork.warp.length,loose=4+((artwork.seed+i*17)%7);
        for(const v of [0,1]) {
          const at=pointOnMesh(shape,u,v),inner=pointOnMesh(shape,u,v===0?.02:.98);
          const dx=at.screenX-inner.screenX,dy=at.screenY-inner.screenY,l=Math.hypot(dx,dy)||1;
          const endX=at.screenX+dx/l*loose,endY=at.screenY+dy/l*loose;
          add(thread.color,`M${at.screenX.toFixed(2)} ${at.screenY.toFixed(2)}Q${(at.screenX+dx/l*loose*.5+1.2).toFixed(2)} ${(at.screenY+dy/l*loose*.5).toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`);
        }
      });
      paths.forEach((d,color)=>fringe.current.get(color)?.setAttribute('d',d));
      return Math.cos(point.angle)>=0?'front':'reverse';
    } catch {setSurfaceError(true);return 'front';}
  },[artwork,selection,edgeCue]);
  useImperativeHandle(ref,()=>({paint}),[paint]);
  useEffect(()=>{onReady(ready);},[ready,onReady]);
  useEffect(()=>{if(ready)paint(progress.current);},[ready,paint,paintCount]);
  useEffect(()=>{
    const element=canvas.current;if(!element)return;
    const observer=new ResizeObserver(()=>paint(progress.current));observer.observe(element);return()=>observer.disconnect();
  },[paint]);
  const colors=[...new Set(artwork.warp.map(thread=>thread.color))];
  return <div className={`reverse-surface ${ready?'is-ready':''}`}>
    {artwork.weft.length>0 ? <>
      {hasInitialMaterial(artwork)&&<Image src='/images/reverse-surface-front.webp' fill sizes='(max-width: 767px) 100vw, 60vw' loading='eager' alt='' className='reverse-surface-poster' />}
      <canvas ref={front} className='reverse-texture' aria-hidden='true'/><canvas ref={reverse} className='reverse-texture' aria-hidden='true'/>
      <canvas ref={canvas} className='reverse-moving-cloth' role='img' aria-label={`Your textile, ${artwork.weft.length} woven rows. Its front and reverse use the same yarns and crossing rules.`}/>
      <svg ref={overlay} className='reverse-continuity' aria-hidden='true'><path ref={edge} fill='none' stroke='#fff0d4' strokeWidth='2' opacity='0'/>{colors.map(color=><path key={color} ref={node=>{if(node)fringe.current.set(color,node);else fringe.current.delete(color);}} fill='none' stroke={color} strokeWidth='.85' strokeLinecap='round' />)}<circle ref={marker} r='12' fill='none' stroke='#fff4de' strokeWidth='1'/></svg>
      <div className='reverse-pick-surface' role='group' tabIndex={0} aria-label='Textile inspection. Tap a crossing to select it. Arrow keys choose a crossing. Enter or Space lifts or turns the cloth.' onPointerUp={event=>{
        if(!ready||!mesh.current)return;const bounds=event.currentTarget.getBoundingClientRect();const hit=hitCrossing(mesh.current,event.clientX-bounds.left,event.clientY-bounds.top,artwork);if(hit)onSelect(hit);
      }} onKeyDown={event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key)){event.preventDefault();onKeyboard(event.key);}}}/>
    </> : <div className='reverse-empty'><p className='eyebrow'>The warp is waiting</p><p>Weave a row.<br/>Then turn it over.</p><Link href='/loom' prefetch={false}>Return to the Loom ↗</Link></div>}
    {(frontRender.error||backRender.error||surfaceError)&&<p className='reverse-render-error' role='alert'>Live material rendering is unavailable. Your cloth data remain intact; return to the Loom to save them. The explanation remains available below.</p>}
  </div>;
}
