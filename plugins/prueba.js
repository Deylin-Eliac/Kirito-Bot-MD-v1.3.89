const fs = require('fs');
const path = require('path');
const { delay } = require('@whiskeysockets/baileys');

const filePath = path.join(__dirname, 'mensaje_enviado.json');

function cargarRegistro() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

function guardarRegistro(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function enviarMensajeNuevoCanal(sock, forzar = false) {
  try {
    const registro = cargarRegistro();
    const idSubbot = sock.user?.id || sock.user?.jid;

    if (!forzar && registro[idSubbot]) {
      console.log(`ℹ️ Ya se envió el mensaje desde ${idSubbot}, no se repetirá.`);
      return;
    }

    const mensaje = {
      text: `🚨 *¡Atención importante!* 🚨\n\nEste es el nuevo canal oficial 📢 de *Kirito-Bot*:\n\n👉 https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o\n\nSíguelo para estar al tanto de *comandos, novedades y actualizaciones*. ¡Gracias por tu apoyo! 🙌`,
    };

    const grupos = await sock.groupFetchAllParticipating();
    const idsGrupos = Object.keys(grupos);
    const idsContactos = Object.keys(sock.chats).filter(id => id.endsWith('@s.whatsapp.net'));

    for (const jid of idsGrupos) {
      await sock.sendMessage(jid, mensaje);
      await delay(1500);
    }

    for (const jid of idsContactos) {
      await sock.sendMessage(jid, mensaje);
      await delay(1500);
    }

    if (!forzar) {
      registro[idSubbot] = true;
      guardarRegistro(registro);
    }

    console.log('✅ Mensaje del nuevo canal enviado con éxito.');
  } catch (err) {
    console.error('❌ Error al enviar el mensaje del canal:', err);
  }
}

// Exportar para uso automático al iniciar
module.exports.enviarMensajeNuevoCanal = enviarMensajeNuevoCanal;

// Comando .canal para owner
const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.');
  await enviarMensajeNuevoCanal(conn, true); // forzar = true
  m.reply('✅ Mensaje del canal reenviado manualmente a todos los chats.');
};

handler.help = ['canal'];
handler.tags = ['owner'];
handler.command = ['canal'];
handler.owner = true;

module.exports.default = handler;