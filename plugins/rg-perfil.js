import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import fs from 'fs';

const moneda = 'llamas'; 
const creador = `${dev}`; 

const loadMarriages = () => {
    if (fs.existsSync('./src/database/marry.json')) {
        const data = JSON.parse(fs.readFileSync('./src/database/marry.json', 'utf-8'));
        global.db.data.marriages = data;
    } else {
        global.db.data.marriages = {};
    }
};

let handler = async (m, { conn, args }) => {
    try {
        loadMarriages();

        let userId;
        if (m.quoted?.sender) {
            userId = m.quoted.sender;
        } else if (m.mentionedJid?.[0]) {
            userId = m.mentionedJid[0];
        } else {
            userId = m.sender;
        }

        let user = global.db.data.users?.[userId];
        if (!user) {
            return m.reply('⚠️ Este usuario no tiene datos aún.');
        }

        let name = await conn.getName(userId);
        let cumpleanos = user.birth || 'No especificado';
        let genero = user.genre || 'No especificado';
        let description = user.description || 'Sin descripción';
        let exp = user.exp || 0;
        let nivel = user.level || 0;
        let role = user.role || 'Esclavo';
        let llamas = user.llama || 0;
        let bankllamas = user.bank || 0;

        let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://qu.ax/ESiZc.jpg');

        let isMarried = userId in global.db.data.marriages;
        let partnerId = isMarried ? global.db.data.marriages[userId] : null;
        let partnerName = partnerId ? await conn.getName(partnerId) : 'Nadie';

        let profileText = `
「👑」 *Perfil* ✰@${userId.split('@')[0]}✰
${description}

✎ Edad » ${user.age || 'Desconocida'}
✎ *Cumpleaños* » ${cumpleanos}
✎ *Género* » ${genero}
✎ Casado con » ${isMarried ? partnerName : 'Nadie'}

♛ *Experiencia* » ${exp.toLocaleString()}
♛ *Nivel* » ${nivel}
♛ Rango » ${role}

⛁ *llamas Cartera* » ${llamas.toLocaleString()} ${moneda}
⛃ *llamas Banco* » ${bankllamas.toLocaleString()} ${moneda}
✰ *Premium* » ${user.premium ? '✅' : '❌'}
        `.trim();

        await conn.sendMessage(m.chat, {
            text: profileText,
            contextInfo: {
                mentionedJid: [userId],
                externalAdReply: {
                    title: '✰ Perfil de Usuario ✰',
                    body: creador,
                    thumbnailUrl: perfil,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al generar el perfil.');
    }
};

handler.help = ['profile', 'perfil'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];
handler.register = true;
handler.group = true;

export default handler;