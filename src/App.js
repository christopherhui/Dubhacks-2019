import React, { useState } from 'react';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { Formik } from 'formik';
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
  let [ errorMessage, setErrorMessage ] = useState("");
  let [ user, setUser ] = useState(firebase.auth().currentUser);
  firebase.auth().onAuthStateChanged(setUser);
  return (
    <React.Fragment>
      {!user ? (
        <Container>
          {errorMessage && (
            <Message error>{errorMessage.message}</Message>
          )}
          <Formik
            initialValues={{ email: '', password: '', option: '' }}
            onSubmit={({ email, password, option }, {setSubmitting}) => {
              if (option === 'signup') {
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(setErrorMessage);
                setSubmitting(false);
              } else {
                firebase.auth().signInWithEmailAndPassword(email, password).catch(setErrorMessage);
                setSubmitting(false);
              }
            }}
          >
            {({values, handleChange, handleSubmit, isSubmitting}) => (
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label>Email Address</label>
                  <input type="text" placeholder='Email Address' name="email" onChange={handleChange} value={values.email} />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input type="password" placeholder='Password' name="password" onChange={handleChange} value={values.password} />
                </Form.Field>
                <Button type='submit' name="option" value="login" onClick={handleChange} loading={isSubmitting} disabled={isSubmitting}>Login</Button>
                <Button type='submit' name="option" value="signup" onClick={handleChange} loading={isSubmitting} disabled={isSubmitting}>Sign Up</Button>
              </Form>
            )}
          </Formik>
        </Container>
      ) : (<Container>
        <h1>logged in.</h1>
        <Button onClick={() => { firebase.auth().signOut() }}>Log out</Button>
      </Container>)}
    </React.Fragment>
  );
}

export default App;
