var K={sh:'hda_shows',fo:'hda_fotos',vi:'hda_video'};
function sv(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function ld(k,d){try{var v=sessionStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
var D_SH=[
  {id:1,nome:'Roda de Samba na Pampulha',local:'Parque da Pampulha — BH',data:'2025-03-15',horario:'16h',ingresso:'Gratuito',dest:true,mapa:'Parque da Pampulha Belo Horizonte'},
  {id:2,nome:'Festival Samba & Cultura Mineira',local:'Teatro Francisco Nunes — BH',data:'2025-03-22',horario:'19h30',ingresso:'R$ 20,00',dest:false,mapa:'Teatro Francisco Nunes BH'},
  {id:3,nome:'Noite de Samba no Mercado Central',local:'Mercado Central de BH',data:'2025-04-05',horario:'18h',ingresso:'Gratuito',dest:false,mapa:'Mercado Central Belo Horizonte'},
  {id:4,nome:'Encontro de Raízes — Contagem',local:'Centro Cultural Contagem',data:'2025-04-19',horario:'17h',ingresso:'R$ 15,00',dest:false,mapa:'Centro Cultural Contagem MG'}
];
var D_FO=[
  {id:1,src:'',cap:'Show Praça da Liberdade',ph:'🥁',h:280},
  {id:2,src:'',cap:'Ensaio Geral',ph:'🎵',h:180},
  {id:3,src:'',cap:'Carnaval BH 2024',ph:'🎺',h:240},
  {id:4,src:'',cap:'Roda de Samba',ph:'🌿',h:200},
  {id:5,src:'',cap:'Festival de Samba',ph:'🎶',h:320},
  {id:6,src:'',cap:'Premiação',ph:'🏆',h:160},
  {id:7,src:'',cap:'Apresentação Cultural',ph:'🎸',h:220},
  {id:8,src:'',cap:'Show Noturno',ph:'🌙',h:260},
  {id:9,src:'',cap:'Comunidade',ph:'⭐',h:190}
];
var D_VI={ytId:'',leg:'Herança dos Ancestrais ao Vivo'};
var shows=ld(K.sh,D_SH),fotos=ld(K.fo,D_FO),video=ld(K.vi,D_VI);

// SCROLL SUAVE
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href^="#"]');
  if(!a)return;
  var id=a.getAttribute('href').slice(1);
  if(!id)return;
  var t=document.getElementById(id);
  if(!t)return;
  e.preventDefault();
  var off=document.getElementById('navbar').offsetHeight;
  window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-off,behavior:'smooth'});
});

// NAV SCROLL
window.addEventListener('scroll',function(){
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});

// MENU MOBILE
function toggleMenu(){
  var open=document.getElementById('menuMobile').classList.toggle('aberto');
  document.getElementById('burgerBtn').classList.toggle('aberto',open);
  document.getElementById('menuOverlay').classList.toggle('aberto',open);
  document.body.style.overflow=open?'hidden':'';
}
function fecharMenu(){
  document.getElementById('menuMobile').classList.remove('aberto');
  document.getElementById('burgerBtn').classList.remove('aberto');
  document.getElementById('menuOverlay').classList.remove('aberto');
  document.body.style.overflow='';
}

// AGENDA
var MP=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
var PIN='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
function renderAgenda(){
  var el=document.getElementById('eventos-lista');
  var arr=shows.slice().sort(function(a,b){return new Date(a.data)-new Date(b.data);});
  if(!arr.length){el.innerHTML='<div class="empty-agenda"><span>🥁</span>Nenhum show agendado.</div>';return;}
  el.innerHTML=arr.map(function(s){
    var d=new Date(s.data+'T12:00:00');
    var dia=String(d.getDate()).padStart(2,'0');
    var mes=MP[d.getMonth()]+' '+d.getFullYear();
    var q=encodeURIComponent(s.mapa||s.local);
    return '<div class="evento-item">'+
      '<div class="evento-data"><div class="evento-dia">'+dia+'</div><div class="evento-mes">'+mes+'</div></div>'+
      '<div class="evento-info"><h3>'+s.nome+(s.dest?'<span class="tag-dest">Destaque</span>':'')+'</h3>'+
      '<div class="evento-local">'+PIN+' '+s.local+'</div>'+
      '<div class="evento-horario">⏰ '+s.horario+(s.ingresso?' — '+s.ingresso:'')+'</div></div>'+
      '<a href="https://maps.google.com/?q='+q+'" target="_blank" class="btn-mapa">'+PIN+' Ver no Mapa</a>'+
    '</div>';
  }).join('');
}

