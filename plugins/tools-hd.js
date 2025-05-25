import axios from "axios";
const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime) return conn.reply(m.chat, `❗ Por favor, responde a una imagen para mejorar a HD.`, m);
    if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, `❗ El archivo (${mime}) no es compatible. Usa JPG o PNG.`, m);

    conn.reply(m.chat, `⏳ Mejorando la calidad de la imagen...`, m);

    let img = await q.download?.();
    let buffer = await upscaleAnonymous(img);

    conn.sendMessage(m.chat, { image: buffer }, { quoted: m });
  } catch (e) {
    console.error(e);
    return m.reply(`⚠️ Ocurrió un error al procesar la imagen.`);
  }
};
handler.help = ["remini", "hd", "enhance"];
handler.tags = ["tools"];
handler.command = ["remini", "hd", "enhance"];
export default handler;

async function upscaleAnonymous(imageBuffer) {
  const form = new FormData();
  form.append("image", imageBuffer, {
    filename: "image.jpg",
    contentType: "image/jpeg",
  });

  const { data } = await axios.post("https://inferenceengine.vyro.ai/remini.vyro", form, {
    headers: form.getHeaders(),
    responseType: "arraybuffer",
  });

  return Buffer.from(data);
}