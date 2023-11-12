import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import {auth} from "./firebase.js"


const signUpEmailInput = document.querySelector('#signUpEmailInput');
const signUpPasswordInput = document.querySelector('#signUpEmailInput');
const signUpSubmit = document.querySelector('#signUpSubmit');




signUpSubmit.addEventListener("click",async (e) => {
   e.preventDefault()
   const emailValue = signUpEmailInput.value;
   const passValue = signUpPasswordInput.value
   await createUserWithEmailAndPassword(auth, emailValue, passValue);
   alert('usuario creado con exito')
})
