import config from '../api/config';
// import firebase from 'firebase';
import { initializeApp, messaging } from 'firebase';
const { firebase: firebaseConfig } = config;
// firebase.initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

// export default firebase;
export default messaging;
