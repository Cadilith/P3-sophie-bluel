const baseApiUrl = "http://localhost:5678/api/";
// pathToUserData = "users/login"

document.addEventListener("submit", (e) => {
    e.preventDefault();
    const login = `${baseApiUrl}users/login`;
    let form = {
        email: document.getElementById("email"),
        password: document.getElementById("password"),
    };
  
    fetch(login, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    })
    .then((response) => {
        if (response.status !== 200) {
            alert("Email ou mot de passe erronés");
        } else {
            response.json()
            .then ((data) => {
                //ADD CODE TO STORE TOKEN
                console.log(data);// DELETE LATER
                window.open("index.html");
            })
        }
    })
})
