import config from '../api/config';
import firebaseApp from 'firebase/app';
import 'firebase/messaging';

const { initializeApp, messaging } = firebaseApp;
const { firebase: firebaseConfig } = config;
initializeApp(firebaseConfig);
export default messaging;
