function downloadBlob(blob: Blob, filename: string) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');

    a.href = url;
    a.download = filename || 'download';

    // Click handler that releases the object URL after the element has been clicked
    // This is required for one-off downloads of the blob content
    const clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
        }, 150);
    };

    // Add the click event listener on the anchor element
    a.addEventListener('click', clickHandler, false);

    // Programmatically trigger a click on the anchor element
    a.click();

    // Return the anchor element
    return a;
}

export default downloadBlob;