
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("attendance_table");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].cells[0];
      y = rows[i + 1].cells[0];
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

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
			    	length++;
			    }
				for (date in attendanceObj.attendance) {
					cell = row.insertCell(count);
					cell.innerHTML = "<b>" + date + "</b>";
					addAttendanceToTable(date, count, length);
					count += 1;
				}

				// sortTable();
			}
		}).catch((error) => {
			console.log(error);
		});

        } else {
        	window.location.replace("./index.html");
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
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
	var table = document.getElementById("attendance_table");
	// get the corresponding course object
	firebase.database().ref("/courses/" + getUrlVars()["courseId"] + "/attendance/" + date).once("value").then(function(attendanceObj) {
		
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
			
		});
	}).catch((error) => {
		// do nothing
	});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
