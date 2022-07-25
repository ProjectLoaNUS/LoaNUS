import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let firebaseConfig = {};
let app;
export let auth;
try {
    if (process.env.REACT_APP_FIREBASE_CONFIG) {
        firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    }
} catch (err) {
    console.log(err);
}