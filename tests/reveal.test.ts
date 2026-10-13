import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCanvas, Path2D } from '@napi-rs/canvas';
import { createRevealMesh, pointOnMesh, hitCrossing, textureU, visibleCrossing, LIFT_POSITION } from '../src/lib/reveal';
import { paintReveal } from '../src/lib/reveal-renderer';
import { renderCloth, clothWindow } from '../src/lib/renderer';
import { makeLoomArtwork } from '../src/lib/construction';
import { crossingAt, serializeArtwork } from '../src/lib/weave';
Object.assign(globalThis,{Path2D,window:{devicePixelRatio:1}});
const near=(a:number,b:number)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('the selected edge curls while the grounded body stays anchored; both faces are exposed',()=>{
 const flat=createRevealMesh(800,900,0,40,6),lift=createRevealMesh(800,900,LIFT_POSITION,40,6);
 for(let j=0;j<=6;j++) for(let i=0;i<=20;i++) {
  near(flat.points[j][i].screenX,lift.points[j][i].screenX);
  near(flat.points[j][i].screenY,lift.points[j][i].screenY);
 }
 assert(lift.triangles.some(t=>t.face==='front'));
 assert(lift.triangles.some(t=>t.face==='reverse'));
 assert(lift.points[3][40].z>100);
});
test('strip integration preserves yarn coordinates and crosswise segment lengths through the turn',()=>{
 for(const progress of [0,.15,LIFT_POSITION,.55,.8,1]) {
  const mesh=createRevealMesh(800,900,progress,40,6);
  for(const line of mesh.points)for(let i=1;i<line.length;i++) {
   near(Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z),800*.94/40);
   assert(Number.isFinite(line[i].screenX)&&Number.isFinite(line[i].screenY));
  }
 }
 const front=createRevealMesh(800,900,0),back=createRevealMesh(800,900,1);
 assert(front.triangles.every(t=>t.face==='front'));assert(back.triangles.every(t=>t.face==='reverse'));
 for(const u of [.05,.25,.5,.75,.95]) {
  near(pointOnMesh(front,u,.5).screenX,800-pointOnMesh(back,u,.5).screenX);
  near(textureU(u,'front'),u);near(textureU(u,'reverse'),1-u);
 }
});
test('selection follows the same original yarn on both faces and hit testing mirrors view direction',()=>{
 const art=makeLoomArtwork(),point={end:31,pick:17};
 const a=visibleCrossing(art,point,'front'),b=visibleCrossing(art,point,'reverse');
 assert.equal(a.warp,b.warp);assert.equal(a.weft,b.weft);assert.equal(a.warpAbove,!b.warpAbove);
 for(const progress of [0,1]) {
  const mesh=createRevealMesh(800,900,progress),p=pointOnMesh(mesh,(point.end+.5)/48,1-(point.pick+.5)/28);
  assert.deepEqual(hitCrossing(mesh,p.screenX,p.screenY,art),point);
 }
 assert.equal(hitCrossing(createRevealMesh(800,900,0),-10,-10,art),null);
});
test('projected endpoint rasters preserve actual crossing ownership without double mirroring',()=>{
 const art=makeLoomArtwork();art.warp=Array.from({length:11},()=>({color:'#DD2222',thickness:.8}));
 art.weft=Array.from({length:9},()=>({color:'#2222DD',thickness:.8}));art.pickStructures=['plain','plain','twill-2-2','twill-2-2','satin-5','satin-5','sateen-5','sateen-5','plain'];
 const snapshot=serializeArtwork(art),textures=([ 'front','reverse'] as const).map(face=>{
  const canvas=createCanvas(440,540);renderCloth(canvas as unknown as HTMLCanvasElement,art,{width:440,height:540,zoom:1,face,bottomUp:true,fit:'stretch',transparent:true});return canvas;
 });
 for(const progress of [0,1]) {
  const canvas=createCanvas(440,540),mesh=paintReveal(canvas as unknown as HTMLCanvasElement,textures[0] as unknown as HTMLCanvasElement,textures[1] as unknown as HTMLCanvasElement,progress,440,540);
  for(let pick=0;pick<9;pick++)for(let end=0;end<11;end++) {
   const p=pointOnMesh(mesh,(end+.5)/11,1-(pick+.5)/9),pixel=canvas.getContext('2d').getImageData(Math.round(p.screenX),Math.round(p.screenY),1,1).data;
   const face=progress===0?'front':'reverse',viewEnd=progress===0?end:10-end;
   assert.equal(pixel[0]>pixel[2],crossingAt(art,viewEnd,pick,face),`${face} original end ${end}, pick ${pick}`);
  }
 }
 assert.equal(serializeArtwork(art),snapshot);
});
test('the focused magnifier centers the same physical crossing before and after reversing',()=>{
 const art=makeLoomArtwork();art.warp=art.warp.map(thread=>({...thread,color:'#DD2222'}));art.weft=art.weft.map(thread=>({...thread,color:'#2222DD'}));
 for(const focus of [{end:0,pick:0},{end:31,pick:17},{end:47,pick:27}])for(const face of ['front','reverse'] as const){
  const canvas=createCanvas(300,300);renderCloth(canvas as unknown as HTMLCanvasElement,art,{width:300,height:300,face,zoom:8,bottomUp:true,focus});
  const pixel=canvas.getContext('2d').getImageData(150,150,1,1).data,viewEnd=face==='front'?focus.end:47-focus.end;
  assert.equal(pixel[0]>pixel[2],crossingAt(art,viewEnd,focus.pick,face));
 }
});

test('a cover crop preserves square yarn pitch and selects the same original crossing on either face',()=>{
 const art=makeLoomArtwork();
 art.warp=art.warp.map(thread=>({...thread,color:'#DD2222'}));
 art.weft=art.weft.map(thread=>({...thread,color:'#2222DD'}));
 for(const [width,height] of [[420,740],[950,540]]) {
  const window=clothWindow(art,width,height);
  near(width/window.ends,height/window.picks);
  assert(window.end>=0&&window.pick>=0);
  const point={end:24,pick:14},u=(point.end+.5-window.end)/window.ends,v=1-(point.pick+.5-window.pick)/window.picks;
  const textures=(['front','reverse'] as const).map(face=>{
   const canvas=createCanvas(width,height);
   renderCloth(canvas as unknown as HTMLCanvasElement,art,{width,height,zoom:1,face,bottomUp:true,fit:'cover',transparent:true});
   return canvas;
  });
  for(const progress of [0,1]) {
   const canvas=createCanvas(width,height);
   const mesh=paintReveal(canvas as unknown as HTMLCanvasElement,textures[0] as unknown as HTMLCanvasElement,textures[1] as unknown as HTMLCanvasElement,progress,width,height);
   const p=pointOnMesh(mesh,u,v);
   assert.deepEqual(hitCrossing(mesh,p.screenX,p.screenY,art,window),point);
   const pixel=canvas.getContext('2d').getImageData(Math.round(p.screenX),Math.round(p.screenY),1,1).data;
   assert.equal(pixel[0]>pixel[2],visibleCrossing(art,point,progress===0?'front':'reverse').warpAbove);
  }
 }
});
