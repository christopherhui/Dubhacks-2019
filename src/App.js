import React, { useState, useEffect } from 'react';
import LoginForm from './Components/LoginForm';
import AccountSettings from './Components/AccountSettings';
import { Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Container, Toolbar, Typography, Button, Hidden, Drawer, Divider, List, ListItemText, ListItem, IconButton, Switch, Badge } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import GoogleMapReact from 'google-map-react';

firebase.initializeApp({
  apiKey: "AIzaSyCP46j4c3quwFHwQRxgD-E3T4SwZEa2qog",
  authDomain: "dubhacks-e68df.firebaseapp.com",
  databaseURL: "https://dubhacks-e68df.firebaseio.com",
  projectId: "dubhacks-e68df",
  storageBucket: "dubhacks-e68df.appspot.com",
  messagingSenderId: "840565739695",
  appId: "1:840565739695:web:859e3211e34c0a5f77045a"
});

const db = firebase.firestore();

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  appBar: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  let [ user, setUser ] = useState(firebase.auth().currentUser);
  firebase.auth().onAuthStateChanged(setUser);
  const classes = useStyles();
  const [inAccountsPage, setInAccountsPage] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [dockInfo, setDockInfo] = useState();
  let [ c, setC ] = useState(false);
  let [ available, setA ] = useState(false);
  const [coords, setCoords] = useState({
    lat: 47.6593953,
    lng: -122.3093366
  });
  const [locations, setLocations] = useState([]);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(x => {
      setCoords({
        lat: x.coords.latitude,
        lng: x.coords.longitude,
      });
    });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleBottomToggle = () => {
    setDockOpen(!dockOpen);
    setDockInfo();
  };

  const toggleAvailability = (e) => {
    const batch = db.batch();
    db.collection("plugs").where('user', "==", user.uid).get().then(snap => {
      snap.forEach(d => {
        const ref = db.collection('plugs').doc(d.id);
        batch.update(ref, {
          available: !available
        })
        batch.commit().then(() =>  {setA(!available)});
      })
    });
  }
  useEffect(() => {
    db.collection("plugs")
      .onSnapshot(function(doc) {
        setLocations(doc.docs.map((x, i) => {
          let y = x.data();
          return (
            <Button
              key={i}
              lat={y.location.latitude}
              lng={y.location.longitude}
              onClick={() => { setDockInfo(y); setDockOpen(true); }}
              style={{ minWidth: '0px', padding: '0px' }}
            >
              <img 
              src={y.available ? "/marker.svg" : "/marker-alt.svg"}
              alt={y.name}
              style={{ zIndex: 1500, width: 'auto', height: '2rem', top: '0px' }}
              />
            </Button>
          );
        }));
    });
    if (user) {
      db.collection('plugs').where('user', '==', user.uid).get()
      .then(s => {
        if (s.docs[0]) setC(true);
        setA(s.docs[0].data().available);
      })
    }
  }, [user]);
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {c ? (
          <ListItem button>
            <ListItemText primary={"Accept Customers"} />
            <Switch
              checked={available}
              onChange={toggleAvailability}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </ListItem>
        ) : (
          <ListItem>
            <p><b>Please add your address under the Account Settings section in order to accept customers.</b></p>
          </ListItem>
        )}
        <ListItem button onClick={() => { setInAccountsPage(false); handleDrawerToggle() }}>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem button onClick={() => { setInAccountsPage(true); handleDrawerToggle() }}>
          <ListItemText primary={"Account Settings"} />
        </ListItem>
        <ListItem button onClick={() => { firebase.auth().signOut(); handleDrawerToggle(); }}>
          <ListItemText primary={"Log Out"} />
        </ListItem>
      </List>
    </div>
  );
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
              <MenuIcon/>
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            chargeUP
          </Typography>
          {user && (
            <Button color="inherit" onClick={() => { firebase.auth().signOut() }}>Log out</Button>
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden implementation="css">
          <Drawer
            anchor='left'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      {user ? 
        (
          <React.Fragment>
            {inAccountsPage ? (
              <AccountSettings firebase={firebase} />
            ) : (
              <div>
                <div style={{height: '100vh', width: '100vw', position: 'fixed'}}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyCQrSkOPcIMBM5HpNeVan7MHdcc8rvvC_E" }}
                    defaultCenter={coords}
                    defaultZoom={15}
                    yesIWantToUseGoogleMapApiInternals
                  >
                    {locations}
                  </GoogleMapReact>
                </div>
                <Drawer
                  anchor="bottom"
                  onClose={handleBottomToggle}
                  open={dockOpen}
                >
                  <Container>
                    {dockInfo && (
                      <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        <h1>{dockInfo.name}</h1>
                        {dockInfo.available ? <Button>Reserve this EV Charging Station</Button> : <Label color="red">Charging Station is occupied</Label>}
                        <a href={`https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${dockInfo.location.latitude},${dockInfo.location.longitude}`}><Button>Navigate via Google Maps</Button></a>
                      </div>
                    )}
                  </Container>
                </Drawer>
              </div>
            )
          }
        </React.Fragment>
      ) : (
        <LoginForm firebase={firebase} />
      )}
    </React.Fragment>
  );
}

export default App;
