import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  async function reportError(e) {
    console.error(e);
    return m.reply(
`╭─「 Kirito-Bot: Error 」
│ Ocurrió un error al ejecutar el comando.
│
│ Detalles: ${e.message}
╰────`);
  }

  switch (true) {
    case isCommand1: {
      let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
      let uniqid = who.split`@`[0];
      let sessionPath = `./${jadi}/${uniqid}`;

      if (!fs.existsSync(sessionPath)) {
        return _envio.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot: Sesión no encontrada 」
│ No se encontró una sesión activa con ese ID.
│ 
│ Usa el comando así:
│ ${usedPrefix + command} (ID opcional)
╰────`,
        }, { quoted: m });
      }

      if (global.conn.user.jid !== conn.user.jid) {
        return _envio.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot: Permiso denegado 」
│ Este comando solo puede ejecutarse desde 
│ el bot principal.
│
│ Enlace directo:
│ https://wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}
╰────`,
        }, { quoted: m });
      }

      try {
        fs.rmdir(sessionPath, { recursive: true, force: true });
        await _envio.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot: Sesión eliminada 」
│ La sesión ha sido eliminada correctamente.
╰────`
        }, { quoted: m });
      } catch (e) {
        return reportError(e);
      }
      break;
    }

    case isCommand2: {
      if (global.conn.user.jid === conn.user.jid) {
        return conn.reply(m.chat,
`╭─「 Kirito-Bot 」
│ Este comando solo está disponible para sub-bots.
╰────`, m);
      } else {
        await conn.reply(m.chat,
`╭─「 Kirito-Bot: Pausa 」
│ El sub-bot ha sido desconectado correctamente.
╰────`, m);
        conn.ws.close();
      }
      break;
    }

    case isCommand3: {
      const users = [
        ...new Set(global.conns.filter(conn => conn.user && conn.ws?.socket?.readyState !== ws.CLOSED))
      ];

      const convertirMsADiasHorasMinutosSegundos = (ms) => {
        let s = Math.floor(ms / 1000) % 60,
            m = Math.floor(ms / 60000) % 60,
            h = Math.floor(ms / 3600000) % 24,
            d = Math.floor(ms / 86400000);
        return `${d ? d + "d " : ""}${h ? h + "h " : ""}${m ? m + "m " : ""}${s ? s + "s" : ""}`.trim();
      };

      const message = users.map((bot, i) => 
`╭─「 Sub-Bot #${i + 1} 」
│ Nombre      : ${bot.user.name || 'Sub-Bot'}
│ Enlace      : wa.me/${bot.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
│ Conectado   : ${bot.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - bot.uptime) : 'Desconocido'}
╰────`).join('\n\n');

      const response = 
`╭─「 Kirito-Bot: Panel de Sub-Bots 」
│ Sub-Bots activos: ${users.length}
╰────\n\n${message || 'No hay sub-bots conectados.'}`;

      return _envio.sendMessage(m.chat, {
        text: response,
        mentions: _envio.parseMention(response)
      }, { quoted: m });
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;