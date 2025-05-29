const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from "qrcode";
import crypto from 'crypto';
import fs from "fs";
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws;
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {

const bot = global.db.data.settings[conn.user.jid] || {};

if (!bot.jadibotmd) return m.reply('*${emoji} Este Comando Se Encuentra Desactivado por mis Desarrolladores*');

  let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn;

/*  if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
    return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`);
  }
*/

  async function serbot() {
    let authFolderB = m.sender.split('@')[0];
    const userFolderPath = `./JadiBot/${authFolderB}`;

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    args[0] ? fs.writeFileSync(`${userFolderPath}/creds.json`, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";

    const { state, saveState, saveCreds } = await useMultiFileAuthState(userFolderPath);
    const msgRetryCounterMap = (MessageRetryMap) => { };
    const msgRetryCounterCache = new NodeCache();
    const { version } = await fetchLatestBaileysVersion();
    let phoneNumber = m.sender.split('@')[0];

    const methodCodeQR = process.argv.includes("qr");
    const methodCode = !!phoneNumber || process.argv.includes("code");
    const MethodMobile = process.argv.includes("mobile");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      mobile: MethodMobile,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid);
        let msg = await store.loadMessage(jid, clave.id);
        return msg?.message || "";
      },
      msgRetryCounterCache,
      msgRetryCounterMap,
      defaultQueryTimeoutMs: undefined,
      version
    };

    let conn = makeWASocket(connectionOptions);

    if (methodCode && !conn.authState.creds.registered) {
      if (!phoneNumber) process.exit(0);
      let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(cleanedNumber);
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
            let txt = `╭───────────────⍰  
│  ✭ 𝗞𝗜𝗥𝗜𝗧𝗢 - 𝗕𝗢𝗧 𝗠𝗗 ✰  
╰───────────────⍰ 
> ✰ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗖ó𝗱𝗶𝗴𝗼) ✪  

⟿ 𝐔𝐬𝐚 𝐞𝐬𝐭𝐞 𝐜𝐨́𝐝𝐢𝐠𝐨 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Selecciona *Vincular con el número de teléfono*.  
➥ ❹ 𓂃 Ingresa el código que se muestra a continuación.  

⚠ 𝐄𝐬𝐭𝐞 𝐜ó𝐝𝐢𝐠𝐨 𝐬ó𝐥𝐨 𝐟𝐮𝐧𝐜𝐢𝐨𝐧𝐚 𝐞𝐧 𝐞𝐥 𝐧ú𝐦𝐞𝐫𝐨 𝐝𝐞𝐬𝐝𝐞 𝐞𝐥 𝐪𝐮𝐞 𝐬𝐞 𝐬𝐨𝐥𝐢𝐜𝐢𝐭ó.  
⚠ 𝐒𝐢 𝐲𝐚 𝐭𝐢𝐞𝐧𝐞𝐬 𝐮𝐧𝐚 𝐬𝐞𝐬𝐢ó𝐧 𝐯𝐢𝐧𝐜𝐮𝐥𝐚𝐝𝐚, 𝐬𝐞 𝐫𝐞𝐜𝐨𝐦𝐢𝐞𝐧𝐝𝐚 𝐝𝐞𝐬𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐫𝐥𝐚 𝐩𝐚𝐫𝐚 𝐞𝐯𝐢𝐭𝐚𝐫 𝐞𝐫𝐫𝐨𝐫𝐞𝐬 𝐨 𝐬𝐮𝐬𝐩𝐞𝐧𝐬𝐢𝐨𝐧𝐞𝐬 𝐝𝐞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽.`;
        await parent.reply(m.chat, txt, m, rcanal);
        await parent.reply(m.chat, codeBot, m, rcanal);
        rl.close();
      }, 3000);
    }

    conn.isInit = false;
    let isInit = true;

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update;
      if (isNewLogin) conn.isInit = true;
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

      if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        let i = global.conns.indexOf(conn);
        if (i < 0) return console.log(await creloadHandler(true).catch(console.error));
        delete global.conns[i];
        global.conns.splice(i, 1);
        fs.rmdirSync(userFolderPath, { recursive: true });
        if (code !== DisconnectReason.connectionClosed) {
          parent.sendMessage(m.chat, { text: "Conexión perdida.." }, { quoted: m });
        }
      }

      if (global.db.data == null) loadDatabase();

      if (connection == 'open') {
        conn.isInit = true;
        global.conns.push(conn);
        await parent.reply(m.chat, args[0] ? `╭───────────────⍰  
│  ✭ 𝗞𝗜𝗥𝗜𝗧𝗢 - 𝗕𝗢𝗧 𝗠𝗗 ✰  
╰───────────────⍰ 
> ✰ 𝗖𝗼𝗻𝗲𝘅𝗶𝗼́𝗻 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗮𝗱𝗮 𝗰𝗼𝗻 𝗲́𝘅𝗶𝘁𝗼 ✪  

⟿ 𝐓𝐞 𝐡𝐚𝐬 𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐝𝐨 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐚𝐦𝐞𝐧𝐭𝐞 𝐚 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝐜𝗼𝗺𝗼 𝐒𝐮𝐛-𝐁𝐨𝐭.  

➥ 𓂃 𝗣𝗮𝗿𝗮 𝗲𝘃𝗶𝘁𝗮𝗿 𝗽𝗲𝗿𝗱𝗶𝗱𝗮𝘀 𝗱𝗲 𝗱𝗮𝘁𝗼𝘀 𝗲𝗻 𝗲𝗹 𝗳𝘂𝘁𝘂𝗿𝗼:  
   ▸ Usa *#delsesion* si deseas cerrar esta sesión.  
   ▸ Luego podrás generar un nuevo código con *#code*.  

⚠ 𝐄𝐬𝐭𝐚 𝐜𝐨𝐧𝐞𝐱𝐢ó𝐧 𝐞𝐬 𝐯á𝐥𝐢𝐝𝐚 𝐬ó𝐥𝐨 𝐞𝐧 𝐞𝐥 𝐧ú𝐦𝐞𝐫𝐨 𝐝𝐞𝐬𝐝𝐞 𝐞𝐥 𝐪𝐮𝐞 𝐬𝐞 𝐬𝐨𝐥𝐢𝐜𝐢𝐭ó.  
⚠ 𝐓𝐞𝐧 𝐞𝐧 𝐜𝐮𝐞𝐧𝐭𝐚 𝐪𝐮𝐞 𝐦ú𝐥𝐭𝐢𝐩𝐥𝐚𝐬 𝐬𝐞𝐬𝐢𝐨𝐧𝐞𝐬 𝐚𝐜𝐭𝐢𝐯𝐚𝐬 𝐩𝐮𝐞𝐝𝐞𝐧 𝐜𝐚𝐮𝐬𝐚𝐫 𝐟𝐚𝐥𝐥𝐨𝐬 𝐨 𝐬𝐮𝐬𝐩𝐞𝐧𝐬𝐢𝐨𝐧𝐞𝐬 𝐝𝐞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽.  

> 👤 𝗗𝗲𝘀𝗮𝗿𝗿𝗼𝗹𝗹𝗮𝗱𝗼𝗿: ${dev}`, m, rcanal);
        await sleep(5000);
        if (args[0]) return;

       /* await parent.reply(conn.user.jid, `╭───────────────⍰  
│  ✭ 𝗞𝗜𝗥𝗜𝗧𝗢 - 𝗕𝗢𝗧 𝗠𝗗 ✰  
╰───────────────⍰ 
> ✰ 𝗥𝗲𝗰𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗿á𝗽𝗶𝗱𝗮 𝗱𝗲 𝗦𝘂𝗯-𝗕𝗼𝘁 ✪  

⟿ 𝐋𝐚 𝐩𝐫ó𝐱𝐢𝐦𝐚 𝐯𝐞𝐳 𝐪𝐮𝐞 𝐝𝐞𝐬𝐞𝐞𝐬 𝐫𝐞𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐫𝐭𝐞, 𝐬𝐢𝐦𝐩𝐥𝐞𝐦𝐞𝐧𝐭𝐞 𝐞𝐧𝐯í𝐚 𝐞𝐥 𝐬𝐢𝐠𝐮𝐢𝐞𝐧𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:  

➤ *#session*  

📌 𝗡𝗼 𝗻𝗲𝗰𝗲𝘀𝗶𝘁𝗮𝗿á𝘀 𝘂𝗻 𝗻𝘂𝗲𝘃𝗼 𝗰ó𝗱𝗶𝗴𝗼 𝗮 𝗺𝗲𝗻𝗼𝘀 𝗾𝘂𝗲 𝗲𝗹𝗶𝗺𝗶𝗻𝗲𝘀 𝘁𝘂 𝘀𝗲𝘀𝗶𝗼́𝗻 𝗰𝗼𝗻 *#delsesion*.  
`, m, rcanal);*/
        await parent.sendMessage(conn.user.jid, { text: usedPrefix + command + " " + Buffer.from(fs.readFileSync(`./CrowJadiBot/${authFolderB}/creds.json`), "utf-8").toString("base64") }, { quoted: m });
      }
    }

    setInterval(async () => {
      if (!conn.user) {
        try { conn.ws.close() } catch { }
        conn.ev.removeAllListeners();
        let i = global.conns.indexOf(conn);
        if (i < 0) return;
        delete global.conns[i];
        global.conns.splice(i, 1);
      }
    }, 60000);

    let handler = await import('../handler.js');
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
      } catch (e) {
        console.error(e);
      }
      if (restatConn) {
        try { conn.ws.close() } catch { }
        conn.ev.removeAllListeners();
        conn = makeWASocket(connectionOptions);
        isInit = true;
      }

      if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
      }

      conn.handler = handler.handler.bind(conn);
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn, true);

      conn.ev.on('messages.upsert', conn.handler);
      conn.ev.on('connection.update', conn.connectionUpdate);
      conn.ev.on('creds.update', conn.credsUpdate);
      isInit = false;
      return true;
    };
    creloadHandler(false);
  }

  serbot();
};

handler.help = ['code'];
handler.tags = ['serbot'];
handler.command = ['codex', 'Code'];
handler.rowner = false

export default handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}