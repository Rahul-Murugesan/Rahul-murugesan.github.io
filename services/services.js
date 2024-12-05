document.addEventListener("DOMContentLoaded", async function() {
    const authorized = await isAuthorized();
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    if (authorized || filename == "letterboxdstat.html") {
        document.getElementById("footer").hidden = false;
        document.getElementById("services").style.display = "flex";
        document.getElementById("loadercontainer").style.display = "none";
    }
    else {
        window.location.href = "/services";
    }
});

// linux server api link
var linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/";
var reqid;

// check letterboxd stat responce
async function letterboxdstat_response() {
    const server_response = await fetch(linux_server_api+`service_response/${reqid}.json`);
    const response = JSON.parse(await server_response.text());
    console.log(response);
    if(response === "Fetching your films") {
        document.getElementById("stat").innerHTML = response;
        return null;
    }
    else if(Array.isArray(response)) {
        document.getElementById("stat").innerHTML = `
        Analysed Films: <span style="color: #28a745;">${response[0]}</span> <br />
        Total Films: <span style="color: #6c757d;">${response[1]}</span> <br />
        Estimated Time Remaining: <span style="color: #fd7e14;">${response[2]}</span>`;
        return response[3]+30;
    }
    else if(response !== null) {
        document.getElementById("stat").innerHTML = `Your Total Watch Minutes: <span style="color: green;">${response}<span>`;
        return -1;
    }
}

// get letterboxd stat
async function letterboxdstat() {
    document.getElementById("statbutton").innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

    const username = document.getElementById("letterboxdusername").value;
    const encrypted_username = await encrypt(username);

    const request = {"letterboxdstat":[encrypted_username]}

    // need to encrypte
    const log = ["Letterboxd wrapped log", username];
    fetch(linux_server_api+"log.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      })

    // POST username to api
    fetch(linux_server_api+"service_request.json", {
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
        if(count === 501) {
            // clear loading button
            document.getElementById("statbutton").innerHTML = "Get Stat";
            document.getElementById("stat").innerHTML = '<span style="color: red;">Server Time-out';
            clearInterval(interval);
        }
        const response = await letterboxdstat_response();
        if(response === -1) {
            // clear loading button
            document.getElementById("statbutton").innerHTML = "Get Stat";
            clearInterval(interval);
        }
    }, 1000);
}

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