// change login/register form
function changeform() {
    const registerForm = document.getElementById('registerform');
    const loginForm = document.getElementById('loginform');
    if (registerForm.hidden === true) {
        registerForm.hidden = false;
    } else {
        registerForm.hidden = true;
    }

    if (loginForm.hidden === true) {
        loginForm.hidden = false;
    } else {
        loginForm.hidden = true;
    }
}

// login user
async function login() {
    // loading button
    document.getElementById("loginbutton").innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

    // clear error message
    document.getElementById("loginusernameerror").innerText = "";
    document.getElementById("loginepassworderror").innerText = "";
    document.getElementById("registerusernameerror").innerText = "";
    document.getElementById("registerpassworderror").innerText = "";

    // get credentials and encrypt
    const username = document.getElementById("loginusername").value
    const encrypted_username = await encrypt(username);
    const encrypted_password = await encrypt(document.getElementById("loginpassword").value);

    // genereate session id
    session_id = generateSessionId();
    const encrypted_session_id = await encrypt(session_id);
    
    const request = {"login":[encrypted_username, encrypted_password, encrypted_session_id]}

    // POST credentials to api
    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(response => response.json())
    .then(data => {
        reqid = data.name;
    })

    // write log
    write_login_register_log("User Login", username);

    // check for server response
    var count = 0;
    let interval = setInterval(async function () {
        count += 1;
        if(count === 31) {
            // clear loading button
            document.getElementById("loginbutton").innerHTML = "Login";
            clearInterval(interval);
        }
        const response = await check_login_response();
        if(response !== null) {
            // clear loading button
            document.getElementById("loginbutton").innerHTML = "Login";
            clearInterval(interval);
        }     
    }, 1000);
}

// register user
async function register() {
    // loading button
    document.getElementById("registerbutton").innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

    // clear error message
    document.getElementById("loginusernameerror").innerText = "";
    document.getElementById("loginepassworderror").innerText = "";
    document.getElementById("registerusernameerror").innerText = "";
    document.getElementById("registerpassworderror").innerText = "";

    // get credentials and encrypt
    const username = document.getElementById("registerusername").value;
    const encrypted_username = await encrypt(username);
    const encrypted_password = await encrypt(document.getElementById("registerpassword").value);

    // generate session
    session_id = generateSessionId();
    const encrypted_session_id = await encrypt(session_id);

    const request = {"register":[encrypted_username, encrypted_password, encrypted_session_id]}

    // POST credentials to api
    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(response => response.json())
    .then(data => {
        reqid = data.name;
    })

    // write log
    write_login_register_log("User Register", username)

    // check for server response
    var count = 0;
    let interval = setInterval(async function () {
        count += 1;
        if(count === 31) {
            // clear loading button
            document.getElementById("registerbutton").innerHTML = "Register";
            clearInterval(interval);
        }
        const response = await check_register_response();
        if(response !== null) {
            // clear loading button
            document.getElementById("registerbutton").innerHTML = "Register";
            clearInterval(interval);
        }     
    }, 1000);
}

// logout user
async function logout() {
    const request = {"logout_session":get_session_id()}
    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(response => response.json())
    .then(data => {
        reqid = data.name;
    })

    document.cookie = 'sessionid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.getElementById("logout").style.visibility = "hidden";
    document.getElementById("login").style.display = "flex";
    document.getElementById("services").style.display = "none";
}

// activate existing session
async function activate_existing_session() {
    const sessionid = get_session_id();

    if(sessionid === null || await isServerActive() === 0)  {
        document.getElementById("loadercontainer").style.display = "none";
        document.getElementById("login").style.display = "flex";
        return 0;
    }

    const request = {"activate_session":await encrypt(sessionid)}
    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(response => response.json())
    .then(data => {
        reqid = data.name;
    })

    // check for server response
    var count = 0;
    let interval = setInterval(async function () {
        count += 1;
        if(count >= 6) {
            document.getElementById("login").style.display = "flex";
            document.getElementById("footer").hidden = false;
            document.getElementById("loadercontainer").style.display = "none";
            clearInterval(interval);
        }
        const response = await check_activate_existing_session_response();
        if(response === 1) {
            document.getElementById("logout").style.visibility = "visible";
            document.getElementById("login").style.display = "none";
            document.getElementById("services").style.display = "flex";
            document.getElementById("footer").hidden = false;
            document.getElementById("loadercontainer").style.display = "none";
            clearInterval(interval);
        }     
    }, 1000);
};
document.addEventListener("DOMContentLoaded", function() {
    activate_existing_session();
});

// update server status
setInterval(async () => {
    const server_status = check_server_status();
    if(server_status === 1) {
        document.getElementById("loginbutton").disabled = false;
        document.getElementById("registerbutton").disabled = false;
    }
    else if(server_status === 2) {

    }
    else if(server_status === 0) {
        document.getElementById("loginbutton").disabled = true;
        document.getElementById("registerbutton").disabled = true;
    }
}, 1000);