const baseApiUrl = "http://localhost:5678/api/";
let worksData;
let categories;
let modalStep = null;

// FETCH works data from API and display it
window.onload = () => {
  fetch(`${baseApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      //get list of categories
      listOfUniqueCategories();
      //display all works
      const filter = document.querySelector(".filter");
      displayGallery(worksData);
      //Filter functionnality
      categoryFilter(categories, filter);
      //administrator mode
      adminUserMode(filter);
    });
};


//*******GALLERY*******

function displayGallery(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
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
    workCard.append(workImage, workTitle);
  });
}

// ********** FILTER ***********//

//get list of categories in array as unique objects
function listOfUniqueCategories() {
  let nodeListOfCategories = new Set();
  worksData.forEach((work) => {
    nodeListOfCategories.add(JSON.stringify(work.category));
  });
  const strings = [...nodeListOfCategories];
  categories = strings.map((s) => JSON.parse(s));
}


//init filter buttons
function categoryFilter(categories, filter) {
  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filterButton";
  button.dataset.category = "Tous";
  filter.appendChild(button);
  filterButtons(categories, filter);
  functionFilter();
}

//create filter buttons
function filterButtons(categories, filter) {
  categories.forEach((categorie) => {
    createButtonFilter(categorie, filter);
  });
}

function createButtonFilter(categorie, filter) {
  const button = document.createElement("button");
  button.innerText = categorie.name;
  button.className = "filterButton";
  button.dataset.category = categorie.name;
  filter.appendChild(button);
}

// Gallery filter
function functionFilter() {
  const filterButtons = document.querySelectorAll(".filterButton");
  //identify wich filter button has been clicked
  filterButtons.forEach((i) => {
    i.addEventListener("click", function () {
      //then proceed to filtering
      toggleActiveCategory(i, filterButtons);
      toggleProjects(i.dataset.category);
    });
  });
}

//add or remove "active to button's class" depending on active category
function toggleActiveCategory(i, filterButtons) {
  filterButtons.forEach((i) => {
    i.classList.remove("active");
  }),
    i.classList.add("active");
}

//if button "tous" active, display all projects, else display only those with same datasetcategory
function toggleProjects(datasetCategory) {
  const figures = document.querySelectorAll(".workCard");
  if ("Tous" === datasetCategory) {
    figures.forEach((figure) => {
      figure.style.display = "block";
    });
  } else {
    figures.forEach((figure) => {
      figure.dataset.category === datasetCategory
        ? (figure.style.display = "block")
        : (figure.style.display = "none");
    });
  }
}

//********ADMIN MODE******//

function adminUserMode() {
  //display admin mode if token is found and has the expected length
  if (sessionStorage.getItem("token")?.length == 143) {//optional chaining
    //Hide filter
    document.querySelector(".filter").style.display = "none";
    //change login to logout
    document.getElementById("logBtn").innerText = "logout";
    //display top menu bar
    const body = document.querySelector("body");
    const topMenu = document.createElement("div");
    const publishBtn = document.createElement("button");
    const editMode = document.createElement("p");

    topMenu.className = "topMenu";
    editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
    publishBtn.innerText = "Publier les changements";

    body.insertAdjacentElement("afterbegin", topMenu);
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

//*********MODAL*******//

//open modal if token is found and has the expected length
const openModal = function () {
  if (sessionStorage.getItem("token")?.length == 143) {
    const modal = document.querySelector(".modal");
    modal.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);
    modalStep = 0;
    // close modal listener
    modal.addEventListener("click", closeModal);
    // DELETE button listener
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};

//display modal gallery function
function modalGallery(data) {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";
  //show all works in array
  data.forEach((i) => {
    //create elements
    const miniWork = document.createElement("figure");
    const workImage = document.createElement("img");
    const edit = document.createElement("figcaption");
    const trashCan = document.createElement("i");
    trashCan.id = i.id;
    trashCan.classList.add("fa-solid", "fa-trash-can");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    edit.innerText = "éditer";
    miniWork.className = "miniWork";
    //references to DOM
    modalContent.appendChild(miniWork);
    miniWork.append(workImage, edit, trashCan);
  });
}

//close modal
const closeModal = function (e) {
  if (
    e.target === document.querySelector(".modal") ||
    e.target === document.getElementsByClassName("fa-xmark")[modalStep]
  ) {
    document.querySelector(".modal").style.display = "none";
    document.removeEventListener("click", closeModal);
    document.removeEventListener("click", deleteBtn);
    modalStep = null;
  }
}

//*************DELETE***************/

//DELETE work event listener handler
const deleteBtn = function (e) {
  e.preventDefault();
  //clicked button
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

//API call for DELETE route
function deleteWork(i) {
  //authentify user and send API response
  let token = sessionStorage.getItem("token");
  fetch(baseApiUrl + "works/" + i, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    //if response is positive, update the works gallery accordingly
    if (response.status === 204 || response.status === 200) {
      alert("Projet supprimé avec succés")
      //delete work from worksData array
      worksData = worksData.filter((work) => work.id != i);
      //display updated galleries
      displayGallery(worksData);
      modalGallery(worksData);
      //if response is negative report an error
    } else {
      alert("erreur");
    }
  });
}

//*************ADD WORK***************/

//display add work form
const openNewWorkForm = function (e) {
  if(e.target === document.querySelector("#addPictureBtn")){
    modalStep = 1;
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#picturePreview").style.display = "none";
    document.getElementById("addPictureForm").reset();
    document.querySelector("#valider").style.backgroundColor = "#A7A7A7";
    //select categories list 
    selectCategoryForm();
    //display preview
    let pictureInput = document.querySelector("#photo");
    pictureInput.onchange = e => {
      const [file] = pictureInput.files;
      if (file) {
        document.querySelector("#picturePreviewImg").src = URL.createObjectURL(file);
        document.querySelector("#picturePreview").style.display = "flex";
        document.querySelector("#labelPhoto").style.display = "none";
      }
    };
    //events
    document.querySelector("#addPictureForm").onchange = changeSubmitBtnColor;
    document.addEventListener("click", closeModal);
    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", openModal);
    document.removeEventListener("click", openNewWorkForm);
    document.removeEventListener("click", deleteBtn);
    document.addEventListener("click", newWorkFormSubmit);
  }
}

//category options for form
const selectCategoryForm = function () {
  //reset categories
  document.querySelector("#selectCategory").innerHTML = "";
  //empty first option
  option = document.createElement("option");
  document.querySelector("#selectCategory").appendChild(option);
  //options from categories array
  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector("#selectCategory").appendChild(option);
  });
};


//submit work form event listener
const newWorkFormSubmit = function (e) {
  if (e.target === document.querySelector("#valider")) {
    e.preventDefault();
    postNewWork();
  }
}

//POST new work
function postNewWork() {
  let token = sessionStorage.getItem("token");
  const select = document.getElementById("selectCategory");
  //get data from form
  const title = document.getElementById("title").value;
  const categoryId = select.options[select.selectedIndex].id;
  const image = document.getElementById("photo").files[0];
  formValidation(image, title, categoryId);
  //create FormData
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", categoryId);
  
// send collected data to API
  fetch(`${baseApiUrl}works`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData
  })
      .then(response => {
          if (response.ok) {
            alert("Nouveau fichier envoyé avec succés : " + title);
            document.querySelector(".modal").style.display = "none";
            document.removeEventListener("click", closeModal);
            document.removeEventListener("click", deleteBtn);
            modalStep = null;
          } else {
            console.error("Erreur:", response.status);
          }
      })
      .catch(error => console.error("Erreur:", error));
};

//change submit button color if all fields are filled
const changeSubmitBtnColor = function() {
  const select = document.getElementById("selectCategory");
  if (document.getElementById("title").value !== "" && document.getElementById("photo").files[0] !== "" && select.options[select.selectedIndex].id !== "") {
    document.querySelector("#valider").style.backgroundColor = "#1D6154";
  }
}

//form validation
const formValidation = function(image, title, categoryId) {
  if (image == ""){
    alert("Veuillez ajouter une image");
    return false;
  }
  if (title == ""){
    alert("Veuillez ajouter un titre");
    return false;
  }
  if (categoryId == ""){
    alert("Veuillez choisir une catégorie");
    return false;
  }
  return true;
}

