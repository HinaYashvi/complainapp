// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true,
  //popupCloseByOutside:true,
  name: 'Your Collector',// App Name
  id: 'com.phonegap.yourcollector',       // App id
  panel: {
    //swipe: 'left', // Enable swipe panel
    closeByBackdropClick : true,
    
  },  
  //theme:'material',
  //material: true, //enable Material theme
  routes: routes, 
  clicks: { 
    externalLinks: '.external',
  },
  navbar: {
    hideOnPageScroll: false,
    iosCenterTitle: false,
    closeByBackdropClick: true,
  },
  picker: {
    rotateEffect: true,
    openIn: 'popover', 
  },
  popover: {
    closeByBackdropClick: true,
  },
  on: {
    pageInit: function(e, page) {
      //console.log('pageInit', e.page);
      var app = this;
      var today = new Date();
      var $ = app.$;

      var calendarRange = app.calendar.create({
        inputEl: '#demo-calendar-modal',
        dateFormat: 'dd-mm-yyyy',
        header: true,
        footer: true,
        openIn: 'customModal'
      });
      var calendarRange1 = app.calendar.create({
        inputEl: '#demo-calendar-modal1',
        dateFormat: 'dd-mm-yyyy',
        header: true,
        footer: true,
        openIn: 'customModal'
      });
      var calendarRange2 = app.calendar.create({
        inputEl: '#demo-calendar-modal2',
        dateFormat: 'mm-yyyy',
        header: true,
        footer: true,
        openIn: 'customModal'
      });
    },
  },
  // Hide and show indicator during ajax requests
  onAjaxStart: function (xhr) {
    app.showIndicator();
  },
  onAjaxComplete: function (xhr) {
    app.hideIndicator();
  }
});

var pictureSource; // picture source
var destinationType;

document.addEventListener("deviceready", checkStorage, false); 
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);

//var base_url = 'http://starprojects.in/complain_manage/';   // TEST SERVER //
var base_url = 'http://yourcollectorand.in/';   // LIVE SERVER // 

function onBackKeyDown() {
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  } 
}
function onDeviceReady() {
  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;  
}
function onPhotoDataSuccess(imageURI) {
  //console.log(imageURI);
  var cameraImage = document.getElementById('image');
  var upldbtnDiv = document.getElementById('upldbtnDiv');
  cameraImage.style.display = 'block';
  upldbtnDiv.style.display = 'block';
  cameraImage.src = imageURI;
} 
function onPhotoURISuccess(imageURI) {
  //console.log(imageURI);
  var galleryImage = document.getElementById('image');
  var upldbtnDiv = document.getElementById('upldbtnDiv');
  galleryImage.style.display = 'block';
  upldbtnDiv.style.display = 'block';
  galleryImage.src = imageURI;
} 
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
function onPhotoDataSuccess(imageURI){
  //console.log(imageURI);
  var cameraImage = document.getElementById('image');
  var upldbtnDiv = document.getElementById('upldbtnDiv');
  cameraImage.style.display = 'block';
  upldbtnDiv.style.display = 'block';
  cameraImage.src = imageURI;
}
function getPhoto(source) {
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 30,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
} 
function onFail(message) {
  alert('Failed because: ' + message);
}
function upload(){   
  var img = document.getElementById('image'); 
  app.dialog.preloader('Uploading....');
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  //options.contentType = 'multipart/form-data';
  //options.httpMethod = "POST";
  options.headers = {
     Connection: "close"
  };
  var params = {};
  params.fullpath =imageURI;
  params.name = options.fileName;
  var ft = new FileTransfer();
  var hidd_compid = $("#hidd_compid").val();
  var sess_u_id = window.localStorage.getItem("session_u_id");
  var uploadControllerURL = base_url+"app_controller/photoupload/"+hidd_compid+"/"+sess_u_id; 
  ft.upload(imageURI,uploadControllerURL, win, fail, options,true);   
}

function win(r) { //console.log("Code = " + r.responseCode);    
    var responseCode = r.responseCode;
    if(responseCode==200){
      app.dialog.alert("Upload Done.");      
      app.dialog.close();
    }
    //console.log("Response = " + r.response);
    //console.log("Sent = " + r.bytesSent);
}
function fail(error) {
  alert("An error has occurred: Code = " + error.code);
  alert("upload error source " + error.source);
  alert("upload error target " + error.target);
}
// --------------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection() {  
  var networkState = navigator.connection.type;
  app.preloader.show(); //alert(networkState);  
  if(networkState=='none'){  
      app.router.navigate('/internet/');  
  }
  app.preloader.hide();
}
// ************************************************************************************************* //

// -------------------------------------- C H E C K  S T O R A G E --------------------------------- //
function checkStorage(){
  //alert("called");
  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;
  checkConnection();  

  var version=1;  
  $.ajax({
    url: base_url+'app_controller/chk_version/'+version, 
    success: function(result){ 
      //alert(result);
      if(result==0 && result!=""){
          app.dialog.confirm('A new update is available for Your Collector. Please update your app.', function () { 
                navigator.app.clearHistory(); 
                navigator.app.exitApp();
          });  
      }
  }});

  var sess_u_id = window.localStorage.getItem("session_u_id");
  //alert(sess_u_id); 
  if(sess_u_id==null){
    var sess_u_id = window.localStorage.getItem("session_admin_u_id");  
  }else{
    var sess_u_id = window.localStorage.getItem("session_u_id");
  }  

  if(sess_u_id==null){
    app.router.navigate('/');   
  }else{  
    app.router.navigate('/dashboard/'); 
  }
}

function chkStatusAndPwd(){
  checkConnection();  
  var sess_u_id = window.localStorage.getItem("session_u_id");  //alert(sess_u_id); 
  if(sess_u_id==null){
    var sess_u_id = window.localStorage.getItem("session_admin_u_id");  
  }else{
    var sess_u_id = window.localStorage.getItem("session_u_id");
  }
  if(sess_u_id!=null){ 
    var url = base_url+"app_controller/chkLogedinUserStatusPwd";
    $.ajax({
      'type':'POST',
      'url': url, 
      'data':{'session_u_id':sess_u_id}, 
      success:function(data){ 
        var json = $.parseJSON(data);
         var json_res = json.chkStPwd[0];
         var u_pass = json.chkStPwd[0].u_pwd; 
         var u_status = json.chkStPwd[0].u_status;
         var session_u_status = window.localStorage.getItem("session_u_status");
         var session_u_pwd = window.localStorage.getItem("session_u_pwd");
         //alert(u_status+"="+session_u_status +"***"+u_pass+"="+session_u_pwd);
         if(session_u_status!=u_status){  
          app.dialog.alert("You are deactivated");
          logOut(); //app.router.navigate('/');           
         }else if(session_u_pwd!=u_pass){
          app.dialog.alert("Your password should be changed recently.");
          logOut(); //app.router.navigate('/');           
         }
      }
    }); 
  }else{
    app.router.navigate('/dashboard/');               
  }
}
// ----------------------------------------- LOGIN : C H E C K L O G I N ----------------------------- //
function checklogin(){
    checkConnection();    
    if (!$$('#loginForm')[0].checkValidity()) { 
     // alert('Check Validity!');
     // console.log('Check Validity!');
    }else{ 
      var form = $(".loginForm").serialize();
      var url=base_url+'app_controller/chklogin'; //console.log(form);     
      var unm=$('input[name="username"]').val();
      //console.log(unm); 
      $.ajax({
        'type':'POST',
        'url': url, 
        'data':form, 
        success:function(data){
          var json = $.parseJSON(data);
          var json_res = json.loggedin_user[0];   //console.log("!!!!!!!!"+json_res);          
          if(json_res!=undefined){ 
            //alert("in if"); 
            //window.localStorage.setItem("session_u_id",json.loggedin_user[0].u_id);
            window.localStorage.setItem("session_u_fullname",json.loggedin_user[0].u_fullname);
            window.localStorage.setItem("session_unm",unm);
            window.localStorage.setItem("session_u_name",json.loggedin_user[0].u_name);
            window.localStorage.setItem("session_u_mo",json.loggedin_user[0].u_mo);
            window.localStorage.setItem("session_u_pwd",json.loggedin_user[0].u_pwd);
            window.localStorage.setItem("session_u_type",json.loggedin_user[0].u_type);
            window.localStorage.setItem("session_u_status",json.loggedin_user[0].u_status);
            var u_type = json.loggedin_user[0].u_type;
            if(u_type==0){  // ADMIN //              
              window.localStorage.setItem("session_admin_u_id",json.loggedin_user[0].u_id);
            }else if(u_type==1){  // USER //              
              window.localStorage.setItem("session_u_id",json.loggedin_user[0].u_id);
            }
            app.router.navigate("/dashboard/");
          }else{
            app.dialog.alert("Authentication Failed!");
            $("#username").val('');
            $("#password").val('');
          }
        }
      });
    }
}  
//*************************************************************************************************** //
$$(document).on('page:init', '.page[data-name="index"]', function (e) { 
  checkConnection(); 
  var url = base_url+"app_controller/getAppCity";
  $.ajax({
    'url': url, 
    success:function(data){       
      $("#district").html(data);      
    }
  }); 
});

