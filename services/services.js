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

// activate session
function activate_session() {
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
        activate_session();
        document.getElementById("login").hidden = true;
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

// check server response for register request
async function check_register_response() {
    const server_response = await fetch(linux_server_api+`server_response/${reqid}.json`);
    const response = JSON.parse(await server_response.text())
    if(response === 1) {
        activate_session();
        document.getElementById("login").hidden = true;
        document.getElementById("services").hidden = false;
    }
    else if(response === 0) {
        // user exist
        document.getElementById("registerusernameerror").innerText = "*User already exist";
    }
    return response;
}

// login user
async function login() {

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
            clearInterval(interval);
        }

        const response = await check_login_response();
        if(response !== null) {
            clearInterval(interval);
        }     
    }, 1000);
}

// register user
async function register() {
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
            clearInterval(interval);
        }

        const response = await check_register_response();
        if(response !== null) {
            clearInterval(interval);
        }     
    }, 1000);
}


// check server status
setInterval( async () => {
    const response = await fetch(linux_server_api+'server_status.json');
    const server_status = JSON.parse(await response.text()).last_active * 1000;

    const timeDifference = (Date.now() - server_status);
    console.log(timeDifference);
    if (timeDifference >= 10000) {
        
        let seconds = Math.floor(timeDifference / 1000);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        let result = '';

        if (hours > 0) {
            result += `${hours} hr${hours > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
            result += `${minutes} min${minutes > 1 ? 's' : ''} `;
        }
        if (seconds > 0 || result === '') {
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