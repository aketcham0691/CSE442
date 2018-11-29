/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initProfessorPage() {
    // Listening for auth state changes.
    // [START authstatelistener]
    return new Promise(function(resolve, reject) {
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
	            document.getElementById('userAvatar').innerHTML = snapshot.key;
	        })
	        .catch(function(error) {
	            alert("problem reading DB: " + error.message);
	        })
				
			// populate the course list and welcome message
			firebase.database().ref('/users/' + getUserFromEmail(user.email)).once('value').then(function(profObj) {
				profObj = profObj.val();
				
				let welcomeMessage = document.getElementById("professorWelcome");
				welcomeMessage.innerHTML = "Welcome, Professor " + profObj.name + "!"; // update the welcome message
				
				if (!profObj.courses) { // no courses, so delete table and update help message
					let table = document.getElementById("courseTable");
					//table.parentNode.removeChild(table);
					let helpMessage = document.getElementById("helpMessage");
					helpMessage.innerHTML = "Please create a new class below to get started!"; // set the help message accordingly
				}
				else {
					for (let courseId in profObj.courses) {
						addCourseToTable(courseId); // add the course to the table
					}
				}
			}).then(function(){
				resolve("worked");
			}).catch((error) => {
				console.log(error);
			});

	        } else {
	        	window.location.replace("./index.html");
	        }
	    });
	});
}

/**
 * Adds a course to the course list HTML by course ID
 */
function addCourseToTable(courseId) {
	let table = document.getElementById("courseTable");
	// get the corresponding course object
	firebase.database().ref("/courses/" + courseId + "/").once("value").then((courseObj) => {
		courseObj = courseObj.val();
		const courseCode = courseObj.courseCode;
		const courseName = courseObj.courseName;
		const courseId = courseObj.courseId;
		// add to the table
		let row = table.insertRow(); // insert to end of table
		let courseCodeCell = row.insertCell(); // insert course code
		courseCodeCell.innerHTML = "<a href=\"./coursestatsprof.html?courseId=" + courseId+ "\">" + courseCode + "</a>";
		let courseNameCell = row.insertCell(); // insert course name
		courseNameCell.innerHTML = courseName;
		let takeAttendanceCell = row.insertCell(); // insert take attendance button
		const thisAttendanceButtonId = "take_attendance_" + courseCode;
		takeAttendanceCell.innerHTML = '<button type="button" class="btn btn-success btn-lg btn-block" data-toggle="modal" data-target="#takeAttendanceModal" id="' + thisAttendanceButtonId + '">Take Attendance</button>';

		// add an onclick listener to make the button open up a modal
		// first, we need to get the professor name
		firebase.database().ref("/users/" + courseObj.professor + "/").once("value").then((profObj) => {
			profObj = profObj.val();
			const profName = profObj.name;

			// now, add the listener
			let takeAttendanceButton = document.getElementById(thisAttendanceButtonId);
			takeAttendanceButton.onclick = function() {
				let qrImage = document.getElementsByClassName("QRCODE")[0];
				var encoding = GenerateQRCode(courseCode, profName);
				qrImage.src = encoding;
			}
		}).catch((error) => {
			// do nothing
		});
	}).catch((error) => {
		// do nothing
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
			
			const courseId = Date.now(); // use current timestamp as course ID
			firebase.database().ref("/courses/" + courseId).set({ // add course to course list
				courseCode: courseCode,
				courseName: courseName,
				courseSec: courseSec,
				courseId: courseId,
				professor: profEmail,
				pin: pin
			}).then(() => {
				// add course to professor's course list
				let profCourseObj = { };
				profCourseObj[courseId] = true;
				firebase.database().ref("/users/" + getUserFromEmail(user.email) + "/courses/").update(profCourseObj).catch((error) => {
					alert("Could not add course to professor's course list");
				});
				let helpMessage = document.getElementById("helpMessage");
				helpMessage.innerHTML = "Please select a class to start taking attendance, or create a new class below."; // update the help message
				
				alert("Course added");
			}).catch((error) => {
				alert(error);
			});
			
			// add course to the HTML on the page
			addCourseToTable(courseId);
        }).catch(function(error) {
            alert("problem reading DB: " + error.message);
        });
	}
	else {
		alert("Please log in before creating a class");
	}
}