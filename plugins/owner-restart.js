let handler = async (fkontak, { conn, usedPrefix, command }) => {
    try {
        
        await conn.reply(fkontak.chat, '🛠️ Reiniciando el sistema del bot...\nPor favor, espere unos segundos.', fkontak)

        
        setTimeout(() => {
            console.log('[RESTART] Reinicio del bot solicitado por el propietario.')
            process.exit(0)
        }, 3000)

    } catch (error) {
        
        console.error('[ERROR][REINICIO]', error)
        await conn.reply(fkontak.chat, `❌ Error al intentar reiniciar el bot:\n\n${error.message || error}`, fkontak)
    }
}


handler.help = ['restart', 'reiniciar']
handler.tags = ['owner']
handler.command = ['restart', 'reiniciar'] 
handler.rowner = true 

export default handler