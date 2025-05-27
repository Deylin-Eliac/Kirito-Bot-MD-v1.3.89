let handler = async (m, { conn }) => {
  return conn.reply(m.chat, `*las API disponibles son:*


[1]
https://mode-api-sigma.vercel.app/api/mp3?url=

[2]
https://mode-api-sigma.vercel.app/api/index?url=

[3]
https://Ytumode-api.vercel.app/api/search?q=

[4]
https://mode-ia.onrender.com/mode-ia?prompt=`, m, rcanal)
};


handler.command = ['apis', 'api']

export default handler;