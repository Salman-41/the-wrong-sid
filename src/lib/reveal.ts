import { crossingAt, type Artwork, type Face } from './weave';

export interface Point3 { x: number; y: number; z: number; u: number; v: number; angle: number }
export interface SurfacePoint extends Point3 { screenX: number; screenY: number }
export interface RevealTriangle { points: [SurfacePoint, SurfacePoint, SurfacePoint]; face: Face; depth: number; light: number }
export interface RevealMesh { points: SurfacePoint[][]; triangles: RevealTriangle[]; columns: number; rows: number }
export interface CrossingPoint { end: number; pick: number }
export interface ClothWindow { end: number; pick: number; ends: number; picks: number }
export type RevealPhase = 'surface' | 'edge' | 'construction' | 'reverse';
export const LIFT_POSITION = .38;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const smooth = (n: number) => { const t=clamp(n,0,1); return t*t*(3-2*t); };
export function revealPhase(progress: number): RevealPhase {
  return progress < .08 ? 'surface' : progress < .27 ? 'edge' : progress < .86 ? 'construction' : 'reverse';
}

/** Inextensible strip integration, with restrained crosswise sag. An authored 2.5D study. */
export function createRevealMesh(width: number, height: number, progress: number, columns = 36, rows = 6): RevealMesh {
  const p = clamp(progress, 0, 1), bend = Math.sin(Math.PI * p);
  const edgeLift=smooth(p/LIFT_POSITION), turn=smooth((p-LIFT_POSITION)/(1-LIFT_POSITION));
  const clothWidth = width * .94, clothHeight = height * .91;
  const focal = Math.max(width, height) * 2.7;
  const points: SurfacePoint[][] = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows, line: Point3[] = [];
    let x = 0, z = 0;
    for (let i = 0; i <= columns; i++) {
      const u = i / columns;
      const curledEdge=smooth((u-.57)/.43);
      const angle = Math.PI*turn + edgeLift*(1-turn)*curledEdge*(2.68+.13*Math.cos(Math.PI*v)) + Math.sin(Math.PI*turn)*.34*(u-.5);
      if (i) {
        const mid = (angle + line[i - 1].angle) / 2;
        x += Math.cos(mid) * clothWidth / columns;
        z += Math.sin(mid) * clothWidth / columns;
      }
      const edge = clothHeight * (.003 * Math.cos(u * 23) + .002 * Math.sin(u * 41)) * (v - .5);
      const sag = bend * clothHeight * (.024 * Math.sin(Math.PI*u) * v*v * turn - .022 * curledEdge * (1-v));
      line.push({x, y: (v - .5) * clothHeight + sag + edge, z, u, v, angle});
    }
    const middle = line[Math.floor(columns / 2)];
    points.push(line.map(point => {
      const px = point.x - middle.x, pz = point.z - middle.z + Math.sin(Math.PI*turn) * clothWidth * .045;
      const perspective = focal / (focal - pz);
      return {...point, x: px, z: pz, screenX: width * .5 + px * perspective, screenY: height * .5 + point.y * perspective};
    }));
  }
  const triangles: RevealTriangle[] = [];
  function triangle(a: SurfacePoint,b: SurfacePoint,c: SurfacePoint) {
    const winding = (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
    const face = winding >= 0 ? 'front' : 'reverse';
    const angle = (a.angle+b.angle+c.angle)/3, sign = face === 'front' ? 1 : -1;
    const illumination = sign * (Math.sin(angle)*.32 + Math.cos(angle)*.94);
    triangles.push({points:[a,b,c],face,depth:(a.z+b.z+c.z)/3,light:clamp(.55+.45*illumination,.49,1)});
  }
  for(let j=0;j<rows;j++) for(let i=0;i<columns;i++) {
    const a=points[j][i],b=points[j][i+1],c=points[j+1][i+1],d=points[j+1][i];
    triangle(a,b,c); triangle(a,c,d);
  }
  triangles.sort((a,b)=>a.depth-b.depth);
  return {points,triangles,columns,rows};
}

/** Reverse textures already mirror ends; invert their UV once to preserve physical yarn identity. */
export function textureU(physicalU: number, face: Face): number { return face === 'front' ? physicalU : 1-physicalU; }
export function pointOnMesh(mesh: RevealMesh, u: number, v: number): SurfacePoint {
  const x=clamp(u,0,1)*mesh.columns,y=clamp(v,0,1)*mesh.rows;
  const i=Math.min(mesh.columns-1,Math.floor(x)),j=Math.min(mesh.rows-1,Math.floor(y)),a=x-i,b=y-j;
  const corners=[mesh.points[j][i],mesh.points[j][i+1],mesh.points[j+1][i+1],mesh.points[j+1][i]];
  const weights=[(1-a)*(1-b),a*(1-b),a*b,(1-a)*b];
  const mix=(key:keyof SurfacePoint)=>corners.reduce((sum,point,index)=>sum+point[key]*weights[index],0);
  return {x:mix('x'),y:mix('y'),z:mix('z'),u,v,angle:mix('angle'),screenX:mix('screenX'),screenY:mix('screenY')};
}
export function clampCrossing(art: Artwork, point: CrossingPoint): CrossingPoint {
  return {end:clamp(Math.round(point.end),0,art.warp.length-1),pick:clamp(Math.round(point.pick),0,Math.max(0,art.weft.length-1))};
}
export function visibleCrossing(art: Artwork, point: CrossingPoint, face: Face) {
  const current=clampCrossing(art,point), viewEnd=face==='front'?current.end:art.warp.length-1-current.end;
  return { ...current, viewEnd, warp:art.warp[current.end],weft:art.weft[current.pick],warpAbove:art.weft.length>0&&crossingAt(art,viewEnd,current.pick,face) };
}
export function hitCrossing(mesh: RevealMesh, x: number, y: number, art: Artwork, window: ClothWindow = { end: 0, pick: 0, ends: art.warp.length, picks: art.weft.length }): CrossingPoint | null {
  // Painter order reversed selects the visible triangle when the folded faces overlap.
  for(let i=mesh.triangles.length-1;i>=0;i--) {
    const [a,b,c]=mesh.triangles[i].points;
    const d=(b.screenY-c.screenY)*(a.screenX-c.screenX)+(c.screenX-b.screenX)*(a.screenY-c.screenY);
    if(Math.abs(d)<.001) continue;
    const wa=((b.screenY-c.screenY)*(x-c.screenX)+(c.screenX-b.screenX)*(y-c.screenY))/d;
    const wb=((c.screenY-a.screenY)*(x-c.screenX)+(a.screenX-c.screenX)*(y-c.screenY))/d, wc=1-wa-wb;
    if(wa>=0&&wb>=0&&wc>=0) return clampCrossing(art,{end:window.end+(wa*a.u+wb*b.u+wc*c.u)*window.ends-.5,pick:window.pick+(1-(wa*a.v+wb*b.v+wc*c.v))*window.picks-.5});
  }
  return null;
}
