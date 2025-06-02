import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  try {
    if (!m.isGroup) throw 'Este comando solo puede usarse en grupos.';

    const metadata = await conn.groupMetadata(m.chat);
    const infoGrupo = {
      id: metadata.id,
      nombre: metadata.subject,
      descripcion: metadata.desc || 'Sin descripción',
      participantes: metadata.participants.map(p => ({
        id: p.id,
        admin: p.admin || null
      }))
    };

    // Guardar en archivo temporal
    const jsonPath = path.join('./', `grupo_${metadata.id.replace('@g.us', '')}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(infoGrupo, null, 2));

    await conn.sendMessage(m.chat, {
      document: { url: jsonPath },
      fileName: `info-grupo-${metadata.id}.json`,
      mimetype: 'application/json'
    }, { quoted: m });

    // Eliminar el archivo después de enviarlo
    fs.unlinkSync(jsonPath);
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al obtener los datos del grupo.');
  }
};

handler.help = ['gid'];
handler.tags = ['owner'];
handler.command = ['gid'];
handler.rowner = true;

export default handler;