// ----------------------------------------- D A S H B O A R D -------------------------------------- //
$$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {  
  //console.log(app.views.main.router);
  checkConnection();  
  chkStatusAndPwd();
  dashboardPage();
  //app.dialog.preloader('Loading Dashboard...'); 
  app.preloader.show();
  setInterval(function(){  
    dashboardPage();
  },5000);      
  app.preloader.hide();
});
function dashboardPage(){
  checkConnection();  
  var sess_u_id = window.localStorage.getItem("session_u_id");
  var sess_u_type = window.localStorage.getItem("session_u_type");
  var session_admin_u_id = window.localStorage.getItem("session_admin_u_id");
  //$(".admin-menu").css("display","none");
  //$(".user-menu").css("display","none"); 
  //alert(sess_u_id);
  if(sess_u_id==null){ // ADMIN //    
    var data = {'session_u_id':'NULL'}     
    var login_id = session_admin_u_id; 
  }else{  // USER //
    var data = {'session_u_id':sess_u_id}
    var login_id = sess_u_id; 
  }  
    var user_url = base_url+'app_controller/userDet';
    $.ajax({
      'type':'POST',
      'url': user_url, 
      'data':{'login_id':login_id},
      success:function(user_data){
      //alert(seen_data);   
        var json = $.parseJSON(user_data);
        var json_user = json.user_data; 
        var u_fullname=json_user[0].u_fullname; 
        var u_mo=json_user[0].u_mo; 
        var u_since=json_user[0].u_ceratedate;


        $("#userName").html("<span class='text-white'>Name : "+u_fullname+"</span>"); 
        $("#userMo").html("<span class='text-white'>Mobile : "+u_mo+"</span>"); 
        $("#userSince").html("<span class='text-white'>User Since : "+u_since+"</span>");        
      }
    });
    var panel_menus='';
    if(sess_u_type==0){
     // $(".leftbars").removeClass("display-none");
      //$(".leftbars").addClass("display-block");
      $("#userDiv").html("<span class='text-white'>( ADMIN )</span>");
      panel_menus = '<li class="" ><a class="list-button item-link panel-close fs-14" href="/dashboard/">Dashboard</a></li><li class="comprep" ><a class="list-button item-link panel-close fs-14" href="/comp_rep/">Complain Report</a></li><li class="compmonthrep"><a class="list-button item-link panel-close fs-14" href="/comp_mon_rep/">Compl. Monthly Report</a></li><li class="" ><a class="list-button item-link panel-close fs-14" href="/change_pwd/">Change Password</a></li><li class="logout"><a class="list-button item-link fs-14" href="#" onclick="logOut()">Logout</a></li>'; 
    }else if(sess_u_type==1){
      //$(".leftbars").removeClass("display-block");
      //$(".leftbars").addClass("display-none");
      $("#userDiv").html("<span class='text-white'>(USER)</span>");
      panel_menus = '<li class="" ><a class="list-button item-link panel-close fs-14" href="/dashboard/">Dashboard</a></li><li class="" ><a class="list-button item-link panel-close fs-14" href="/change_pwd/">Change Password</a></li><li class="logout"><a class="list-button item-link fs-14" href="#" onclick="logOut()">Logout</a></li>';
    }
    $("#panel_menus").html(panel_menus);
    var url=base_url+'app_controller/getComplaintsStatusandCounts';
    $.ajax({
      'type':'POST',
      'url': url, 
      //'data':{'session_u_id':sess_u_id},
      'data':data,
      success:function(data){
        var json = $.parseJSON(data);
        var json_res = json.complaint_counts; //console.log(json_res);      
        var statusdata=''; 
        app.preloader.show(); 
        for(var i=0;i<json_res.length;i++){
            var status_type=json_res[i].statustype;
            var status_id=json_res[i].s_id;  
            var status_counts=json_res[i].cnt;  
            var all_compcnt = json_res[i].all_compcnt; 
            var impcnt = json_res[i].imp_compcnt;
            var isclosed_cnt = json_res[i].closed_cnt;
            //alert(impcnt);
            if(status_type == 'Assigned'){
              var block_class = "block-assign";
            }else if(status_type == 'Executed'){
              var block_class = "block-exec";
            }else if(status_type == 'In progress'){
              var block_class = "block-preogress";
            }else if(status_type == 'Completed'){
              var block_class = "block-comp";
            }   
            statusdata +='<div class="md-only col-50 card-content card-content-padding dashboard-blocks text-uppercase '+block_class+'" onclick="getStatusWiseComps('+status_id+','+"'"+status_type+"'"+')"><span class="fs-14">'+status_type+'</span><p id="data_counts" class="fs-2em">'+status_counts+'</p></div>';   

            statusdata +='<div class="ios-only col-100 card-content card-content-padding dashboard-blocks text-uppercase '+block_class+'" onclick="getStatusWiseComps('+status_id+','+"'"+status_type+"'"+')"><span class="fs-16">'+status_type+'</span><p id="data_counts" class="fs-2em float-right">'+status_counts+'</p></div>'; 

            $('#dashboard-boxes').html(statusdata); 
            //app.preloader.hide();    
            $("#total_complaints").html(all_compcnt);
            $("#imp_counts").html(impcnt);
            $("#closed_counts").html(isclosed_cnt);
             
          }  
          app.preloader.hide();
        }
      });
     
}
function ImportantComps(){
  app.router.navigate("/imp-comps/");
}

$$(document).on('page:init', '.page[data-name="imp-comps"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  //app.preloader.show();  
  var sess_u_id = window.localStorage.getItem("session_u_id");  
  if(sess_u_id==null){
    // ADMIN //
    var data = {'session_u_id':'NULL'}     
  }else{
    // USER //
    var data = {'session_u_id':sess_u_id}  
  }
  var imp_comp_url = base_url+'app_controller/AllImpComps';  
  $.ajax({
    'type':'POST', 
    'url':imp_comp_url, 
    'data':data,     
    success:function(data){ 
      app.preloader.show(); 
      var imp_comp_url_json = $.parseJSON(data);
      var json_comp_imp = imp_comp_url_json.all_impcomps;
      var comps_imp = '';              
      for(var j=0;j<json_comp_imp.length;j++){                              
       // var comp_id = json_comp_imp[j].comp_id; 
       // var comp_no = json_comp_imp[j].comp_no; 
        var lightred='';        
        var status=json_comp_imp[j].statustype;
        var comp_no=json_comp_imp[j].comp_no;
        var is_seen_byuser=json_comp_imp[j].is_seen_byuser;
        var complain = json_comp_imp[j].complain;
        var comp_adddate = json_comp_imp[j].comp_adddate;
        var is_impt = json_comp_imp[j].is_impt;
        var ref_name = json_comp_imp[j].ref_name;
        var onemonth_added_dt = json_comp_imp[j].onemonth_added_dt;
        var isclosed = json_comp_imp[j].is_closed;
          var today = new Date();
          var month = today.getMonth()+1;
          var day = today.getDate();
          if(month>=9){
            var mm = "0"+month;
          }else{
            var mm = month;
          } 

          if(day>=9){
            var dd = "0"+day;
          }else{
            var dd = day;
          }
          var date = today.getFullYear()+'-'+(mm)+'-'+dd;
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var todaydateTime = date+' '+time;       
        
        if(status=='Assigned'){
          if(todaydateTime > onemonth_added_dt){
              var badge_color = "color-red";
            }else{
              var badge_color = "color-custom";
            }          
          var imp_triangle = '';
        }else if(status=='Executed'){
          var badge_color = "color-executed";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='In progress'){
          var badge_color = "color-progress";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='Completed'){
          var badge_color = "color-complete";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }
        if(is_impt==1){
          lightred='notseen';
          var ref_by = '<em><span class="float-left fw-700 text-blue">Ref : [ '+ref_name+' ] </span></em>';
          var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
        }else{
          lightred="";
          var ref_by = '';
          var imp_triangle = '';
        }
        if(is_seen_byuser==0){ 
          var notseen="<i class='fa fa-eye-slash fs-16 text-green'></i>";
        }else{
          var notseen="";
        }
        if(isclosed==0){ // closed //
          var lock = '<i class="fa fa-lock text-red fs-12"></i>';
        }else if(isclosed==1){ // not closed / in process //
          var lock = '<i class="fa fa-unlock-alt text-red fs-12"></i>';
        }
        comps_imp+='<tr onclick="comp_det_page('+"'"+comp_no+"'"+')" class="'+lightred+'"><td class="label-cell"><a onclick="comp_det_page('+"'"+comp_no+"'"+')" class="float-left mt-5p fw-700">'+comp_no+' '+notseen+'</a><br/><span class="float-left w-100">'+complain+'..</span><br/><span class="fs-12 float-left w-100"><i class="fa fa-calendar mr-5p fs-12 ml-5x"></i>'+comp_adddate+'<span class="ml-5p">બંધ : '+lock+'</span></span>'+ref_by+'</td><td class="numeric-cell"><span class="badge '+badge_color+'">'+status+'</span>'+imp_triangle+'</td></tr><br>';
        $("#important-comps").html(comps_imp);         
        app.preloader.hide();              
      }          
    }       
  });  
});

function ClosedComps(){
  app.router.navigate("/closed-comps/");
}

