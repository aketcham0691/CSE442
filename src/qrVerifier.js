 //Creat by Mohammad Talha the only Hafeez
//This function reads the QR code 

function GenerateQRCode2(courseId){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date+time;
var data=courseId+dateTime;
var URLendcoding="https://api.qrserver.com/v1/create-qr-code/?data="+data;
return URLendcoding;
}


 function openQRCamera(node) {
  var reader = new FileReader();
  reader.onload = function() {
    node.value = "";
    qrcode.callback = function(res) {
      if(res instanceof Error) {
        alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
      } else {
        node.parentNode.previousElementSibling.value = res;
            Verifier(res);

      }
    };
    qrcode.decode(reader.result);
  };
  reader.readAsDataURL(node.files[0]);
  }


  //Created By Rajeev Gundavarapu and Mohammad Hafeez
  //Checks if the read 

  function Verifier(information)
  {
      //get current user
      user = firebase.auth().currentUser;
      var today = new Date();
      
      let emailGex = /(.+)@.+\..+/g; // (email)@domain.com
      const studentEmailMatches = emailGex.exec(user.email);
      if (!studentEmailMatches || studentEmailMatches.length !== 2) {
          return alert("Error reading email name");
      }
      const studentEmail = studentEmailMatches[1];
      console.log(studentEmail);
      
      //object of student name
      var obj = {
          
      };
      obj[studentEmail] = "true";
      
      
      //check all student courses
      firebase.database().ref('/users/'+getUserFromEmail(user.email)+'/courses').once('value').then(function(snapshot){
          
          snapshot.forEach(function(childSnapshot) {
              console.log(childSnapshot.key);
              
              if(GenerateQRCode2(childSnapshot.key)==information){
                  
                  firebase.database().ref("courses/"+childSnapshot.key+"/attendance/"+(today.getMonth()+today.getDate()+today.getYear())).set(obj).then(()=>{
                      alert("You have been marked presnt");
                      break;
                  }).catch((error)=>{
                          alert("cheater Cheater Pumkin Eater");
                  });
                           
                }
        });
                                          
      }).catch((error)=>{
          console.log("You are not signed up for any courses");
      });
      
      
 /*
    if(GenerateQRCode2("CSE331", "Aatri Rudra")==information)
    {
      alert("You have been Marked Present for CSE331");
    }
    else if (GenerateQRCode2("CSE460", "Jan Chomicki")==information){
      alert("You have been Marked Present for CSE460");

    }
    else if (GenerateQRCode2("CSE442", "Matthew Hertz")==information){
       alert("You have been Marked Present for CSE442");
    }
    else
    {
      alert("Cheater cheater pumkin eater");
    }*/

      
//          for (let courseName in snapshot.val().courses){
//              console.log(courseName);
//              console.log(snapshot.val().course[courseName]);
//              console.log("heloooo");
//          }
  }