let handler = async (m, { conn }) => {
  return con.replay(m.chat, 'puto', m)
};


handler.command = ['h']

export default handler;