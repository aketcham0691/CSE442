/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        document.getElementById("login_button").disabled = true;
        var email = document.getElementById("loginname").value + "@buffalo.edu";
        var password = document.getElementById('loginpass').value;
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        document.getElementById("login_button").disabled = false;
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
        })
        .then(function(userCredential) {
            firebase.database().ref('/users/' + getUserFromEmail(userCredential.user.email)).once('value').then(function(snapshot) {
                var snapshot = snapshot.val();
                if (snapshot.account_type == "Student") {
                    window.location.replace("./studentPage.html");
                } else {
                    window.location.replace("./ProfessorPage.html");
                }
            });
        })
        // [END authwithemail]
    }
}
    /**
     * Handles the sign up button press.
     */
function handleSignUp() {
    var email = document.getElementById('email').value + "@buffalo.edu";
    var password = document.getElementById('password').value;
    var uname = document.getElementById("email").value;
    document.getElementById("submit_button").disabled = true;
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
        // Handle Errors here.
        document.getElementById("submit_button").disabled = false;
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
        } else {
        alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    })
    .then(function() {
        console("user added");
    })
// [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
    }
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    return new Promise(function(resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
            // [END_EXCLUDE]
            if (user) {
            // User is signed in.
            firebase.database().ref('/users/' + getUserFromEmail(user.email)).once('value').then(function(snapshot) {
                if (!snapshot.val()) {
                    var name = document.getElementById("name").value;
                    var uname = document.getElementById("email").value;
                    var email = uname + "@buffalo.edu";
                    var choice = document.getElementById("accountTypes");
                    choice = (choice.options[choice.selectedIndex].value);
                    var account_type = choice == '1' ? "Student" : "Professor";

                    var database = firebase.database();
                    firebase.database().ref('users/' + uname).set({
                        name: name,
                        email: email,
                        account_type : account_type
                    })
                    .then(function() {
                        if (account_type == "Student") {
                            window.location.replace("./studentPage.html");
                        } else {
                            window.location.replace("./ProfessorPage.html");
                        }
                    })
                    .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert("Unable to update database: " + errorMessage);
                    console.error(errorMessage);
                    })
                } else {
                    var snapshot = snapshot.val();
                    if (snapshot.account_type == "Student") {
                        window.location.replace("./studentPage.html");
                    } else {
                        window.location.replace("./ProfessorPage.html");
                    }
                }
            }).then(function(result) {
                reject("user logged in");
            }).catch(function(error) {
                alert("problem reading DB: " + error.message);
            })
            
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            
            } else {
                resolve("worked");
            }
        });
    });

}