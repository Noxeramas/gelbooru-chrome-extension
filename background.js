chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.postUrl) {
        fetchImageData(message.postUrl).then(data => {
            const { imageUrl, tags } = data;
            downloadImageAndTags(imageUrl, tags);
        });
    }
});

async function fetchImageData(postUrl) {
    const response = await fetch(postUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const img = doc.querySelector('img');
    const imageUrl = img.src;
    const altText = img.alt;
    const tags = altText.split(', ').join('\n');
    return { imageUrl, tags };
}

function downloadImageAndTags(imageUrl, tags) {
    const filename = imageUrl.split('/').pop();
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
    const imageFilename = `${nameWithoutExt}.jpg`;
    const tagsFilename = `${nameWithoutExt}.txt`;

    // Download image
    chrome.downloads.download({
        url: imageUrl,
        filename: imageFilename,
        conflictAction: 'uniquify'
    }, function(downloadId) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log(`Image download started with ID ${downloadId}`);
        }
    });

    // Download tags
    const blob = new Blob([tags], { type: 'text/plain' });
    const tagsUrl = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: tagsUrl,
        filename: tagsFilename,
        conflictAction: 'uniquify'
    }, function(downloadId) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log(`Tags download started with ID ${downloadId}`);
        }
    });
}
