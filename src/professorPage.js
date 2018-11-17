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
	var courseCode = document.getElementById("course-code").value;
	var courseName = document.getElementById("course-name").value;
	var courseSec = document.getElementById("course-section").value;
	var user = firebase.auth().currentUser;
	if (user) {
		firebase.database().ref('/users/' + getUserFromEmail(user.email)).once('value').then(function(snapshot) {
			let emailGex = /(.+)@.+\..+/g; // (email)@domain.com
			const profEmailMatches = emailGex.exec(snapshot.val().email);
			if (!profEmailMatches || profEmailMatches.length !== 2) {
				return alert("Error reading email name");
			}
			const profEmail = profEmailMatches[1];
			
			const max = 999999;
			const min = 100000;
			const pin = Math.floor(Math.random() * (max - min + 1)) + min; // generate a random pin between min and max
			firebase.database().ref("/courses/" + courseName).set({ // add course to course list
				courseCode: courseCode,
				courseName: courseName,
				courseSec: courseSec,
				professor: profEmail,
				pin: pin
			}).then(() => {
				alert("course added");
			}).catch((error) => {
				alert(error);
			});
			
			// also add course to professor's course list
			let profCourseObj = { };
			profCourseObj[courseName] = "true";
			firebase.database().ref("/users/" + getUserFromEmail(user.email) + "/courses/").update(profCourseObj).catch((error) => {
				alert("Could not add course to professor's course list");
			});
        }).catch(function(error) {
            alert("problem reading DB: " + error.message);
        });
	}
	else {
		alert("Please log in before creating a class");
	}
}