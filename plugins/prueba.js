import axios from 'axios';

let handler = async (m, { conn }) => {
  try {
    // Obtener meme desde la API
    const res = await axios.get('https://meme-api.com/gimme');
    const meme = res.data;

    // Descargar imagen como buffer
    const buffer = (await axios.get(meme.url, { responseType: 'arraybuffer' })).data;

    // Enviar imagen con datos
    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: 'image/jpeg',
      caption: `*${meme.title}*\nSubreddit: _${meme.subreddit}_\n👍 ${meme.ups}`
    }, { quoted: m });

    // Enviar enlace por separado para vista previa enriquecida
    await conn.sendMessage(m.chat, {
      text: meme.postLink
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: 'No se pudo descargar el meme en buena calidad.'
    }, { quoted: m });
  }
};

handler.help = ['lode memes'];
handler.tags = ['fun'];
handler.command = ['lode'];

export default handler;