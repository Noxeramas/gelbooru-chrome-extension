function initiateDownload() {
    function findLargestImage() {
        let images = document.querySelectorAll('img');
        let largestImage = null;
        let maxArea = 0;

        images.forEach(image => {
            let width = image.width;
            let height = image.height;
            let area = width * height;
            if (area > maxArea) {
                maxArea = area;
                largestImage = image;
            }
        });

        return largestImage;
    }

    function extractGeneralTags() {
        let generalTags = [];
        const sidebar = document.querySelector('#tag-sidebar');

        if (sidebar) {
            const generalHeader = Array.from(sidebar.querySelectorAll('h6')).find(header => header.innerText.trim() === 'General');

            if (generalHeader) {
                console.log("Found General header: ", generalHeader);
                let nextElement = generalHeader.nextElementSibling;

                while (nextElement && nextElement.tagName !== 'H6') {
                    if (nextElement.tagName === 'LI' && nextElement.classList.contains('tag-type-general')) {
                        const tagLink = nextElement.querySelector('a.tag-link');
                        if (tagLink) {
                            console.log("Found tag: ", tagLink.innerText.trim());
                            generalTags.push(tagLink.innerText.trim());
                        }
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            } else {
                console.log("General header not found");
            }
        } else {
            console.log("Sidebar not found");
        }

        // Filter out the '///' tag
        generalTags = generalTags.filter(tag => tag !== '///');

        console.log("Extracted tags: ", generalTags);
        return generalTags;
    }

    // Scrape images and tags from the webpage
    const largestImage = findLargestImage();
    const tags = extractGeneralTags();

    if (largestImage) {
        const src = largestImage.src;
        const tagString = tags.join(", ");
        console.log("Tag string: ", tagString);
        const blob = new Blob([tagString], { type: 'text/plain' });
        const blobUrl = URL.createObjectURL(blob);
        console.log("Blob URL: ", blobUrl);
        chrome.runtime.sendMessage({ src: src, tagsUrl: blobUrl });
    }
}

initiateDownload();
