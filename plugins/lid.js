let handler = async function (m, { conn, args, groupMetadata, isGroup, usedPrefix, command }) {
  try {
    let metadata

    if (args[0]) {
      // --- Si el argumento es un enlace ---
      const link = args[0]
      if (!link.includes('chat.whatsapp.com')) {
        throw `❌ Enlace inválido.\nUsa:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`
      }

      const code = link.split('/').pop().trim()
      const groupId = await conn.groupAcceptInvite(code) // se une temporalmente
      metadata = await conn.groupMetadata(groupId)

      // ✅ Se sale después de obtener los datos (opcional)
      await conn.groupLeave(groupId)

    } else {
      // --- Si se usa localmente dentro de un grupo ---
      if (!isGroup) {
        throw `⚠️ Este comando se debe usar dentro de un grupo o con un enlace válido.\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/abc123XYZ`
      }
      metadata = groupMetadata
    }

    const participants = metadata?.participants || []
    const result = participants.map(p => ({
      id: p.id,
      lid: p.lid || null,
      admin: p.admin || null
    }))

    await m.reply(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al obtener los participantes del grupo.')
  }
}

handler.command = ['lid']
handler.help = ['lid [enlace del grupo]']
handler.tags = ['group']
handler.rowner = true

export default handler