"use strict";
window.onload = function() {
    const organizacao = localStorage.getItem("organizacao");
    const id = (new URLSearchParams(window.location.search)).get("id");
    let get;
    let ambiente ="";

    if(id !== null){
        document.querySelector("#AdicionarAtivos").href = "/pages/ativo.html?ambiente="+id;
        get = '?ativo_ambiente='+id;
        ambiente = "&ambiente="+id;

        options.method = "GET";
        fetch(Base_URI + '/ativos/'+id, options)
            .then(response => response.json())
            .then(response => {
                document.querySelector("#NomeAtivo").innerHTML += '<li class="breadcrumb-item" aria-current="page">'+response[0].descricao+'</li>';
                if(response[0].ativo_ambiente !== null){
                    document.querySelector("#VoltarAtivos").href = "/pages/ativos.html?id="+response[0].ativo_ambiente;
                }
            })
            .catch(err => console.error(err));

    } else {
        document.querySelector("#VoltarAtivos").parentNode.removeChild(document.querySelector("#VoltarAtivos"));
        get = '?organizacao='+organizacao;
    }

    document.querySelector("#Buscar").onclick = function () {
        BuscarAtivos(get,ambiente,document.querySelector("#PesquisaAtivo").value);
        document.querySelector("#ListaAtivos").innerHTML = "";
    }
    BuscarAtivos(get,ambiente);

    if(Nivel_acesso > 2){
        document.querySelector("#AdicionarAtivos").remove();
    }

}

function BuscarAtivos(get,ambiente,dados=null){
    let dado = "";
    if(dados !== null && dados !== '' && dados !== undefined){
        dado = "&descricao="+dados;
    }

    options.method = "GET";
    fetch(Base_URI + '/ativos/' + get + dado, options)
        .then(response => response.json())
        .then(response => {
            response.forEach(function(elemento) {
                if(elemento.inativo === 0){
                    let elem = '<li class="list-group-item">\n' +
                        elemento.descricao +
                        '            <div class="float-end">\n' +
                        '                <a href="/pages/ativo.html?id='+elemento.id+ambiente+'" class="link-dark"><span class="material-symbols-outlined me-2">edit</span></a>\n' +
                        '                <a href="/pages/ativos.html?id='+elemento.id+ambiente+'" class="link-dark"><span class="material-symbols-outlined me-2">add</span></a>\n' +
                        '                <a href="/pages/scan.html?id='+elemento.id+ambiente+'" class="link-dark"><span class="material-symbols-outlined me-2">mobile_friendly</span></a>\n' +
                        '                <a data-id="'+elemento.id+'" class="link-dark DeletarAtivo"><span class="material-symbols-outlined">delete</span></a>\n' +
                        '            </div>\n' +
                        '        </li>';
                    document.querySelector("#ListaAtivos").innerHTML += elem;
                }
            });
            AtivaDelete();
        })
        .catch(err => console.error(err));
}

function AtivaDelete(){
    document.querySelectorAll('.DeletarAtivo').forEach(function(elemento) {
        if(Nivel_acesso > 2){
            elemento.remove()
        } else {
            elemento.onclick = function() {

                Swal.fire({
                    title: 'Deseja Apagar?',
                    text: "qualquer ativo contido nele será apagado",
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    showCancelButton: true
                }).then((result) => {
                    if(result.isConfirmed){
                        console.log(this.dataset.id);
                        let body = {};
                        body.id = this.dataset.id
                        body.inativo = 1
                        options.method = "PUT";
                        options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
                        options.body = JSON.stringify(body);
                        fetch(Base_URI+'/ativos', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response);
                                Swal.fire({
                                    title: 'Apagado com Sucesso',
                                    icon: 'success',
                                    confirmButtonText: 'Ok'
                                }).then(() => {
                                    location.reload();
                                });

                            })
                            .catch(err => console.error(err));

                    }
                });
            };
        }
    });
}
