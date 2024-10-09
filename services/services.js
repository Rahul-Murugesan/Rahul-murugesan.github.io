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

// linux server api link
var linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/";

// check server online or not
async function isServerActive() {
    const response = await fetch(linux_server_api+'server_status.json');
    const server_status = JSON.parse(await response.text()).last_active * 1000;

    const timeDifference = (Date.now() - server_status);
    if (timeDifference <= 5000) {
        return 1;
    }
    return 0;
}

// write login, register log
async function write_login_register_log(logtype, username){
    // get public ip
    publicip = null;
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json(); 
        publicip = data.ip;
    } 
    catch (error) {

    }
    
    // time and url
    const url = window.location.href;
    const time = new Date().toString().replace(' GMT+0530 (India Standard Time)','');
    const log = [logtype, publicip, time, username, getBrowser(), getOS()];
    
    // POST logs to api
    fetch(linux_server_api+"log.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      })
}

// encrypt data with public key
async function encrypt(cred) {
    const response = await fetch('public_key.pem');
    if (!response.ok) {
        throw new Error('Failed to load public key');
    }
    const publicKey = forge.pki.publicKeyFromPem(await response.text());
    return forge.util.encode64(publicKey.encrypt(cred, 'RSA-OAEP'));
}

// genereate a session id
function generateSessionId() {
    const timestamp = Date.now(); // Get the current timestamp
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0; // Generate a random number between 0 and 15
        const v = c === 'x' ? r : (r & 0x3 | 0x8); // Create the UUID structure
        return v.toString(16); // Convert to hexadecimal
    });
    return `${timestamp}-${uuid}`; // Combine timestamp with UUID
}

var session_id; // session id
var reqid; // request id

// set session id
function set_session_id() {
    let expires = "";
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = "sessionid=" + (session_id || "") + expires + "; path=/";
}

// get session id
function get_session_id() {
    let name = "sessionid=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}

// check server response for login request
async function check_login_response() {
    const server_response = await fetch(linux_server_api+`server_response/${reqid}.json`);
    const response = JSON.parse(await server_response.text())
    if(response === 1) {
        set_session_id();
        document.getElementById("navbar").innerHTML += '<li onclick="logout()"><a href="#" id="logout">Logout</a></li>';
        document.getElementById("login").style.displayden = "none";
        document.getElementById("services").hidden = false;
    } else if(response === 0) {
        // wrong password
        document.getElementById("loginepassworderror").innerText = "*Wrong password";
    } else if(response === 2) {
        // no user exist
        document.getElementById("loginusernameerror").innerText = "*No user found";
    }
    return response;
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

// check server response for register request
async function check_register_response() {
    const server_response = await fetch(linux_server_api+`server_response/${reqid}.json`);
    const response = JSON.parse(await server_response.text())
    if(response === 1) {
        set_session_id();
        document.getElementById("navbar").innerHTML += '<li onclick="logout()"><a href="#" id="logout">Logout</a></li>';
        document.getElementById("login").style.display = "none";
        document.getElementById("services").hidden = false;
    }
    else if(response === 0) {
        // user exist
        document.getElementById("registerusernameerror").innerText = "*User already exist";
    }
    return response;
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
    console.log(get_session_id());
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
    document.getElementById("navbar").innerHTML = '<li class="serverstatus">Server Status: <span id="cursts"></span><br><span id="lastactive"></span></li>';
    document.getElementById("login").style.display = "flex";
    document.getElementById("services").hidden = true;
}

// check server response for verifying existing session
async function check_activate_existing_session_response() {
    const server_response = await fetch(linux_server_api+`server_response/${reqid}.json`);
    const response = JSON.parse(await server_response.text())
    if(response === 1) {
        document.getElementById("navbar").innerHTML += '<li onclick="logout()"><a href="#" id="logout">Logout</a></li>';
        document.getElementById("login").style.display = "none";
        document.getElementById("services").hidden = false;
    }
    return response;
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
        if(count === 11) {
            document.getElementById("loadercontainer").style.display = "none";
            clearInterval(interval);
        }
        const response = await check_activate_existing_session_response();
        if(response !== null) {
            document.getElementById("loadercontainer").style.display = "none";
            clearInterval(interval);
        }     
    }, 1000);
};
document.addEventListener("DOMContentLoaded", function() {
    activate_existing_session();
});

// check server status
setInterval( async () => {
    const response = await fetch(linux_server_api+'server_status.json');
    const server_status = JSON.parse(await response.text()).last_active * 1000;

    const timeDifference = (Date.now() - server_status);
    if (timeDifference >= 10000) {
        
        let seconds = Math.floor(timeDifference / 1000);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        let result = '';
        var addseconds = true;

        if (hours > 0) {
            addseconds = false;
            result += `${hours} hr${hours > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
            result += `${minutes} min${minutes > 1 ? 's' : ''} `;
        }
        if (seconds > 0 && addseconds) {
            result += `${seconds} sec${seconds > 1 ? 's' : ''} `;
        }

        document.getElementById("cursts").innerText = "🔴";
        document.getElementById("lastactive").innerText = `Last Active: ${result.trim()} ago`;
        document.getElementById("loginbutton").disabled = true;
        document.getElementById("registerbutton").disabled = true;
    } else {
        document.getElementById("cursts").innerText = "🟢";
        document.getElementById("lastactive").innerText = "";
        document.getElementById("loginbutton").disabled = false;
        document.getElementById("registerbutton").disabled = false;
    }

}, 1000);