import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m, rcanal);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', ` ╭──────⚔──────╮  
  ${emoji} 𝑲𝑰𝑹𝑰𝑻𝑶-𝑩𝑶𝑻 𝑴𝑫   
╰──────⚔──────╯\n⟢ 𝑨𝒌𝒊 𝒕𝒊𝒆𝒏𝒆𝒔: *˙Ⱉ˙ฅ*\n⟢ 𝑫𝒊𝒔𝒇𝒓𝒖𝒕𝒂.`, m, rcanal);
    await m.react(done);
    }
  } catch (e) {
    return conn.reply(m.chat, `${msm} Ocurrió un error.`, m);
    await m.react(error);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;