$$(document).on('page:init', '.page[data-name="closed-comps"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show();  
  var sess_u_id = window.localStorage.getItem("session_u_id");  
  if(sess_u_id==null){ // ADMIN //    
    var data = {'session_u_id':'NULL'}     
  }else{ // USER //    
    var data = {'session_u_id':sess_u_id}  
  }
  var closed_comp_url = base_url+'app_controller/AllclosedComps';
  $.ajax({
    'type':'POST', 
    'url':closed_comp_url, 
    'data':data,     
    success:function(data){ 
      app.preloader.show(); 
      var imp_comp_url_json = $.parseJSON(data);
      var json_comp_closed = imp_comp_url_json.all_closedcomps;
      var comps_imp = '';              
      for(var j=0;j<json_comp_closed.length;j++){                               
        var lightred='';        
        var status=json_comp_closed[j].statustype;
        var comp_no=json_comp_closed[j].comp_no;
        var is_seen_byuser=json_comp_closed[j].is_seen_byuser;
        var complain = json_comp_closed[j].complain;
        var comp_adddate = json_comp_closed[j].comp_adddate;
        var is_impt = json_comp_closed[j].is_impt;
        var ref_name = json_comp_closed[j].ref_name;
        var onemonth_added_dt = json_comp_closed[j].onemonth_added_dt;
        var isclosed = json_comp_closed[j].is_closed;
          var today = new Date();
          var month = today.getMonth()+1;
          var day = today.getDate();
          if(month>=9){
            var mm = "0"+month;
          }else{
            var mm = month;
          } 

          if(day>=9){
            var dd = "0"+day;
          }else{
            var dd = day;
          }
          var date = today.getFullYear()+'-'+(mm)+'-'+dd;
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var todaydateTime = date+' '+time;       
        
        if(status=='Assigned'){
          if(todaydateTime > onemonth_added_dt){
              var badge_color = "color-red";
            }else{
              var badge_color = "color-custom";
            }          
          var imp_triangle = '';
        }else if(status=='Executed'){
          var badge_color = "color-executed";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='In progress'){
          var badge_color = "color-progress";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='Completed'){
          var badge_color = "color-complete";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }
        if(is_impt==1){
          lightred='notseen';
          var ref_by = '<em><span class="float-left fw-700 text-blue">Ref : [ '+ref_name+' ] </span></em>';
          var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
        }else{
          lightred="";
          var ref_by = '';
          var imp_triangle = '';
        }
        if(is_seen_byuser==0){ 
          var notseen="<i class='fa fa-eye-slash fs-16 text-green'></i>";
        }else{
          var notseen="";
        } 

        if(isclosed==0){ // closed //
          var lock = '<i class="fa fa-lock text-red fs-12"></i>';
        }else if(isclosed==1){ // not closed / in process //
          var lock = '<i class="fa fa-unlock-alt text-red fs-12"></i>';
        }
        comps_imp+='<tr onclick="comp_det_page('+"'"+comp_no+"'"+')" class="'+lightred+'"><td class="label-cell"><a onclick="comp_det_page('+"'"+comp_no+"'"+')" class="float-left mt-5p fw-700">'+comp_no+' '+notseen+'</a><br/><span class="float-left w-100">'+complain+'..</span><br/><span class="fs-12 float-left w-100"><i class="fa fa-calendar mr-5p fs-12 ml-5x"></i>'+comp_adddate+'</span><span class="ml-5p">બંધ : '+lock+'</span>'+ref_by+'</td><td class="numeric-cell"><span class="badge '+badge_color+'">'+status+'</span>'+imp_triangle+'</td></tr><br>';
        $("#important-comps").html(comps_imp);         
        app.preloader.hide();              
      }          
    }       
  });  
});
$$(document).on('page:init', '.page[data-name="statusComp"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  var $ptrContent = $$('.ptr-content');
  //app.preloader.show(); 
    
  var dashboard_clicked_stid = window.localStorage.getItem("dashboard_clicked_stid");
  var dashboard_clicked_sttype = window.localStorage.getItem("dashboard_clicked_sttype");
  //alert(dashboard_clicked_stid+"*******"+dashboard_clicked_sttype);
  getStatusWiseComps(dashboard_clicked_stid,dashboard_clicked_sttype);
  var sess_u_id = window.localStorage.getItem("session_u_id");
  //app.preloader.hide(); 
 
  $ptrContent.on('ptr:refresh', function (e) {   
    getStatusWiseComps(dashboard_clicked_stid,dashboard_clicked_sttype);
    //console.log(e.detail());
     app.ptr.done(); // or e.detail();
      //e.detail();
  }, 5000);
 /* setInterval(function(){ 
  //alert("hi");  
    getStatusWiseComps(dashboard_clicked_stid,dashboard_clicked_sttype);
  },5000); */

});
function getStatusWiseComps(statusid,status_type){
  window.localStorage.setItem("dashboard_clicked_stid",statusid);
  window.localStorage.setItem("dashboard_clicked_sttype",status_type);
  checkConnection();  
  app.router.navigate("/statusComp/");  
  
  var sess_u_id = window.localStorage.getItem("session_u_id");
  var url=base_url+'app_controller/complinsByStatus';  
  //var statusurl = base_url+"app_controller/assignedId";
  if(sess_u_id==null){ // ADMIN //     
    var data = {'session_u_id':'NULL','statusid':statusid}   
  }else{ // USER //    
    var data = {'session_u_id':sess_u_id,'statusid':statusid}
  } 
  
  app.preloader.show();
  $.ajax({
    'type':'POST',
    'url': url,     
    'data': data,
    success:function(data){
      var json_comps = $.parseJSON(data);
      var json_compres = json_comps.complaintByStatus; // console.log(json_compres);     
      var comaplintStatusdata='';       
      if(json_compres.length!=0){
        for(var j=0;j<json_compres.length;j++){
          var lightred='';
          var status=json_compres[j].statustype;
          var comp_no=json_compres[j].comp_no; 
          var s_id = json_compres[j].s_id;   
          var is_seen_byuser = parseInt(json_compres[j].is_seen_byuser);  
          var complain = json_compres[j].complain;
          var comp_adddate = json_compres[j].comp_adddate;
          var is_impt = json_compres[j].is_impt;
          var ref_name = json_compres[j].ref_name;
          var onemonth_added_dt = json_compres[j].onemonth_added_dt;
          var isclosed = json_compres[j].is_closed;
          var today = new Date();
          var month = today.getMonth()+1;
          var day = today.getDate();
          if(month>=9){
            var mm = "0"+month;
          }else{
            var mm = month;
          }
          if(day>=9){
            var dd = "0"+day;
          }else{
            var dd = day;
          }
          var date = today.getFullYear()+'-'+(mm)+'-'+dd;
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var todaydateTime = date+' '+time;          
          if(status_type=='Assigned'){
            if(todaydateTime > onemonth_added_dt){
              var badge_color = "color-red";
            }else{
              var badge_color = "color-custom";
            }
            /*if(is_seen_byuser==0){
             lightred='notseen';
            }  */            
            var imp_triangle = '';        
          }else if(status_type=='Executed'){
            var badge_color = "color-executed";
            var notseen="";
            var imp_triangle = '';
          }else if(status_type=='In progress'){
            var badge_color = "color-progress";
            var notseen="";
            var imp_triangle = '';
          }else if(status_type=='Completed'){
            var badge_color = "color-complete";
            var notseen="";
            var imp_triangle = '';
          }         
          if(is_impt==1){
            lightred='notseen';
            var ref_by = '<em><span class="float-left fw-700 text-blue">Ref : ['+ref_name+'] </span></em>';
            var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
            
          }else{
            lightred="";
            var ref_by = '';
            var imp_triangle = '';
          }
          if(is_seen_byuser==0){
            //lightred='notseen';
            var notseen="<i class='fa fa-eye-slash fs-16 text-green'></i>";
          }else{
            var notseen="";
          }
          if(isclosed==0){ // closed //
            var lock = '<i class="fa fa-lock text-red fs-12"></i>';
          }else if(isclosed==1){ // not closed / in process // 
            var lock = '<i class="fa fa-unlock-alt text-red fs-12"></i>';
          }
          comaplintStatusdata+='<tr onclick="comp_det_page('+"'"+comp_no+"'"+')" class="'+lightred+'"><td class="label-cell"><a onclick="comp_det_page('+"'"+comp_no+"'"+')" class="float-left mt-5p fw-700">'+comp_no+' '+notseen+'</a><br/><span class="float-left w-100">'+complain+'..</span><br/><span class="fs-12 float-left w-100"><i class="fa fa-calendar mr-5p fs-12  ml-5x"></i>'+comp_adddate+'<span class="ml-5p">બંધ : '+lock+'</span></span>'+ref_by+'</td><td class="numeric-cell"><span class="badge '+badge_color+'">'+status_type+'</span>'+imp_triangle+'</td></tr>';

            
            //$('#complaintsbyStatus').html(comaplintStatusdata);
        }
    }else{
      comaplintStatusdata+='<tr><td>No Data Available.</td></tr>';
    }
    
      //alert("hi");   
    $("#page_title").html(status_type);
    $('#complaintsbyStatus').html(comaplintStatusdata);
    
    app.preloader.hide();
    }
  });

}

// ******************************************************************************************************* //

