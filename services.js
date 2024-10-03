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
    const linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/log.json";
    fetch(linux_server_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      })
}

async function encrypt(cred) {
    const response = await fetch('public_key.pem');
    if (!response.ok) {
        throw new Error('Failed to load public key');
    }
    const publicKey = forge.pki.publicKeyFromPem(await response.text());
    return forge.util.encode64(publicKey.encrypt(cred, 'RSA-OAEP'));
}

function generateSessionId() {
    const timestamp = Date.now(); // Get the current timestamp
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0; // Generate a random number between 0 and 15
        const v = c === 'x' ? r : (r & 0x3 | 0x8); // Create the UUID structure
        return v.toString(16); // Convert to hexadecimal
    });
    return `${timestamp}-${uuid}`; // Combine timestamp with UUID
}

var linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/";
async function login() {
    const username = document.getElementById("loginusername").value
    const encrypted_username = await encrypt(username);
    const encrypted_password = await encrypt(document.getElementById("loginpassword").value);
    const session_id = generateSessionId();
    const encrypted_session_id = await encrypt(session_id);
    const request = {"login":[encrypted_username, encrypted_password, encrypted_session_id]}

    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(response => response.json()) // Parse the response as JSON
    .then(data => {
        reqid = data.name;
    })

    write_login_register_log("User Login", username);
}

async function register() {
    const username = document.getElementById("registerusername").value;
    const encrypted_username = await encrypt(username);
    const encrypted_password = await encrypt(document.getElementById("registerpassword").value);
    const session_id = generateSessionId();
    const encrypted_session_id = await encrypt(session_id);
    const request = {"register":[encrypted_username, encrypted_password, encrypted_session_id]}

    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    })

    write_login_register_log("User Register", username)
}

setInterval( async () => {
    const response = await fetch(linux_server_api+'server_status.json');
    const server_status = JSON.parse(await response.text()).last_active * 1000;

    const timeDifference = (Date.now() - server_status);
    if (timeDifference > 0) {
        
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
    } else {
        document.getElementById("cursts").innerText = "🟢";
        document.getElementById("lastactive").innerText = "";
    }

}, 1000);