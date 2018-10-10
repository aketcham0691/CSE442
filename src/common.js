// Initialize Firebase
      var config = {
        apiKey: "AIzaSyBJjiM_ouXSCvHJNglp0cmL5fbTcQidqRE",
        authDomain: "qrattendance-28a3a.firebaseapp.com",
        databaseURL: "https://qrattendance-28a3a.firebaseio.com",
        projectId: "qrattendance-28a3a",
        storageBucket: "qrattendance-28a3a.appspot.com",
        messagingSenderId: "478980586825"
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