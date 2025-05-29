let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`✳️ Uso correcto:\n${usedPrefix + command} <enlace_del_grupo> | <mensaje>\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/ABCDEFGHIJKLMNO | Hola grupo!`);

  let [link, ...mensajePartes] = text.split("|");
  let mensaje = mensajePartes.join("|").trim();

  if (!link.includes('chat.whatsapp.com')) return m.reply('❌ El enlace proporcionado no es válido.');
  if (!mensaje) return m.reply('❌ Debes proporcionar un mensaje para enviar al grupo.');

  let inviteCode = link.trim().split('/').pop();

  try {
    let groupId = await conn.groupAcceptInvite(inviteCode);
    await conn.sendMessage(groupId + '@g.us', { text: mensaje });
    m.reply('✅ El bot se unió al grupo y envió el mensaje con éxito.');
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al unirse o enviar el mensaje. Verifica el enlace o si el grupo está lleno.');
  }
};

handler.help = ['joingrp <enlace> | <mensaje>'];
handler.tags = ['group', 'owner'];
handler.command = ['joingrp', 'joinlink']; 
handler.owner = true; 

module.exports = handler;