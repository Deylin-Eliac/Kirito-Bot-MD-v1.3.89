const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      throw `⚠️ Usa el comando así:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`;
    }

    const enlace = args[0];
    const codigo = enlace.split('/').pop().trim();

    if (!codigo || !enlace.includes('chat.whatsapp.com')) {
      throw '❌ Enlace de grupo inválido. Asegúrate de copiar correctamente el link.';
    }

    // Unirse temporalmente para obtener metadata
    const res = await conn.groupAcceptInvite(codigo);
    const metadata = await conn.groupMetadata(res);

    const info = `
📛 *Nombre:* ${metadata.subject}
🆔 *ID:* ${metadata.id}
📝 *Descripción:* ${metadata.desc || 'Sin descripción'}
👥 *Participantes:* ${metadata.participants.length}
🛡️ *Admins:* ${metadata.participants.filter(p => p.admin).length}
`.trim();

    await m.reply(info);

    // Salir del grupo automáticamente si solo es para consulta
    await conn.groupLeave(res);
  } catch (e) {
    console.error(e);
    await m.reply('❌ No se pudo obtener la información del grupo. Verifica el enlace o los permisos del bot.');
  }
};

handler.help = ['gid'];
handler.tags = ['owner'];
handler.command = ['gid'];
handler.rowner = true;

export default handler;