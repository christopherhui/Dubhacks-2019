import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { Formik } from 'formik';
import axios from 'axios';


export default function AccountSettings ({ firebase }) {
  const db = firebase.firestore();
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
        {c && (
          <Formik
            initialValues={{ address: c.address, phone: c.phone }}
            onSubmit={({ address, phone }, {setSubmitting}) => {
                var user = firebase.auth().currentUser;
                var locationId = user.uid;
            
                db.collection("plugs").where('user', "==", locationId)
                
                axios({
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA6DgZkGPam98xGu5Ad4ntbX162Nc61PvY`,
                    responseType: 'json'
                }).then((response) => {
                    if (response.status === 200) {
                        const body = response.data;
                        var coords = body.results[0].geometry.location;
                        var formatted_address = body.results[0].formatted_address;
                        var yLat = coords.lat;
                        var yLong = coords.lng;
                        console.log(formatted_address, yLat, yLong);
                        if (c.user) {
                          const batch = db.batch();
                          db.collection("plugs").where('user', "==", locationId).get().then(snap => {
                            snap.forEach(d => {
                              const ref = db.collection('plugs').doc(d.id);
                              batch.update(ref, {
                                name: formatted_address,
                                address: formatted_address,
                                location: new firebase.firestore.GeoPoint(yLat, yLong),
                                phone
                              })
                              batch.commit().then(() => { setSubmitting(false) });
                            })
                          });
                        } else {
                          db.collection("plugs").add({
                            name: formatted_address,
                            address: formatted_address,
                            location: new firebase.firestore.GeoPoint(yLat, yLong),
                            phone,
                            user: locationId,
                            available: false
                          }).then(() => { setSubmitting(false) });
                        }
                    }
                });
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
