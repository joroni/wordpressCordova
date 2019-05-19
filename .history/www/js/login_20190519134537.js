var loginCredentials = { username : "", password : "" }
$base_url = "http://178.128.63.151/bnext2";

function setupPageLogin(){ 
    nonceGet();
    $('#login-button').on('click', function(){
        if($('#username').val().length > 0 && $('#password').val().length > 0){
            loginCredentials.username = $('#username').val();
            loginCredentials.password = $('#password').val();
            var outputJSON = JSON.stringify(loginCredentials);
            console.log(outputJSON);
            loginAuth.login({action : 'login', outputJSON : outputJSON});
            localStorage.setItem('loginAuth',outputJSON );
        } else {
            alert('all fields are required');
        }
    });    
}


function nonceGet(){
      $.ajax({ 
        type: 'GET', 
        url: $base_url+'/api/get_nonce/?controller=user&method=generate_auth_cookie', 
        data: { get_param: 'value' }, 
        complete: function (data) { 
            var names = data.responseText;
            //localStorage.setItem('nonce', names);
            var str1 = names;
            var str2 = "filtering";
            var str3 = str1.replace(str2,"");
            var nonce = JSON.parse(str3)
            console.log('nonce:', nonce);
            
           /*  if(nonce.status == "ok"  &&  userAuth !== ""){
                $.mobile.changePage( "#index", { transition: "slide"} );
            }else{
                $.mobile.changePage( "#login", { transition: "slide"} );
                
            } */
        }
    });
  
}



function setupPageHome(){ 
    var userAuth = localStorage.getItem("auth");
    var loginAuth = JSON.parse(localStorage.getItem('loginAuth'));
    if(loginCredentials.username.length == 0 && loginAuth.username == "" && loginAuth.password == ""){
        $.mobile.changePage( "#login", { transition: "slide"} );
    }
    $(this).find('[data-role="header"] h3').append('hi ' + loginAuth.username);
}



$('.logout').on('click', function(){
    localStorage.removeItem("auth");
    
        $.mobile.changePage( "#login", { transition: "slide"} );
    
}




//var username = $("#username").val();
//var password = $("#password").val();

var loginAuth = {
    login:function(loginData){
        $.ajax({url: $base_url+'/api/user/generate_auth_cookie/?username='+loginCredentials.username+'&password='+loginCredentials.password+'&insecure=cool',
            data: loginData,
            async: true,
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function(loginData) {
                $.mobile.loading('hide');
                
                console.log(loginData.responseText); 
                var str1 = loginData.responseText;
                var str2 = "filtering"
                var str3 = str1.replace(str2,"");
                localStorage.setItem("auth",str3);
           
                var lol2 = localStorage.getItem("auth");
                var lol3 = JSON.parse(lol2);
                console.log(lol3);
                if(lol3.status == "error"){
                    alert('Login failed. Please try again!');
                }else{
                    $.mobile.changePage( "#index", { transition: "slide"} );
                }
            },
           
           /*  success: function (loginData) {      
                if(result == "ok") {
                    $.mobile.changePage( "#index", { transition: "slide"} );
                } else {
                    alert('Login failed. Please try again!');
                }
                
            } */
           // error: function (request,error) {
                //alert('system or network error. Please try again!');
           // }
        });

        console.log(loginData);
    }
}    

$(document).on('pagecreate', '#login', setupPageLogin);
$(document).on('pagebeforeshow', '#index', setupPageHome);