// GALERIA
function renderGaleria(){
  var m=document.getElementById('galeria-masonry');
  m.innerHTML=fotos.map(function(f){
    var img=f.src?'<img src="'+f.src+'" alt="'+f.cap+'" style="width:100%;display:block">':'<div class="img-ph" style="height:'+f.h+'px">'+f.ph+'</div>';
    return '<div class="masonry-item">'+img+'<div class="moverlay"><span>'+f.cap+'</span></div></div>';
  }).join('');
  var vs=document.getElementById('video-section');
  if(video.ytId){
    vs.innerHTML='<div class="video-destaque"><div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" src="https://www.youtube.com/embed/'+video.ytId+'" allowfullscreen></iframe></div><div style="padding:1.2rem 1.5rem;background:rgba(0,36,18,.6);font-family:Playfair Display,serif;font-style:italic;color:var(--marfim)">'+video.leg+'</div></div>';
  } else {
    vs.innerHTML='<div class="video-destaque"><div class="video-thumb"><div class="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div><div class="video-label">Em Breve · <span>Novo Vídeo</span></div></div></div>';
  }
}

// LOGIN
var SENHA='heranca2025',tentativas=0,bloqueadoAte=0,autenticado=false;
function abrirAdmin(){
  if(autenticado){
    document.getElementById('admin-overlay').classList.add('open');
    renderShows();renderFotosAdmin();carregaVideoForm();atualizarPrevLogo();
  } else {
    document.getElementById('lerr').textContent='';
    document.getElementById('latt').textContent='';
    document.getElementById('lsenha').value='';
    document.getElementById('login-overlay').classList.add('open');
    setTimeout(function(){document.getElementById('lsenha').focus();},100);
  }
}
function fecharLogin(){document.getElementById('login-overlay').classList.remove('open');}
function toggleSenha(){var i=document.getElementById('lsenha');i.type=i.type==='password'?'text':'password';}
function tentarLogin(){
  var agora=Date.now();
  if(agora<bloqueadoAte){document.getElementById('latt').textContent='Aguarde '+Math.ceil((bloqueadoAte-agora)/1000)+'s.';return;}
  if(document.getElementById('lsenha').value.trim()===SENHA){
    autenticado=true;tentativas=0;fecharLogin();
    document.getElementById('admin-overlay').classList.add('open');
    renderShows();renderFotosAdmin();carregaVideoForm();atualizarPrevLogo();
  } else {
    tentativas++;
    var inp=document.getElementById('lsenha');
    inp.classList.add('shake');setTimeout(function(){inp.classList.remove('shake');},400);
    document.getElementById('lerr').textContent='Senha incorreta.';
    if(tentativas>=5){bloqueadoAte=Date.now()+30000;tentativas=0;document.getElementById('latt').textContent='Muitas tentativas. Aguarde 30s.';}
  }
}
function fecharAdmin(){document.getElementById('admin-overlay').classList.remove('open');}
function abaAdmin(id,btn){
  document.querySelectorAll('.apane').forEach(function(p){p.classList.remove('on');});
  document.querySelectorAll('.atab').forEach(function(t){t.classList.remove('on');});
  document.getElementById('apane-'+id).classList.add('on');
  btn.classList.add('on');
}

// SHOWS
function renderShows(){
  var el=document.getElementById('shows-lista');
  if(!shows.length){el.innerHTML='<p style="color:rgba(245,240,232,.4);font-size:.85rem">Nenhum show.</p>';return;}
  el.innerHTML=shows.map(function(s){
    return '<div class="scard"><div><div class="sname">'+(s.dest?'⭐ ':'')+s.nome+'</div><div class="smeta">'+s.data+' · '+s.horario+' · '+s.local+'</div></div>'+
    '<div class="sbtns"><button class="sedit" onclick="editShow('+s.id+')">✏️</button><button class="sdel" onclick="delShow('+s.id+')">🗑️</button></div></div>';
  }).join('');
}
function editShow(id){
  var s=shows.find(function(x){return x.id===id;});if(!s)return;
  document.getElementById('eid').value=s.id;
  document.getElementById('fn').value=s.nome;
  document.getElementById('fl').value=s.local;
  document.getElementById('fd').value=s.data;
  document.getElementById('fh').value=s.horario;
  document.getElementById('fi2').value=s.ingresso||'';
  document.getElementById('fds').value=s.dest?'1':'0';
  document.getElementById('fm').value=s.mapa||'';
  document.getElementById('ftitle').textContent='✏️ Editar Show';
}
function delShow(id){
  if(!confirm('Excluir este show?'))return;
  shows=shows.filter(function(x){return x.id!==id;});
  sv(K.sh,shows);renderShows();renderAgenda();toast('🗑️ Excluído.');
}
function limparShow(){
  ['eid','fn','fl','fd','fh','fi2','fm'].forEach(function(i){document.getElementById(i).value='';});
  document.getElementById('fds').value='0';
  document.getElementById('ftitle').textContent='➕ Adicionar Novo Show';
}
function salvarShow(){
  var n=document.getElementById('fn').value.trim(),l=document.getElementById('fl').value.trim(),d=document.getElementById('fd').value,h=document.getElementById('fh').value.trim();
  if(!n||!l||!d||!h){toast('⚠️ Preencha os campos obrigatórios!');return;}
  var obj={nome:n,local:l,data:d,horario:h,ingresso:document.getElementById('fi2').value.trim(),dest:document.getElementById('fds').value==='1',mapa:document.getElementById('fm').value.trim()||l};
  var eid=document.getElementById('eid').value;
  if(eid){var idx=shows.findIndex(function(x){return x.id==eid;});if(idx>-1){shows[idx]=Object.assign({},obj,{id:shows[idx].id});toast('✅ Atualizado!');}}
  else{shows.push(Object.assign({},obj,{id:Date.now()}));toast('✅ Adicionado!');}
  sv(K.sh,shows);limparShow();renderShows();renderAgenda();
}

