
function GenerateQRCode(CourseCode,ProfessorName){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+time;
var data=CourseCode+ProfessorName+dateTime;
var URLendcoding="https://api.qrserver.com/v1/create-qr-code/?data="+data;
return URLendcoding;
}