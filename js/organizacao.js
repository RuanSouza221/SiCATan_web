"use strict";
window.onload = function() {
    if(Nivel_acesso > 2){
        window.location.assign("/pages/ativos.html");
    }

    document.querySelector("#Buscar").onclick = function () {
        BuscarUsuarios(document.querySelector("#PesquisaUsuario").value);
    }

    BuscarUsuarios();
}

function BuscarUsuarios (dados= null) {
    let get = "";
    if(dados !== null && dados !== '' && dados !== undefined){
        get = "&nome="+dados;
    }
    options.method = "GET";
    fetch(Base_URI + '/usuarios/?order=nome&organizacao='+localStorage.getItem("organizacao")+get, options)
        .then(response => response.json())
        .then(response => {
            document.querySelector("#ListaUsuarios").innerHTML = "";
            response.forEach(function(elemento) {
                console.log(elemento.id);
                console.log(elemento.nome);
                if(elemento.inativo === 0){
                    let elem = '<li class="list-group-item">' +
                        ''+elemento.nome+'' +
                        '<div class="float-end">' +
                        '<a class="link-dark" href="/pages/usuario.html?modo=organizacao&id='+elemento.id+'"><span class="material-symbols-outlined me-3">edit</span></a>' +
                        '<a data-id="'+elemento.id+'" class="link-dark DeletarUsuario"><span class="material-symbols-outlined">delete</span></a>\n ' +
                        '</div>' +
                        '</li>';
                    document.querySelector("#ListaUsuarios").innerHTML += elem;
                }
                AtivaDelete();
            });
        })
        .catch(err => console.error(err));
}

function AtivaDelete(){
    Nivel_acesso
    document.querySelectorAll('.DeletarUsuario').forEach(function(elemento) {
        if(Nivel_acesso > 1){
            elemento.remove()
        } else {
            elemento.onclick = function() {

                Swal.fire({
                    title: 'Deseja mesmo Apagar?',
                    text: "",
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    showCancelButton: true
                }).then((result) => {
                    if(result.isConfirmed){
                        let body = {};
                        body.id = this.dataset.id
                        body.inativo = 1
                        options.method = "PUT";
                        options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
                        options.body = JSON.stringify(body);
                        fetch(Base_URI+'/usuarios', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response);
                                Swal.fire({
                                    title: 'Apagado com Sucesso',
                                    icon: 'success',
                                    confirmButtonText: 'Ok'
                                })
                                options.body = null;
                                BuscarUsuarios(document.querySelector("#PesquisaUsuario").value);
                            })
                            .catch(err => console.error(err));

                    }
                });
            };
        }
    });
}