// FOTOS
function renderFotosAdmin(){
  var g=document.getElementById('fotos-grid');
  g.innerHTML=fotos.map(function(f,i){
    var t=f.src?'<img src="'+f.src+'" alt="'+f.cap+'">':'<div class="mph2">'+f.ph+'<small>placeholder</small></div>';
    return '<div class="mth">'+t+'<div class="mcap">'+f.cap+'</div><div class="mover2"><button onclick="editCap('+i+')">✏️</button><button class="bdm" onclick="delFoto('+i+')">🗑️</button></div></div>';
  }).join('');
}
function addFotos(inp){
  var files=Array.from(inp.files),done=0;
  files.forEach(function(f){
    if(!f.type.startsWith('image/')){toast('⚠️ Apenas imagens.');return;}
    if(f.size>5*1024*1024){toast('⚠️ Máximo 5 MB.');return;}
    var r=new FileReader();
    r.onload=function(e){
      fotos.push({id:Date.now()+Math.random(),src:e.target.result,cap:f.name.replace(/\.[^.]+$/,''),ph:'📷',h:220});
      if(++done===files.length){sv(K.fo,fotos);renderFotosAdmin();renderGaleria();toast('✅ '+done+' foto(s) adicionada(s)!');}
    };
    r.readAsDataURL(f);
  });
  inp.value='';
}
function editCap(i){
  var nova=prompt('Nova legenda:',fotos[i].cap);if(nova===null)return;
  fotos[i].cap=nova.trim()||fotos[i].cap;sv(K.fo,fotos);renderFotosAdmin();renderGaleria();toast('✅ Legenda atualizada!');
}
function delFoto(i){
  if(!confirm('Excluir?'))return;
  fotos.splice(i,1);sv(K.fo,fotos);renderFotosAdmin();renderGaleria();toast('🗑️ Removida.');
}

// VIDEO
function ytIdParse(s){
  s=s.trim();
  var m=s.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/))([A-Za-z0-9_-]{11})/);
  return m?m[1]:(s.length===11&&/^[A-Za-z0-9_-]+$/.test(s)?s:'');
}
function prevVideo(){
  var id=ytIdParse(document.getElementById('vyt').value);
  document.getElementById('vprev').innerHTML=id?'<iframe src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>':'<div class="novid"><span>🎬</span>A prévia aparecerá aqui</div>';
}
function carregaVideoForm(){
  document.getElementById('vyt').value=video.ytId||'';
  document.getElementById('vleg').value=video.leg||'';
  prevVideo();
}
function salvarVideo(){
  var raw=document.getElementById('vyt').value,id=ytIdParse(raw);
  if(raw.trim()&&!id){toast('⚠️ URL inválida.');return;}
  video={ytId:id,leg:document.getElementById('vleg').value.trim()||'Herança dos Ancestrais ao Vivo'};
  sv(K.vi,video);renderGaleria();toast('✅ Vídeo salvo!');
}

// TOAST
function toast(msg){
  var el=document.getElementById('atoast');
  el.textContent=msg;el.classList.add('show');
  setTimeout(function(){el.classList.remove('show');},3000);
}

// LOGO
var logoSrc = ld('hda_logo', '');
function uploadLogo(inp) {
  var f = inp.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) { toast('⚠️ Apenas imagens.'); return; }
  if (f.size > 5*1024*1024) { toast('⚠️ Máximo 5 MB.'); return; }
  var r = new FileReader();
  r.onload = function(e) {
    logoSrc = e.target.result;
    sv('hda_logo', logoSrc);
    aplicarLogo();
    atualizarPrevLogo();
    toast('✅ Logo atualizada!');
  };
  r.readAsDataURL(f);
  inp.value = '';
}
function removerLogo() {
  if (!confirm('Remover a logo personalizada?')) return;
  logoSrc = '';
  sv('hda_logo', '');
  aplicarLogo();
  atualizarPrevLogo();
  toast('🗑️ Logo removida.');
}
function aplicarLogo() {
  document.querySelectorAll('.hero-logo, .logo-grande').forEach(function(img) {
    if (logoSrc) {
      img.src = logoSrc;
      img.style.display = '';
    } else {
      img.src = ''; img.style.display = 'none';
    }
  });
}
function atualizarPrevLogo() {
  var prev = document.getElementById('logo-prev');
  if (!prev) return;
  if (logoSrc) {
    prev.innerHTML = '<img src="' + logoSrc + '" style="max-width:100%;max-height:220px;object-fit:contain;border-radius:4px">';
  } else {
    prev.innerHTML = '<span style="color:rgba(245,240,232,.2);font-size:.8rem">Nenhuma logo carregada</span>';
  }
}

renderAgenda();
renderGaleria();
if (logoSrc) aplicarLogo();