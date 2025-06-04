export async function before(m, { conn }) { 
  if (!m.text || !global.prefix.test(m.text)) {
    return;
  }

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (!command) return;

  if (command === "bot") {
    return;
  }

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

   /* if (chat.isBanned) {
      const avisoDesactivado = `➳✰ 𝐄𝐥 𝐛𝐨𝐭 *${botname}* 𝐞𝐬𝐭𝐚 𝐟𝐮𝐞𝐫𝐚 𝐝𝐞 𝐬𝐞𝐫𝐯𝐢𝐜𝐢𝐨 𝐞𝐧 𝐞𝐬𝐭𝐞 𝐠𝐫𝐮𝐩𝐨✦.\n\n> ✎ 𝐔𝐧 *𝐚𝐝𝐦𝐢𝐧* 𝐩𝐮𝐞𝐝𝐞 𝐚𝐜𝐭𝐢𝐯𝐚𝐫𝐥𝐨 𝐜𝐨𝐧 𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨✦:\n> » *${usedPrefix}𝗸𝗶𝗿𝗶𝘁𝗼 𝗼𝗻*`;
      await conn.reply(m.chat, avisoDesactivado, m, rcanal);
      return;
    }*/

    if (!user.commands) user.commands = 0;
    user.commands += 1;
  } else {
    const comando = m.text.trim().split(' ')[0];
    await conn.reply(m.chat, `✎⍰ 𝑬𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐《 *${comando}* 》𝒏𝒐 𝒆𝒙𝒊𝒔𝒕𝒆.\n𝒑𝒆𝒓𝒂 𝒗𝒆𝒓 𝒍𝒂 𝒍𝒊𝒔𝒕𝒂 𝒅𝒆 𝒄𝒐𝒎𝒂𝒏𝒅𝒐𝒔 𝒖𝒔𝒂:\n» *#𝗺𝗲𝗻𝘂*`, m, rcanal);
  }
}