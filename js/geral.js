"use strict";
const Base_URI = "http://localhost:8000";
var options = {
    method: "",
    headers: {'Content-Type': 'application/json'},
};

if(localStorage.getItem("token") !== null){
    options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
    if(localStorage.getItem("organizacao") === null){
        options.method = "GET";
        const id = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;
        fetch(Base_URI + '/usuarios/'+id, options)
            .then(response => response.json())
            .then(response => {
                localStorage.setItem("organizacao",response[0].organizacao)
            })
            .catch(err => console.error(err));
    }
}



if(document.querySelector("#navbar")){
     fetch("/pages/navbar.html")
        .then(response => response.text())
        .then(response => {
            document.querySelector("#navbar").innerHTML = response;
            if(localStorage.getItem('token') === null){
                document.querySelector("#PerfilUsuario").parentNode.removeChild(document.querySelector("#PerfilUsuario"));
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

if(document.querySelector("#navbar-bottom")){
    fetch("/pages/navbar-bottom.html")
        .then(response => response.text())
        .then(response => {
            document.querySelector("#navbar-bottom").innerHTML = response;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}
