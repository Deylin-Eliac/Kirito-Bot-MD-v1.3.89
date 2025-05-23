// Código creado por Deylin
// https://github.com/deylinqff
// No quites créditos

import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';

  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || `Hola, mucho gusto. Soy Deylin.
Soy desarrollador de software y sitios web, apasionado por la tecnología, el diseño funcional y la innovación digital.

Cada día me esfuerzo por aprender algo nuevo, mejorar mis habilidades y ofrecer soluciones eficientes y creativas a quienes confían en mi trabajo`;
  const empresa = 'Deylin - Servicios Tecnológicos';


  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-ABLabel:Dirección Web
X-ABLabel:Correo Electrónico
X-ABLabel:Teléfono de contacto
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD
  `.trim();


  await conn.sendMessage(
    m.chat,
    { contacts: { displayName: name, contacts: [{ vcard }] } },
    { quoted: fkontak }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;