
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
			// alert("courseId: " + getUrlVars()["courseId"]);
			// populate the course list and welcome message
			firebase.database().ref('/courses/' + getUrlVars()["courseId"]).once('value').then(function(attendanceObj) {
				attendanceObj = attendanceObj.val();
				
				if (!attendanceObj.attendance) { // no courses, so delete table and update help message
					alert("No attendance has been taken for this course.");
					window.location.replace("./ProfessorPage.html");
				}
				else {
					var header = document.getElementById("class_header");
					header.innerHTML = attendanceObj.courseCode + ": " + attendanceObj.courseName;
					var count = 1;
					var table = document.getElementById("attendance_table");
				    var header = table.createTHead();
				    var row = header.insertRow(0);
				    var cell = row.insertCell(0);
				    cell.innerHTML = "<b>UBIT</b>";
				    var length = 0;

				    for (date in attendanceObj.attendance) {
						cell = row.insertCell(count);
						var date_string = date.replace(/(.{2})/g,"$1/");
						date_string = date_string.substring(0, date_string.length - 1);
						cell.innerHTML = "<b>" + date_string + "</b>";
						count++;
						length++;
					}

				    var num_students = 0;
				    for (student in attendanceObj.roster) {
				    	var student_row = table.insertRow(num_students+1)
				    	student_row.insertCell(0).innerHTML = student;
				    	num_students++;
				    }

					
					for (var j = 1; j <= num_students; j++) {
						for(var k = 1; k <= count; k++) {
							table.rows[j].insertCell(k).innerHTML = ' ';
						}
					}
					count = 1;

					for (date in attendanceObj.attendance) {
						addAttendanceToTable(date, count, length).then(function(result){
							console.log(result);
						});
						count++;
					}
				}
			}).then(function(result) {
				resolve("completed table");
			}).catch((error) => {
				console.log(error);
			});
	        } else {
	        	window.location.replace("./index.html");
	        }
	    });
    });
    
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
}

/**
 * Adds a course to the course list HTML by course ID
 */
function addAttendanceToTable(date, col, num_cols) {

	return new Promise(function(resolve, reject) {
		var table = document.getElementById("attendance_table");
		// get the corresponding course object
		firebase.database().ref("/courses/" + getUrlVars()["courseId"] + "/attendance/" + date).once("value").then(function(attendanceObj) {
			
			var children = 0;
			attendanceObj.forEach(function(child) {
				var contains_child = false;
				var i = 0;
				for (i = 0, row; row = table.rows[i]; i++) {
					if (row.cells[0].innerHTML == child.key) {
						row.cells[col].innerHTML = '✔';
						contains_child = true;
						break;
					}

				}
				if (!contains_child) {
					var row = table.insertRow(i);
					row.insertCell(0).innerHTML = child.key;
					for(var j = 1; j <= num_cols; j++) {
						row.insertCell(j).innerHTML = ' ';
					}
					row.cells[col].innerHTML = '✔';
				}
				children++;
			});
		}).then(function(result) {
			resolve("for each worked, children: " + children);
		}).catch((error) => {
			// do nothing
		});
		
	});
	
}
