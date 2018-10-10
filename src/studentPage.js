/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initStudentPage() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        firebase.database().ref('/users/' + getUserFromEmail(user.email)).once('value').then(function(snapshot) {
            document.getElementById('userAvatar').innerHTML = snapshot.val().name;
        })
        .catch(function(error) {
            alert("problem reading DB: " + error.message);
        })
        } else {

        }
        // [START_EXCLUDE silent]
        
        // [END_EXCLUDE]
    });
}