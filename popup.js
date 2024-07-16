document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fetchImages
        }, function(results) {
            if (results && results[0] && results[0].result) {
                displayImages(results[0].result);
            }
        });
    });

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', downloadSelectedImages);
});

function fetchImages() {
    // Adjust the selector to target the images within the updated HTML structure
    const images = Array.from(document.querySelectorAll('div.thumbnail-container article.thumbnail-preview a img'));
    return images.map(img => {
        let src = img.src;
        if (src.startsWith('//')) {
            src = 'https:' + src;
        }
        return { src: src, postUrl: img.closest('a').href };
    });
}

function displayImages(images) {
    const imageList = document.getElementById('imageList');
    imageList.innerHTML = '';
    images.forEach((image, index) => {
        const li = document.createElement('li');
        li.style.listStyleType = 'none'; // Remove bullet points

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = `Image ${index + 1}`;
        img.style.width = '100px'; // Set the width of the images

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `imageCheckbox${index}`;
        checkbox.dataset.postUrl = image.postUrl;
        checkbox.style.marginRight = '10px'; // Add some space between checkbox and image

        li.appendChild(checkbox);
        li.appendChild(img);
        imageList.appendChild(li);
    });
}

function downloadImageAndTags(imageUrl) {
    chrome.downloads.download({
        url: imageUrl,
        // Optional filename
        filename: 'download.jpg',
        conflictAction: 'uniquify'
    }, function(downloadId) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log(`Download started with ID ${downloadId}`);
        }
    });
}

function downloadSelectedImages() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            chrome.runtime.sendMessage({ postUrl: checkbox.dataset.postUrl });
        }
    });
}