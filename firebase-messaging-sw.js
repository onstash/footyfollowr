importScripts("https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.5.0/firebase-messaging.js");

var config = {
  apiKey: "AIzaSyC1reWt7ocb6sjegTFgytoGq0539O6e0N8",
  authDomain: "myfootball-e3ecc.firebaseapp.com",
  databaseURL: "https://myfootball-e3ecc.firebaseio.com",
  projectId: "myfootball-e3ecc",
  storageBucket: "myfootball-e3ecc.appspot.com",
  messagingSenderId: "153781839125"
};
firebase.initializeApp(config);
var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  var title = "Data Notification";
  var options = {
    body: payload.data.status
  };
  return self.registration.showNotification(title, options);
});
