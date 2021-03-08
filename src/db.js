import firebase from "firebase/app";
import "firebase/database";

const config ={
    apiKey: "AIzaSyCy9VIaeqYf9pF0kio2bc9Fos1C9VGWBpM",
    authDomain: "vue-chat-project-207c0.firebaseapp.com",
    projectId: "vue-chat-project-207c0",
    storageBucket: "vue-chat-project-207c0.appspot.com",
    messagingSenderId: "171517763797",
    appId: "1:171517763797:web:16e7e7aeb63c7ca03f825c"
}

const db = firebase.initializeApp(config)
export default db;