import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import LoginForm from './Components/LoginForm';
import 'semantic-ui-css/semantic.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, Hidden, Drawer, Divider, List, ListItemText, ListItem, ListItemIcon, IconButton } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coords, setCoords] = useState({
    lat: 47.6593953,
    lng: -122.3093366
  });
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
  useEffect(() => {
    db.collection("plugs")
      .onSnapshot(function(doc) {
        console.log(doc.docs);
    });
  }, []);
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary={"Charging Station Mode"} />
        </ListItem>
        <ListItem button>
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
            EVChargeUp
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
      {user ? (
        <div style={{height: '100vh', width: '100vw', position: 'fixed'}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCQrSkOPcIMBM5HpNeVan7MHdcc8rvvC_E" }}
            defaultCenter={coords}
            defaultZoom={15}
          >
            <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      ) : (
        <LoginForm firebase={firebase} />
      )}
    </React.Fragment>
  );
}

export default App;
