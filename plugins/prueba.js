const fs = require('fs');
const path = require('path');
const { delay } = require('@whiskeysockets/baileys');

const filePath = path.join(__dirname, 'mensaje_enviado.json');

function cargarRegistro() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function guardarRegistro(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function enviarMensajeNuevoCanal(sock, forzar = false) {
  try {
    const registro = cargarRegistro();
    const idSubbot = sock.user?.id || sock.user?.jid;

    if (!idSubbot) {
      console.log('❌ No se pudo obtener el ID del subbot, el sock no está listo.');
      return;
    }

    if (!forzar && registro[idSubbot]) {
      console.log(`ℹ️ Ya se envió el mensaje desde ${idSubbot}, no se repetirá.`);
      return;
    }

    const mensaje = {
      text: `🚨 *¡Atención importante!* 🚨\n\nEste es el nuevo canal oficial 📢 de *Kirito-Bot*:\n\n👉 https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o\n\nSíguelo para estar al tanto de *comandos, novedades y actualizaciones*. ¡Gracias por tu apoyo! 🙌`,
    };

    // Obtener grupos
    let idsGrupos = [];
    try {
      const grupos = await sock.groupFetchAllParticipating();
      idsGrupos = Object.keys(grupos);
      console.log(`ℹ️ Se encontraron ${idsGrupos.length} grupos.`);
    } catch (e) {
      console.warn('⚠️ No se pudieron obtener los grupos:', e.message);
    }

    // Obtener chats individuales
    const chats = await sock.getChats();
    const idsContactos = chats
      .filter(chat => chat.id.endsWith('@s.whatsapp.net'))
      .map(chat => chat.id);

    console.log(`ℹ️ Se encontraron ${idsContactos.length} chats individuales.`);

    // Enviar a grupos
    for (const jid of idsGrupos) {
      console.log(`📨 Enviando mensaje al grupo: ${jid}`);
      await sock.sendMessage(jid, mensaje);
      await delay(2000);
    }

    // Enviar a contactos individuales
    for (const jid of idsContactos) {
      console.log(`📨 Enviando mensaje al contacto: ${jid}`);
      await sock.sendMessage(jid, mensaje);
      await delay(2000);
    }

    if (!forzar) {
      registro[idSubbot] = true;
      guardarRegistro(registro);
      console.log(`✅ Registro actualizado para el subbot ${idSubbot}.`);
    }

    console.log('✅ Mensaje del nuevo canal enviado con éxito.');
  } catch (err) {
    console.error('❌ Error al enviar el mensaje del canal:', err);
  }
}

// Handler para el comando .canal
async function handler(m, { conn, isOwner }) {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.');
  await enviarMensajeNuevoCanal(conn, true);
  m.reply('✅ Mensaje del canal reenviado manualmente a todos los chats.');
}

// Exporta el handler y sus propiedades para que tu bot lo registre
handler.help = ['canal'];
handler.tags = ['owner'];
handler.command = ['canal'];
handler.owner = true;

module.exports = handler;