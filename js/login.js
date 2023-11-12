import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import {auth} from "./firebase.js"

const loginEmailInput = document.querySelector('#loginEmailInput');
const loginPassInput = document.querySelector('#loginPassInput');
const loginSubmitButton = document.querySelector('#loginSubmitButton');

loginSubmitButton.addEventListener("click",async (e) => {
   e.preventDefault()
  const emailValue = loginEmailInput.value;
  const passwordValue = loginPassInput.value;

  try {
    const userCredentials = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
    const userId = userCredentials.user.uid;

        // El usuario está autenticado, redirige a la página de notas
        window.location.href = `./html/bienvenido.html?userId=${userId}`;
      

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("No se pudo iniciar sesión. Verifica tus credenciales e intenta de nuevo.");
  }


})
