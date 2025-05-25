import axios from 'axios';

let handler = async (m, { conn }) => {
  try {
    const res = await axios.get('https://meme-api.com/gimme');
    const meme = res.data;

    await conn.sendMessage(m.chat, {
      image: { url: meme.url },
      caption: `*${meme.title}*\n_Sub: ${meme.subreddit}_\n👍 ${meme.ups} | [Ver post](${meme.postLink})`
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: 'Ocurrió un error al cargar el meme. Intenta de nuevo más tarde.'
    }, { quoted: m });
  }
};

handler.help = ['lode memes'];
handler.tags = ['fun'];
handler.command = /^lode$/i;

export default handler;