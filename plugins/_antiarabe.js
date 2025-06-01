let handler = async (event, { conn }) => {
  const prefijosProhibidos = ['502', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '249', '212'];

  const botJid = conn?.user?.id || conn?.user?.jid;
  if (!botJid) return;

  const botSettings = global.db?.data?.settings?.[botJid] || {};
  if (!botSettings.anticommand) return;

  const procesarParticipante = async (participant, chatId) => {
    const number = participant.split('@')[0];
    const isBannedPrefix = prefijosProhibidos.some(prefijo => number.startsWith(prefijo));
    let user = global.db?.data?.users?.[participant] || {};

    if (isBannedPrefix) {
      user.banned = true;
      global.db.data.users[participant] = user;

      try {
        await conn.sendMessage(chatId, {
          text: `⚠️ Usuario con número prohibido detectado.\n@${number} será eliminado.`,
          mentions: [participant]
        });

        await conn.groupParticipantsUpdate(chatId, [participant], 'remove');
        await conn.updateBlockStatus(participant, 'block');
        console.log(`🛑 Usuario ${number} eliminado y bloqueado.`);
      } catch (e) {
        console.error('❌ Error al expulsar o bloquear:', e);
      }
    }
  };

  // Validar acción de agregar miembros
  if (event.action === 'add') {
    const chatId = event.id || event.chat;

    for (const participant of event.participants || []) {
      await procesarParticipante(participant, chatId);

      // Si el bot fue agregado al grupo
      if (participant.split(':')[0] === botJid.split(':')[0]) {
        console.log(`✅ Bot fue añadido al grupo: ${chatId}`);

        try {
          // Esperar brevemente para que el grupo esté accesible
          await new Promise(resolve => setTimeout(resolve, 2000));

          const metadata = await conn.groupMetadata(chatId);
          const participantesActuales = metadata.participants.map(p => p.id || p.jid);

          for (const miembro of participantesActuales) {
            if (miembro.split(':')[0] !== botJid.split(':')[0]) {
              await procesarParticipante(miembro, chatId);
            }
          }
        } catch (err) {
          console.error('❌ Error al revisar los miembros del grupo:', err);
        }
      }
    }
  }
};

handler.event = 'group-participants-update';
export default handler;