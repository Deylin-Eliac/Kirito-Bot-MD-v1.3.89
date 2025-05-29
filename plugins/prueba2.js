// plugins/admin-protection.js

const handler = async (m, { conn, participants }) => {
    try {
        // Verificar si es un mensaje de grupo
        if (!m.isGroup) return;

        // Obtener información del grupo
        const groupId = m.chat;
        const botNumber = conn.user.jid;

        // Obtener los administradores del grupo
        const groupAdmins = participants.filter(p => p.admin);

        // Verificar si el bot es admin
        if (!groupAdmins.find(p => p.id === botNumber)?.admin) {
            return m.reply('❌ El bot necesita ser administrador para usar esta función');
        }

        // Monitorear cambios de admin
        conn.on('group-participants-update', async (update) => {
            if (update.action === 'demote') {
                const revokedAdmin = update.participants[0];
                const revokingAdmin = update.actor;

                try {
                    // Restaurar admin al revocado
                    await conn.groupParticipantsUpdate(groupId, [revokedAdmin], "promote");

                    // Quitar admin al que revocó
                    await conn.groupParticipantsUpdate(groupId, [revokingAdmin], "demote");

                    await conn.sendMessage(groupId, {
                        text: `🛡️ Sistema de Protección Activado\n\n` +
                              `✅ Admin restaurado: @${revokedAdmin.split('@')[0]}\n` +
                              `❌ Admin removido: @${revokingAdmin.split('@')[0]}`,
                        mentions: [revokedAdmin, revokingAdmin]
                    });

                } catch (error) {
                    console.error('Error al gestionar cambios de admin:', error);
                    await conn.sendMessage(groupId, {
                        text: '❌ Error al procesar cambios de administrador'
                    });
                }
            }
        });

    } catch (error) {
        console.error('Error en plugin de protección:', error);
        m.reply('❌ Ocurrió un error al ejecutar el plugin');
    }
}

// Configuración del comando
handler.help = ['adminprotect'];
handler.tags = ['group', 'admin'];
handler.command = /^(adminprotect|protectadmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

module.exports = handler;