// Handler Pinterest sin API Key usando API pública alternativa
import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.length,
        expectedVideoCount: 0,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message,
              },
            }
          : {}),
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
    await baileys.delay(delay);
  }

  return album;
}

const buscarPinterest = async (query) => {
  try {
    const res = await axios.get(`https://api-dylux.vercel.app/api/pinterest?text=${encodeURIComponent(query)}`);
    if (res.data?.status && res.data?.result?.length > 0) {
      return res.data.result.map(url => ({ type: 'image', data: { url } }));
    }
    return [];
  } catch (e) {
    console.error('Error en buscarPinterest:', e.message);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Escribe algo para buscar en Pinterest.', m);

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const albumMedias = await buscarPinterest(text);
    if (albumMedias.length < 2) return conn.reply(m.chat, 'No se encontraron suficientes imágenes.', m);

    await sendAlbumMessage(m.chat, albumMedias.slice(0, 10), { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, 'Ocurrió un error al buscar en Pinterest.', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];

export default handler;