document.addEventListener("DOMContentLoaded", function() {
    
    let index = 0;
displayImages();

function displayImages() {
    let i;
    const img_slides = document.getElementsByClassName("image-slideshow");
    // console.log(img_slides);
    const images = document.getElementsByClassName("image");
    console.log(images.length,images)

    if (images.length === 0) {
        console.error("No images found with the class 'image'.");
        return;
    }

    for (i = 0; i < images.length; i++) {
        images[i].style.display = "none";  // Hide all images
    }

    index++;
    if (index > images.length) {
        index = 1;
    }

    images[index - 1].style.display = "block";  // Show the current image
    setTimeout(displayImages, 9000);  // Change image every second
}

});