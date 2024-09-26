// Function to initiate QR code scanning
document.getElementById('startScan').addEventListener('click', function() {
    // Access the user's camera
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
        video.srcObject = stream;
        video.play();

        // Start scanning for QR codes
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const scan = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    document.getElementById('scanResult').textContent = `QR Code Detected: ${code.data}`;
                    processQRCode(code.data);  // Process the scanned QR code
                } else {
                    requestAnimationFrame(scan);
                }
            } else {
                requestAnimationFrame(scan);
            }
        };

        requestAnimationFrame(scan);
    });
});

// Mock database of QR code IDs and access dates
const mockDatabase = {
    "1234567890": { name: "John Doe", accessDate: "2024-09-26" },
    "0987654321": { name: "Jane Smith", accessDate: "2024-09-27" }
};

// Function to process QR code data and check access
function processQRCode(qrCodeData) {
    const currentDate = new Date().toISOString().slice(0, 10);  // Current date in YYYY-MM-DD format
    const person = mockDatabase[qrCodeData];

    const statusDiv = document.getElementById('status');
    const resultMessage = document.getElementById('resultMessage');

    if (person) {
        // Check if the access date matches the current date
        if (person.accessDate === currentDate) {
            resultMessage.textContent = `${person.name} is allowed entry today!`;
            resultMessage.className = 'success';
        } else {
            resultMessage.textContent = `${person.name} does not have access today.`;
            resultMessage.className = 'fail';
        }
    } else {
        resultMessage.textContent = "QR code not recognized.";
        resultMessage.className = 'fail';
    }

    statusDiv.classList.remove('hidden');
}
