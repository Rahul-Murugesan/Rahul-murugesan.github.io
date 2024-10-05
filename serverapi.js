
// Detect browser name
function getBrowser() {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
    } else {
        browserName = "Unknown";
    }

    return browserName;
}
// Detect OS name
function getOS(){
    const userAgent = navigator.userAgent;
    let osName;

    if (userAgent.indexOf("Win") > -1) {
        osName = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
        osName = "MacOS";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("X11") > -1 || userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("like Mac") > -1) {
        osName = "iOS";
    } else {
        osName = "Unknown";
    }

    return osName;
}

// write access log
async function write_access_log(){
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
    const log = ["Access log", publicip, time, url, getBrowser(), getOS()];
    
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
