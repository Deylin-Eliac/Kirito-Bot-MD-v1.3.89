import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

const effects = {
  narutotext: 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html',
  glitchtext: 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html',
  neonlight: 'https://en.ephoto360.com/neon-light-text-effect-online-882.html',
  // Agrega más efectos si quieres
};

async function generarLogo(tipo = 'narutotext', texto = 'Kirito-Bot') {
  const url = effects[tipo.toLowerCase()];
  if (!url) throw `Efecto "${tipo}" no válido. Prueba: narutotext, glitchtext, neonlight.`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(res.data);
  const token = $('input[name=token]').val();
  const build_server = $('input[name=build_server]').val();
  const build_server_id = $('input[name=build_server_id]').val();

  const form = new FormData();
  form.append('text[]', texto);
  form.append('token', token);
  form.append('build_server', build_server);
  form.append('build_server_id', build_server_id);

  const generar = await axios.post(
    'https://en.ephoto360.com/effect/create-image',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0',
        'Cookie': res.headers['set-cookie']?.join('; ') || ''
      }
    }
  );

  const imageUrl = generar.data?.image;
  return build_server + imageUrl;
}

let handler = async (m, { text, args, conn, usedPrefix, command }) => {
  if (args.length < 2) {
    throw `Uso incorrecto.\nEjemplo: ${usedPrefix + command} narutotext TuNombre`;
  }

  const tipo = args[0];
  const texto = args.slice(1).join(' ');
  const url = await generarLogo(tipo, texto);

  await conn.sendMessage(m.chat, { image: { url }, caption: `Logo generado con efecto: ${tipo}` }, { quoted: m });
};

handler.help = ['ephoto <efecto> <texto>'];
handler.tags = ['logo'];
handler.command = ['ephoto', 'logo'];

export default handler;