import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  async function reportError(e) {
    console.log(e);
    await m.reply(
`╭─「 Kirito-Bot: Error 」
│ Ocurrió un error al ejecutar el comando.
│ 
│ Detalles: ${e.message || e}
╰────`);
  }

  switch (true) {
    case isCommand1: {
      let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
      let uniqid = who.split`@`[0];
      const sessionPath = `./${jadi}/${uniqid}`;

      if (!fs.existsSync(sessionPath)) {
        await conn.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot 」
│ No hay sesión activa con ese ID.
│ 
│ Usa el comando así:
│ ${usedPrefix + command} (ID opcional)
╰────`,
        }, { quoted: m });
        return;
      }

      if (global.conn.user.jid !== conn.user.jid) {
        await conn.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot 」
│ Este comando solo funciona en el bot principal.
│ 
│ Enlace directo:
│ https://wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}
╰────`,
        }, { quoted: m });
        return;
      }

      await conn.sendMessage(m.chat, {
        text:
`╭─「 Kirito-Bot 」
│ Sub-bot desconectado.
╰────`,
      }, { quoted: m });

      try {
        fs.rmdir(sessionPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, {
          text:
`╭─「 Kirito-Bot 」
│ Sesión eliminada correctamente.
╰────`,
        }, { quoted: m });
      } catch (e) {
        return reportError(e);
      }
      break;
    }

    case isCommand2: {
      if (global.conn.user.jid === conn.user.jid) {
        await conn.reply(m.chat,
`╭─「 Kirito-Bot 」
│ Este comando es exclusivo para sub-bots.
╰────`, m);
      } else {
        await conn.reply(m.chat,
`╭─「 Kirito-Bot 」
│ Sub-bot desactivado correctamente.
╰────`, m);
        conn.ws.close();
      }
      break;
    }

    case isCommand3: {
      const usersMap = new Map();
for (const c of global.conns) {
  if (c?.user?.jid && c.ws?.socket?.readyState !== ws.CLOSED && !usersMap.has(c.user.jid)) {
    usersMap.set(c.user.jid, c);
  }
}
const users = [...usersMap.values()];

      const convertirMsADiasHorasMinutosSegundos = (ms) => {
        let s = Math.floor(ms / 1000) % 60,
            m = Math.floor(ms / 60000) % 60,
            h = Math.floor(ms / 3600000) % 24,
            d = Math.floor(ms / 86400000);
        return `${d ? d + "d " : ""}${h ? h + "h " : ""}${m ? m + "m " : ""}${s ? s + "s" : ""}`.trim();
      };

      const message = users.map((v, i) =>
`╭─「 Sub-Bot #${i + 1} 」
│ Nombre  : ${v.user.name || 'Sub-Bot'}
│ Enlace  : wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
│ Online  : ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}
╰────`).join('\n\n');

      const responseMessage =
`╭─「 Kirito-Bot 」
│ Sub-Bots activos: ${users.length}
╰────\n\n${message || 'No hay sub-bots conectados.'}`;

      await conn.sendMessage(m.chat, {
        text: responseMessage,
        mentions: conn.parseMention(responseMessage)
      }, { quoted: m });

      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;