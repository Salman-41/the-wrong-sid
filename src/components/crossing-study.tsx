import { useId } from 'react';
import { crossingAt, PALETTE, type Artwork, type Face } from '@/lib/weave';
import { visibleCrossing, type CrossingPoint } from '@/lib/reveal';
export function yarnName(color:string) {return PALETTE.find(yarn=>yarn.color.toLowerCase()===color.toLowerCase())?.name.toLowerCase()??'custom';}
/** A diagram of the selected actual crossing, not a fixed plain-weave illustration. */
export function CrossingStudy({artwork,point,face}:{artwork:Artwork;point:CrossingPoint;face:Face}) {
  const selected=visibleCrossing(artwork,point,face),id=useId().replaceAll(':','');
  const starts=Math.max(0,Math.min(artwork.warp.length-5,selected.viewEnd-2));
  const ends=Array.from({length:Math.min(5,artwork.warp.length)},(_,i)=>starts+i);
  const picks=Array.from({length:Math.min(5,artwork.weft.length)},(_,i)=>Math.min(artwork.weft.length-1,Math.max(4,selected.pick+2))-i).filter(p=>p>=0);
  const x=(i:number)=>18+i*30,y=(i:number)=>18+i*30;
  return <svg className='reverse-crossing-study' viewBox='0 0 156 156' role='img' aria-label={selected.weft?`${yarnName(selected.warp.color)} warp ${selected.warpAbove?'above':'below'} ${yarnName(selected.weft.color)} weft on the ${face}. Adjacent crossings follow their stored weave rules.`:'Unwoven warp threads. There are no weft crossings yet.'}>
    <defs><filter id={`${id}-shadow`} filterUnits='userSpaceOnUse' x='0' y='0' width='156' height='156'><feDropShadow dx='1' dy='2' stdDeviation='.8' floodOpacity='.65'/></filter></defs>
    {ends.map((end,i)=><path key={`warp-${end}`} d={`M${x(i)} 4V150`} stroke={artwork.warp[face==='front'?end:artwork.warp.length-1-end].color} strokeWidth='8' strokeLinecap='round' opacity='.56'/>)}
    {picks.map((pick,i)=><path key={`weft-${pick}`} d={`M4 ${y(i)}H150`} stroke={artwork.weft[pick].color} strokeWidth='8' strokeLinecap='round' opacity='.48'/>)}
    {ends.flatMap((end,ei)=>picks.map((pick,pi)=>{
      const over=crossingAt(artwork,end,pick,face),thread=over?artwork.warp[face==='front'?end:artwork.warp.length-1-end]:artwork.weft[pick];
      const d=over?`M${x(ei)} ${y(pi)-13}Q${x(ei)+1.5} ${y(pi)} ${x(ei)} ${y(pi)+13}`:`M${x(ei)-13} ${y(pi)}Q${x(ei)} ${y(pi)-1.5} ${x(ei)+13} ${y(pi)}`;
      return <g key={`${end}-${pick}`}><path d={d} fill='none' stroke={thread.color} strokeWidth='9' strokeLinecap='round' filter={`url(#${id}-shadow)`}/><path d={d} fill='none' stroke='#fff7df' strokeWidth='.7' opacity='.3'/></g>;
    }))}
    {selected.weft&&<circle cx={x(selected.viewEnd-starts)} cy={y(picks.indexOf(selected.pick))} r='15' fill='none' stroke='#f2ede5' strokeWidth='.7'/>}
  </svg>;
}
