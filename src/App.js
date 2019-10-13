import React, { useState } from 'react';
import { Button, Container } from 'semantic-ui-react';
import LoginForm from './Components/LoginForm';
import 'semantic-ui-css/semantic.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyCP46j4c3quwFHwQRxgD-E3T4SwZEa2qog",
  authDomain: "dubhacks-e68df.firebaseapp.com",
  databaseURL: "https://dubhacks-e68df.firebaseio.com",
  projectId: "dubhacks-e68df",
  storageBucket: "dubhacks-e68df.appspot.com",
  messagingSenderId: "840565739695",
  appId: "1:840565739695:web:859e3211e34c0a5f77045a"
});

function App() {
  let [ user, setUser ] = useState(firebase.auth().currentUser);
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
