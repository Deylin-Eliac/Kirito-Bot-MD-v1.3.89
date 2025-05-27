let handler = async (m, { conn }) => {
  return conn.reply(m.chat, 'puto', m)
};


handler.command = ['h']

export default handler;