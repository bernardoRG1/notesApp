import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import {auth, saveNote, getNotes, deleteNote , updateNote} from "./firebase.js"



  const noteSubmitButton = document.querySelector("#noteSubmit");
  const noteDeleteButton = document.querySelector("#noteDelete");
  const noteUpdateButton = document.querySelector("#noteUpdate");
  let currentNoteId = null;

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  

  // TOOLS

  function limpiarCola() {
    const noteList = document.querySelector('.note-list');
    noteList.innerHTML = '';
  }
  function agregarBotonEspecial() {
  const listaNotas = document.querySelector('.note-list');
  const li = document.createElement('li');
  li.innerHTML = '<a href="#" id="nodeNewEkement"><i>+</i></a>';
  listaNotas.appendChild(li);
  li.addEventListener('click', () => {
    quill.root.innerHTML = "";
  })
}
  
function obtenerUserIdDesdeURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId');
}




function generarIdUnico() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function obtenerFechaActual() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//¡ NOTAS GUARDADAS *//

const agregarNotasAlaCola = (nota) => {
  const noteList = document.querySelector('.note-list')

  const listItem = document.createElement('li');

  const noteLink = document.createElement('a');
  noteLink.href = "#";
  noteLink.className = "noteElement"
  noteLink.innerHTML = 
  `
  ${nota.contenido}
`;
const fechaEnMillis = nota.fecha.seconds * 1000;
const formattedDate = new Date(fechaEnMillis).toLocaleString();
listItem.id = `noteListItem_${nota.id}`;

  listItem.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedNoteId = e.currentTarget.id.split('_')[1];

  // Guarda el ID en el quill.root
    quill.root.dataset.noteId = selectedNoteId;
    quill.root.innerHTML = `${nota.contenido} ${formattedDate}`;
  })

  listItem.appendChild(noteLink);
  noteList.append(listItem);


}

const cargarNotasAlInicio = async () => {
  // Obtener el ID del usuario desde la URL
  const userId = obtenerUserIdDesdeURL();

  if (userId) {
    // TODO: Obtener las notas del usuario desde Firebase y cargarlas en la cola
    // Aquí puedes usar getNotes u otra lógica para obtener las notas.
    try {
      const notas = await getNotes(userId);
      limpiarCola();
      agregarBotonEspecial();
      // Lógica para cargar las notas en la cola
      // Ejemplo:
      notas.forEach((nota) => {
        agregarNotasAlaCola(nota);
      });
    } catch (error) {
      console.error("Error al cargar las notas:", error);
    }
  }
};

  await cargarNotasAlInicio()
  const quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  
  
    
  });

  quill.on('editor-change', function (eventName, delta, oldDelta, source) {
    if (eventName === 'text-change' && source === 'user') {
      const content = quill.getContents();
      const firstLine = content.ops[0]?.insert;

      // Check if the first line is not an H1
      if (firstLine && typeof firstLine === 'string' && !firstLine.startsWith('# ')) {
          // Insert an H1 at the beginning
          quill.formatLine(0, 1, 'header', 1);
      }
    }
  });






noteSubmitButton.addEventListener("click", async (e) => {
  await cargarNotasAlInicio()
  e.preventDefault()
  const userId = obtenerUserIdDesdeURL(); 
  const id = generarIdUnico(); // Puedes implementar una función para generar IDs únicos
  const contenido = quill.root.innerHTML;
  const fecha = obtenerFechaActual(); // Puedes implementar una función para obtener la fecha actual
 
  await saveNote(userId, id, contenido, fecha);
  quill.root.innerHTML = "";
  const nuevaNota = { contenido: quill.root.textContent , fecha : fecha, id: id}; // Puedes ajustar según la estructura de tus notas

  agregarNotasAlaCola(nuevaNota)
  await limpiarCola();
  await cargarNotasAlInicio()
  
})




noteDeleteButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Obtén el ID de la nota seleccionada
  const userId = obtenerUserIdDesdeURL(); 
  const selectedNoteId = quill.root.dataset.noteId;

  // Llama a la función para eliminar la nota
  await deleteNote(userId, selectedNoteId);
  quill.root.innerHTML = "";  

  // Actualiza la interfaz después de eliminar la nota
  await limpiarCola();
  await cargarNotasAlInicio();
});






noteUpdateButton.addEventListener("click", async (e) => {
  await cargarNotasAlInicio();
  e.preventDefault();

  // Obtén el ID de la nota seleccionada
  const userId = obtenerUserIdDesdeURL(); 
  const selectedNoteId = quill.root.dataset.noteId;
  const contenido = quill.root.innerHTML;
  const fecha = obtenerFechaActual(); // Puedes implementar una función para obtener la fecha actual

  // Llama a la función para actualizar la nota
  await updateNote(userId, selectedNoteId, contenido, fecha);
  quill.root.innerHTML = "";

  // Actualiza la interfaz después de actualizar la nota
  await limpiarCola();
  await cargarNotasAlInicio();
}); 