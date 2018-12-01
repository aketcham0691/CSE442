
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initStudentClassPage() {
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
		        var uname;
		        firebase.database().ref('/users/' + getUserFromEmail(user.email)).once('value').then(function(snapshot) {
		            document.getElementById('userAvatar').innerHTML = snapshot.key;
		            uname = snapshot.key;
		        })
		        .catch(function(error) {
		            alert("problem reading DB: " + error.message);
		        })
				// alert("courseId: " + getUrlVars()["courseId"]);
				// populate the course list and welcome message
				var columns = [];
		        var dataSet = [];
		        var dataTable = [];

				firebase.database().ref('/courses/' + getUrlVars()["courseId"]).once('value').then(function(attendanceObj) {
					attendanceObj = attendanceObj.val();
					
					if (!attendanceObj.attendance) { // no courses, so delete table and update help message
						alert("No attendance has been taken for this course.");
						window.location.replace("./studentPage.html");
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

					    var ubit_col = {};
					    ubit_col['title'] = "UBIT";
					    columns.push(ubit_col);	

					    for (date in attendanceObj.attendance) {
							cell = row.insertCell(count);
							var date_string = date.replace(/(.{2})/g,"$1/");
							date_string = date_string.substring(0, date_string.length - 1);
							cell.innerHTML = "<b>" + date_string + "</b>";
							var date_col = {};
							date_col['title'] = date_string;
							columns.push(date_col);
							count++;
							length++;
						}

					    var student_row = table.insertRow(1);
					    student_row.insertCell(0).innerHTML = uname;
						
						var tuple = [];
						tuple.push(uname);
						for(var j = 1; j <= count; j++) {
							table.rows[1].insertCell(j).innerHTML = ' ';
							tuple.push(' ');
						}
						dataSet.push(tuple);
						count = 1;

						var promises = [];
						for (date in attendanceObj.attendance) {
							promises.push(addAttendanceToTable(date, count, length, uname, dataSet));
							count++;
						}
						return Promise.all(promises);
					}
				}).then(function(result) {
					dataTable.push(columns);
					dataTable.push(dataSet);
					resolve(dataTable);
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
function addAttendanceToTable(date, col, num_cols, student, dataSet) {

	return new Promise(function(resolve, reject) {
		var table = document.getElementById("attendance_table");
		// get the corresponding course object
		firebase.database().ref("/courses/" + getUrlVars()["courseId"] + "/attendance/" + date).once("value").then(function(attendanceObj) {
			
			var children = 0;
			if (attendanceObj.hasChild(student)) {
				table.rows[1].cells[col].innerHTML = '✔';
				dataSet[0][col] = '✔';
			}
		}).then(function(result) {
			resolve("worked");
		}).catch((error) => {
			// do nothing
		});
		
	});
	
}
