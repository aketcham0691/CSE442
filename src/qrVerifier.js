 //Creat by Mohammad Talha the only Hafeez
//This function reads the QR code 

function GenerateQRCode2(CourseCode,ProfessorName){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date+time;
var data=CourseCode+ProfessorName+dateTime;
return data;
}

function GenerateQRCode3(CourseCode,ProfessorName)
{
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes()+1);
var dateTime = date+time;
var data=CourseCode+ProfessorName+dateTime;
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
 
    if((GenerateQRCode2("CSE331", "Aatri Rudra")==information)||(GenerateQRCode3("CSE331","Aatri Rudra")==information))
    {
      alert("You have been Marked Present for CSE331");
    }
    else if ((GenerateQRCode2("CSE460", "Jan Chomicki")==information)||(GenerateQRCode3("CSE460", "Jan Chomicki")==information)){
      alert("You have been Marked Present for CSE460");

    }
    else if ((GenerateQRCode2("CSE442", "Matthew Hertz")==information)||(GenerateQRCode3("CSE442", "Matthew Hertz")==information)){
       alert("You have been Marked Present for CSE442");
    }
    else
    {
      alert("Cheater cheater pumkin eater");
    }

  }