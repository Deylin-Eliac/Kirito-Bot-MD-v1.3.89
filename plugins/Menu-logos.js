const estilosLogos = [
  { cmd: 'glitchtext', emoji: '🟣' },
  { cmd: 'narutotext', emoji: '🍥' },
  { cmd: 'amongustext', emoji: '🟠' },
  { cmd: 'neonlight', emoji: '💡' },
  { cmd: 'pubglogo', emoji: '🔫' },
  { cmd: 'dragonball', emoji: '⚡' },
  { cmd: 'marvel', emoji: '🦸' },
  { cmd: 'pixelglitch', emoji: '🔳' },
  { cmd: 'matrix', emoji: '👾' },
  { cmd: 'writetext', emoji: '✍️' },
  { cmd: 'advancedglow', emoji: '🌟' },
  { cmd: 'firetext', emoji: '📝' },
  { cmd: 'rainbowtext', emoji: '🌈' },
  { cmd: 'flagtext', emoji: '🏳️' },
  { cmd: 'flag3dtext', emoji: '🏁' },
  { cmd: 'glitchtext Kirito-Bot-MD*', emoji: '❌' },
  { cmd: 'blackpinkstyle', emoji: '💖' },
  { cmd: 'multicoloredneon', emoji: '✨' },
  { cmd: 'underwatertext', emoji: '🌊' },
  { cmd: 'logomaker', emoji: '🖌️' },
  { cmd: 'cartoonstyle', emoji: '🎨' },
  { cmd: 'papercutstyle', emoji: '✂️' },
  { cmd: 'watercolortext', emoji: '🖍️' },
  { cmd: 'effectclouds', emoji: '☁️' },
  { cmd: 'blackpinklogo', emoji: '🌸' },
  { cmd: 'typographytext', emoji: '🌀' },
  { cmd: 'summerbeach', emoji: '🏖️' },
  { cmd: 'luxurygold', emoji: '🥇' },
  { cmd: 'gradienttext', emoji: '💫' },
  { cmd: 'neonglitch', emoji: '🌧️' },
  { cmd: 'galaxywallpaper', emoji: '🪐' },
  { cmd: 'deletingtext', emoji: '💠' },
  { cmd: 'makingneon', emoji: '🔆' },
  { cmd: 'royaltext', emoji: '👑' },
  { cmd: 'freecreate', emoji: '🆓' },
  { cmd: 'galaxystyle', emoji: '🌌' },
  { cmd: 'equalizertext', emoji: '🎚️' },
  { cmd: 'icecold', emoji: '🖍️' },
  { cmd: 'colorfulltext', emoji: '🌈' },
  { cmd: 'papercut3d', emoji: '🌧️' },
  { cmd: 'angeltxt', emoji: '👼' },
  { cmd: 'starlight', emoji: '🌟' },
  { cmd: 'steel', emoji: '🔩' },
  { cmd: 'neoncity', emoji: '🌃' },
  { cmd: 'cloudsky', emoji: '☁️' },
  { cmd: 'logosmenu', emoji: '🟩' },
  { cmd: 'emoji', emoji: '💛' },
  { cmd: 'map', emoji: '📐' },
  { cmd: 'graffititext', emoji: '🔥' },
  { cmd: 'sandsummer', emoji: '🧊' },
  { cmd: 'harrypotter', emoji: '🌈' }
];

const menuLogosHandler = async (m, { conn, usedPrefix }) => {
  let texto = '*MENÚ DE LOGOS Y ESTILOS*\n\n';
  texto += estilosLogos.map(l => `${l.emoji} *${usedPrefix + l.cmd}*`).join('\n');
  texto += `\n\n*┗━━⊱ Usa así:* _${usedPrefix}comando tu texto_\nPor ejemplo: *${usedPrefix}glitchtext Kirito-Bot-MD*`;
  await conn.reply(m.chat, texto, m);
};

handler.help = ['logosmenu'];
handler.tags = ['menu'];
handler.command = ['mlog', 'logostylemenu', 'menulogos'];

export default menuLogosHandler;