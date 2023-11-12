import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import {auth} from "./firebase.js"

const loginEmailInput = document.querySelector('#loginEmailInput');
const loginPassInput = document.querySelector('#loginPassInput');
const loginSubmitButton = document.querySelector('#loginSubmitButton');





loginSubmitButton.addEventListener("click",async (e) => {
   e.preventDefault()
   const emailValue = loginEmailInput.value;
   const passValue = loginPassInput.value
   await createUserWithEmailAndPassword(auth, emailValue, passValue);
})
