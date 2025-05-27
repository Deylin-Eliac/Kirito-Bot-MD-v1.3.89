const handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://api.fgmods.xyz/api/nsfw-nime/pussy?apikey=fg_ZIKajBcu');
    if (!res.ok) throw 'Error en la API';
    const json = await res.json();
    if (!json.result) throw 'No se encontró imagen.';
    await conn.sendFile(m.chat, json.result, 'nsfw.jpg', '🔞', m);
  } catch (e) {
    await m.reply('❌ Error obteniendo la imagen.');
  }
};

handler.help = ['pussy'];
handler.tags = ['nsfw'];
handler.command = ['pussy'];

export default handler;