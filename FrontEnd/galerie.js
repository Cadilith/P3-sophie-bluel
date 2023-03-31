// fetch works data from API and display it
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => displayGallery(data))

//function to display the gallery
function displayGallery(data) {

    //select parent element
    const gallery = document.querySelector(".gallery");

    //display all works in array
    for (let i = 0; i < data.length; i++) {
        const work = data[i];

        //create figure
        const workCard = document.createElement("figure");

        //create tags
        const workImage = document.createElement("img");
        const workTitle = document.createElement("figcaption");
        workImage.src = work.imageUrl;
        workTitle.innerText = work.title;

        //references to DOM    
        gallery.appendChild(workCard);
        workCard.appendChild(workImage);
        workCard.appendChild(workTitle);
    }
}