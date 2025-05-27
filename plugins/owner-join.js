let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
    if (!text) return m.reply(`${emoji} Debes enviar una invitación para que *${botname}* se una al grupo.`);

    let match = text.match(linkRegex);
    if (!match) return m.reply(`${emoji2} Enlace de invitación no válido.`);

    let [, code] = match;

    if (isOwner) {
        try {
            await conn.groupAcceptInvite(code);
            m.reply(`${emoji} Me he unido exitosamente al grupo.`);
        } catch (err) {
            console.error('[ERROR AL UNIRSE AL GRUPO]', err);
            let msg = `${msm} Error al unirme al grupo.`;

            if (err?.message?.includes('not-authorized')) {
                msg += `\nPosiblemente el número fue expulsado del grupo anteriormente.`;
            } else if (err?.message?.includes('already joined')) {
                msg += `\nYa estoy en ese grupo.`;
            } else if (err?.message?.includes('invalid')) {
                msg += `\nEl enlace de invitación no es válido o está vencido.`;
            }

            m.reply(msg);
        }
    } else {
        let message = `${emoji} Invitación a un grupo:\n${text}\n\nPor: @${m.sender.split('@')[0]}`;
        await conn.sendMessage(`${suittag}@s.whatsapp.net`, { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`${emoji} El link del grupo ha sido enviado, gracias por tu invitación. ฅ^•ﻌ•^ฅ`);
    }
};

handler.help = ['invite'];
handler.tags = ['owner', 'tools'];
handler.command = ['invite', 'join'];
handler.rowner = true;

export default handler;