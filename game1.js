
'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const $ = s => document.querySelector(s);
const money = n => '$' + Math.round(n).toLocaleString();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>Math.random()*(b-a)+a;
const TYPES = {
 carousel:{name:'Carousel',emoji:'🎠',kind:'ride',cost:650,size:2,color:'#ff9fcb',capacity:6,cycle:8,price:12,appeal:28,upkeep:1.0},
 ferris:{name:'Ferris Wheel',emoji:'🎡',kind:'ride',cost:1200,size:3,color:'#77d6ff',capacity:8,cycle:13,price:18,appeal:40,upkeep:1.8},
 coaster:{name:'Mini Coaster',emoji:'🎢',kind:'ride',cost:2500,size:3,color:'#ffb85c',capacity:8,cycle:10,price:25,appeal:58,upkeep:3.2},
 drop:{name:'Drop Tower',emoji:'🗼',kind:'ride',cost:4200,size:2,color:'#aa92ff',capacity:10,cycle:9,price:32,appeal:72,upkeep:4.4},
 burger:{name:'Burger Stand',emoji:'🍔',kind:'food',cost:500,size:1,color:'#ffcb66',capacity:2,cycle:3.5,price:11,appeal:4,upkeep:.8},
 drinks:{name:'Drink Kiosk',emoji:'🥤',kind:'drink',cost:350,size:1,color:'#63e6be',capacity:2,cycle:2.8,price:7,appeal:3,upkeep:.55},
 restroom:{name:'Restroom',emoji:'🚻',kind:'toilet',cost:700,size:2,color:'#8ab4f8',capacity:4,cycle:4,price:1,appeal:2,upkeep:1.2},
 bench:{name:'Shaded Seating',emoji:'🌴',kind:'rest',cost:250,size:1,color:'#5ebf70',capacity:4,cycle:5,price:0,appeal:7,upkeep:.15}
};
const state={cash:5000,dayProfit:0,lifetimeProfit:0,rating:72,speed:1,paused:false,time:0,day:1,selected:null,buildType:null,nextId:1,buildings:[],guests:[],particles:[],floatingText:[],spawnTimer:0,autosave:0,mission:0,gate:{x:70,y:0},metrics:{hungry:0,thirsty:0,toilet:0,bored:0},started:false};
let W=900,H=650,dpr=1,last=performance.now();
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=r.width*dpr;canvas.height=r.height*dpr;W=r.width;H=r.height;ctx.setTransform(dpr,0,0,dpr,0,0);state.gate={x:W/2,y:H-20};}
window.addEventListener('resize',resize);resize();
function buildingDefaults(key,x,y){const t=TYPES[key];return {id:state.nextId++,type:key,x,y,size:t.size,level:1,capacity:t.capacity,cycle:t.cycle,price:t.price,appeal:t.appeal,queue:[],active:[],timer:0,revenue:0,served:0,upkeep:t.upkeep};}
function seed(){if(state.buildings.length)return; state.buildings.push(buildingDefaults('carousel',W*.29,H*.31),buildingDefaults('burger',W*.57,H*.34),buildingDefaults('drinks',W*.68,H*.49),buildingDefaults('restroom',W*.38,H*.58));}
function createButtons(){
 const rides=['carousel','ferris','coaster','drop'];const fac=['burger','drinks','restroom','bench'];
 const make=k=>`<button class="build-btn" data-build="${k}"><span class="emoji">${TYPES[k].emoji}</span><span class="name">${TYPES[k].name}</span><div class="cost">${money(TYPES[k].cost)}</div></button>`;
 $('#rideButtons').innerHTML=rides.map(make).join('');$('#facilityButtons').innerHTML=fac.map(make).join('');
 document.querySelectorAll('[data-build]').forEach(b=>b.onclick=()=>setBuildMode(b.dataset.build));
}
function setBuildMode(k){state.buildType=state.buildType===k?null:k;state.selected=null;document.querySelectorAll('[data-build]').forEach(b=>b.classList.toggle('active',b.dataset.build===state.buildType));$('#modePill').textContent=state.buildType?`🔨 Placing ${TYPES[state.buildType].name} — click grass`:'👆 Select mode';renderInspector();}
function canPlace(x,y,size,ignore=null){const s=42*size; if(x-s/2<15||x+s/2>W-15||y-s/2<65||y+s/2>H-55)return false; return !state.buildings.some(b=>{if(b.id===ignore)return false;const bs=42*b.size;return Math.abs(x-b.x)<(s+bs)/2+12&&Math.abs(y-b.y)<(s+bs)/2+12;});}
function place(k,x,y){const t=TYPES[k];if(state.cash<t.cost)return toast('Not enough cash');if(!canPlace(x,y,t.size))return toast('That space is blocked');state.cash-=t.cost;const b=buildingDefaults(k,x,y);state.buildings.push(b);state.selected=b.id;state.buildType=null;document.querySelectorAll('[data-build]').forEach(btn=>btn.classList.remove('active'));$('#modePill').textContent='👆 Select mode';burst(x,y,t.color);toast(`${t.name} opened!`);renderInspector();}
function spawnGuest(){const pull=state.buildings.reduce((s,b)=>s+b.appeal,0);const cap=20+pull*.62; if(state.guests.length>cap)return;const g={id:(globalThis.crypto && typeof globalThis.crypto.randomUUID==='function')?globalThis.crypto.randomUUID():(Date.now().toString(36)+Math.random().toString(36).slice(2)),x:state.gate.x+rand(-18,18),y:H+10,vx:0,vy:0,speed:rand(24,40),money:rand(45,130),happiness:rand(72,95),hunger:rand(0,30),thirst:rand(0,34),toilet:rand(0,25),fun:rand(45,80),target:null,status:'entering',wait:0,color:`hsl(${Math.floor(rand(0,360))} 72% 64%)`,shirt:`hsl(${Math.floor(rand(0,360))} 64% 48%)`,patience:rand(42,76),thought:''};state.guests.push(g);}
function chooseTarget(g){const candidates=state.buildings.filter(b=>{const t=TYPES[b.type]; if(g.money<t.price)return false;if(t.kind==='food'&&g.hunger<45)return false;if(t.kind==='drink'&&g.thirst<42)return false;if(t.kind==='toilet'&&g.toilet<42)return false;if(t.kind==='rest'&&g.happiness>75)return false;if(t.kind==='ride'&&g.fun>58&&Math.random()<.75)return false;return true;});
 if(!candidates.length){g.target=null;g.status='wandering';g.tx=rand(40,W-40);g.ty=rand(90,H-70);return;}
 candidates.sort((a,b)=>scoreTarget(g,b)-scoreTarget(g,a));const b=candidates[0];g.target=b.id;g.status='walking';g.tx=b.x+rand(-18,18);g.ty=b.y+42*b.size*.55+10;}
