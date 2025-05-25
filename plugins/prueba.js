import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  try {
    const res = await axios.get('https://meme-api.com/gimme');
    const meme = res.data;

    // Descargar la imagen en buffer
    const buffer = (await axios.get(meme.url, { responseType: 'arraybuffer' })).data;

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: 'image/jpeg',
      caption: `*${meme.title}*\nSubreddit: _${meme.subreddit}_\n👍 ${meme.ups}\n🔗 ${meme.postLink}`
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