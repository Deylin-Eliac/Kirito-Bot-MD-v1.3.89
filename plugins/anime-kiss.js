// Codígo creado por Destroy wa.me/584120346669
// Modificado por https://wa.me/573154062343

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('💋');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` *Le dio besos a* \`${name || who}\` *( ˘ ³˘)♥*.`;
    } else if (m.quoted) {
        str = `\`${name2}\` *beso a* \`${name || who}\` 💋.`;
    } else {
        str = `\`${name2}\` *se besó a sí mismo ( ˘ ³˘)♥*`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360416473.mp4';
        let pp2 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360413151.mp4';
        let pp3 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360408138.mp4';
        let pp4 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360404752.mp4';
        let pp5 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360400635.mp4';
        let pp6 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360396672.mp4';
        let pp7 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360392488.mp4';
        let pp8 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360387132.mp4';
        let pp9 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360381983.mp4';
        let pp10 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360378757.mp4';
        let pp11 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360373892.mp4';   
        let pp12 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360370272.mp4';
        let pp13 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360366015.mp4';
        let pp14 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360357954.mp4';
        let pp15 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360354316.mp4';
        let pp16 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360350515.mp4';
        let pp17 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360346691.mp4';
        let pp18 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360341001.mp4';
        let pp19 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360336842.mp4';
        let pp20 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748360332407.mp4';
        let pp21 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748359611075.mp4';
        let pp22 = 'https://raw.githubusercontent.com/https0J/Hoshino-Adiciones/main/Contenido/1748359606416.mp4';

        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15, pp16, pp17, pp18, pp19, pp20, pp21, pp22];
        const video = videos[Math.floor(Math.random() * videos.length)];

        let mentions = [who];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['kiss/besar @tag'];
handler.tags = ['anime'];
handler.command = ['kiss','besar'];
handler.group = true;

export default handler;
