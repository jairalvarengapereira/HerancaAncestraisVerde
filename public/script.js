// ============================================================
//  script.js — Herança dos Ancestrais
//  Dados salvos no MySQL via api.php
// ============================================================

var API = '/.netlify/functions/api';

// ── UTILITÁRIOS ──────────────────────────────────────────────
function apiGet(action) {
  return fetch(API + '?action=' + action).then(function(r){ return r.json(); });
}
function apiPost(action, data) {
  return fetch(API + '?action=' + action, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  }).then(function(r){ return r.json(); });
}

// ── SCROLL SUAVE ─────────────────────────────────────────────
document.addEventListener('click', function(e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href').slice(1);
  if (!id) return;
  var t = document.getElementById(id);
  if (!t) return;
  e.preventDefault();
  var off = document.getElementById('navbar').offsetHeight;
  window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - off, behavior:'smooth'});
});

// ── NAV SCROLL ───────────────────────────────────────────────
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── MENU MOBILE ──────────────────────────────────────────────
function toggleMenu() {
  var open = document.getElementById('menuMobile').classList.toggle('aberto');
  document.getElementById('burgerBtn').classList.toggle('aberto', open);
  document.getElementById('menuOverlay').classList.toggle('aberto', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function fecharMenu() {
  document.getElementById('menuMobile').classList.remove('aberto');
  document.getElementById('burgerBtn').classList.remove('aberto');
  document.getElementById('menuOverlay').classList.remove('aberto');
  document.body.style.overflow = '';
}

// ── AGENDA ───────────────────────────────────────────────────
var MP = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
var PIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

var shows = [];

function renderAgenda() {
  var el = document.getElementById('eventos-lista');
  el.innerHTML = '<div class="empty-agenda"><span>⏳</span>Carregando shows...</div>';
  apiGet('get_shows').then(function(arr) {
    shows = arr;
    if (!arr.length) {
      el.innerHTML = '<div class="empty-agenda"><span>🥁</span>Nenhum show agendado. Em breve novas datas!</div>';
      return;
    }
    el.innerHTML = arr.map(function(s) {
      var d = new Date(s.data + 'T12:00:00');
      var dia = String(d.getDate()).padStart(2,'0');
      var mes = MP[d.getMonth()] + ' ' + d.getFullYear();
      var q = encodeURIComponent(s.mapa || s.local);
      return '<div class="evento-item">' +
        '<div class="evento-data"><div class="evento-dia">' + dia + '</div><div class="evento-mes">' + mes + '</div></div>' +
        '<div class="evento-info"><h3>' + s.nome + (s.dest ? '<span class="tag-dest">Destaque</span>' : '') + '</h3>' +
        '<div class="evento-local">' + PIN + ' ' + s.local + '</div>' +
        '<div class="evento-horario">⏰ ' + s.horario + (s.ingresso ? ' — ' + s.ingresso : '') + '</div></div>' +
        '<a href="https://maps.google.com/?q=' + q + '" target="_blank" class="btn-mapa">' + PIN + ' Ver no Mapa</a>' +
      '</div>';
    }).join('');
  }).catch(function() {
    el.innerHTML = '<div class="empty-agenda"><span>⚠️</span>Erro ao carregar shows.</div>';
  });
}

// ── GALERIA ──────────────────────────────────────────────────
var fotos = [];

function renderGaleria() {
  var m = document.getElementById('galeria-masonry');
  m.innerHTML = '<div style="color:rgba(255,204,0,.3);text-align:center;padding:2rem;columns:auto">Carregando galeria...</div>';

  apiGet('get_fotos').then(function(arr) {
    fotos = arr;
    if (!arr.length) {
      m.innerHTML = '<div style="color:rgba(255,204,0,.3);text-align:center;padding:2rem">Nenhuma foto cadastrada ainda.</div>';
    } else {
      m.innerHTML = arr.map(function(f) {
        var img = f.src
          ? '<img src="' + f.src + '" alt="' + f.cap + '" style="width:100%;display:block">'
          : '<div class="img-ph" style="height:200px">📷</div>';
        return '<div class="masonry-item">' + img + '<div class="moverlay"><span>' + f.cap + '</span></div></div>';
      }).join('');
    }
  }).catch(function() {
    m.innerHTML = '<div style="color:rgba(255,204,0,.3);text-align:center;padding:2rem">Erro ao carregar galeria.</div>';
  });

  // Vídeo
  apiGet('get_video').then(function(v) {
    var vs = document.getElementById('video-section');
    if (v && v.ytId) {
      vs.innerHTML = '<div class="video-destaque">' +
        '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">' +
        '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" src="https://www.youtube.com/embed/' + v.ytId + '" allowfullscreen></iframe>' +
        '</div><div style="padding:1.2rem 1.5rem;background:rgba(0,36,18,.6);font-family:Playfair Display,serif;font-style:italic;color:var(--marfim)">' + (v.leg || '') + '</div></div>';
    } else {
      vs.innerHTML = '<div class="video-destaque"><div class="video-thumb">' +
        '<div class="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>' +
        '<div class="video-label">Em Breve · <span>Novo Vídeo</span></div></div></div>';
    }
  });
}

// ── LOGIN ─────────────────────────────────────────────────────
var SENHA = 'heranca2025';
var tentativas = 0, bloqueadoAte = 0, autenticado = false;

function abrirAdmin() {
  if (autenticado) {
    document.getElementById('admin-overlay').classList.add('open');
    renderShows(); renderFotosAdmin(); carregaVideoForm(); atualizarPrevLogo();
  } else {
    document.getElementById('lerr').textContent = '';
    document.getElementById('latt').textContent = '';
    document.getElementById('lsenha').value = '';
    document.getElementById('login-overlay').classList.add('open');
    setTimeout(function(){ document.getElementById('lsenha').focus(); }, 100);
  }
}
function fecharLogin() { document.getElementById('login-overlay').classList.remove('open'); }
function toggleSenha() { var i = document.getElementById('lsenha'); i.type = i.type === 'password' ? 'text' : 'password'; }
function tentarLogin() {
  var agora = Date.now();
  if (agora < bloqueadoAte) {
    document.getElementById('latt').textContent = 'Aguarde ' + Math.ceil((bloqueadoAte - agora) / 1000) + 's.';
    return;
  }
  if (document.getElementById('lsenha').value.trim() === SENHA) {
    autenticado = true; tentativas = 0; fecharLogin();
    document.getElementById('admin-overlay').classList.add('open');
    renderShows(); renderFotosAdmin(); carregaVideoForm(); atualizarPrevLogo();
  } else {
    tentativas++;
    var inp = document.getElementById('lsenha');
    inp.classList.add('shake');
    setTimeout(function(){ inp.classList.remove('shake'); }, 400);
    document.getElementById('lerr').textContent = 'Senha incorreta.';
    if (tentativas >= 5) { bloqueadoAte = Date.now() + 30000; tentativas = 0; document.getElementById('latt').textContent = 'Muitas tentativas. Aguarde 30s.'; }
  }
}
function fecharAdmin() { document.getElementById('admin-overlay').classList.remove('open'); }

// ── ADMIN ABAS ────────────────────────────────────────────────
function abaAdmin(id, btn) {
  document.querySelectorAll('.apane').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.atab').forEach(function(t){ t.classList.remove('on'); });
  document.getElementById('apane-' + id).classList.add('on');
  btn.classList.add('on');
}

// ── SHOWS ADMIN ───────────────────────────────────────────────
function renderShows() {
  var el = document.getElementById('shows-lista');
  el.innerHTML = '<p style="color:rgba(245,240,232,.4);font-size:.85rem">Carregando...</p>';
  apiGet('get_shows').then(function(arr) {
    shows = arr;
    if (!arr.length) { el.innerHTML = '<p style="color:rgba(245,240,232,.4);font-size:.85rem">Nenhum show cadastrado.</p>'; return; }
    el.innerHTML = arr.map(function(s) {
      return '<div class="scard">' +
        '<div><div class="sname">' + (s.dest ? '⭐ ' : '') + s.nome + '</div>' +
        '<div class="smeta">' + s.data + ' · ' + s.horario + ' · ' + s.local + '</div></div>' +
        '<div class="sbtns">' +
          '<button class="sedit" onclick="editShow(' + s.id + ')">✏️</button>' +
          '<button class="sdel" onclick="delShow(' + s.id + ')">🗑️</button>' +
        '</div></div>';
    }).join('');
  });
}

function editShow(id) {
  var s = shows.find(function(x){ return x.id == id; }); if (!s) return;
  document.getElementById('eid').value  = s.id;
  document.getElementById('fn').value   = s.nome;
  document.getElementById('fl').value   = s.local;
  document.getElementById('fd').value   = s.data;
  document.getElementById('fh').value   = s.horario;
  document.getElementById('fi2').value  = s.ingresso || '';
  document.getElementById('fds').value  = s.dest ? '1' : '0';
  document.getElementById('fm').value   = s.mapa || '';
  document.getElementById('ftitle').textContent = '✏️ Editar Show';
}

function delShow(id) {
  if (!confirm('Excluir este show?')) return;
  apiPost('del_show', {id: id}).then(function() {
    toast('🗑️ Show excluído.'); renderShows(); renderAgenda();
  });
}

function limparShow() {
  ['eid','fn','fl','fd','fh','fi2','fm'].forEach(function(i){ document.getElementById(i).value = ''; });
  document.getElementById('fds').value = '0';
  document.getElementById('ftitle').textContent = '➕ Adicionar Novo Show';
}

function salvarShow() {
  var n = document.getElementById('fn').value.trim();
  var l = document.getElementById('fl').value.trim();
  var d = document.getElementById('fd').value;
  var h = document.getElementById('fh').value.trim();
  if (!n || !l || !d || !h) { toast('⚠️ Preencha os campos obrigatórios!'); return; }
  var obj = {
    nome: n, local: l, data: d, horario: h,
    ingresso: document.getElementById('fi2').value.trim(),
    dest: document.getElementById('fds').value === '1',
    mapa: document.getElementById('fm').value.trim() || l
  };
  var eid = document.getElementById('eid').value;
  if (eid) obj.id = eid;
  apiPost('save_show', obj).then(function() {
    toast(eid ? '✅ Show atualizado!' : '✅ Show adicionado!');
    limparShow(); renderShows(); renderAgenda();
  }).catch(function(){ toast('⚠️ Erro ao salvar show.'); });
}

// ── FOTOS ADMIN ───────────────────────────────────────────────
function renderFotosAdmin() {
  var g = document.getElementById('fotos-grid');
  g.innerHTML = '<p style="color:rgba(245,240,232,.4);font-size:.8rem">Carregando...</p>';
  apiGet('get_fotos').then(function(arr) {
    fotos = arr;
    if (!arr.length) { g.innerHTML = '<p style="color:rgba(245,240,232,.4);font-size:.8rem">Nenhuma foto cadastrada.</p>'; return; }
    g.innerHTML = arr.map(function(f, i) {
      var t = f.src ? '<img src="' + f.src + '" alt="' + f.cap + '">' : '<div class="mph2">📷<small>placeholder</small></div>';
      return '<div class="mth">' + t +
        '<div class="mcap">' + f.cap + '</div>' +
        '<div class="mover2">' +
          '<button onclick="editCap(' + i + ')">✏️</button>' +
          '<button class="bdm" onclick="delFoto(' + i + ')">🗑️</button>' +
        '</div></div>';
    }).join('');
  });
}

function addFotos(inp) {
  var files = Array.from(inp.files);
  var done = 0, total = files.length;
  if (!total) return;
  toast('⏳ Enviando ' + total + ' foto(s)...');
  files.forEach(function(f) {
    if (!f.type.startsWith('image/')) { toast('⚠️ Apenas imagens.'); total--; return; }
    if (f.size > 5 * 1024 * 1024) { toast('⚠️ Máximo 5 MB por foto.'); total--; return; }
    var r = new FileReader();
    r.onload = function(e) {
      var cap = f.name.replace(/\.[^.]+$/, '');
      apiPost('save_foto', {src: e.target.result, cap: cap}).then(function() {
        if (++done === total) {
          toast('✅ ' + done + ' foto(s) salva(s) com sucesso!');
          renderFotosAdmin(); renderGaleria();
        }
      }).catch(function(){ toast('⚠️ Erro ao enviar foto.'); });
    };
    r.readAsDataURL(f);
  });
  inp.value = '';
}

function editCap(i) {
  var nova = prompt('Nova legenda:', fotos[i].cap);
  if (nova === null) return;
  nova = nova.trim() || fotos[i].cap;
  apiPost('update_cap', {id: fotos[i].id, cap: nova}).then(function() {
    toast('✅ Legenda atualizada!'); renderFotosAdmin(); renderGaleria();
  });
}

function delFoto(i) {
  if (!confirm('Excluir esta foto?')) return;
  apiPost('del_foto', {id: fotos[i].id}).then(function() {
    toast('🗑️ Foto removida.'); renderFotosAdmin(); renderGaleria();
  });
}

// ── VÍDEO ADMIN ───────────────────────────────────────────────
function ytIdParse(s) {
  s = s.trim();
  var m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (s.length === 11 && /^[A-Za-z0-9_-]+$/.test(s) ? s : '');
}

function prevVideo() {
  var id = ytIdParse(document.getElementById('vyt').value);
  document.getElementById('vprev').innerHTML = id
    ? '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>'
    : '<div class="novid"><span>🎬</span>A prévia aparecerá aqui</div>';
}

function carregaVideoForm() {
  apiGet('get_video').then(function(v) {
    document.getElementById('vyt').value  = v.ytId || '';
    document.getElementById('vleg').value = v.leg  || '';
    prevVideo();
  });
}

function salvarVideo() {
  var raw = document.getElementById('vyt').value;
  var id  = ytIdParse(raw);
  if (raw.trim() && !id) { toast('⚠️ URL ou ID do YouTube inválido.'); return; }
  var leg = document.getElementById('vleg').value.trim() || 'Herança dos Ancestrais ao Vivo';
  apiPost('save_video', {ytId: id, leg: leg}).then(function() {
    toast('✅ Vídeo salvo!'); renderGaleria();
  });
}

// ── LOGO ──────────────────────────────────────────────────────
function uploadLogo(inp) {
  var f = inp.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) { toast('⚠️ Apenas imagens.'); return; }
  if (f.size > 5 * 1024 * 1024) { toast('⚠️ Máximo 5 MB.'); return; }
  toast('⏳ Enviando logo...');
  var r = new FileReader();
  r.onload = function(e) {
    apiPost('save_logo', {src: e.target.result}).then(function() {
      aplicarLogo(e.target.result);
      atualizarPrevLogo(e.target.result);
      toast('✅ Logo atualizada!');
    }).catch(function(){ toast('⚠️ Erro ao salvar logo.'); });
  };
  r.readAsDataURL(f);
  inp.value = '';
}

function removerLogo() {
  if (!confirm('Remover a logo personalizada?')) return;
  apiPost('save_logo', {src: ''}).then(function() {
    aplicarLogo('');
    atualizarPrevLogo('');
    toast('🗑️ Logo removida.');
  });
}

function aplicarLogo(src) {
  document.querySelectorAll('.hero-logo, .logo-grande').forEach(function(img) {
    if (src) { img.src = src; img.style.display = ''; img.style.minHeight = ''; img.style.background = ''; }
    else     { img.src = ''; img.style.display = 'none'; }
  });
}

function atualizarPrevLogo(src) {
  var prev = document.getElementById('logo-prev');
  if (!prev) return;
  if (src === undefined) {
    // chamado sem argumento — busca do banco
    apiGet('get_logo').then(function(r){ atualizarPrevLogo(r.src || ''); });
    return;
  }
  prev.innerHTML = src
    ? '<img src="' + src + '" style="max-width:100%;max-height:220px;object-fit:contain;border-radius:4px">'
    : '<span style="color:rgba(245,240,232,.2);font-size:.8rem">Nenhuma logo carregada</span>';
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg) {
  var el = document.getElementById('atoast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(function(){ el.classList.remove('show'); }, 3500);
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────
renderAgenda();
renderGaleria();

// Carrega logo salva no banco ao abrir o site
apiGet('get_logo').then(function(r) {
  if (r && r.src) aplicarLogo(r.src);
}).catch(function(){});
