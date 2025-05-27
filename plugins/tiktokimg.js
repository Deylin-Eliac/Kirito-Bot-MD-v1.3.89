import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `✨ *Ingresa una URL de TikTok válida*\n\nEjemplo: !tiktokimg https://www.tiktok.com/@Rayoh-ofc/photo/7460682985231191302`,
      m
    );
  }

  try {
    await m.react('🕒');
    conn.sendPresenceUpdate('composing', m.chat);

    const url = `https://api.fgmods.xyz/api/downloader/tiktok?url=${encodeURIComponent(text)}&apikey=fg_ZIKajBcu`;
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.result && data.result.images && data.result.images.length > 0) {
      const images = data.result.images;

      const mediaGroup = images.map((image, index) => ({
        type: 'photo',
        media: image,
        caption: `📸 Imagen ${index + 1} de TikTok`,
      }));

      await conn.sendMediaGroup(m.chat, mediaGroup);
      await m.react('✅');
    } else {
      conn.reply(m.chat, '❌ No se encontraron imágenes en el enlace proporcionado.', m);
    }
  } catch (error) {
    console.error("❌ Error al obtener imágenes de TikTok:", error.message);
    conn.reply(
      m.chat,
      '❌ Ocurrió un error al procesar tu solicitud. Por favor, verifica el enlace e intenta nuevamente.',
      m
    );
  }
};

handler.command = ['tiktokimg1'];
handler.help = ['tiktokimg'];
handler.tags = ['downloader'];

export default handler;