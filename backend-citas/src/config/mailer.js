const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'TU_CORREO_GMAIL@gmail.com',
    pass: process.env.EMAIL_PASS || 'TU_CONTRASEÑA_DE_APLICACION' 
  }
});

const enviarCorreoEstado = (correo, paciente, estado, detalles = '') => {
  const mailOptions = {
    from: `Sistema de Citas Médicas <${process.env.EMAIL_USER || 'TU_CORREO_GMAIL@gmail.com'}>`,
    to: correo,
    subject: `Actualización de tu Cita Médica: Estado ${estado}`,
    text: `Hola ${paciente},\n\nTu cita médica ha cambiado de estado a: ¡${estado}!\n${detalles}\n\nGracias por confiar en nosotros.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('❌ Error al enviar correo:', error);
    else console.log('📧 Correo enviado con éxito a:', correo);
  });
};

module.exports = { enviarCorreoEstado };