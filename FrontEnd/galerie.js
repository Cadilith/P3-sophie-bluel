const baseApiUrl = "http://localhost:5678/api/";
let worksData;

// fetch works data from API and display it
window.onload = () => {
  fetch(`${baseApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
        worksData = data;
      //get list of categories 
      let nodeListOfCategories = new Set();
      worksData.forEach((work) => {
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
    });

};
//*******display gallery*******
function displayGallery(data) {
    const gallery = document.querySelector(".gallery");
    //show all works in array
    data.forEach((i) => {
                //create tags
        const workCard = document.createElement("figure");
        const workImage = document.createElement("img");
        const workTitle = document.createElement("figcaption");
        workImage.src = i.imageUrl;
        workImage.alt = i.title;
        workTitle.innerText = i.title;
        workCard.dataset.category = i.category.name;
        workCard.className = "workCard";
        //references to DOM    
        gallery.appendChild(workCard);
        workCard.append(workImage,workTitle);
    })
}

// ********** Filter***********//

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
  filterButtons.forEach((i) => {
    i.addEventListener("click", function () {
        //then proceed to filtering
        toggleActiveCategory(i, filterButtons),
          toggleProjects(i.dataset.category);
      });
  })
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

//********Display admin mode if token is found in session storage******//
function adminUserMode(filter) {
    if (sessionStorage.getItem("token").length == 143) { //controls token lenght for additional security
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
        
        body.insertAdjacentElement ("afterbegin", topMenu);
        topMenu.append(editMode, publishBtn);
        //edit buttons
        const editBtn = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
        document.querySelector("#introduction img").insertAdjacentHTML("afterend", editBtn);
        document.querySelector("#introduction article").insertAdjacentHTML("afterbegin", editBtn);
        document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", editBtn);
        //event listener modal
        document.querySelector("#portfolio p").addEventListener("click", openModal);
    }
}
//*********display gallery modal *******//
const openModal = function () {
    if (sessionStorage.getItem("token").length == 143){ //controls token lenght fo additional security
        const modal = document.querySelector(".modal");
        modal.style.display = "flex";
        modalGallery(worksData);
        modal.addEventListener("click", closeModal);
    }else{
        alert("Veuillez vous connecter.");
    }
}

// display mini gallery function
function modalGallery(data) {
    const modalContent = document.querySelector(".modalContent");
    modalContent.innerHTML = "";
    //show all works in array
    data.forEach((i) => {
        //create tags
        const miniWork = document.createElement("figure");
        const workImage = document.createElement("img");
        const edit = document.createElement("figcaption");
        workImage.src = i.imageUrl;
        workImage.alt = i.title;
        edit.innerText = "éditer";
        miniWork.className = "miniWork";
        //references to DOM    
        modalContent.appendChild(miniWork);
        miniWork.append(workImage,edit);
    })
}

//close modal function
function closeModal() {
    document.querySelector(".modal").style.display = "none";
}