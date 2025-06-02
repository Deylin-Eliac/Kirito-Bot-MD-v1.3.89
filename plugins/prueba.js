const handler = async (m, {conn, isROwner, text}) => {
  // Mensaje a enviar
  const mensaje = `🚨 *¡Atención importante!* 🚨\n\nEste es el nuevo canal oficial 📢 de *Kirito-Bot*:\n\n👉 https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o\n\nSíguelo para estar al tanto de *comandos, novedades y actualizaciones*. ¡Gracias por tu apoyo! 🙌`;

  // Solo el owner puede enviar el mensaje masivamente
  if (!isOwner) throw `❌ Este comando es solo para el *owner*`;

  // Obtener todos los chats donde el bot está
  const chats = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);

  let enviados = 0;
  for (let [jid] of chats) {
    await conn.sendMessage(jid, { text: mensaje }).catch(() => null);
    enviados++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa para evitar bloqueo
  }

  m.reply(`✅ Mensaje enviado a ${enviados} chats.`);
};

handler.help = ['canal'];
handler.tags = ['owner'];
handler.command = ['canal'];
handler.owner = true;

export default handler;