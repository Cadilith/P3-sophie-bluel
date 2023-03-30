// fetch works data from API
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => displayConsole(data))
.then((data) => displayGallery(data))


function displayConsole(data) {
    console.log(data);
    return data;
}
