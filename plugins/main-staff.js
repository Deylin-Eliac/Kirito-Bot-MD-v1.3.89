import fs from 'fs';

let handler = async (m, { conn }) => {
    let img = './src/catalogo.jpg';

    // Miembros del equipo con sus roles
    const staff = [
        { number: '50433191934', name: 'Deylin 👑', role: 'Creador' },
        { number: '573154062343', name: 'https', role: 'Desarrollador' },
       // { number: '50487654321', name: 'Ana Codes', role: 'Programadora' },
        //{ number: '50411223344', name: 'Carlos Designer', role: 'Diseñador' },
    ];

    let mensaje = `╭━━〔 *🌟 EQUIPO OFICIAL* 〕━━⬣\n`;
    
    for (let miembro of staff) {
        mensaje += `┃ *${miembro.role}*\n`;
        mensaje += `┃ Nombre: ${miembro.name}\n`;
        mensaje += `┃ Contacto: https://wa.me/${miembro.number}\n`;
        mensaje += `┃━━━━━━━━━━━━━━━━━━\n`;
    }
    mensaje += `┃Kirito-Bot-MD`;
    mensaje += `╰━━━━━━━━━━━━━━━━━━━━⬣`;

    if (!fs.existsSync(img)) {
        console.error(`Error: La imagen ${img} no existe.`);
        return m.reply("⚠️ Imagen no encontrada.");
    }

    await conn.sendFile(m.chat, img, 'staff.jpg', mensaje.trim(), m, { linkPreview: true });
};

handler.help = ['staff'];
handler.command = ['staff', 'colaboradores'];
handler.register = true;
handler.tags = ['main'];

export default handler;