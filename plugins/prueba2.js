const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) throw `⚠️ Usa el comando así:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`;

    const link = args[0];
    const code = link.split('/').pop().trim();

    if (!code || !link.includes('chat.whatsapp.com')) {
      throw '❌ Enlace inválido. Asegúrate de que sea un link de grupo válido.';
    }

    // Obtener info del grupo sin unirse
    const info = await conn.groupGetInviteInfo(code);

    const grupoData = {
      id: info.id,
      nombre: info.subject,
      descripcion: info.desc || 'Sin descripción',
      agregado: new Date().toISOString()
    };

    // Asegurar que la sección 'grupos' exista
    global.db.data.grupos = global.db.data.grupos || {};

    // Guardar en base de datos
    global.db.data.grupos[info.id] = grupoData;
    if (typeof global.db.write === 'function') await global.db.write();

    // Enviar mensaje al grupo
    await conn.sendMessage(info.id, {
      text: '✅ Bot corriendo en este grupo.'
    });

    // Confirmación al dueño que ejecuta el comando
    await m.reply(`✅ Información del grupo guardada y mensaje enviado.\n\n📛 *Nombre:* ${grupoData.nombre}\n🆔 *ID:* ${grupoData.id}`);

  } catch (e) {
    console.error(e);
    await m.reply('❌ No se pudo obtener o enviar el mensaje al grupo. Verifica el enlace o los permisos del bot.');
  }
};

handler.help = ['gid'];
handler.tags = ['owner'];
handler.command = ['gid'];
handler.rowner = true;

export default handler;