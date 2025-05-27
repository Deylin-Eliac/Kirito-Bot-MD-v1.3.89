let handler = async (m, { conn }) => {
  return conn.replay(m.chat, 'puto', m)
};


handler.command = ['h']

export default handler;