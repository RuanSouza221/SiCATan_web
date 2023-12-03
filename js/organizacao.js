"use strict";
window.onload = function() {

    document.querySelector("#Buscar").onclick = function () {
        BuscarUsuarios(document.querySelector("#PesquisaUsuario").value);
    }

    BuscarUsuarios();
}

function BuscarUsuarios (dados= null) {
    let get = "";
    if(dados !== null && dados !== '' && dados !== undefined){
        get = "&nome="+dados;
        document.querySelector("#ListaUsuarios").innerHTML = "";
    }
    options.method = "GET";
    fetch(Base_URI + '/usuarios/?organizacao='+localStorage.getItem("organizacao")+get, options)
        .then(response => response.json())
        .then(response => {
            response.forEach(function(elemento) {
                console.log(elemento.id);
                console.log(elemento.nome);
                let elem = "<li class=\"list-group-item\"><a class=\"link-dark\" href=\"/pages/usuario.html?modo=organizacao&id="+elemento.id+"\">"+elemento.nome+"<span class=\"float-end material-symbols-outlined\">edit</span></a></li>";
                document.querySelector("#ListaUsuarios").innerHTML += elem;
            });
        })
        .catch(err => console.error(err));
}