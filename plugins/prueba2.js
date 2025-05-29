import { makeWASocket, useMultiFileAuthState, DisconnectReason, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text, command }) => {
  try {
    const sessionPath = `./subbots/${m.sender.replace(/[^0-9]/g, '')}`;
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ['Kirito-SubBot', 'Chrome', '1.0.0'],
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
        return {
          conversation: "SubBot conectado",
        };
      }
    });

    m.reply('🟡 Esperando conexión del Sub-Bot...');

    // Muestra QR
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        await conn.sendMessage(m.chat, { text: '*📲 Escanea este código QR desde otro WhatsApp:*' }, { quoted: m });
        await conn.sendMessage(m.chat, { image: Buffer.from(qr), caption: '⌛ Expira en 60 segundos' }, { quoted: m });
      }

      if (connection === 'open') {
        await conn.sendMessage(m.chat, { text: '✅ Sub-Bot vinculado exitosamente y conectado.', mentions: [m.sender] }, { quoted: m });
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        const reason = DisconnectReason[code] || lastDisconnect?.error?.message;
        await conn.sendMessage(m.chat, { text: `❌ Sub-Bot desconectado: ${reason}` }, { quoted: m });
        try {
          await sock.logout();
        } catch {}
      }
    });

    // Código de emparejamiento (opcional)
    try {
      const code = await sock.requestPairingCode(m.sender.split('@')[0]);
      await conn.sendMessage(m.chat, { text: `🔗 *Código de vinculación generado:*\n\`\`\`${code}\`\`\`` }, { quoted: m });
    } catch (err) {
      console.error('No se pudo generar el código de vinculación:', err.message);
    }

    // Guardar sesión en cada cambio
    sock.ev.on('creds.update', saveCreds);

    // Lógica del sub-bot
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.message || msg.key.fromMe) return;
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

      if (/hola|hello|hi/i.test(text)) {
        await sock.sendMessage(msg.key.remoteJid, { text: '👋 ¡Hola! Soy un Sub-Bot temporal.' });
      }
    });

  } catch (err) {
    console.error('Error en comando serbot:', err);
    await conn.sendMessage(m.chat, { text: `❌ Ocurrió un error al iniciar el Sub-Bot:\n\`\`\`${err.message}\`\`\`` }, { quoted: m });
  }
};

handler.command = ['codex'];
export default handler;