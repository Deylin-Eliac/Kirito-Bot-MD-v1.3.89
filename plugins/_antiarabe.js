let handler = async (event, { conn }) => {
  const prefijosProhibidos = ['502', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '249', '212'];

  const botJid = conn?.user?.jid;
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
          text: `⚠️ @${number} ha sido eliminado automáticamente por tener un prefijo no permitido.`,
          mentions: [participant]
        });

        await conn.groupParticipantsUpdate(chatId, [participant], 'remove');
        await conn.updateBlockStatus(participant, 'block');
      } catch (e) {
        console.error('Error al expulsar o bloquear:', e);
      }
    }
  };

  // Si alguien fue añadido
  if (event.action === 'add') {
    for (const participant of event.participants || []) {
      await procesarParticipante(participant, event.id);

      // Si el bot fue agregado al grupo
      if (participant === botJid) {
        try {
          // Esperamos a que el grupo esté completamente accesible
          const metadata = await conn.groupMetadata(event.id);
          const participantesActuales = metadata.participants.map(p => p.id);

          for (const miembro of participantesActuales) {
            if (miembro !== botJid) {
              await procesarParticipante(miembro, event.id);
            }
          }
        } catch (err) {
          console.error('Error al revisar los miembros del grupo:', err);
        }
      }
    }
  }
};

handler.event = 'group-participants-update';

export default handler;