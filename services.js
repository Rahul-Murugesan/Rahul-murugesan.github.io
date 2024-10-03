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
    const username = await encrypt(document.getElementById("loginusername").value);
    const password = await encrypt(document.getElementById("loginpassword").value);
    n = generateSessionId();
    console.log(n)
    const sessionid = await encrypt(n);
    const request = {"login":[username, password, sessionid]}

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
}

async function register() {
    const username = await encrypt(document.getElementById("registerusername").value);
    const password = await encrypt(document.getElementById("registerpassword").value);
    const request = {"register":[username, password]}

    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    })
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