// Créditos del código base: FzTeis + Adaptado por ChatGPT sin API Key

import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`jid must be string, got ${typeof jid}`);

  if (medias.length < 2) throw new RangeError("Se necesitan al menos 2 imágenes para enviar un álbum");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(media => media.type === "image").length,
        expectedVideoCount: medias.filter(media => media.type === "video").length,
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
  const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%2C%22redux_normalize_feed%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D`;

  const headers = {
    'user-agent': 'Mozilla/5.0',
    'x-requested-with': 'XMLHttpRequest'
  };

  try {
    const res = await axios.get(link, { headers });
    const results = res.data?.resource_response?.data?.results || [];

    return results.map(item => item?.images?.orig?.url || item?.images?.['564x']?.url).filter(Boolean);
  } catch (e) {
    console.error('Error en buscarPinterest:', e.message);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Escribe algo para buscar en Pinterest.', m);

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    const resultados = await buscarPinterest(text);
    if (!resultados.length) return conn.reply(m.chat, 'No encontré imágenes.', m);

    const albumMedias = resultados.slice(0, 10).map(url => ({
      type: 'image',
      data: { url }
    }));

    await sendAlbumMessage(m.chat, albumMedias, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, 'Ocurrió un error al buscar imágenes.', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];

export default handler;