// netlify/functions/api.js
// Herança dos Ancestrais — API via Supabase
// As credenciais vêm das variáveis de ambiente do Netlify

const { createClient } = require('@supabase/supabase-js');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const action = event.queryStringParameters?.action || '';
  const sb = getSupabase();

  try {

    // ── SHOWS ────────────────────────────────────────────────
    if (action === 'get_shows') {
      const { data, error } = await sb
        .from('shows')
        .select('*')
        .order('data', { ascending: true });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'save_show') {
      const d = JSON.parse(event.body || '{}');
      const obj = {
        nome: d.nome, local: d.local, data: d.data,
        horario: d.horario, ingresso: d.ingresso || '',
        dest: !!d.dest, mapa: d.mapa || ''
      };
      let result;
      if (d.id) {
        result = await sb.from('shows').update(obj).eq('id', d.id).select();
      } else {
        result = await sb.from('shows').insert(obj).select();
      }
      if (result.error) throw result.error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: result.data[0].id }) };
    }

    if (action === 'del_show') {
      const d = JSON.parse(event.body || '{}');
      const { error } = await sb.from('shows').delete().eq('id', d.id);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── FOTOS ────────────────────────────────────────────────
    if (action === 'get_fotos') {
      const { data, error } = await sb
        .from('fotos')
        .select('id, cap, src')
        .order('id', { ascending: true });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'save_foto') {
      const d = JSON.parse(event.body || '{}');
      const { data, error } = await sb
        .from('fotos')
        .insert({ src: d.src, cap: d.cap || 'Foto' })
        .select();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: data[0].id }) };
    }

    if (action === 'update_cap') {
      const d = JSON.parse(event.body || '{}');
      const { error } = await sb.from('fotos').update({ cap: d.cap }).eq('id', d.id);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'del_foto') {
      const d = JSON.parse(event.body || '{}');
      const { error } = await sb.from('fotos').delete().eq('id', d.id);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── VÍDEO ────────────────────────────────────────────────
    if (action === 'get_video') {
      const { data } = await sb.from('config').select('valor').eq('chave', 'video').single();
      const val = data ? JSON.parse(data.valor) : { ytId: '', leg: '' };
      return { statusCode: 200, headers, body: JSON.stringify(val) };
    }

    if (action === 'save_video') {
      const d = JSON.parse(event.body || '{}');
      const val = JSON.stringify({ ytId: d.ytId || '', leg: d.leg || '' });
      const { error } = await sb.from('config').upsert({ chave: 'video', valor: val });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── LOGO ─────────────────────────────────────────────────
    if (action === 'get_logo') {
      const { data } = await sb.from('config').select('valor').eq('chave', 'logo').single();
      return { statusCode: 200, headers, body: JSON.stringify({ src: data?.valor || '' }) };
    }

    if (action === 'save_logo') {
      const d = JSON.parse(event.body || '{}');
      const { error } = await sb.from('config').upsert({ chave: 'logo', valor: d.src || '' });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ erro: 'Ação não encontrada' }) };

  } catch (err) {
    console.error('API Error:', err);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ erro: 'Erro interno: ' + err.message })
    };
  }
};