// ---------------------------------------- C O M P L A I N T S ----------------------------------------- //
$$(document).on('page:init', '.page[data-name="complaints"]', function (e) {
  //console.log(app.views.main.router.url);
  //console.log(app.views.main.router);
  checkConnection();
  chkStatusAndPwd();
  //app.preloader.show();  
  var $ptrContent = $$('.ptr-content');
  complaintsPage();  
  /*setInterval(function(){    
    complaintsPage();
  },5000); */    
  
  $ptrContent.on('ptr:refresh', function (e) {     
    complaintsPage();//console.log(e.detail());    
     app.ptr.done(); // or e.detail();
     //e.detail();
  }, 3000);
});
function complaintsPage(){  
  checkConnection();
  var url=base_url+'app_controller/getAllComplaintsOfUser';
  var sess_u_id = window.localStorage.getItem("session_u_id");
  var sess_u_type = window.localStorage.getItem("session_u_type"); 
  if(sess_u_id==null){
    // ADMIN //
    var data = {'session_u_id':'NULL'}   
  }else{
    // USER //
    var data = {'session_u_id':sess_u_id}  
  }
  app.preloader.show(); 
  $.ajax({
    'type':'POST',
    'url': url, 
    //'data':{'session_u_id':sess_u_id},
    'data': data,
    success:function(data){
      var json = $.parseJSON(data);
      var json_res = json.AllComplaints;
      //console.log("*******"+json);
      var comaplintdata=''; 
      for(var j=0;j<json_res.length;j++){
        var lightred='';        
        var status=json_res[j].statustype;
        var comp_no=json_res[j].comp_no;
        var is_seen_byuser=json_res[j].is_seen_byuser;
        var complain = json_res[j].complain;
        var comp_adddate = json_res[j].comp_adddate;
        var is_impt = json_res[j].is_impt;
        var ref_name = json_res[j].ref_name;
        var onemonth_added_dt = json_res[j].onemonth_added_dt;
        var isclosed = json_res[j].is_closed;
        //console.log(isclosed);
        var today = new Date();
        var month = today.getMonth()+1;
        var day = today.getDate();
        if(month>=9){
          var mm = "0"+month;
        }else{
          var mm = month;
        } 

        if(day>=9){
          var dd = "0"+day;
        }else{
          var dd = day;
        }
        var date = today.getFullYear()+'-'+(mm)+'-'+dd;
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var todaydateTime = date+' '+time;
       
        
        if(status=='Assigned'){
          //var badge_color = "color-custom";
          if(todaydateTime > onemonth_added_dt){
              var badge_color = "color-red";
            }else{
              var badge_color = "color-custom";
            }
            var imp_triangle = '';
        }else if(status=='Executed'){
          var badge_color = "color-executed";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='In progress'){
          var badge_color = "color-progress";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }else if(status=='Completed'){
          var badge_color = "color-complete";
          var notseen="";
          //var imp_img='';
          var imp_triangle = '';
        }
        if(is_impt==1){
          lightred='notseen';
          var ref_by = '<em><span class="float-left fw-700 text-blue">Ref : [ '+ref_name+' ] </span></em>';
          //var imp_img = '<img src="img/important-red-stamp.png" height="28" width="28" class="ml-5p blink-image"/>';
          var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
        }else{
          lightred="";
          var ref_by = '';
          //var imp_img = '';
          var imp_triangle = '';
        }

        if(is_seen_byuser==0){
          //lightred='notseen';
          //var notseen="<i class='f7-icons fs-16 text-red'>eye_fill</i>";
          var notseen="<i class='fa fa-eye-slash fs-16 text-green'></i>";
        }else{
          var notseen="";
        }
        if(isclosed==0){ // closed //
          var lock = '<i class="fa fa-lock text-red fs-12"></i>';
        }else if(isclosed==1){ // not closed / in process //
          var lock = '<i class="fa fa-unlock-alt text-red fs-12"></i>';
        }
        comaplintdata+='<tr onclick="comp_det_page('+"'"+comp_no+"'"+')" class="'+lightred+'"><td class="label-cell"><a onclick="comp_det_page('+"'"+comp_no+"'"+')" class="float-left mt-5p fw-700">'+comp_no+' '+notseen+'</a><br/><span class="float-left w-100">'+complain+'..</span><br/><span class="fs-12 float-left w-100"><i class="fa fa-calendar mr-5p fs-12 ml-5x"></i>'+comp_adddate+'<span class="ml-5p">બંધ : '+lock+'</span></span>'+ref_by+'</td><td class="numeric-cell"><span class="badge '+badge_color+'">'+status+'<i class="f7-icons ios-only">home</i><i class="material-icons ios-only">home</i></span>'+imp_triangle+'</td></tr><br>'; 
        $('#complaints').html(comaplintdata);   
         app.preloader.hide(); 
      }
    }
  });
}
$$(document).on('page:init', '.page[data-name="complaintData"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show(); 
    
  var sess_u_id = window.localStorage.getItem("session_u_id");
  app.preloader.hide();
});
function comp_det_page(comp_no){
  //alert(comp_no);
  checkConnection();
  app.preloader.show();
  app.router.navigate("/complaintData/");
  var url=base_url+'app_controller/getComplaintData';
  var status_url = base_url+'app_controller/AllCompStatus';
  
  var sess_u_id = window.localStorage.getItem("session_u_id");
  var session_u_type = window.localStorage.getItem("session_u_type");

  $.ajax({
    'type':'POST',
    'url': url, 
    'data':{'comp_no':comp_no},
    success:function(data){
      var json = $.parseJSON(data);
      var json_res = json.complaint_data[0];
      //console.log(json_res+"*****");
      var showcomaplintdata=''; 
      var comp_id = json.complaint_data[0].comp_id;      
      var complaint_no = json.complaint_data[0].comp_no;
      var complain = json.complaint_data[0].complain;
      var d_name = json.complaint_data[0].d_name;
      var u_fullname = json.complaint_data[0].u_fullname;
      var remarks = json.complaint_data[0].remarks;      
      var add_byfname = json.complaint_data[0].add_byfname;
      var comp_adddate = json.complaint_data[0].comp_adddate;
      var last_editbyadmin_date = json.complaint_data[0].last_editbyadmin_date;
      var u_mo = json.complaint_data[0].u_mo;
      var is_impt = json.complaint_data[0].is_impt;
      var ref_name = json.complaint_data[0].ref_name;
      var onemonth_added_dt = json.complaint_data[0].onemonth_added_dt;
      var is_closed = json.complaint_data[0].is_closed;
        var today = new Date();
        var month = today.getMonth()+1;
        var day = today.getDate();
        if(month>=9){
          var mm = "0"+month;
        }else{
          var mm = month;
        } 

        if(day>=9){
          var dd = "0"+day;
        }else{
          var dd = day;
        }
        var date = today.getFullYear()+'-'+(mm)+'-'+dd;
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var todaydateTime = date+' '+time;
       
      if(is_impt==1){
        
        var refre = '<tr><td class="label-cell" id="ref_by_lbl">Reference By</td><td class="numeric-cell">'+ref_name+'</td></tr>';

      }else{
        
        var refre = '';
      }
      //alert(u_mo);

      var s_id = json.complaint_data[0].s_id;
      var is_seen_byuser = json.complaint_data[0].is_seen_byuser;

      if(sess_u_id==null){
        // ADMIN //
        var u_id = window.localStorage.getItem("session_admin_u_id");        
      }else{
        // USER //
        var u_id = json.complaint_data[0].u_id;
      }
     // alert(is_seen_byuser);
     if(session_u_type==1){
      if(is_seen_byuser==0){
        UpdateIsseen(comp_no);
      }
     }
      if(last_editbyadmin_date!=null && last_editbyadmin_date!=undefined){
        var last_editbyadmin_dt=last_editbyadmin_date;
      }else{
        var last_editbyadmin_dt='---';
      }

      var last_editbyuser_date = json.complaint_data[0].last_editbyuser_date;

      if(last_editbyuser_date!=null && last_editbyuser_date!=undefined){
        var last_editbyuser_dt=last_editbyuser_date;
      }else{
        var last_editbyuser_dt='---';
      }

      var comp_respby = json.complaint_data[0].comp_respby;
      if(comp_respby!=null && comp_respby!=undefined){
        var comp_respby_dt=comp_respby;
      }else{
        var comp_respby_dt='---';
      }

      var comp_respdatetime = json.complaint_data[0].comp_respdatetime;
      if(comp_respdatetime!=null && comp_respdatetime!=undefined){
        var comp_respdatetime_dt=comp_respdatetime;
      }else{
        var comp_respdatetime_dt='---';
      }

      var statustype = json.complaint_data[0].statustype;
      if(statustype=='Assigned'){
        //var badge_color = "color-custom";
        if(todaydateTime > onemonth_added_dt){
          var badge_color = "color-red";
        }else{
          var badge_color = "color-custom";
        }
      }else if(statustype=='Executed'){
        var badge_color = "color-executed";
      }else if(statustype=='In progress'){
        var badge_color = "color-progress";
      }else if(statustype=='Completed'){
        var badge_color = "color-complete";
      }       
      if(is_closed==0){
        var show_cls = "display-none";
        var closed_seal = '<center><img src="img/closed-seal.png" height="120" width="150" /></center>';
      }else if(is_closed==1){
        var show_cls = "display-block";
        var closed_seal = '';
      }
      showcomaplintdata='<div class="card data-table"><table><tbody><tr><td class="label-cell">Complain</td><td class="numeric-cell">'+complain+'</td></tr><tr><td class="label-cell">Department</td><td class="numeric-cell">'+d_name+'</td></tr><tr><td class="label-cell">Handled By</td><td class="numeric-cell">'+u_fullname+'</td></tr><tr><td class="label-cell">Mobile</td><td class="numeric-cell">'+u_mo+'<span class="col button color-green button-small outline-green button-outline float-right ml-5p" onclick="call_handler('+"'"+u_mo+"'"+')"><span ><i class="fa fa-phone color-green"></i></span></span></td></tr>'+refre+'<tr><td class="label-cell">Remarks</td><td class="numeric-cell">'+remarks+'</td></tr><tr><td class="label-cell">Complain Added By</td><td class="numeric-cell">'+add_byfname+'</td></tr><tr><td class="label-cell">Complain Date</td><td class="numeric-cell">'+comp_adddate+'</td></tr><tr><td class="label-cell">Admin Last Edit On</td><td class="numeric-cell">'+last_editbyadmin_dt+'</td></tr><tr><td class="label-cell">Last Edit On</td><td class="numeric-cell">'+last_editbyuser_dt+'</td></tr><tr><td class="label-cell">Response By</td><td class="numeric-cell">'+u_fullname+'</td></tr><tr><td class="label-cell">Response Date</td><td class="numeric-cell">'+comp_respdatetime_dt+'</td></tr><tr><td class="label-cell">Response Status</td><td class="numeric-cell"><span class="badge '+badge_color+'">'+statustype+'</span></td></tr></tbody></table><div class="list"><ul><form name="user_form" id="user_form" class="mb-15p"><input type="hidden" name="hidd_compid" id="hidd_compid" value="'+comp_id+'" /><input type="hidden" name="hidd_uid" id="hidd_uid" value="'+u_id+'" /><input type="hidden" name="hidd_compid" id="hidd_compid" value="'+comp_id+'" /><input type="hidden" name="hidd_compno" id="hidd_compno" value="'+complaint_no+'" /><div class="item-title item-label newlbl "></div><li class="item-content item-input show-attach display-none md-only"><div class="item-inner"><div class="item-input-wrap "><div class="list accordion-list"><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">Complain Attachments<span class="ml-5p totalattacehs"></span></div></div></a><div class="accordion-item-content"><div class="block attach_collapse" id="attach_collapse"></div></div></li></ul></div></div></div></li><li class="item-content item-input show-attach display-none ios-only mb-2"><div class="item-inner"><div class="item-input-wrap "><div class="list accordion-list"><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">Complain Attachments<span class="ml-5p totalattacehs"></span></div></div></a><div class="accordion-item-content"><div class="block attach_collapse" id="attach_collapse"></div></div></li></ul></div></div></div></li><li class="item-content item-input user-attach display-none md-only"><div class="item-inner"><div class="item-input-wrap "><div class="list accordion-list"><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">User Attachments<span class="ml-5p totaluserattacehs"></span></div></div></a><div class="accordion-item-content"><div class="block attachuser_collapse" id="attachuser_collapse"></div></div></li></ul></div></div></div></li><li class="item-content item-input user-attach display-none ios-only mb-2"><div class="item-inner"><div class="item-input-wrap "><div class="list accordion-list"><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">User Attachments<span class="ml-5p totaluserattacehs"></span></div></div></a><div class="accordion-item-content"><div class="block attachuser_collapse" id="attachuser_collapse"></div></div></li></ul></div></div></div></li><li class="item-content item-input showold-rems display-none md-only"><div class="item-inner"><div class="item-input-wrap"><div class="list accordion-list "><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">user remark<span class="ml-5p totalremsxxxx"></span></div></div></a><div class="accordion-item-content"><div class="block rem_collapse" id=" rem_collapse"></div><div class="w-100 fs-16 '+show_cls+'" id="remarkbtns"><span class="text-red float-right ml-5p mr-5p" onclick="deltLastRem('+comp_id+')"><div class="col button button-small button-round button-outline outline-dangerbtn mb-15p"><i class="fa fa-trash"></i></div></span><span class="grey-text float-right" onclick="editLastRem()"><div class="col button button-small button-round button-outline outline-orangebtn mb-15p"><i class="fa fa-pencil"></i></div></span></div></div></li></ul></div></div></div></li><li class="item-content item-input showold-rems display-none ios-only mb-2"><div class="item-inner"><div class="item-input-wrap"><div class="list accordion-list "><ul class="accr-pad display-none"><li class="accordion-item grey-border"><a href="#" class="item-content item-link light-grey"><div class="item-inner "><div class="item-title text-uppercase grey-text fs-12">user remark<span class="ml-5p totalremsxxxx"></span></div></div></a><div class="accordion-item-content"><div class="block rem_collapse" id=" rem_collapse"></div><div class="w-100 fs-16 '+show_cls+'" id="remarkbtns"><span class="text-red float-right ml-5p mr-5p" onclick="deltLastRem('+comp_id+')"><i class="fa fa-trash"></i></span><span class="grey-text float-right" onclick="editLastRem()"><i class="fa fa-pencil"></i></span></div></div></li></ul></div></div></div></li><li class="item-content item-input md-only '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><label class="md-only">Remark</label><textarea rows="10" name="user_remarks" class="grey-border w-100 p-2" id="user_remarks"></textarea></div></div></li><li class="item-content item-input mb-2 '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><label class="ios-only">Remark</label><textarea rows="10" name="user_remarks" class="grey-border w-100 p-2 ios-only" id="user_remarks"></textarea></div></div></li><li class="item-content item-input '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><select name="user_status" id="status_sel" class="grey-border fs-14 p-1"></select></div></div></li><li class="item-content item-input md-only '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><button class="col button button-small button-outline outline-orangebtn w-50" type="button" onclick="showIcons()">Upload Document</button></div></div></li><li class="item-content item-input ios-only mt-2p '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><button class="col button button-small button-outline outline-orangebtn w-50" type="button" onclick="showIcons()">Upload Document</button></div></div></li><li class="item-content item-input showtwoBlocks display-none md-only"><div class="item-inner"><div class="item-input-wrap"><div class="uploadDiv w-100 display-none"><div class="col-100"><div class="row"><div class="20"></div><div class="col-50 picbox text-white" ><span onclick="capturePhoto();" ><div class="innerDiv"><i class="f7-icons picbox-text">camera</i><br/><span class="picbox-text">Capture</span></span></div></a></div><div class="col-50 picbox text-white" ><a onclick="getPhoto(pictureSource.PHOTOLIBRARY);"><div class="innerDiv"><i class="f7-icons picbox-text">photos</i><br/><span class="picbox-text">Photo Gallery</span></div></a></div><div class="20"></div></div></div></div></div></div></li><li class="item-content item-input showtwoBlocks display-none ios-only"><div class="item-inner"><div class="item-input-wrap"><div class="uploadDiv w-35 display-none"><div class="col-100"><div class="row"><div class="20"></div><div class="col-50 picbox text-white" ><a onclick="capturePhoto();" ><div class="innerDiv"><i class="f7-icons picbox-text">camera</i><br/><span class="picbox-text">Capture</span></div></a></div><div class="col-50 picbox text-white" ><a onclick="getPhoto(pictureSource.PHOTOLIBRARY);"><div class="innerDiv"><i class="f7-icons picbox-text">photos</i><br/><span class="picbox-text">Photo Gallery</span></div></a></div><div class="20"></div></div></div></div></div></div></li><!--br><button onclick="getPhoto(pictureSource.PHOTOLIBRARY);" class="mb-15p">From Photo Library</button><br--><li class="item-content item-input imageblock"><div class="item-inner"><div class="item-input-wrap"><img id="image" src="" style="display:none;width:100%;"></div></div></li><li class="item-content item-input upldbtnDiv " style="display:none;width:100%;" id="upldbtnDiv"><div class="item-inner"><div class="item-input-wrap"><button onclick="upload();" type="button" class="col button button-fill color-gray " id="upldbtn" >Upload</button></div></div></li><li class="item-content item-input md-only '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><a href="#" class="col button button-fill orange-btn grey-text " onclick="changeCompStatus('+"'"+complaint_no+"'"+')">Save</a></li><li class="item-content item-input ios-only '+show_cls+'"><div class="item-inner"><div class="item-input-wrap"><a href="#" class="col button button-big button-fill orange-btn grey-text " onclick="changeCompStatus('+"'"+complaint_no+"'"+')">Save</a></li>'+closed_seal+'</div></div></form></ul></div></div>';     

        $.ajax({
          'type':'GET',
          'url': status_url, 
          success:function(data){
            var json = $.parseJSON(data);
            var json_status = json.all_status;
            var complaint_status = '';
            complaint_status='<option value="" >--- COMPLAINT STATUS ---</option>';
            //console.log(json_status);
            for(var j=0;j<json_status.length;j++){ 
              var selected='';              
              var s_id_tbl = json_status[j].s_id; 
              var status_name = json_status[j].statustype; 
              if(s_id == s_id_tbl){
                selected = "selected";
              }
              complaint_status+='<option value="'+s_id_tbl+'" '+selected+'>'+status_name+'</option>';
              $("#status_sel").html(complaint_status);
            }          
          }         
        });

        getLastRemarksOfUser(comp_id,sess_u_id);
        /*var rem_url = base_url+"app_controller/getallRemarksbyUser"
        $.ajax({
          'type':'POST',
          'url': rem_url,
          'data':{'comp_id':comp_id,'sess_u_id':sess_u_id}, 
          success:function(rem_data){
            var json_data = $.parseJSON(rem_data);
            var json_rem = json_data.all_remarks;
            var alluser_rems = '';          
            //console.log(json_rem);
            if(json_rem.length!=0){
              $(".showold-rems").removeClass("display-none");
              $(".showold-rems").addClass("display-block");
              $(".accr-pad").removeClass("display-none");
              $(".accr-pad").addClass("display-block");
              $(".totalrems").html("("+json_rem.length+")"); // totalremsxxxx //
              for(var j=0;j<json_rem.length;j++){ 
              var remarks_user = json_rem[j].remarks; 
              var cs_id = json_rem[j].cs_id;
              $("#hidd_csid").val(cs_id);
              //alluser_rems+='<p>'+(j+1)+'. '+remarks_user+'</p>'; // OLD //
              alluser_rems+='<p class="remarknoteditable">'+remarks_user+'</p><input type="text" name="editablelastrem" id="editablelastrem" class="display-none" value="'+remarks_user+'"><button class="col button button-small button-fill color-black display-none" onclick="saveEditedRem()" id="remsvbtn" type="button">Save</button>';
              $(".rem_collapse").html(alluser_rems);
              }    
            }      
          }         
        });*/

        var attach_url = base_url+"app_controller/getallAttachmentsbyComp"
        $.ajax({
          'type':'POST',
          'url': attach_url,
          'data':{'comp_id':comp_id}, 
          success:function(att_data){
            var json_att = $.parseJSON(att_data);
            var json_attach = json_att.allCompAttached;
            //console.log(json_attach);
            var allcomp_attached = '';  
            if(json_attach.length!=0){
              $(".show-attach").removeClass("display-none");
              $(".show-attach").addClass("display-block");
              $(".accr-pad").removeClass("display-none");
              $(".accr-pad").addClass("display-block");
              $(".totalattacehs").html("("+json_attach.length+")");                    
            
              for(var j=0;j<json_attach.length;j++){ 
                var c_attach_id = json_attach[j].c_attach_id; 
                var file_path = json_attach[j].file_path;
                var file_type = json_attach[j].file_type;
                var file_name = json_attach[j].file_name;
                var full_path = base_url+file_path;
                allcomp_attached+='<p><a onclick="downloaddoc('+"'"+full_path+"'"+','+"'"+file_name+"'"+')" class="open-progress">'+(j+1)+'. '+file_name+'</a></p>';

                //allcomp_attached+='<p><a  onclick="downloadFile('+"'"+full_path+"'"+','+"'"+file_name+"'"+')">'+(j+1)+'. '+file_name+'</a></p>';

              // allcomp_attached+='<p><a  onclick="storeIntelligrapeLogo('+"'"+full_path+"'"+','+"'"+file_name+"'"+')">'+(j+1)+'. '+file_name+'</a></p>';

             // allcomp_attached+='<p><a onclick="downloadme('+"'"+full_path+"'"+','+"'"+file_name+"'"+')">'+(j+1)+'. '+file_name+'</a></p>';
               

                $(".attach_collapse").html(allcomp_attached);             
              }    
            }      
          }       
        });

        var user_attaches = base_url+"app_controller/getAllUserAttaches";
        $.ajax({
          'type':'POST',
          'url': user_attaches,
          'data':{'comp_id':comp_id}, 
          success:function(useratt_data){
            var user_json_att = $.parseJSON(useratt_data);
            var user_json_attach = user_json_att.allUserAttached;
            //console.log(user_json_attach);
            var alluser_attached = '';  
            if(user_json_attach.length!=0){ 
              $(".user-attach").removeClass("display-none");
              $(".user-attach").addClass("display-block");
              $(".accr-pad").removeClass("display-none");
              $(".accr-pad").addClass("display-block");
              $(".totaluserattacehs").html("("+user_json_attach.length+")");                    
            
              for(var j=0;j<user_json_attach.length;j++){ 
                var c_attach_id = user_json_attach[j].attach_id; 
                var u_attfile_path = user_json_attach[j].att_file_path;
                var u_attfile_type = user_json_attach[j].att_file_type;
                var u_attfile_name = user_json_attach[j].att_file_name;
                var u_attfull_path = base_url+u_attfile_path;
                //alluser_attached+='<p><a href="'+u_attfull_path+'">'+(j+1)+'. '+u_attfile_name+'</a></p>';
                alluser_attached+='<p><a onclick="downloaddoc('+"'"+u_attfull_path+"'"+','+"'"+u_attfile_name+"'"+')">'+(j+1)+'. '+u_attfile_name+'</a></p>';
                $(".attachuser_collapse").html(alluser_attached);              
              }    
            }      
          }        
        });
        //alert(is_impt);
        if(is_impt==1){
          $("#imp_img").removeClass("display-none");
          $("#imp_img").html('<img src="img/important-red-stamp.png" height="35" width="40" class="m-t-20p">'); 
        }
        $("#comp_no").html(complaint_no);
        $("#complaint_detail").html(showcomaplintdata);
        app.preloader.hide(); 
    }
  });
}
/*function downloadme(fullpath,filename){
alert("in downloadme");
cordova.plugins.DownloadManager.download(fullpath, downloadsuccess, downloadfail);
}

var downloadfail = function (message) {    
   alert(message)
}
var downloadsuccess = function (data) {
       alert("succes");
}*/

