 //Creat by Mohammad Talha the only Hafeez
//This function reads the QR code 
//so many generates
function GenerateQRCode2(courseId){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date+time;
var data=courseId+dateTime;
return data;
}

function GenerateQRCode3(courseId)
{
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes()+1);
var dateTime = date+time;
var data=courseId+dateTime;
return data;
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
      obj[studentEmail] = true;
      
      var classID = information.substring(0,13);
      console.log(classID);
      console.log(information);
      
      
      //check all student courses
      firebase.database().ref('/users/'+getUserFromEmail(user.email)+'/courses').once('value').then(function(snapshot){
          
          if(((GenerateQRCode2(classID)==information) || (GenerateQRCode3(classID) == information)) && snapshot.hasChild(classID)){
              
              console.log("in if")
              var dateString = ('0' + (today.getMonth()+1)).slice(-2)
             + ('0' + today.getDate()).slice(-2)
             + (today.getYear()-100);
              var ref = "courses/"+classID+"/attendance/"+dateString; 
              console.log(ref);
              firebase.database().ref(ref).update(obj).then(()=>{
                      alert("You have been marked presnt");
                  }).catch((error)=>{
                          alert("cheater Cheater Pumkin Eater");
                  });
            
              
          }
          
          
                                          
      }).catch((error)=>{
          console.log("You are not signed up for any courses");
      });
   
  }