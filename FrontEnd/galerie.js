const baseApiUrl = "http://localhost:5678/api/";

// fetch works data from API and display it
fetch(baseApiUrl + "works")
.then((response) => response.json())
.then((worksData) => {
    //get list of categories
    let listOfCategories = new Set();
    worksData.forEach(work => {
        listOfCategories.add(work.category.name);
    });
    categories = Array.from(listOfCategories);
    //display all works
    displayGallery(worksData);  
    //display filter buttons
    displayFilterButtons(categories);
})



//display the gallery
function displayGallery(data) {

    //select parent element
    const gallery = document.querySelector(".gallery");

    //show all works in array
    for (let index = 0; index < data.length; index++) {
        const work = data[index];
        
        //create tags
        const workCard = document.createElement("figure");
        const workImage = document.createElement("img");
        const workTitle = document.createElement("figcaption");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        workTitle.innerText = work.title;
        workCard.dataset.category = work.category.name;
        workCard.className = "workCard";

        //references to DOM    
        gallery.appendChild(workCard);
        workCard.append(workImage,workTitle);
    }
}

//create button all
function allButton() {

    const filter = document.querySelector(".filter");
    const button = document.createElement("button");
    
    button.innerText = "Tous";
    button.className = "filterButton";
    filter.appendChild(button);
}

//create filter buttons
function filterButtons(categories) {

    const filter = document.querySelector(".filter");
    categories.forEach(categorie => {
        createButtonFilter(categorie, filter);
    });
}

function createButtonFilter(categorie, filter) {
    const button = document.createElement("button");
    button.innerText = categorie;
    button.className = "filterButton";
    filter.appendChild(button);
}

//display filter buttons
function displayFilterButtons(categories) {
    allButton();
    filterButtons(categories);
    //Event listener filter buttons
    const filterButton = document.getElementsByClassName("filterButton");
    filterButton.addEventListener("click", function() {
        ////////// continuer ICI
        });
};