function call_handler(u_mo){
  //alert("clicked");
  window.plugins.CallNumber.callNumber(onSuccess, onError, u_mo, true);
}
function onSuccess(result){
  console.log("Success:"+result);
} 
function onError(result) {
  console.log("Error:"+result);
}
function getLastRemarksOfUser(comp_id,sess_u_id){
  var rem_url = base_url+"app_controller/getallRemarksbyUser"
        $.ajax({
          'type':'POST',
          'url': rem_url,
          'data':{'comp_id':comp_id,'sess_u_id':sess_u_id}, 
          success:function(rem_data){
            var json_data = $.parseJSON(rem_data);
            var json_rem = json_data.all_remarks;
            var alluser_rems = '';          
            //console.log(json_rem);
            //alert("json_rem.length---"+json_rem.length);  
            if(json_rem.length!=0){
              $(".showold-rems").removeClass("display-none");
              $(".showold-rems").addClass("display-block");
              $(".accr-pad").removeClass("display-none");
              $(".accr-pad").addClass("display-block");
              $(".totalrems").html("("+json_rem.length+")"); // totalremsxxxx //
              for(var j=0;j<json_rem.length;j++){ 
              var remarks_user = json_rem[j].remarks; 
              var cs_id = json_rem[j].cs_id;
              //alert(cs_id);
              //$("#hidd_csid").val(cs_id);
              //alluser_rems+='<p>'+(j+1)+'. '+remarks_user+'</p>'; // OLD //
              /*<input type="text" name="editablelastrem" id="editablelastrem" class="display-none" value="'+remarks_user+'>

              <textarea name="editablelastrem" id="editablelastrem" class="display-none">'+remarks_user+'</textarea>
              */
              alluser_rems+='<p class="remarknoteditable">'+remarks_user+'</p><input type="hidden" name="hidd_csid" id="hidd_csid" value="'+cs_id+'"/><input type="hidden" name="old_rem" id="old_rem" value="'+remarks_user+'" /><textarea name="editablelastrem" id="editablelastrem" class="display-none">'+remarks_user+'</textarea><button class="col button button-small button-fill color-black display-none" onclick="saveEditedRem('+comp_id+')" id="remsvbtn" type="button">Save</button>';

              //$(".rem_collapse").html(alluser_rems);
              }    
            }else{
              $("#remarkbtns").addClass("display-none");
              alluser_rems+='<p>No Remark.</p>';
            } 
            $(".rem_collapse").html(alluser_rems);     
          }         
        });
}
function deltLastRem(comp_id){ 
  var hidd_csid = $("#hidd_csid").val();
  var sess_u_id = window.localStorage.getItem("session_u_id");
  if(sess_u_id==null){
    // ADMIN //
    sess_u_id = window.localStorage.getItem("session_admin_u_id");        
  }else{
    // USER //
    sess_u_id = sess_u_id;
  }
  //alert(hidd_csid);
  var dltRemurl = base_url+"app_controller/DltLastRem";
  app.dialog.confirm('Do you want to delete this remark?', function () {
    $.ajax({
      'type':'POST',
      'url': dltRemurl, 
      'data':{'cs_id':hidd_csid,'sess_u_id':sess_u_id}, 
      success:function(dlt_data){
        //alert(dlt_data);
        if(dlt_data=='dltupdated'){          
          app.dialog.alert('Remark Deleted!');
          getLastRemarksOfUser(comp_id,sess_u_id);
        }
      }
    });    
  });
}
function editLastRem(){
  var hidd_csid = $("#hidd_csid").val();
  $(".remarknoteditable").addClass("display-none");
  $("#remarkbtns").addClass("display-none");
  $("#editablelastrem").removeClass("display-none");
  $("#editablelastrem").addClass("display-block");
  $("#editablelastrem").focus(); 
  $("#remsvbtn").removeClass("display-none");
  $("#remsvbtn").addClass("display-block"); 
}
function saveEditedRem(comp_id){
  //app.preloader.show();
  var hidd_csid = $("#hidd_csid").val();
  var hidd_compid = $("#hidd_compid").val();
  var editablelastrem = $("#editablelastrem").val();
  var old_rem = $("#old_rem").val();
  //alert(editablelastrem);
  var sess_u_id = window.localStorage.getItem("session_u_id");
  if(sess_u_id==null){
    // ADMIN //
        sess_u_id = window.localStorage.getItem("session_admin_u_id");        
  }else{
        // USER //
        sess_u_id = sess_u_id;
  }

  // alert(hidd_csid);
  var editRemurl = base_url+"app_controller/EditLastRem";  
  $.ajax({
    'type':'POST',
    'url': editRemurl, 
    'data':{'cs_id':hidd_csid,'sess_u_id':sess_u_id,'remarks':editablelastrem,'hidd_compid':hidd_compid,'old_rem':old_rem}, 
    success:function(edit_data){
      //alert(edit_data);
      if(edit_data=='lastremupdated'){
        app.dialog.alert('Remark Saved!'); 
        $(".remarknoteditable").removeClass("display-none");
        $("#remarkbtns").removeClass("display-none");
        getLastRemarksOfUser(comp_id,sess_u_id);           
      }
    }
  });
}
function UpdateIsseen(comp_no){
  var seen_updturl = base_url+'app_controller/updateSeen';
  $.ajax({
    'type':'POST',
    'url': seen_updturl, 
    'data':{'comp_no':comp_no},
    success:function(seen_data){
    //alert(seen_data);             
    }
  });
}
function showIcons(){
  $(".showtwoBlocks").removeClass("display-none");
  $(".showtwoBlocks").addClass("display-block");
  $(".uploadDiv").removeClass("display-none");
  $(".uploadDiv").addClass("display-block");
}
function showUploadbtn(){
  alert("inshowUploadbtn");
  $(".upldbtnDiv").removeClass("display-none");
  $(".upldbtnDiv").addClass("display-block");
  $("#upldbtn").removeClass("display-none");
  $("#upldbtn").addClass("display-block"); 
}
function downloaddoc(fullpath,folder_path){
  //alert(device.platform);
  if(device.platform == "Android"){
    var assetURL = fullpath;
    var store = cordova.file.externalRootDirectory+"Download/"; // output in android: file:///storage/emulated/0/
    //var store = cordova.file.dataDirectory; // or //var store = "cdvfile://localhost/persistent/";
    var fileName = folder_path;
    var fileTransfer = new FileTransfer();
    fileTransfer.download(assetURL, store + fileName, 
      function(entry) {
          console.log("Success!");
          //alert("Success!");
          //alert(entry.fullPath);
          //alert("download toURL: " + entry.toURL());
      }, 
      function(err) {
          console.log("Error");
          console.dir(err);
         // alert("Some error");
         // alert(err);
      });

      /*fileTransfer.onprogress = function(result){
        var percent =  result.loaded / result.total * 100;
        percent = Math.round(percent);
        console.log('Downloaded:  ' + percent + '%');    
        //alert('Downloaded:  ' + percent + '%');
        app.dialog.alert('<div class="progressbar" data-progress="'+percent+'"> %<span></span></div> Downloaded:  ' + percent + '%');
      }*/
      var percent = 0;
      var dialog = app.dialog.progress('Downloading...', percent);      
      fileTransfer.onprogress = function(result){
        var percent =  result.loaded / result.total * 100;
        percent = Math.round(percent);
        dialog.setText('Downloaded : '+percent+' %');
        dialog.setProgress(percent);
        //alert(percent);
        if (percent == 100) {
          //clearInterval(interval);
          //app.dialog.close();
          dialog.close();
          app.dialog.alert("Download Completed.");
        }
      }
    }else if(device.platform == 'iOS'){
    //  alert("in iOS");
      var fileName = folder_path;
     // alert(fileName);
      window.requestFileSystem(  
        LocalFileSystem.PERSISTENT, 0,  
        function onFileSystemSuccess(fileSystem) {  
        //fileSystem.root.getFile(  
                 //   "dummy.html", {create: true, exclusive: false},  
          function gotFileEntry(fileEntry){  
                    var sPath = fileEntry.fullPath; 
                    //var sPath = fileEntry.fullPath.replace("dummy.html","");  
                    var fileTransfer = new FileTransfer();  
                    //fileEntry.remove();  
                    fileTransfer.download(  
                     fullpath,  
                     sPath + fileName,  
                     function(theFile) {  
                      alert("download complete: " + theFile.toURI()); 

                     },  
                     function(error) {  
                      alert("download error source " + error.source);  
                      alert("download error target " + error.target);  
                      alert("upload error code: " + error.code);  
                     }  
                     ); 
                     
                    //},fail);  
        } 
        var percent = 0;
          var dialog = app.dialog.progress('Downloading...', percent);      
          fileTransfer.onprogress = function(result){
            var percent =  result.loaded / result.total * 100;
            percent = Math.round(percent);
            dialog.setText('Downloaded : '+percent+' %');
            dialog.setProgress(percent);
            if (percent == 100) {
              dialog.close();
              app.dialog.alert("Download Completed.");
            }
          }  
      });
    }
}
function changeCompStatus(complaint_no){
  //alert(complaint_no);
  var hidd_compid = $("#hidd_compid").val();
  var hidd_uid = $("#hidd_uid").val();
  //alert("hidd_uid"+hidd_uid);
  var user_remarks = $("#user_remarks").val();
  var status_sel = $("#status_sel").val();
  var url = base_url+"app_controller/addUserRemark";
  //alert(hidd_compid+"---"+hidd_uid+"---"+user_remarks+"---"+status_sel);
  $.ajax({
    'type':'POST',
    'url': url, 
    'data':{'hidd_compid':hidd_compid,'hidd_uid':hidd_uid,'user_remarks':user_remarks,'status_sel':status_sel},

    success:function(data){ 
      if(data=='success'){
        app.dialog.alert("Complain updated successfully");
        app.router.navigate("/complaints/");
      }
    }
  });
}
// **************************************************************************************************** //

