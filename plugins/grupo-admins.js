const handler = async (m, {conn, participants, groupMetadata, args}) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || './src/catalogo.jpg';
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const pesan = args.join` `;
  const oi = `» ${pesan}`;
  const text = `╭━━━〔 *𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐝𝐨𝐫𝐞𝐬 𝐃𝐞𝐥 𝐆𝐫𝐮𝐩𝐨* 〕━━━⬣
┃  
╰━ ${listAdmin}

╭━• ${emoji} *𝐌𝐞𝐧𝐬𝐚𝐣𝐞:*
┃ ${oi}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣

${emoji} *𝐍𝐎𝐓𝐀:* 𝑬𝒗𝒊𝒕𝒂 𝒖𝒔𝒂𝒓 𝒆𝒔𝒕𝒆 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒑𝒂𝒓𝒂 𝒔𝒑𝒂𝒎 𝒖 𝒃𝒓𝒐𝒎𝒂𝒔, 𝒅𝒆 𝒍𝒐 𝒄𝒐𝒏𝒕𝒓𝒂𝒓𝒊𝒐 𝒑𝒐𝒅𝒓𝒊𝒂𝒔 𝒔𝒆𝒓 "𝒆𝒍𝒊𝒎𝒊𝒏𝒂𝒅𝒐" 𝒖 "𝒃𝒂𝒏𝒆𝒂𝒅𝒐" 𝒅𝒆𝒍 𝒃𝒐𝒕.`.trim();
  conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['admins <texto>'];
handler.tags = ['grupo'];
// regex detect A word without case sensitive
handler.customPrefix = /a|@/i;
handler.command = /^(admins|@admins|dmins)$/i;
handler.group = true;

export default handler;