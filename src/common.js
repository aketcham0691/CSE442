// Initialize Firebase
    var config = {
        apiKey: "AIzaSyC3ckmHaSucNz2xfw7oknrRKXI7YOPa_-A",
        authDomain: "qrattendance-ff437.firebaseapp.com",
        databaseURL: "https://qrattendance-ff437.firebaseio.com",
        projectId: "qrattendance-ff437",
        storageBucket: "qrattendance-ff437.appspot.com",
        messagingSenderId: "723831313556"
      };
    firebase.initializeApp(config);

function getUserFromEmail(email) {
    return email.substring(0, email.indexOf("@"));
}

function signOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut().then(function () {
            window.location.assign("./index.html");
        })
        .catch(function(error) {
            alert("error signing out: " + error.message);
        })
    }
    else {
        alert("not currently signed in");
    }

}