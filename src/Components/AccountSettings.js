import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { Formik } from 'formik';


export default function AccountSettings ({ firebase }) {
  const db = firebase.firestore();
  let [ errorMessage, setErrorMessage ] = useState("");
  let [ c, setC ] = useState(undefined);
  useEffect(() => {
    db.collection('plugs').where('user', '==', firebase.auth().currentUser.uid).get()
    .then(s => {
      if (s.docs[0]) setC(s.docs[0].data());
      else setC({address: '', phone: ''});
    })
  }, [db, firebase]);
  return (
    <Container>
      <h1>Account Settings</h1>
      {errorMessage && (
        <Message error>{errorMessage.message}</Message>
      )}
        {c && (
          <Formik
            initialValues={{ address: c.address, phone: c.phone }}
            onSubmit={({ address, phone }, {setSubmitting}) => {
              
            }}
          >
          {({values, handleChange, handleSubmit, isSubmitting}) => (
            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <label>Address</label>
                <input type="text" placeholder='123 Dixon Ave.' name="address" onChange={handleChange} value={values.address} />
              </Form.Field>
              <Form.Field>
                <label>Phone Number</label>
                <input type="text" placeholder='+12345678901' name="phone" onChange={handleChange} value={values.phone} />
              </Form.Field>
              <Button type='submit' loading={isSubmitting} disabled={isSubmitting}>Set Address and Phone Number</Button>
            </Form>
          )}
          </Formik>
        )}
    </Container>
  );
}
