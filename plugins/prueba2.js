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
    console.error("Error al unirse o enviar mensaje:", error);
    let errMsg = '❌ Error al unirse o enviar mensaje.';
    if (error?.message?.includes('already')) {
      errMsg += '\n📌 El bot ya está en el grupo.';
    } else if (error?.message?.includes('not-authorized')) {
      errMsg += '\n📌 El grupo está lleno o el enlace fue revocado.';
    } else if (error?.message?.includes('invite code invalid')) {
      errMsg += '\n📌 El código de invitación es inválido.';
    }
    m.reply(errMsg);
  }
};

handler.help = ['joingrp <enlace> | <mensaje>'];
handler.tags = ['owner'];
handler.command = ['joingrp', 'joinlink'];
handler.owner = true;

export default handler;