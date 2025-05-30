import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m, rcanal);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    if (!data || data.length === 0) {
      await m.react(error);
      return conn.reply(m.chat, `${emoji2} No se pudo obtener el contenido.`, m, rcanal);
    }

    const infoMsg = `
╭──────⚔──────╮  
${emoji} 𝑲𝑰𝑹𝑰𝑻𝑶-𝑩𝑶𝑻 𝑴𝑫   
╰──────⚔──────╯
👤 *Usuario:* ${data[0].username || 'Desconocido'}
📝 *Descripción:* ${data[0].caption ? data[0].caption.slice(0, 200) : 'Sin descripción'}
📁 *Tipo:* ${data[0].type || 'Desconocido'}
📷 *Medios:* ${data.length}

⟢ Aquí tienes: *˙Ⱉ˙ฅ*
⟢ ¡Disfruta!
`.trim();

    
    await conn.reply(m.chat, infoMsg, m, rcanal);

    
    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', '', m, rcanal);
    }

    await m.react(done);

  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${msm} Ocurrió un error al procesar el enlace.`, m, rcanal);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;