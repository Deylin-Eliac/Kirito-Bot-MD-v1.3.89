let handler = async function (m, { conn, args, groupMetadata, isGroup, usedPrefix, command }) {
  try {
    let metadata

    // Si se proporciona un link, obtener metadata desde ese grupo
    if (args[0] && args[0].includes('chat.whatsapp.com')) {
      const code = args[0].split('/').pop().trim()
      if (!code) throw '❌ Enlace de grupo inválido.'

      // El bot se une temporalmente al grupo si es necesario
      const groupId = await conn.groupAcceptInvite(code)
      metadata = await conn.groupMetadata(groupId)

      // Se puede salir después si quieres:
      // await conn.groupLeave(groupId)

    } else {
      // Si es un grupo activo, usar metadata del contexto
      if (!isGroup) throw `⚠️ Usa el comando así:\n${usedPrefix + command} [enlace de grupo]\nO dentro de un grupo.`
      metadata = groupMetadata
    }

    const participants = metadata?.participants || []
    const result = participants.map(participant => ({
      id: participant.id,
      lid: participant.lid || null,
      admin: participant.admin || null
    }))

    await m.reply(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al obtener la lista de participantes.')
  }
}

handler.command = ['lid']
handler.help = ['lid [link]']
handler.tags = ['group']
handler.rowner = true // sólo para dueño del bot, opcional

export default handler