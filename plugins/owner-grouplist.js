const handler = async (m, { conn }) => {
  let txt = '';
  try {
    const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
    const totalGroups = groups.length;

    for (let i = 0; i < groups.length; i++) {
      const [jid] = groups[i];
      const metadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch(() => null))) || {};
      const participants = metadata.participants || [];
      const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
      const isBotAdmin = bot?.admin || false;
      const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
      const participantStatus = isParticipant ? 'Participante' : 'Ex-participante';
      const totalParticipants = participants.length;
      const groupName = metadata.subject || await conn.getName(jid);
      const groupLink = isBotAdmin
        ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid).catch(() => '') || 'Error'}`
        : '(No disponible: sin permisos de admin)';

      txt += `╔════════════════════╗
║ Grupo ${i + 1}
╠ Nombre: ${groupName}
╠ ID: ${jid}
╠ Admin: ${isBotAdmin ? 'Sí' : 'No'}
╠ Estado: ${participantStatus}
╠ Participantes: ${totalParticipants}
╠ Link: ${groupLink}
╚════════════════════╝\n\n`;
    }

    m.reply(`📄 Lista de grupos del bot\n\nTotal: ${totalGroups} grupos encontrados.\n\n${txt}`.trim());
  } catch (e) {
    let errorTxt = '';
    const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
    const totalGroups = groups.length;

    for (let i = 0; i < groups.length; i++) {
      const [jid] = groups[i];
      const metadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch(() => null))) || {};
      const participants = metadata.participants || [];
      const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
      const isBotAdmin = bot?.admin || false;
      const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
      const participantStatus = isParticipant ? 'Participante' : 'Ex-participante';
      const totalParticipants = participants.length;
      const groupName = metadata.subject || await conn.getName(jid);

      errorTxt += `╔════════════════════╗
║ Grupo ${i + 1}
╠ Nombre: ${groupName}
╠ ID: ${jid}
╠ Admin: ${isBotAdmin ? 'Sí' : 'No'}
╠ Estado: ${participantStatus}
╠ Participantes: ${totalParticipants}
╠ Link: (No disponible)
╚════════════════════╝\n\n`;
    }

    m.reply(`📄 Lista de grupos del bot\n\nTotal: ${totalGroups} grupos encontrados.\n\n${errorTxt}`.trim());
  }
};

handler.help = ['groups', 'grouplist'];
handler.tags = ['owner'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'listagrupos'];
handler.rowner = true;

export default handler;