// ----------------------------------------- D A S H B O A R D -------------------------------------- //
$$(document).on('page:init', '.page[data-name="comp_rep"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show(); 
  
  $(".popover-on-bottom").css("display","none");
  $(".popover-backdrop").removeClass("backdrop-in");

  var sess_u_id = window.localStorage.getItem("session_u_id");
  var rep_inputs='';
  rep_inputs='<tr><td class="label-cell w-100"><select name="searchstatus" class="input-with-value" id="status_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="dept" class="input-with-value" id="dept_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="deptperson" class="input-with-value" id="user_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="compno" class="input-with-value" id="comp_no"></select></td></tr><tr><td class="label-cell w-100"><input name="user_mo" type="number" id="user_mo" placeholder="MOBILE" class=""></td></tr><tr><td class="label-cell w-100"><input type="text" placeholder="FROM" readonly="readonly" id="demo-calendar-modal" name="fromdt"></td></tr><tr><td class="label-cell w-100"><input type="text" placeholder="TO" readonly="readonly" id="demo-calendar-modal1" name="todt"></td></tr><tr><td><label class="checkbox"><input type="checkbox" name="checkbox2" id="checkbox2"><i class="icon-checkbox"></i></label> Important</td></tr><tr><td class=""><a href="#" onclick="search_comp();" class="col button button-big button-fill orange-btn grey-text mb-2 float-right mt-5p" >SEARCH</a></td></tr>';   
 

  //rep_inputs='<div class="block-title">Open in Mondal</div><div class="list no-hairlines-md"><ul><li><div class="item-content item-input"><div class="item-inner"><div class="item-input-wrap"><input type="text" placeholder="Select date" readonly="readonly" id="demo-calendar-modal"/></div></div></div></li></ul></div>';
    
     
    var status_url = base_url+'app_controller/AllCompStatus';
    $.ajax({
      'type':'POST', 
      'url':status_url,      
      success:function(data){ 
        app.preloader.show(); 
        var json = $.parseJSON(data);
        var json_status = json.all_status;
        var complaint_status = '';
        complaint_status='<option value="" >--- COMPLAINT STATUS ---</option>';
        //console.log(json_status);
        for(var j=0;j<json_status.length;j++){ 
          var selected='';              
          var s_id_tbl = json_status[j].s_id; 
          var status_name = json_status[j].statustype; 
          complaint_status+='<option value="'+s_id_tbl+'" '+selected+'>'+status_name+'</option>';
          $("#status_sel").html(complaint_status);
          app.preloader.hide();  
        }          
      }       
    });
    

    
    var dept_url = base_url+'app_controller/AllDept';
    $.ajax({
      'type':'POST', 
      'url':dept_url,      
      success:function(data){ 
        app.preloader.show(); 
        var dept_json = $.parseJSON(data);
        var json_dept = dept_json.all_dept;
        var dept_nm = '';
        dept_nm='<option value="" >--- DEPARTMENT ---</option>';
        //console.log(json_status);
        for(var j=0;j<json_dept.length;j++){ 
          var selected='';              
          var d_id = json_dept[j].d_id; 
          var d_name = json_dept[j].d_name; 
          dept_nm+='<option value="'+d_id+'">'+d_name+'</option>';
          $("#dept_sel").html(dept_nm);
          app.preloader.hide(); 
        }          
      }       
    }); 
    

    
    var user_url = base_url+'app_controller/AllUsers';
    $.ajax({
      'type':'POST', 
      'url':user_url,      
      success:function(data){
        app.preloader.show(); 
        var user_url_json = $.parseJSON(data);
        var json_user = user_url_json.all_users;
        var user_nm = '';
        user_nm='<option value="">----- USER -----</option>';
        //console.log(json_status);
        for(var j=0;j<json_user.length;j++){ 
          var selected='';              
          var u_id = json_user[j].u_id; 
          var u_name = json_user[j].u_fullname; 
          user_nm+='<option value="'+u_id+'">'+u_name+'</option>';
          $("#user_sel").html(user_nm);
          app.preloader.hide(); 
        }          
      }       
    });
    

    
    var comp_url = base_url+'app_controller/AllNotDltedComps';
    $.ajax({
      'type':'POST', 
      'url':comp_url,      
      success:function(data){ 
        app.preloader.show(); 
        var comp_url_json = $.parseJSON(data);
        var json_comp = comp_url_json.all_notdltcomps;
        var comps = '';
        comps='<option value="">----- COMPLAIN NO -----</option>';
        //console.log(json_status);
        for(var j=0;j<json_comp.length;j++){ 
          var selected='';              
          var comp_id = json_comp[j].comp_id; 
          var comp_no = json_comp[j].comp_no; 
          comps+='<option value="'+comp_id+'">'+comp_no+'</option>';
          $("#comp_no").html(comps);
          app.preloader.hide(); 
        }          
      }       
    });
    

    
  $("#comprep_inputs").html(rep_inputs);
  app.preloader.hide(); 
}); 

