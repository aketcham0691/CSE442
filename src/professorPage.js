/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initProfessorPage() {
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
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
}

/**
 * Handles the class creation
 */
function handleCreateClass() {
	console.log("called");
	var courseCode = document.getElementById("course-code").value;
	var courseName = document.getElementById("course-name").value;
	var courseSec = document.getElementById("course-section").value;
	var user = firebase.auth().currentUser;
	if (user) {
		firebase.database().ref("courses/" + courseName).set({
			courseCode: courseCode,
			courseName: courseName,
			courseSec: courseSec,
			professor: user.uid,
			attendance: [],
		}).then(() => {
			alert("course added");
		}).catch((error) => {
			alert(error);
		})
	}
	else {
		alert("Please log in before creating a class");
	}
}