let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el error que desea reportar.`, m, fake)
    if (text.length < 10) return conn.reply(m.chat, `${emoji} Especifique bien el error, mínimo 10 caracteres.`, m, fake)
    if (text.length > 1000) return conn.reply(m.chat, `${emoji2} *Máximo 1000 caracteres para enviar el error.`, m, fake)
    const teks = `*🔥 \`R E P O R T E\` 🔥*

👑 Número:
• Wa.me/${m.sender.split`@`[0]}

✨ Usuario: 
• ${m.pushName || 'Anónimo'}

🔥 Mensaje:
• ${text}`
    
    await conn.reply(`${suittag}@s.whatsapp.net`, m.quoted ? teks + m.quoted.text : teks, m, fake, { mentions: conn.parseMention(teks) })
    await conn.reply('120363402481697721@g.us', m.quoted ? teks + m.quoted.text : teks, m, fake, { mentions: conn.parseMention(teks) })

    conn.reply(m.chat, `${emoji} El reporte se envió a mi creador y al grupo correspondiente, cualquier informe falso puede ocasionar baneo.`, m, fake)
}
handler.help = ['reportar']
handler.tags = ['info']
handler.command = ['reporte', 'report', 'reportar', 'bug', 'error']

export default handler