function changeform(toggle) {
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

function login() {
    console.log("login");
    event.preventDefault();
}

function register() {
    console.log("register");
    event.preventDefault();
}