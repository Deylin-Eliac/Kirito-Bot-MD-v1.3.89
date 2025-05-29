const handler = async (m, { conn, text, command, usedPrefix }) => {
  const [link, ...mensajePartes] = text.split("|");
  const mensaje = mensajePartes.join("|").trim();

  if (!link || !mensaje)
    throw `✳️ Uso correcto:\n${usedPrefix + command} <enlace_del_grupo> | <mensaje>\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/ABCDEFGHIJKLMNO | Hola grupo!`;

  if (!link.includes('chat.whatsapp.com'))
    throw '❌ El enlace proporcionado no es válido.';

  const inviteCode = link.trim().split('/').pop();

  try {
    const groupId = await conn.groupAcceptInvite(inviteCode);
    await conn.sendMessage(groupId + '@g.us', { text: mensaje });
    m.reply(`✅ El bot se unió al grupo y envió el mensaje con éxito.`);
  } catch (error) {
    console.error(error);
    m.reply('❌ Error al unirse o enviar mensaje. Asegúrate de que el grupo no esté lleno o el enlace no esté vencido.');
  }
};

handler.help = ['joingrp <enlace> | <mensaje>'];
handler.tags = ['owner'];
handler.command = ['joingrp', 'joinlink']; // Puedes agregar más aliases si deseas
handler.owner = true;

export default handler;