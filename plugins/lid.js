let handler = async function (m, { conn, args, usedPrefix, command }) {
  try {
    let metadata

    if (args[0]) {
      // 👉 Uso con URL
      const link = args[0]
      if (!link.includes('chat.whatsapp.com')) {
        throw `❌ Enlace inválido.\nUsa:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`
      }

      const code = link.split('/').pop().trim()
      const groupId = await conn.groupAcceptInvite(code)
      metadata = await conn.groupMetadata(groupId)

      // Opcional: salir después
      await conn.groupLeave(groupId)

    } else {
      // 👉 Uso local: obtener metadata manualmente
      if (!m.isGroup) {
        throw `⚠️ Usa este comando dentro de un grupo o con el enlace del grupo.\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`
      }
      metadata = await conn.groupMetadata(m.chat)
    }

    const participantList = metadata?.participants || []
    const result = participantList.map(participant => ({
      id: participant.id,
      lid: participant.lid || null,
      admin: participant.admin || null
    }))

    await m.reply(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
    await m.reply('❌ No se pudieron obtener los participantes del grupo.')
  }
}

handler.command = ['lid']
handler.help = ['lid [enlace del grupo]']
handler.tags = ['group']
handler.rowner = true

export default handler