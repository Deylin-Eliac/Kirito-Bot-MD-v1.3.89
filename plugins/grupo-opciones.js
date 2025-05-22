const handler = async (m, { conn }) => {
  const { welcome, autolevelup, antiBot, antiBot2, autoAceptar, autoRechazar, autoresponder, modoadmin, reaction, nsfw, detect, antiLink, antiLink2, antitoxic, antiTraba, antifake } = global.db.data.chats[m.chat];

  const estado = (valor) => valor ? ' *`Activado`*' : ' *`Desactivado`*';

  const text = `*PANEL DE CONFIGURACIÓN DEL GRUPO* 

⚔️ *Anti-Bots:* ${estado(antiBot)}  
> ➨ *Descripción:* Activa o desactiva la expulsión de bots no autorizados en el grupo.

⚔️ *Anti-SubBots:* ${estado(antiBot2)}  
> ➨ *Descripción:* Activa o desactiva la expulsión de subbots no autorizados en el grupo.

⚔️ *Modo Admin:* ${estado(modoadmin)}  
> ➨ *Descripción:* El bot solo responderá a los administradores del grupo.

🔗 *Anti-Enlaces:* ${estado(antiLink)}  
> ➨ *Descripción:* Activa o desactiva el bloqueo de enlaces de WhatsApp en el grupo.

🔗 *Anti-Enlaces Avanzado:* ${estado(antiLink2)}  
> ➨ *Descripción:* Activa o desactiva el bloqueo de enlaces de sitios HTTPS en el grupo.

🛡 *Anti-Tóxicos:* ${estado(antitoxic)}  
> ➨ *Descripción:* Activa o desactiva la eliminación de mensajes ofensivos o tóxicos en el grupo.

⚠️ *Anti-Trabas:* ${estado(antiTraba)}  
> ➨ *Descripción:* Activa o desactiva la eliminación de mensajes con demasiados caracteres que puedan causar lag.

👻 *Anti-Fakes:* ${estado(antifake)}  
> ➨ *Descripción:* Activa o desactiva el bloqueo de enlaces de WhatsApp de números falsos o sospechosos.

🤖 *Respuesta Automática (IA):* ${estado(autoresponder)}  
> ➨ *Descripción:* Activa o desactiva las respuestas automáticas del bot usando la IA de Gemini.

✨ *Bienvenida:* ${estado(welcome)}  
> ➨ *Descripción:* Activa o desactiva el mensaje de bienvenida para nuevos miembros en el grupo.

✅ *Aceptación Automática:* ${estado(autoAceptar)}  
> ➨ *Descripción:* Activa o desactiva la aceptación automática de solicitudes de ingreso al grupo.

❌ *Rechazo Automático:* ${estado(autoRechazar)}  
> ➨ *Descripción:* Activa o desactiva el rechazo automático de solicitudes de ingreso al grupo.

👀 *Detección de Cambios:* ${estado(detect)}  
> ➨ *Descripción:* Activa o desactiva las notificaciones de cambios en el grupo (nombre, descripción, etc.).

😂 *Reacciones Épicas:* ${estado(reaction)}  
> ➨ *Descripción:* Activa o desactiva las reacciones del bot a los mensajes del grupo.

🔞 *Modo +18:* ${estado(nsfw)}  
> ➨ *Descripción:* Activa o desactiva los comandos +18 y contenido para adultos en el grupo.

_*📝 Ejemplo de uso (#antilink on).*_`;

  await conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: '⚔️ KIRITO-BOT',
        body: 'Gestión Avanzada del Reino',
        thumbnailUrl: 'src/catalogo.jpg',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: fkontak });
};

handler.help = ['configuraciongrupo'];
handler.tags = ['grupo'];
handler.command = ['config', 'opciones', 'nable'];
handler.register = true;
handler.group = true;

export default handler;