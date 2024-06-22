import { transport } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmation = async (user: IEmail) => {
    const info = await transport.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - confirma tu cuenta",
      text: "UpTask - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta de Uptask, ya casi esta todo listo
      ,solo debes confirmar tu cuenta
      </p>
      
      <p>Visita el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>

      <p>E ingresa el código: <b>${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>
      `,
    });

    console.log("Mensaje enviado", info.messageId);
  };

  static sendPasseordResetToken = async (user: IEmail) => {
    const info = await transport.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Restablece tu contraseña",
      text: "UpTask - Restablece tu contraseña",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.
      </p>
      
      <p>Visita el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Cpntraseña</a>

      <p>E ingresa el código: <b>${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>
      `,
    });

    console.log("Mensaje enviado", info.messageId);
  };
}
