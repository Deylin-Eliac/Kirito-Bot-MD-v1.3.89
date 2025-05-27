let handler = async (m, { conn }) => {
  return con.replay(m.chat,  'hola mundo', m)
};


handler.command = ['deldescription', 'deldesc']

export default handler;