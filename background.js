chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://gelbooru.com/index.php?page=post&s=view&id=')) {
        console.log('Tab updated:', tab.url);
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.imageUrl) {
        console.log('Message received with imageUrl:', message.imageUrl);
        downloadImage(message.imageUrl);
    }
});

function downloadImage(imageUrl) {
    const filename = imageUrl.split('/').pop();
    chrome.downloads.download({
        url: imageUrl,
        filename: filename,
        conflictAction: 'uniquify'
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error('Download error:', chrome.runtime.lastError.message);
        } else {
            console.log('Download started with ID:', downloadId);
        }
    });
}
