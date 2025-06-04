export async function before(m, { conn }) { 
  if (!m.text || !global.prefix.test(m.text)) return;

  const chat = global.db.data.chats[m.chat];
  if (chat?.isBanned) return; 
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
  if (command === "bot") return;

  if (validCommand(command, global.plugins)) {
    let user = global.db.data.users[m.sender];
    if (!user.commands) user.commands = 0;
    user.commands += 1;
  } else {
    const comando = m.text.trim().split(' ')[0];
    await conn.reply(m.chat, `✎⍰ 𝑬𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐《 *${comando}* 》𝒏𝒐 𝒆𝒙𝒊𝒔𝒕𝒆.\n𝒑𝒆𝒓𝒂 𝒗𝒆𝒓 𝒍𝒂 𝒍𝒊𝒔𝒕𝒂 𝒅𝒆 𝒄𝒐𝒎𝒂𝒏𝒅𝒐𝒔 𝒖𝒔𝒂:\n» *#𝗺𝗲𝗻𝘂*`, m, rcanal);
  }
}