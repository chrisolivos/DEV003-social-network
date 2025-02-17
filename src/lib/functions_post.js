import {
  getFirestore,
  collection,
  addDoc, setDoc,
  deleteDoc,
  doc,
  where,
  query,
  getDoc,
  getDocs,
  updateDoc,
  orderBy,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';
// eslint-disable-next-line import/named
import { app } from './firebase';
import { paintLikes } from '../components/Home';
import { comments, paintComments } from '../components/Comments';

// Initialize Cloud Firestore and get a reference to the service
const dataBase = getFirestore(app);
/* funcion que cree collection. debe llamarse al registrarse */
// export function userCollection(userEmail) {
//   console.log(`entro al collection: ${userEmail}`);
//   addDoc(collection(dataBase, userEmail), {});
// }
export function createID(use) {
  const idGenerator = Math.random().toString(30).substring(2);
  return use + idGenerator;
}
export function createUserDoc(user, fullName, photo) {
  return setDoc(doc(dataBase, 'usuarios', user.uid), {
    id: user.uid,
    correo: user.email,
    nombre: fullName,
    foto: photo,
  });
}

export function createPost(userId, nombre, postContent) {
  const postId = createID('post');
  console.log(postId);
  // crea un nuevo objeto `Date` con fecha y hora del momento
  const today = new Date();
  return addDoc(collection(dataBase, 'publicaciones'), {
    postId,
    userId,
    nombre,
    contenido: postContent,
    likes: [],
    date: today,
  });
}

export function deletePost(idPost) {
  deleteDoc(doc(dataBase, 'publicaciones', idPost));
}

export function getUserPosts(userId) {
  // Obtener documentos de una Colección
  const ref = collection(dataBase, 'publicaciones'); // Se crea la referencia de la colección
  const q = query( // Se crea la query/consulta
    ref,
    // where('userId', '==', userId),
    orderBy('date', 'desc'),
  );
  return getDocs(q);
}

export function updatePost(postId, newFields) {
  return updateDoc(doc(dataBase, 'publicaciones', postId), newFields);
}

export const getUserFromFirestore = (userId) => {
  const ref = doc(dataBase, 'usuarios', userId);
  return getDoc(ref);
};

function addLike(postLikes, userUid) {
  updateDoc(postLikes, {
    likes: arrayUnion(userUid),
  });
}

function removeLike(postLikes, userUid) {
  updateDoc(postLikes, {
    likes: arrayRemove(userUid),
  });
}

export function counterLike(userUid, docPost, idButton) {
  // si usario ya le dio like entonces le quita el like
  // contar cantidad de items en el like para el numero de like que tiene la publicacion
  // xxxxxx

  const postLikes = doc(dataBase, 'publicaciones', docPost.uid);
  const ref = collection(dataBase, 'publicaciones');
  const arrLike = query(ref, where('postId', '==', docPost.postId));

  const getData = getDocs(arrLike);
  let dataLikes = '';
  let cantLikes;

  getData.then((result) => {
    const arrayLikes = result;
    arrayLikes.forEach((d) => {
      if (d.exists()) {
        console.log('trae datos');
        dataLikes = d.data();
        if (dataLikes.postId === docPost.postId) {
          console.log('encontro el post');
          if (dataLikes.likes.length > 0) {
            console.log(dataLikes.likes);
            for (let i = 0; i < dataLikes.likes.length; i += 1) {
              if (dataLikes.likes[i] === userUid) {
                console.log('iguales', dataLikes.likes[i], userUid);
                removeLike(postLikes, userUid);
                cantLikes = dataLikes.likes.length - 1;
              } else {
                console.log('diferentes', dataLikes.likes[i], userUid);
                addLike(postLikes, userUid);
                cantLikes = dataLikes.likes.length + 1;
              }
            }
          } else {
            console.log('no tiene ningun like');
            addLike(postLikes, userUid);
            console.log('nuevo total like:', dataLikes.likes.length + 1);
          }
        }
      }
    });
    console.log('total likes', cantLikes);
  });

  const q = query(collection(dataBase, 'publicaciones'), where('postId', '==', docPost.postId));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((d) => {
      paintLikes(d.data().likes.length, idButton);
    });
  });
}

export function updateComments(userUid, docPost, idButton) {
  const q = query(collection(dataBase, 'publicaciones'), where('postId', '==', docPost.postId));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((d) => {
      console.log('===============================>', d.data());
      paintComments(d.data(), idButton);
    });
  });
}

// export function updateDeleteComments(userUid, docPost) {
//   const q = query(collection(dataBase, 'publicaciones'), where('postId', '==', docPost.postId));
//   let dataUpdateComments = [];
//   onSnapshot(q, (querySnapshot) => {
//     querySnapshot.forEach((d) => {
//       dataUpdateComments.push(d.data());
//       console.log(d.data());
//     });
//   });
//   console.log(dataUpdateComments)
//   return dataUpdateComments;
// }

export function removeComment(post, commentID) {
  // console.log(postID, commentId);
  const arrayComments = post.comentarios;
  const arrayUpdateComments = arrayComments.filter((comment) => comment.commentID !== commentID);
  console.log(commentID);
  console.log(arrayUpdateComments);
  updateDoc(doc(dataBase, 'publicaciones', post.uid), {
    comentarios: arrayUpdateComments,
  });
}
//  arrayComments.forEach((comment) => {
//   if(comment.commentID === commentID) {

//   }
//  })
// }
