
import { initializeApp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { getFirestore, collection, addDoc, Timestamp, doc, getDoc, setDoc, getDocs, deleteDoc }  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBrQyzvme9BD8BsJHh5XF8vzlO4lABLX8A",
    authDomain: "notas-3b92f.firebaseapp.com",
    projectId: "notas-3b92f",
    storageBucket: "notas-3b92f.appspot.com",
    messagingSenderId: "228980688608",
    appId: "1:228980688608:web:ec10560bb26d8f93103285"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);

  const db = getFirestore(app)

  export const saveNote = async (userId, id, contenido, fecha) => {
    try {
      // Obtener la referencia al documento del usuario
      const userDocRef = doc(db, 'usuarios', id);
  
      // Verificar si el documento del usuario ya   existe
      const userDocSnap = await getDoc(userDocRef);
  
      // Si el documento no existe, crea la colección de notas para el usuario
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {}); // Puedes establecer más información del usuario aquí si es necesario
      }
  
      // Ahora, agregar la nota a la subcolección de notas del usuario
      const noteRef = doc(collection(db, `usuarios/${userId}/notas`), id);
  
      // Asegúrate de que fecha sea una cadena de fecha válida o un objeto Date válido
      const timestampDate = new Date(fecha);
      
      if (isNaN(timestampDate.getTime())) {
        throw new Error("Fecha no válida");
      }
  
      // Convertir la fecha a un Timestamp
      const timestamp = Timestamp.fromDate(timestampDate);
  
      // Guardar la nota con la fecha convertida
      await setDoc(noteRef, {
        contenido: contenido,
        fecha: timestamp,
      });
  
      console.log("Nota guardada con ID: ", id);
    } catch (e) {
      console.error("Error al guardar la nota: ", e);
    }
  };




  export const getNotes = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, `usuarios/${userId}/notas`))
      const notas = []

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notas.push({
          id: doc.id,
          contenido: data.contenido,
          fecha: data.fecha
        })
      })

      return notas
    } catch(error) {
      throw error;
    }
  }



  export const deleteNote = async (userId,selectedNoteId) => {
    try {
      const noteRef= await doc(collection(db, `usuarios/${userId}/notas`), selectedNoteId);
      await deleteDoc(noteRef);
      console.log("Nota eliminada con ID: ", selectedNoteId);
    } catch (error) {
      console.log(error)
    }
  }



  export const updateNote = async (userId, noteId, contenido, fecha) => {
    try {
      const noteRef = doc(collection(db, `usuarios/${userId}/notas`), noteId);
  
      const timestampDate = new Date(fecha);

    if (isNaN(timestampDate.getTime())) {
        throw new Error("Fecha no válida");
    }

    // Guardar la fecha como timestamp en Firebase
    const timestamp = Timestamp.fromDate(timestampDate);
  
      await setDoc(noteRef, {
        contenido: contenido,
        fecha: timestamp 
      });
  
      console.log("Nota actualizada con ID: ", noteId);
    } catch (error) {
      console.error("Error al actualizar la nota: ", error);
    }};