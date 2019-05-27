var loginCredentials = {
    username: "",
    password: ""
}
$base_url = "https://justinpineda.com";

/*************************** ROUTES and CONTROLLERS **************************/
function setupPageLogin() {

   
    gotoHome();
    $('#login-button').on('click', function () {
        if ($('#username').val().length > 0 && $('#password').val().length > 0) {
            loginCredentials.username = $('#username').val();
            loginCredentials.password = $('#password').val();
            var outputJSON = JSON.stringify(loginCredentials);
            console.log(outputJSON);
            loginAuth.login({
                action: 'login',
                outputJSON: outputJSON
            });

            localStorage.setItem('loginAuth', outputJSON);
            // console.log(outputJSON.username);
            //localStorage.setItem('userinfo',outputJSON);
            var myusername = JSON.parse(localStorage.getItem('loginAuth'));
            // localStorage.setItem('userinfo',outputJSON);

            console.log(myusername.username);
            localStorage.setItem('username', myusername.username);
            $(function(){
                setTimeout(function () {
                    var theCookie = localStorage.getItem('auth');
                    //console.log('theCookie',theCookie);
                    var mycookie = JSON.parse(theCookie);
                    document.cookie = 'cookie=' + mycookie.cookie;
                    // console.log('cookie',mycookie.cookie);
                }, 1000);
                nonceGet();
                return false
            })
          
            


        } else {
            alert('all fields are required');
        }
    });

  setInterval(myTimer, 1000);

    function myTimer() {
       
        persisLog();
       
    }
    
}




function setupPageHome() {

    // var userAuth = localStorage.getItem("auth");
    var userloggedname = localStorage.getItem("auth");
    var loginAuth = JSON.parse(localStorage.getItem('loginAuth'));
    if (loginCredentials.username.length == 0 && localStorage.username == null || localStorage.username == "") {
        //  if (loginCredentials.username.length == 0 ) {
        $.mobile.changePage("#login", {
            transition: "slide"
        });
    } else {
        $(this).find('[data-role="header"] h3').html('').append('hi ' + localStorage.username);



        $('#profile-button').on('click', function () {

            $.mobile.changePage("#profile", {
                transition: "slide"
            });


        })
    }
    //persisLog();
    //logoutUser();



}


function setupPageProfile() {
    persisLog();
    nonceGet();
    gotoHome();



}


function gotoHome() {
    function navHome() {
        if (localStorage.username !== null) {
            // this will only work if the token is set in the localStorage
            $.mobile.changePage("#index", {
                transition: "slide"
            });
        } else {
            $.mobile.changePage("#", {
                transition: "slide"
            });

        }
    }
    $('#home-button').on('click', function () {
        navHome();
    })
}


$(document).on('pagecreate', '#login', setupPageLogin);
$(document).on('pagebeforeshow', '#profile', setupPageProfile);
$(document).on('pagebeforeshow', '#index', setupPageHome);



/*************************** CONTROLLERS **************************/
function logoutUser() {
    $('#logout').on('click', function () {
        localStorage.removeItem("auth");
        localStorage.removeItem("loginAuth");
        localStorage.removeItem("userinfo");
        localStorage.removeItem("username");
        $.mobile.changePage("#login", {
            transition: "slide"
        });
        // loggedCheck();
    });
}





var loginAuth = {
    login: function (loginData) {
        $.ajax({
            url: $base_url + '/api/user/generate_auth_cookie/?username=' + loginCredentials.username + '&password=' + loginCredentials.password + '&insecure=cool',
            data: loginData,
            async: true,
            beforeSend: function () {
                $.mobile.loading('show');
            },
            complete: function (loginData) {
                $.mobile.loading('hide');

                console.log(loginData.responseText);
                var str1 = loginData.responseText;
                var str2 = "filtering"
                var str3 = str1.replace(str2, "");
                localStorage.setItem("auth", str3);

                var lol2 = localStorage.getItem("auth");
                var lol3 = JSON.parse(lol2);
                console.log(lol3);
                if (lol3.status == "error") {
                    alert('Login failed. Please try again!');
                } else {
                    $.mobile.changePage("#index", {
                        transition: "slide"
                    });
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



function nonceGet() {
    $.ajax({
        type: 'GET',
        url: $base_url + '/api/get_nonce/?controller=user&method=generate_auth_cookie',
        data: {
            get_param: 'value'
        },
        complete: function (data) {
            var names = data.responseText;
            localStorage.setItem('nonce', names);
            var str1 = names;
            var str2 = "filtering";
            var str3 = str1.replace(str2, "");
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


function persisLog() {

    var lol2 = localStorage.getItem("nonce");
    var lol3 = JSON.parse(lol2);
    console.log(lol3);
    if (lol3.status == "error") {
        alert('Login failed. Please try again!');
    } else {
        $.mobile.changePage("#login", {
            transition: "slide"
        });
    }

    /* if (localStorage.loginAuth !== "") {
        var credentials = JSON.parse(localStorage.getItem("loginAuth"));
        console.log('credentials', credentials);
        // loginCredentials.username = credentials.username;
        //  loginCredentials.password = credentials.password;
        var outputJSON = JSON.stringify(loginCredentials);
        console.log(outputJSON);
    } else if (loginCredentials.username.length > 0 && loginCredentials.password.length > 0) {
        loginAuth.login({
            action: 'login',
            outputJSON: outputJSON
        });
    } else {
        $.mobile.changePage("login", {
            transition: "slide"
        });

    } */
    logoutUser();

}
