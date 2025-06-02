const handler = async (m, { conn, isROwner, isOwner }) => {
  const mensaje = `🚨 *¡Atención importante!* 🚨\n\nEste es el nuevo canal oficial 📢 de *Kirito-Bot*:\n\n👉 https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o\n\nSíguelo para estar al tanto de *comandos, novedades y actualizaciones*. ¡Gracias por tu apoyo! 🙌`;

  if (!isOwner) throw '❌ Este comando es solo para el *owner*.';

  const chats = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);

  let usuarios = [];
  let grupos = [];

  await m.reply(`📢 *Enviando mensaje del canal...* Esto puede tardar unos segundos.`);

  for (let [jid, chat] of chats) {
    let tipo = jid.endsWith('@g.us') ? 'grupo' : 'usuario';
    try {
      await conn.sendMessage(jid, { text: mensaje });
      tipo === 'grupo' ? grupos.push(jid) : usuarios.push(jid);
      await new Promise(resolve => setTimeout(resolve, 400)); // retraso para evitar bloqueos
    } catch (e) {
      console.log(`❌ Error al enviar a ${jid}`);
    }
  }

  let resumen = `✅ *Mensaje enviado correctamente*\n\n📨 Total: ${usuarios.length + grupos.length} chats\n👤 Usuarios: ${usuarios.length}\n👥 Grupos: ${grupos.length}\n\n`;

  if (usuarios.length) resumen += `📋 *Usuarios:*\n` + usuarios.map(u => `• wa.me/${u.replace(/[^0-9]/g, '')}`).join('\n') + '\n\n';
  if (grupos.length) resumen += `📋 *Grupos:*\n` + grupos.map(g => `• ${g}`).join('\n');

  await m.reply(resumen);
};

handler.help = ['canal'];
handler.tags = ['owner'];
handler.command = ['canal'];
handler.owner = true;

export default handler;