function scoreTarget(g,b){const t=TYPES[b.type];let need=t.kind==='food'?g.hunger:t.kind==='drink'?g.thirst:t.kind==='toilet'?g.toilet:t.kind==='rest'?100-g.happiness:100-g.fun;return need+t.appeal*.45-b.queue.length*5-Math.hypot(g.x-b.x,g.y-b.y)*.015+rand(0,12);}
function moveToward(g,tx,ty,dt){const dx=tx-g.x,dy=ty-g.y,d=Math.hypot(dx,dy);if(d<3)return true;g.x+=dx/d*g.speed*dt;g.y+=dy/d*g.speed*dt;return false;}
function updateGuests(dt){
 for(const g of state.guests){g.hunger=clamp(g.hunger+dt*.72,0,100);g.thirst=clamp(g.thirst+dt*.9,0,100);g.toilet=clamp(g.toilet+dt*.6,0,100);g.fun=clamp(g.fun-dt*.45,0,100);g.happiness=clamp(g.happiness-dt*((g.hunger+g.thirst+g.toilet>210)?1.3:.05),0,100);g.wait+=dt;
  if(g.status==='entering'){if(moveToward(g,state.gate.x,H-70,dt)){g.status='wandering';g.tx=rand(50,W-50);g.ty=rand(100,H-80);}}
  else if(g.status==='walking'||g.status==='wandering'){
   if(moveToward(g,g.tx,g.ty,dt)){if(g.status==='walking'){const b=state.buildings.find(x=>x.id===g.target);if(b){g.status='queue';g.wait=0;b.queue.push(g.id);}else chooseTarget(g);}else chooseTarget(g);}
  } else if(g.status==='queue'){
   const b=state.buildings.find(x=>x.id===g.target);if(!b){g.status='wandering';continue;}const qi=b.queue.indexOf(g.id);const ang=(qi%8)/8*Math.PI*2;const ring=Math.floor(qi/8);const tx=b.x+Math.cos(ang)*(34*b.size+10+ring*12),ty=b.y+Math.sin(ang)*(34*b.size+10+ring*12);moveToward(g,tx,ty,dt);
   if(g.wait>g.patience){b.queue=b.queue.filter(id=>id!==g.id);g.happiness-=12;g.thought='😠';g.status='wandering';g.target=null;g.tx=rand(40,W-40);g.ty=rand(90,H-70);}
  } else if(g.status==='using'){const b=state.buildings.find(x=>x.id===g.target);if(b){g.x=b.x+rand(-2,2);g.y=b.y+rand(-2,2);}}
  if((g.happiness<18||g.money<2||g.hunger>96||g.thirst>96||g.toilet>98)&&g.status!=='leaving'){removeFromQueues(g);g.status='leaving';g.target=null;g.thought=g.happiness<18?'😤':'👋';}
  if(g.status==='leaving'){if(moveToward(g,state.gate.x,H+18,dt))g.dead=true;}
 }
 state.guests=state.guests.filter(g=>!g.dead);
}
