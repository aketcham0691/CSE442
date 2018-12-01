/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
username='';
function initStudentPage() {
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
                username=snapshot.key;
                ShowCourses();
            }).then(function(result) {
                resolve("worked");
            }).catch(function(error) {
                alert("problem reading DB: " + error.message);
            })
            } else {

            }
            // [START_EXCLUDE silent]
            
            // [END_EXCLUDE]
        });
    });
    
}



function initStudentClassPage() {
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


function AddCourse(){
    //variable to check if the course is inserted or not
    insert= false
    //getting courses data
    firebase.database().ref('/courses/').once('value').then(function(snapshot) {
        //looping through all the courses
        for(c in snapshot.val()){
            //if the pin is equal
             if(snapshot.val()[c].pin==document.getElementById('course').value){
                //getting that course data 
                CourseName=snapshot.val()[c].courseName
                 CourseCode= snapshot.val()[c].courseCode
                 Professor=snapshot.val()[c].professor
                 Sec=snapshot.val()[c].courseSec
                 //adding that course code and name in user's object
                firebase.database().ref('/users/'+username+'/courses/'+snapshot.val()[c].courseId).set(snapshot.val()[c].courseCode);
                firebase.database().ref('/courses/' + c +'/roster/' + username).set(true);
                //emptying the input
                document.getElementById('course').value=''
                //course is inserted
                insert = true
                //displaying course data
                document.getElementById('courseModalLabel').innerHTML='Course Registered'
                document.getElementById('CName').innerHTML='Course Name : '+CourseName
                document.getElementById('CCode').innerHTML='Course Code : '+CourseCode
                document.getElementById('CProfessor').innerHTML='Professor : '+Professor
                document.getElementById('CSection').innerHTML='Course Section : '+Sec
                $("#courseModal").modal()
               // alert('Course Added\nCorse Name : '+CourseName+'\nCource Code : '+CourseCode+'\nProfessor : '+Professor+'\nCource Section : '+Sec)
                //updating course modal  2ndTask
                ShowCourses();
                break;
            }
        }
        //if the pin doees not match
        if(!insert){
            document.getElementById('courseModalLabel').innerHTML='Invalid Code'
                document.getElementById('CName').innerHTML=''
                document.getElementById('CCode').innerHTML=''
                document.getElementById('CProfessor').innerHTML=''
                document.getElementById('CSection').innerHTML=''
                $("#courseModal").modal()
        }

    })
    .catch(function(error) {
        alert("problem reading DB: " + error.message);
    })
}

//method for user courses and updating courses modal
    function ShowCourses(){
        //getting user's registered courses
        firebase.database().ref('/users/'+username+'/courses/').once('value').then(function(snapshot) {
            //courses modal body
            coursesListBody=''
            //looping through user's registered courses
            for(c in snapshot.val()){
                    //concatinating anchor tags to then later on add it to the modal body
                    coursesListBody = coursesListBody + "<a href='./student_class.html?courseId=" + c +  "' style='padding: 2px'><button type='button' class='btn btn-primary' href='#'>"+snapshot.val()[c]+"</button></a>"
            }
            //adding all the anchor tags to modal body
            document.getElementById('courses').innerHTML=coursesListBody;
            
        })
        .catch(function(error) {
            alert("problem reading DB: " + error.message);
        })
}