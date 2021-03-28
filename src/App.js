import React, { useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  apiKey: "AIzaSyA8MK7EeUubeaLz1NyRGq8dTR9AlYDR-yo",
  authDomain: "mychat-a2a0f.firebaseapp.com",
  projectId: "mychat-a2a0f",
  storageBucket: "mychat-a2a0f.appspot.com",
  messagingSenderId: "31655311165",
  appId: "1:31655311165:web:60df386889d250774a7754"
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>This</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut(){
  return auth.currentUser && (

    <button className="sign-out" onClick = {()=> auth.SignOut}>Sign out</button>

  )
}

function ChatRoom() {
  const dummy = useRef()
  //skapar en referens till vår databas
  const messageRef = firestore.collection('messages');
  //Skapar en query efter de 25 senaste messages
  const query = messageRef.orderBy('createdAt').limit(25);
  //ANvädner oss av en Hook som lyssnar på vår data hela tiden
  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

  

    e.preventDefault()

    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    
    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'})

  }


  return (
    <>
      <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>
      </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange = {(e) => setFormValue(e.target.value)}/>
      <button type="submit">Submit</button>
    </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;

  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received'


  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
    </>
  )
}

export default App;
