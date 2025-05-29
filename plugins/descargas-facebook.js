import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Facebook.`, m, rcanal)
  }

  let res;
  try {
    await m.react(rwait);  
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `${msm} Error al obtener datos. Verifica el enlace.`, m, rcanal)
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emoji2} No se encontraron resultados.`, m, rcanal)
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, `${msm} Error al procesar los datos.`, m, rcanal)
  }

  if (!data) {
    return conn.reply(m.chat, `${emoji2} No se encontró una resolución adecuada.`, rcanal)
  }

  let video = data.url;

  try {
    
    await conn.sendMessage(m.chat, { video: { url: video }, caption: ` ╭──────⚔──────╮  
  ${emoji} 𝑲𝑰𝑹𝑰𝑻𝑶-𝑩𝑶𝑻 𝑴𝑫   
╰──────⚔──────╯\n⟢ 𝑨𝒌𝒊 𝒕𝒊𝒆𝒏𝒆𝒔: *˙Ⱉ˙ฅ*\n⟢ 𝑫𝒊𝒔𝒇𝒓𝒖𝒕𝒂.`, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m })
    await m.react(done); 
  } catch (e) {
    
    await m.react(error);  
    return conn.reply(m.chat, `${msm} Error al enviar el video.`, m)
  }
}

handler.help = ['facebook', 'fb']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler