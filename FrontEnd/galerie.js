const baseApiUrl = "http://localhost:5678/api/";

// fetch works data from API and display it
window.onload = () => { fetch(`${baseApiUrl}works`)
.then((response) => response.json())
.then((worksData) => {
    //get list of categories
    let nodeListOfCategories = new Set();
    worksData.forEach(work => {
        nodeListOfCategories.add(work.category.name);
    });
    categories = Array.from(nodeListOfCategories);
    //display all works
    const filter = document.querySelector(".filter");
    displayGallery(worksData);  
    //Filter functionnality
    categoryFilter(categories, filter);
    //administrator mode
    adminUserMode(filter);
})
}
//*******display gallery*******
function displayGallery(data) {
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
function categoryFilter(categories, filter) {
    createButtonFilter("Tous", filter);
    filterButtons(categories, filter);
    functionFilter();
};

//create filter buttons
function filterButtons(categories, filter) {
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
function functionFilter() {
  const filterButtons = document.querySelectorAll(".filterButton");
  //identify wich filter button has been clicked
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
      //then proceed to filtering
      toggleActiveCategory(filterButtons[i], filterButtons),
        toggleProjects(filterButtons[i].dataset.category);
    });
  }
}

//add or remove "active to class" depending on active category
function toggleActiveCategory(i, filterButtons) {
    filterButtons.forEach((i) => {
        i.classList.remove("active");
    }),
        i.classList.add("active");
}

//if button "tous" active, display all projects, else display only those with same datasetcategory
function toggleProjects(datasetCategory) {
    const figures = document.querySelectorAll(".workCard");
    if ("Tous" === datasetCategory){
        figures.forEach(figure => {
            figure.style.display = "block";
        });
    } else {
        figures.forEach(figure => {
            figure.dataset.category === datasetCategory
                ? (figure.style.display = "block")
                : (figure.style.display = "none");
        });
    }
}

//********Display admin mode if token is found in session storage******
function adminUserMode(filter) {
    if (sessionStorage.getItem("token")) { //TODO : taille du token a verifier
        //Hide filter
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
