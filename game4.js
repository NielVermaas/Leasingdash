function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600);}
function save(show=true){const data={...state,guests:[],particles:[],floatingText:[],started:true};localStorage.setItem('wonderland-works-save',JSON.stringify(data));if(show)toast('Park saved');}
function load(){try{const raw=localStorage.getItem('wonderland-works-save');if(!raw)return false;const d=JSON.parse(raw);Object.assign(state,d,{guests:[],particles:[],floatingText:[],started:false});return true;}catch(e){return false;}}
$('#saveBtn').onclick=()=>save();$('#pauseBtn').onclick=()=>{state.paused=!state.paused;$('#pauseBtn').textContent=state.paused?'▶':'⏸';toast(state.paused?'Game paused':'Park reopened');};document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{state.speed=+b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(x=>x.classList.toggle('active',x===b));});
$('#bulldozeBtn').onclick=()=>{const b=state.buildings.find(x=>x.id===state.selected);if(!b)return toast('Select a building first');removeBuilding(b);};
function removeBuilding(b){for(const id of [...b.queue,...b.active]){const g=state.guests.find(x=>x.id===id);if(g){g.status='wandering';g.target=null;g.tx=rand(40,W-40);g.ty=rand(90,H-70);}}state.cash+=Math.round(TYPES[b.type].cost*.35);state.buildings=state.buildings.filter(x=>x.id!==b.id);state.selected=null;toast(`${TYPES[b.type].name} removed`);renderInspector();}
function startPark(){
 if(state.started)return;
 const welcome=$('#welcome');if(welcome)welcome.classList.add('hidden');
 state.started=true;
 for(let i=0;i<8;i++)setTimeout(spawnGuest,i*180);
}
window.addEventListener('themepark:start',startPark);
window.__themeParkReady=true;
if(window.__themeParkStartRequested)startPark();
createButtons();const hadSave=load();seed();if(hadSave){$('#startBtn').textContent='Continue your park';}renderInspector();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);draw();updateUI();requestAnimationFrame(frame);}requestAnimationFrame(frame);
