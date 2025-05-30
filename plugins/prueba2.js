let handler = async function (m, { conn, participants, groupMetadata }) {
  // Función para normalizar los JIDs (eliminar caracteres no numéricos)
  const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')

  // Número del remitente (quien envió el mensaje)
  const senderNum = normalizeJid(m.sender)

  // Lista de números del bot: principal (jid) y secundario (lid)
  const botNums = [conn.user.jid, conn.user.lid].map(normalizeJid)

  // Participantes del grupo (si es que el mensaje vino de un grupo)
  const participantList = m.isGroup ? groupMetadata.participants : []

  // Usuario que envió el mensaje
  const user = m.isGroup
    ? participantList.find(u => normalizeJid(u.id) === senderNum)
    : {}

  // Información del bot en el grupo (si está en los participantes)
  const bot = m.isGroup
    ? participantList.find(u => botNums.includes(normalizeJid(u.id)))
    : {}

  // Aquí puedes hacer lo que desees con los datos, por ejemplo, enviarlos
  return m.reply(`Participantes: ${participantList.length}\nUsuario: ${user?.id || 'N/A'}\nBot: ${bot?.id || 'N/A'}`)
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['lid']

export default handler