function search_comp(){
  $(".popover-on-bottom").css("display","none");
  $(".popover-backdrop").removeClass("backdrop-in");
  app.router.navigate("/complain_rep_grid/");

  var sess_u_id = window.localStorage.getItem("session_u_id");
  var status_sel = $("#status_sel").val();
  var dept_sel = $("#dept_sel").val();
  var user_sel = $("#user_sel").val();
  var comp_no = $("#comp_no").val();
  var user_mo = $("#user_mo").val();
  var fromdt = $("#demo-calendar-modal").val();
  var todt = $("#demo-calendar-modal1").val();
  if ($('#checkbox2').is(":checked")){
      var isimpt = 1;
  }else{
      var isimpt = 0;
  }
  app.preloader.show(); 
  var comp_rep = base_url+"app_controller/searchComp";
  $.ajax({
    'type':'POST', 
    'url':comp_rep,      
    'data':{'searchstatus':status_sel,'dept':dept_sel,'deptperson':user_sel,'compno':comp_no,'user_mo':user_mo,'fromdt':fromdt,'todt':todt,'isimpt':isimpt},
    success:function(data){      
      var comp_json = $.parseJSON(data);
      var json_comp = comp_json.compdata;
      var comps_rep = '';      
      console.log(json_comp);
      if(json_comp.length!=0){
        $(".total_rep").html(json_comp.length);
        for(var j=0;j<json_comp.length;j++){                     
          var comp_id = json_comp[j].comp_id; 
          var comp_no = json_comp[j].comp_no; 
          var comp_adddate = json_comp[j].comp_dt;
          var complain = json_comp[j].complain;
          var is_impt = json_comp[j].is_impt;
          var is_seen_byuser = json_comp[j].is_seen_byuser;
          var statustype = json_comp[j].statustype;
          var u_fullname = json_comp[j].u_fullname;
          var u_mo = json_comp[j].u_mo;

          if(statustype=='Assigned'){
            var badge_color = "color-custom";
          }else if(statustype=='Executed'){
            var badge_color = "color-executed";
          }else if(statustype=='In progress'){
            var badge_color = "color-progress";
          }else if(statustype=='Completed'){
            var badge_color = "color-complete";
          }

          if(is_impt==1){            
            lightred='notseen';
            var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
          }else{            
            lightred='';
            var imp_triangle = '';
          }       

          if(is_seen_byuser==1) {
            var seen = 'હા';
          }else{
            var seen = 'ના';
          }     
          comps_rep+='<div class="card '+lightred+'" ><li><a href="#" onclick="comp_det_page('+"'"+comp_no+"'"+')" class="item-link item-content"><div class="item-inner"><div class="item-title"><div class="item-header text-blue fw-700">'+comp_no+'</div>ફરિયાદ બાબત : '+complain+'<div class="item-footer">વિભાગ વ્યક્તિ : '+u_fullname+'</div><div class="item-footer">વિભાગ સંપર્ક નં : '+u_mo+'</div><div class="badge '+badge_color+'">'+statustype+'</div><span class="ml-5p">જોયેલ : '+seen+'</span></div><div class="item-after">'+comp_adddate+'</div></div></a>'+imp_triangle+'</li></div>';           
        }          
      }else{
        comps_rep+='<div class="card p-2">No Data Available.</div>';
      }    
      $(".comp_rep").html(comps_rep); 
      app.preloader.hide();  
      } 
  });
}




