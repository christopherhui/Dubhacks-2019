import React, { useState } from 'react';
import { Button, Container } from 'semantic-ui-react';
import LoginForm from './Components/LoginForm';
import 'semantic-ui-css/semantic.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyCGAepexaDfdV2CBw56IqV1D2Ia5NjpFZ4",
  authDomain: "genuine-essence-255720.firebaseapp.com",
  databaseURL: "https://genuine-essence-255720.firebaseio.com",
  projectId: "genuine-essence-255720",
  storageBucket: "genuine-essence-255720.appspot.com",
  messagingSenderId: "204865783620",
  appId: "1:204865783620:web:d41af47d3c97d77046b911"
});

function App() {
  let [user, setUser] = useState(firebase.auth().currentUser);
  firebase.auth().onAuthStateChanged(setUser);
  return (
    <React.Fragment>
      {user ? (
        <Container>
          <h1>logged in.</h1>
          <Button onClick={() => { firebase.auth().signOut() }}>Log out</Button>
        </Container>
      ) : (
          <LoginForm firebase={firebase} />
        )}
    </React.Fragment>
  );
}

export default App;
