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

var linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/";
function login() {
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginpassword").value;
    const request = {"login":[email, password]}

    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    })
}

function register() {
    const email = document.getElementById("registeremail").value;
    const password = document.getElementById("registerpassword").value;
    const request = {"register":[email, password]}

    fetch(linux_server_api+"user_request.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    })
}