$$(document).on('page:init', '.page[data-name="comp_mon_rep"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show();
   
  $(".popover-on-bottom").css("display","none");
  $(".popover-backdrop").removeClass("backdrop-in");

  var sess_u_id = window.localStorage.getItem("session_u_id");
  var mon_rep_inputs='';
  mon_rep_inputs='<tr><td class="label-cell w-100"><select name="searchstatus" class="input-with-value" id="status_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="dept" class="input-with-value" id="dept_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="deptperson" class="input-with-value" id="user_sel"></select></td></tr><tr><td class="label-cell w-100"><select name="compno" class="input-with-value" id="comp_no"></select></td></tr><tr><td class="label-cell w-100"><input name="user_mo" type="number" id="user_mo" placeholder="MOBILE" class=""></td></tr><tr><td class="label-cell w-100"><input type="text" placeholder="SELECT MONTH" readonly="readonly" id="demo-calendar-modal2" name="mnth"></td></tr><tr><td><label class="checkbox"><input type="checkbox" name="checkbox2" id="checkbox2"><i class="icon-checkbox"></i></label> Important</td></tr><tr><td class=""><a href="#" onclick="search_comp_month();" class="col button button-big button-fill orange-btn grey-text mb-2 float-right mt-5p" >SEARCH</a></td></tr>';   
 

  //rep_inputs='<div class="block-title">Open in Mondal</div><div class="list no-hairlines-md"><ul><li><div class="item-content item-input"><div class="item-inner"><div class="item-input-wrap"><input type="text" placeholder="Select date" readonly="readonly" id="demo-calendar-modal"/></div></div></div></li></ul></div>';
    
     
    var status_url = base_url+'app_controller/AllCompStatus';
    $.ajax({
      'type':'POST', 
      'url':status_url,      
      success:function(data){ 
        app.preloader.show(); 
        var json = $.parseJSON(data);
        var json_status = json.all_status;
        var complaint_status = '';
        complaint_status='<option value="" >--- COMPLAINT STATUS ---</option>';
        //console.log(json_status);
        for(var j=0;j<json_status.length;j++){ 
          var selected='';              
          var s_id_tbl = json_status[j].s_id; 
          var status_name = json_status[j].statustype; 
          complaint_status+='<option value="'+s_id_tbl+'" '+selected+'>'+status_name+'</option>';
          $("#status_sel").html(complaint_status);
          app.preloader.hide();  
        }          
      }       
    });
    

    
    var dept_url = base_url+'app_controller/AllDept';
    $.ajax({
      'type':'POST', 
      'url':dept_url,      
      success:function(data){ 
        app.preloader.show(); 
        var dept_json = $.parseJSON(data);
        var json_dept = dept_json.all_dept;
        var dept_nm = '';
        dept_nm='<option value="" >--- DEPARTMENT ---</option>';
        //console.log(json_status);
        for(var j=0;j<json_dept.length;j++){ 
          var selected='';              
          var d_id = json_dept[j].d_id; 
          var d_name = json_dept[j].d_name; 
          dept_nm+='<option value="'+d_id+'">'+d_name+'</option>';
          $("#dept_sel").html(dept_nm);
          app.preloader.hide(); 
        }          
      }       
    }); 
    

    
    var user_url = base_url+'app_controller/AllUsers';
    $.ajax({
      'type':'POST', 
      'url':user_url,      
      success:function(data){
        app.preloader.show(); 
        var user_url_json = $.parseJSON(data);
        var json_user = user_url_json.all_users;
        var user_nm = '';
        user_nm='<option value="">----- USER -----</option>';
        //console.log(json_status);
        for(var j=0;j<json_user.length;j++){ 
          var selected='';              
          var u_id = json_user[j].u_id; 
          var u_name = json_user[j].u_fullname; 
          user_nm+='<option value="'+u_id+'">'+u_name+'</option>';
          $("#user_sel").html(user_nm);
          app.preloader.hide(); 
        }          
      }       
    });
    

    
    var comp_url = base_url+'app_controller/AllNotDltedComps';
    $.ajax({
      'type':'POST', 
      'url':comp_url,      
      success:function(data){ 
        app.preloader.show(); 
        var comp_url_json = $.parseJSON(data);
        var json_comp = comp_url_json.all_notdltcomps;
        var comps = '';
        comps='<option value="">----- COMPLAIN NO -----</option>';
        //console.log(json_status);
        for(var j=0;j<json_comp.length;j++){ 
          var selected='';              
          var comp_id = json_comp[j].comp_id; 
          var comp_no = json_comp[j].comp_no; 
          comps+='<option value="'+comp_id+'">'+comp_no+'</option>';
          $("#comp_no").html(comps);
          app.preloader.hide(); 
        }          
      }       
    });    
  $("#compmonrep_inputs").html(mon_rep_inputs);
  app.preloader.hide(); 
});
$$(document).on('page:init', '.page[data-name="complain_rep_grid"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show(); 
    
  var sess_u_id = window.localStorage.getItem("session_u_id");
  app.preloader.hide();
});
$$(document).on('page:init', '.page[data-name="complainmon_rep_grid"]', function (e) {
  checkConnection();
  chkStatusAndPwd();
  app.preloader.show(); 
    
  var sess_u_id = window.localStorage.getItem("session_u_id");
  app.preloader.hide();
}); 
function search_comp_month(){
  $(".popover-on-bottom").css("display","none");
  $(".popover-backdrop").removeClass("backdrop-in");
  app.router.navigate("/complainmon_rep_grid/");

  var sess_u_id = window.localStorage.getItem("session_u_id");
  var status_sel = $("#status_sel").val();
  var dept_sel = $("#dept_sel").val();
  var user_sel = $("#user_sel").val();
  var comp_no = $("#comp_no").val();
  var user_mo = $("#user_mo").val();
  var mnth = $("#demo-calendar-modal2").val();
  
  if ($('#checkbox2').is(":checked")){
      var isimpt = 1;
  }else{
      var isimpt = 0;
  }
  app.preloader.show(); 
  var comp_rep = base_url+"app_controller/searchCompMonth";
  $.ajax({
    'type':'POST', 
    'url':comp_rep,      
    'data':{'searchstatus':status_sel,'dept':dept_sel,'deptperson':user_sel,'compno':comp_no,'user_mo':user_mo,'mnth':mnth,'isimpt':isimpt},
    success:function(data){      
      var compmonth_json = $.parseJSON(data);
      var jsonmonth_comp = compmonth_json.compmonthdata;
      var compsmonth_rep = '';      
      console.log(jsonmonth_comp);
      if(jsonmonth_comp.length!=0){
        $(".total_rep").html(jsonmonth_comp.length);
        for(var j=0;j<jsonmonth_comp.length;j++){                     
          var comp_id = jsonmonth_comp[j].comp_id; 
          var comp_no = jsonmonth_comp[j].comp_no; 
          var comp_adddate = jsonmonth_comp[j].comp_dt;
          var complain = jsonmonth_comp[j].complain;
          var is_impt = jsonmonth_comp[j].is_impt;
          var is_seen_byuser = jsonmonth_comp[j].is_seen_byuser;
          var statustype = jsonmonth_comp[j].statustype;
          var u_fullname = jsonmonth_comp[j].u_fullname;
          var u_mo = jsonmonth_comp[j].u_mo;

          if(statustype=='Assigned'){
            var badge_color = "color-custom";
          }else if(statustype=='Executed'){
            var badge_color = "color-executed";
          }else if(statustype=='In progress'){
            var badge_color = "color-progress";
          }else if(statustype=='Completed'){
            var badge_color = "color-complete";
          }

          if(is_impt==1){            
            lightred='notseen';
            var imp_triangle = '<div id="triangle-topleft"><span class="impfont fw-700">IMP</span></div>';
          }else{            
            lightred='';
            var imp_triangle = '';
          }       

          if(is_seen_byuser==1) {
            var seen = 'હા';
          }else{
            var seen = 'ના';
          }     
          compsmonth_rep+='<div class="card '+lightred+'" ><li><a href="#" onclick="comp_det_page('+"'"+comp_no+"'"+')" class="item-link item-content"><div class="item-inner"><div class="item-title"><div class="item-header text-blue fw-700">'+comp_no+'</div>ફરિયાદ બાબત : '+complain+'<div class="item-footer">વિભાગ વ્યક્તિ : '+u_fullname+'</div><div class="item-footer">વિભાગ સંપર્ક નં : '+u_mo+'</div><div class="badge '+badge_color+'">'+statustype+'</div><span class="ml-5p">જોયેલ : '+seen+'</span></div><div class="item-after">'+comp_adddate+'</div></div></a>'+imp_triangle+'</li></div>';           
        }          
      }else{
        compsmonth_rep+='<div class="card p-2">No Data Available.</div>';
      }    
      $(".compmon_rep").html(compsmonth_rep); 
      app.preloader.hide();  
      } 
  });
}
$$(document).on('page:init', '.page[data-name="change_pwd"]', function (e) {
  checkConnection(); 
  chkStatusAndPwd();
  app.preloader.show();
  var session_unm = window.localStorage.getItem("session_unm"); 
  var sess_u_id = window.localStorage.getItem("session_u_id"); 
  if(sess_u_id==null){
    var sess_u_id = window.localStorage.getItem("session_admin_u_id");  
  }else{
    var sess_u_id = window.localStorage.getItem("session_u_id");
  }  
  $("#hidden_uid").val(sess_u_id);
  $("#u_name").html('<span>Username : '+session_unm+'</span>');
  app.preloader.hide();   
  $("#retype_pwd").keyup(validate);  
});
function validate() {
  var password1 = $("#new_pwd").val();
  var password2 = $("#retype_pwd").val();
  if(password1 == password2) {
    $("#success-badge").removeClass("display-none");
    $(".unmatch-text").css("display",'none');
    $(".match-text").css("display",'block');
    $(".match-text").text("Passwords match.");        
  }
  else{
    $("#warning-badge").removeClass("display-none");
    $(".match-text").css("display",'none');
    $(".unmatch-text").css("display",'block');
    $(".unmatch-text").text("Passwords do not match!");  
  }    
}
function changePass(){
  //alert("in changePass");
  var changePwdForm = $(".changePwdForm").serialize();
  var sess_city=window.localStorage.getItem("session_city");
  var url=base_url+'app_controller/changePassWord';
  $.ajax({
        'type':'POST', 
        'url':url,
        'data':changePwdForm,
        success:function(response){  
          var res=response.trim();
          if(res){
            if(res == 'updated'){
              app.dialog.alert("Password changed successfully."); 
            }else if(res == 'wrongoldpwd'){
              app.dialog.alert("Entered OldPassword is incorrect.");
            }
          }
        }
  }); 
  $("#old_pwd").val('');
  $("#new_pwd").val('');
  $("#retype_pwd").val('');
  $(".match-text").css("display",'none');
  $(".unmatch-text").css("display",'none');
  $("#warning-badge").addClass("display-none");
  $("#success-badge").addClass("display-none");
}
// --------------------------------------------- L O G O U T ------------------------------------------ //
function logOut(){
  checkConnection();
  $(".popover-backdrop.backdrop-in").css("visibility","hidden");
  $(".popover.modal-in").css("display","none");
  //$(".admin-menu").css("display","none");
  //$(".user-menu").css("display","none"); 
  window.localStorage.removeItem("session_u_fullname"); 
  window.localStorage.removeItem("session_u_id"); 
  window.localStorage.removeItem("session_u_mo"); 
  window.localStorage.removeItem("session_u_name");
  window.localStorage.removeItem("session_u_pwd");
  window.localStorage.removeItem("session_u_type");
  window.localStorage.removeItem("session_u_status");
  window.localStorage.removeItem("session_admin_u_id"); 
  window.localStorage.removeItem("dashboard_clicked_stid");
  window.localStorage.removeItem("dashboard_clicked_sttype");
  window.localStorage.removeItem("session_unm");
  //$(".panelleft").removeClass("panel-active");
  //$(".panel").css("display","none");
  //$(".panel-backdrop").css("display","none");    
  app.router.navigate('/');
  app.panel.close();
  app.panel.destroy();
  
}
// ******************************************************************************************************* //
