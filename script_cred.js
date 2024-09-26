function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    // If found your qr code
    function onScanSuccess(decodeText) {
        // Call backend API to fetch days access using QRCodeID
        fetch(`/getDaysAccess/${decodeText}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("QR Code not found");
                }
                return response.json();
            })
            .then((data) => {
                alert("Days Access: " + data.daysAccess);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
