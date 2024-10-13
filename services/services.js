document.addEventListener("DOMContentLoaded", async function() {
    const authorized = await isAuthorized();
    if (authorized) {
        document.getElementById("footer").hidden = false;
        document.getElementById("loadercontainer").style.display = "none";
    }
    else {
        window.location.href = "/services";
    }
});

// update server status
setInterval(async () => {
    const server_status = check_server_status();
    if(server_status === 1) {
        
    }
    else if(server_status === 2) {

    }
    else if(server_status === 0) {

    }
}, 1000);