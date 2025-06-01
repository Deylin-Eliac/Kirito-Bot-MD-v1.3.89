const eliminarUsuariosConPrefijosProhibidos = async (lista, conn, chatId) => {
  const prefijosProhibidos = ['502', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '249', '212'];

  for (const usuario of lista) {
    const number = usuario.id.split('@')[0];
    const isBannedPrefix = prefijosProhibidos.some(prefijo => number.startsWith(prefijo));

    // Ignorar si es admin o superadmin
    if (usuario.admin) continue;

    if (isBannedPrefix) {
      try {
        await conn.sendMessage(chatId, {
          text: `⚠️ Usuario @${number} eliminado por prefijo prohibido.`,
          mentions: [usuario.id]
        });

        await conn.groupParticipantsUpdate(chatId, [usuario.id], 'remove');
        await conn.updateBlockStatus(usuario.id, 'block');

        console.log(`🚫 Usuario ${number} eliminado y bloqueado.`);
      } catch (err) {
        console.error(`❌ Error al eliminar al usuario ${number}:`, err);
      }
    }
  }
};