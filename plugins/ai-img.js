import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, `${emoji} Por favor, proporciona una descripción para generar la imagen.`, m, rcanal);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;

    conn.reply(m.chat, `${emoji2} Espere un momento...\n\ngenerando imagen de *${prompt}*`, m, rcanal);

    let imageBuffer = null;

    for (let intento = 1; intento <= 2; intento++) {
        try {
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

            
            if (response.data && response.data.length > 1000) {
                imageBuffer = Buffer.from(response.data);
                break; 
            }
        } catch (error) {
            console.error(`⚠️ Error en el intento ${intento}:`, error.message);
        }
    }

    if (imageBuffer) {
        await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });
    } else {
        await conn.reply(m.chat, `❌ No se pudo generar la imagen tras varios intentos.\nPor favor, intenta nuevamente más tarde.`, m, rcanal);
    }
};

handler.command = ['imgg', 'kiritoia'];
handler.help = ['imgg <descripción>', 'kiritoia <descripción>'];
handler.tags = ['tools'];

export default handler;