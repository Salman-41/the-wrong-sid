import { createRevealMesh, textureU, pointOnMesh, LIFT_POSITION, type RevealMesh, type RevealTriangle, type SurfacePoint } from './reveal';

type Texture = HTMLCanvasElement;
function outline(ctx: CanvasRenderingContext2D, mesh: RevealMesh) {
  const {points,columns,rows}=mesh;
  ctx.beginPath();
  const all=[...points[0],...points.slice(1).map(line=>line[columns]),...points[rows].slice(0,-1).reverse(),...points.slice(1,-1).reverse().map(line=>line[0])];
  all.forEach((point,i)=>{if(i)ctx.lineTo(point.screenX,point.screenY);else ctx.moveTo(point.screenX,point.screenY);});ctx.closePath();
}
/** Affine texture triangles. Cached yarn renders are never regenerated during the motion. */
function paintTriangle(ctx: CanvasRenderingContext2D, tri: RevealTriangle, texture: Texture) {
  const [a,b,c]=tri.points;
  const src=tri.points.map(point=>({x:textureU(point.u,tri.face)*texture.width,y:point.v*texture.height}));
  const [s,t,r]=src;
  const determinant=s.x*(t.y-r.y)+t.x*(r.y-s.y)+r.x*(s.y-t.y);
  const screenArea=(b.screenX-a.screenX)*(c.screenY-a.screenY)-(b.screenY-a.screenY)*(c.screenX-a.screenX);
  if(Math.abs(determinant)<.001||Math.abs(screenArea)<.06)return;
  const solve=(p:number,q:number,v:number)=>[
    (p*(t.y-r.y)+q*(r.y-s.y)+v*(s.y-t.y))/determinant,
    (p*(r.x-t.x)+q*(s.x-r.x)+v*(t.x-s.x))/determinant,
    (p*(t.x*r.y-r.x*t.y)+q*(r.x*s.y-s.x*r.y)+v*(s.x*t.y-t.x*s.y))/determinant,
  ];
  const [m11,m21,dx]=solve(a.screenX,b.screenX,c.screenX),[m12,m22,dy]=solve(a.screenY,b.screenY,c.screenY);
  ctx.save();ctx.beginPath();
  // Tiny overlap removes antialias seams; source UVs stay unchanged at the edges.
  const centerX=(a.screenX+b.screenX+c.screenX)/3,centerY=(a.screenY+b.screenY+c.screenY)/3;
  for(const [i,point] of tri.points.entries()) {
    const vx=point.screenX-centerX,vy=point.screenY-centerY,d=Math.hypot(vx,vy)||1;
    const x=point.screenX+vx/d*.4,y=point.screenY+vy/d*.4;
    if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);
  }
  ctx.closePath();ctx.clip();ctx.transform(m11,m12,m21,m22,dx,dy);ctx.drawImage(texture,0,0);
  ctx.restore();
  if(tri.light<.995) {
    ctx.beginPath();ctx.moveTo(a.screenX,a.screenY);ctx.lineTo(b.screenX,b.screenY);ctx.lineTo(c.screenX,c.screenY);ctx.closePath();
    ctx.fillStyle=`rgba(12,6,16,${(1-tri.light)*.58})`;ctx.fill();
  }
}
export function paintReveal(canvas: HTMLCanvasElement, front: Texture, reverse: Texture, progress: number, width: number, height: number): RevealMesh {
  const mobile=width<600,dpr=Math.min(window.devicePixelRatio, mobile?1.5:1.75,Math.sqrt(2_500_000/(width*height)));
  const pixelWidth=Math.round(width*dpr),pixelHeight=Math.round(height*dpr);
  if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;}
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D is unavailable.');
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const mesh=createRevealMesh(width,height,progress,mobile?24:40,mobile?4:7);
  const lift=Math.sin(Math.PI*progress);
  ctx.save();ctx.translate(8+lift*23,14+lift*25);outline(ctx,mesh);ctx.fillStyle=`rgba(0,0,0,${.35-lift*.13})`;ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=12+lift*22;ctx.fill();ctx.restore();
  let foldShadowPainted=false;
  mesh.triangles.forEach(tri=>{
    if(progress>0&&progress<=LIFT_POSITION+.015&&!foldShadowPainted&&tri.depth>1){
      foldShadowPainted=true;
      const crease=pointOnMesh(mesh,.65,.5),tip=pointOnMesh(mesh,1,.5);
      const start=Math.min(crease.screenX,tip.screenX)-12,end=Math.max(crease.screenX,tip.screenX)+18;
      ctx.save();outline(ctx,mesh);ctx.clip();
      const cast=ctx.createLinearGradient(start,0,end,0),strength=.34*progress/LIFT_POSITION;
      cast.addColorStop(0,'rgba(8,4,10,0)');cast.addColorStop(.58,`rgba(8,4,10,${strength})`);cast.addColorStop(1,'rgba(8,4,10,0)');
      ctx.fillStyle=cast;ctx.fillRect(start,0,end-start,height);ctx.restore();
    }
    paintTriangle(ctx,tri,tri.face==='front'?front:reverse);
  });
  // The continuous cut edge follows the same mesh as both yarn faces.
  outline(ctx,mesh);ctx.strokeStyle='rgba(231,207,170,.43)';ctx.lineWidth=.8;ctx.stroke();
  const edge=mesh.points.map(line=>line[mesh.columns]);
  ctx.beginPath();edge.forEach((point,i)=>{if(i)ctx.lineTo(point.screenX,point.screenY);else ctx.moveTo(point.screenX,point.screenY);});
  ctx.strokeStyle=`rgba(255,226,187,${.28+lift*.26})`;ctx.lineWidth=1.5;ctx.stroke();
  return mesh;
}
export function contourPath(points: SurfacePoint[]): string {return points.map((point,i)=>`${i?'L':'M'}${point.screenX.toFixed(2)} ${point.screenY.toFixed(2)}`).join(' ');}
