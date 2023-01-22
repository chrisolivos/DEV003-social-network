/* eslint-disable import/no-cycle */
// HOME
import { onNavigate } from './router.js';
import {
  loginWithGoogle,
  logOutFunction,
  registerNewUser,
  emailLogin,
} from './lib/firebase';

export const Home = () => {
  const secHome = document.createElement('sec');

  const labelMail = document.createElement('label');
  labelMail.innerHTML = '<strong>Correo: </strong><br>';
  const textMail = document.createElement('input');
  textMail.type = 'text';
  textMail.id = 'txtMail';
  // textMail.ariaPlaceholder = 'Ingresa tu correo';
  // textMail.ariaAutoComplete = 'off';
  const space1 = document.createElement('br');
  const labelPassword = document.createElement('label');
  labelPassword.innerHTML = '<strong>Clave: </strong><br>';
  const textPass = document.createElement('input');
  textPass.type = 'password';
  textPass.id = 'txtPassword';

  const space2 = document.createElement('br');
  const buttonRegister = document.createElement('button');
  buttonRegister.id = 'btnRegister';
  buttonRegister.textContent = 'Registrate';
  const buttonLogin = document.createElement('button');
  buttonLogin.id = 'btnLogin';
  buttonLogin.textContent = 'Inicia sesión';
  /** ********************************** */
  const buttonGoogle = document.createElement('button');
  buttonGoogle.id = 'btnLoginGoogle';
  buttonGoogle.textContent = 'Google';
  /** *************************************** */
  buttonRegister.addEventListener('click', async () => {
    const email = document.getElementById('txtMail').value;
    const password = document.getElementById('txtPassword').value;
    //  console.log(email, password);
    // console.log(userCredential);
    const resultNewUser = await registerNewUser(email, password);
    onNavigate('/register');
  });

  buttonLogin.addEventListener('click', () => {
    const email = document.getElementById('txtMail').value;
    const password = document.getElementById('txtPassword').value;
    const dataReturn = emailLogin(email, password);

    onNavigate('/login');
  });

  buttonGoogle.addEventListener('click', async () => {
    const user = await loginWithGoogle();
    setTimeout(onNavigate('/google'), 8000);
  });

  secHome.appendChild(labelMail);
  secHome.appendChild(textMail);
  secHome.appendChild(space1);
  secHome.appendChild(labelPassword);
  secHome.appendChild(textPass);
  secHome.appendChild(space2);
  secHome.appendChild(buttonRegister);
  secHome.appendChild(buttonLogin);
  secHome.appendChild(buttonGoogle);
  return secHome;
};

// REGISTER
export const Register = () => {
  const secHome = document.createElement('sec');
  secHome.textContent = 'Bienvenida al Register';
  const buttonLogout = document.createElement('button');

  buttonLogout.textContent = 'Cerrar Sesion';
  buttonLogout.addEventListener('click', () => {
    logOutFunction();
    onNavigate('/');
  });
  secHome.appendChild(buttonLogout);

  return secHome;
};

// LOGIN
// eslint-disable-next-line import/no-cycle
// import { onNavigate } from '../main.js';

export const Login = () => {
  const secHome = document.createElement('sec');
  secHome.textContent = 'Bienvenida al Login';
  const buttonLogOutMail = document.createElement('button');

  buttonLogOutMail.textContent = 'Cerrar Sesion';
  buttonLogOutMail.addEventListener('click', () => {
    logOutFunction();
    onNavigate('/');
  });
  secHome.appendChild(buttonLogOutMail);

  return secHome;
};

export const googleLogin = () => {
  const secHome = document.createElement('sec');
  // const mailLogin = loginGoogle();
  secHome.textContent = 'Bienvenida al Login';

  const buttonLogoutGoogle = document.createElement('button');
  buttonLogoutGoogle.textContent = 'Cerrar Sesion';
  buttonLogoutGoogle.addEventListener('click', () => {
    logOutFunction();
    onNavigate('/');
  });
  secHome.appendChild(buttonLogoutGoogle);

  return secHome;
};
