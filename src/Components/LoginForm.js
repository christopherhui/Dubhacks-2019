import React, { useState } from 'react';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { Formik } from 'formik';

export default function LoginForm({ firebase }) {
  let [ errorMessage, setErrorMessage ] = useState("");
  return (
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
  );
};