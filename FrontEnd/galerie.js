const baseApiUrl = "http://localhost:5678/api/";

// fetch works data from API and display it
fetch(`${baseApiUrl}works`)
.then((response) => response.json())
.then((worksData) => {
    //get list of categories
    let nodeListOfCategories = new Set();
    worksData.forEach(work => {
        nodeListOfCategories.add(work.category.name);
    });
    categories = Array.from(nodeListOfCategories);
    //display all works
    displayGallery(worksData);  
    //Filter functionnalities
    displayFilter(categories);
    adminUserMode();
})

//display gallery
function displayGallery(data) {

    //select parent element
    const gallery = document.querySelector(".gallery");

    //show all works in array
    for (let i = 0; i < data.length; i++) {
        const work = data[i];
        
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

// ********** Filter***********

//display filter buttons
function displayFilter(categories) {
    buttonDisplayAll();
    filterButtons(categories);
    functionFilter();
};

//create button "Tous"
function buttonDisplayAll() {

    const filter = document.querySelector(".filter");//DOUBLON A VOIR ?
    const button = document.createElement("button");
    
    button.innerText = "Tous";
    button.dataset.category = "Tous";
    button.className = "filterButton";
    filter.appendChild(button);
}

//create filter buttons
function filterButtons(categories) {

    const filter = document.querySelector(".filter");//DOUBLON A VOIR ?
    categories.forEach(categorie => {
        createButtonFilter(categorie, filter);
    });
}

function createButtonFilter(categorie, filter) {
    const button = document.createElement("button");
    button.innerText = categorie;
    button.className = "filterButton";
    button.dataset.category = categorie;
    filter.appendChild(button);
}

// Gallery filter
function functionFilter () {
    const filterButtons = document.querySelectorAll(".filterButton");
    const figures = document.querySelectorAll(".workCard");

    function toggleActiveCategory(i) {
        filterButtons.forEach((i) => {
            i.classList.remove("active");
        }),
            i.classList.add("active");
    }

    function toggleProjects(datasetCategory) {
        if ("Tous" === datasetCategory)
            figures.forEach(figure => {
                figure.style.display = "block";
            });
        else
            figures.forEach(figure => {
                figure.dataset.category === datasetCategory
                    ? (figure.style.display = "block")
                    : (figure.style.display = "none");
            });
    }

    for (let i = 0; i < filterButtons.length; i++)
        filterButtons[i].addEventListener("click", function () {
            toggleActiveCategory(filterButtons[i]),
                toggleProjects(filterButtons[i].dataset.category);
        });
}

//********Display admin mode if token is found in session storage******
function adminUserMode() {
    if (sessionStorage.getItem("token")) {
        //Hide filter
        const filter = document.querySelector(".filter");//DOUBLON A VOIR ?
        filter.style.display = "none";
        //change login to logout
        const logBtn = document.getElementById("logBtn");
        logBtn.innerText = "logout";
        //display top menu bar
        const body = document.querySelector("body");
        const topMenu = document.createElement("div");
        const publishBtn = document.createElement("button");
        const editMode = document.createElement("p");

        topMenu.className = "topMenu";
        editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
        publishBtn.innerText = "Publier les changements";
        
        body.appendChild(topMenu);
        body.insertAdjacentElement ("beforebegin", topMenu);
        topMenu.append(editMode, publishBtn);
        //edit buttons
        const editBtn = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
        document.querySelector("#introduction img").insertAdjacentHTML("afterend", editBtn);
        document.querySelector("#introduction article").insertAdjacentHTML("afterbegin", editBtn);
        document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", editBtn);


    }
}
