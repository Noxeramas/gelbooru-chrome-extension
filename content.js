function fetchHighResImage() {
    // Adjust the selector to target the high-resolution image
    const img = document.querySelector('main div section picture img');
    const imageUrl = img ? img.src : null;
    console.log('Fetched high-resolution image URL:', imageUrl);
    return imageUrl;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchHighResImage") {
        const imageUrl = fetchHighResImage();
        sendResponse({ imageUrl });
    }
    return true;
});
