"use strict";
const Base_URI = "https://episematic-polarity.000webhostapp.com";
let Nivel_acesso
var options = {
    method: "",
    headers: {'Content-Type': 'application/json'},
};

if(localStorage.getItem("token") !== null){
    Nivel_acesso = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).nivel;
    options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
    if(localStorage.getItem("organizacao") === null){
        options.method = "GET";
        const id = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;
        fetch(Base_URI + '/usuarios/'+id, options)
            .then(response => response.json())
            .then(response => {
                localStorage.setItem("organizacao",response[0].organizacao)
                location.reload();
            })
            .catch(err => console.error(err));
    }
    if((new URL(window.location.href).pathname).includes('/pages/login.html')){
        window.location.assign("../pages/organizacao.html");
    }
} else {
    let pathname = (new URL(window.location.href).pathname);

    if(!(pathname.includes('/pages/login.html') || (pathname.includes('/pages/usuario.html')))){
        window.location.assign("../pages/login.html");
    }
}



if(document.querySelector("#navbar")){
     fetch("../pages/navbar.html")
        .then(response => response.text())
        .then(response => {
            document.querySelector("#navbar").innerHTML = response;
            if(localStorage.getItem('token') === null){
                document.querySelector("#PerfilUsuario").remove();
                document.querySelector("#SairUsuario").remove();
            } else {
                document.querySelector("#SairUsuario").onclick = function () {
                    localStorage.removeItem("token");
                    localStorage.removeItem("organizacao");
                    window.location.assign("../pages/login.html");
                };
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

if(document.querySelector("#navbar-bottom")){
    fetch("../pages/navbar-bottom.html")
        .then(response => response.text())
        .then(response => {
            document.querySelector("#navbar-bottom").innerHTML = response;
            if(Nivel_acesso > 2){
                document.querySelector("#OrganizacaoMenu").remove();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}
