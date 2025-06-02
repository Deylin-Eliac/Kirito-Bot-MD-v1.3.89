import fs from 'fs';
import path from 'path';

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

    const data = {
      id: info.id,
      nombre: info.subject,
      descripcion: info.desc || 'Sin descripción',
    };

    // Guardar archivo
    const ruta = `./grupos_guardados/${info.id}.json`;
    fs.mkdirSync('./grupos_guardados', { recursive: true });
    fs.writeFileSync(ruta, JSON.stringify(data, null, 2));

    await m.reply(`✅ Información del grupo guardada.\n\n📛 *Nombre:* ${data.nombre}\n🆔 *ID:* ${data.id}`);

  } catch (e) {
    console.error(e);
    await m.reply('❌ No se pudo obtener la información del grupo. Puede que el bot no tenga permiso para ver ese enlace.');
  }
};

handler.help = ['gid'];
handler.tags = ['owner'];
handler.command = ['gid'];
handler.rowner = true;

export default handler;