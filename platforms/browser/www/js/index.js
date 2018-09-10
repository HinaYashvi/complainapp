// Device Event Listener
/*document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    console.log('Device is Ready');
}*/
var pictureSource; // picture source
var destinationType; // sets the format of returned value
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
//
 
function onDeviceReady() {
pictureSource = navigator.camera.PictureSourceType;
destinationType = navigator.camera.DestinationType;

/*var constraints = { audio: true, video: { width: 1280, height: 720 } }; 

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  var video = document.querySelector('video');
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end. */
}
// Called when a photo is successfully retrieved
//
 
function onPhotoDataSuccess(imageURI) {
// Uncomment to view the base64-encoded image data
console.log(imageURI);
// Get image handle
//
var cameraImage = document.getElementById('image');
$(".imageblock").removeClass("display-none");
$(".imageblock").addClass("display-block");
// Unhide image elements
//
cameraImage.style.display = 'block';
// Show the captured photo
// The inline CSS rules are used to resize the image
//
cameraImage.src = imageURI;
showUploadbtn();
}
// Called when a photo is successfully retrieved
//
 
function onPhotoURISuccess(imageURI) {
// Uncomment to view the image file URI
console.log(imageURI);
// Get image handle
//
var galleryImage = document.getElementById('image');
//alert(galleryImage+" gallery image");
// Unhide image elements
//
galleryImage.style.display = 'block';
// Show the captured photo
// The inline CSS rules are used to resize the image
//
galleryImage.src = imageURI;
}
// A button will call this function
//
 
function capturePhoto() {
// Take picture using device camera and retrieve image as base64-encoded string
navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
quality: 30,
targetWidth: 600,
targetHeight: 600,
destinationType: destinationType.FILE_URI,
saveToPhotoAlbum: true
}); 

}
// A button will call this function
//
function onPhotoDataSuccess(imageURI){

// Uncomment to view the base64-encoded image data
console.log(imageURI);
// Get image handle
//
var cameraImage = document.getElementById('image');
$(".imageblock").removeClass("display-none");
$(".imageblock").addClass("display-block");
// Unhide image elements
//
cameraImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
cameraImage.src = imageURI;
showUploadbtn();
}
 
function getPhoto(source) {
	
// Retrieve image file location from specified source
navigator.camera.getPicture(onPhotoURISuccess, onFail, {
quality: 30,
targetWidth: 600,
targetHeight: 600,
destinationType: destinationType.FILE_URI,
sourceType: source
});
}
// Called if something bad happens.

 
function onFail(message) {
alert('Failed because: ' + message);
}
function upload(){   
	var img = document.getElementById('image');	
	var imageURI = img.src;
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
	options.chunkedMode = false;
	//options.httpMethod = "POST";
	options.headers = {
	   Connection: "close"
	};
	// setup parameters
	var params = {};
	params.fullpath =imageURI;
	params.name = options.fileName;
	var ft = new FileTransfer();
	//var url="";
	//ft.upload(imageURI, encodeURI(url+'www/contact_photo'), win, fail, options);
	ft.upload(imageURI,"http://starprojects.in/f7CI/Appcont/appcontroller/photoupload", win, fail, options,true);		
}
function win(r) {
	console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);

}
function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	alert("upload error source " + error.source);
	alert("upload error target " + error.target);
}

 

