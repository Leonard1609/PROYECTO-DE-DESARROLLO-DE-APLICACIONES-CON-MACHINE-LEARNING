const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Usa SSL/TLS de forma nativa para el puerto 465
  auth: {
    user: process.env.EMAIL_USER, // darkkrisalix616@gmail.com
    pass: process.env.EMAIL_PASS  // bzwxzvccejmcowxd
  },
  tls: {
    rejectUnauthorized: false // 🛡️ EVITA BLOQUEOS LOGÍSTICOS LOCALES: Permite que el servidor local despache correos sin trabas de certificados auto-firmados
  }
});

// Función para enviar el correo
const enviarCorreoEstado = (correoPaciente, nombrePaciente, estado, detalles) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correoPaciente,
    subject: `Estado de tu Cita Médica: ${estado}`,
    text: `Hola ${nombrePaciente},\n\nTu cita ha cambiado a estado: ${estado}.\n\n${detalles}\n\nSaludos,\nSistema de Citas Médicas.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('❌ Error al enviar correo:', error);
    }
    console.log('📧 Correo enviado exitosamente:', info.response);
  });
};

module.exports = { enviarCorreoEstado };