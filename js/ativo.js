"use strict";
window.onload = function() {
    const organizacao = localStorage.getItem("organizacao");
    const id = (new URLSearchParams(window.location.search)).get("id");
    const ambiente = (new URLSearchParams(window.location.search)).get("ambiente");
    let pai_ambiente;
    let ambiente_opg;

    if(id !== null){
        document.querySelector("#ExecAtivo").id = "ExecPUTAtivo";
    }

    options.method = "GET";
    fetch(Base_URI + '/ativos/?organizacao='+organizacao, options)
        .then(response => response.json())
        .then(response => {
            let opg = document.createElement('optgroup');
            opg.label = "Raiz";
            response.forEach(function(elemento) {
                if(id === null || elemento.id !== id){
                    let opt = document.createElement('option');
                    opt.value = elemento.id;
                    opt.innerHTML = elemento.descricao;
                    opg.appendChild(opt);
                }
            });
            document.querySelector("#AmbienteAtivo").appendChild(opg);


            if(ambiente !== null && ambiente !== 'null'){

                options.method = "GET";
                fetch(Base_URI + '/ativos/'+ambiente, options)
                    .then(response => response.json())
                    .then(response => {
                        let opg = document.createElement('optgroup');
                        opg.label = "Pai";
                        let opt = document.createElement('option');
                        opt.value = response[0].id;
                        opt.innerHTML = response[0].descricao;
                        opg.appendChild(opt);
                        document.querySelector("#AmbienteAtivo").value = ambiente;

                        pai_ambiente = response[0].ativo_ambiente;
                        if(pai_ambiente !== null){
                            ambiente_opg = opg;

                            options.method = "GET";
                            fetch(Base_URI + '/ativos/'+pai_ambiente, options)
                                .then(response => response.json())
                                .then(response => {
                                    let opg = document.createElement('optgroup');
                                    opg.label = "Avô";
                                    let opt = document.createElement('option');
                                    opt.value = response[0].id;
                                    opt.innerHTML = response[0].descricao;
                                    opg.appendChild(opt);
                                    document.querySelector("#AmbienteAtivo").appendChild(opg);
                                    document.querySelector("#AmbienteAtivo").appendChild(ambiente_opg);
                                    document.querySelector("#AmbienteAtivo").value = ambiente;
                                    montaSelectIrmaos(ambiente,id);
                                })
                                .catch(err => console.error(err));

                        } else {
                            document.querySelector("#AmbienteAtivo").appendChild(opg);
                            document.querySelector("#AmbienteAtivo").value = ambiente;
                            montaSelectIrmaos(ambiente,id);
                        }
                    })
                    .catch(err => console.error(err));


                document.querySelector("#AmbienteAtivo").value = ambiente;
            }
            if(id !== null){
                ConsultaAtivo(id);
            }
        })
        .catch(err => console.error(err));

    if(document.querySelector("#ExecQR")){
        let divqr = document.createElement('div');
        new QRCode(divqr, {
            text: id,
            width: 128,
            height: 128
        });
        let imgqr = divqr.getElementsByTagName("img")[0];
        imgqr.onload = function () {
            let testejanela = window.open('', '_blank');
            if(testejanela !== null){
                testejanela.close();
                document.querySelector("#ExecQR").onclick = function() {
                    let janelaImpressao = window.open('', '_blank');
                    janelaImpressao.document.write('<img alt="qrcode" src="' + imgqr.src + '" />');
                    janelaImpressao.document.close();
                }
            } else {
                document.querySelector("#ExecQR").href = imgqr.src;
            }
        }
    }

    if(document.querySelector("#ExecPUTAtivo")){
        document.querySelector("#ExecPUTAtivo").onclick = function() {
            let body = {};
            body.id = id;
            if(document.querySelector("#DescricaoAtivo").value !== document.querySelector("#DescricaoAtivo").dataset.atual){
                body.descricao = document.querySelector("#DescricaoAtivo").value;
                document.querySelector("#DescricaoAtivo").dataset.atual = body.descricao;
            }
            if(document.querySelector("#CategoriaAtivo").value !== document.querySelector("#CategoriaAtivo").dataset.atual){
                body.categoria = document.querySelector("#CategoriaAtivo").value;
                document.querySelector("#CategoriaAtivo").dataset.atual = body.categoria;
            }
            if(document.querySelector("#AmbienteAtivo").value !== document.querySelector("#AmbienteAtivo").dataset.atual){
                body.ativo_ambiente = document.querySelector("#AmbienteAtivo").value;
                document.querySelector("#AmbienteAtivo").dataset.atual = body.ativo_ambiente;
                if(body.ativo_ambiente !== 'null'){
                    document.querySelector("#VoltarAtivo").href = "../pages/ativos.html?id="+body.ativo_ambiente;
                } else {
                    body.ativo_ambiente = null;
                    document.querySelector("#VoltarAtivo").href = "../pages/ativos.html";
                }
            }
            if(body.descricao !== undefined || body.categoria !== undefined || body.ativo_ambiente !== undefined){
                options.method = "PUT";
                options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
                options.body = JSON.stringify(body);
                fetch(Base_URI+'/ativos', options)
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        Swal.fire({
                            title: 'Atualizado com sucesso',
                            text: "suas alterações foram salvas",
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }).then(() => {
                            window.location.assign("../pages/ativo.html?id="+response.data.id+"&ambiente="+document.querySelector("#AmbienteAtivo").value);
                        });
                    })
                    .catch(err => console.error(err));
            }
        }

    }

    if(document.querySelector("#ExecAtivo")){
        document.querySelector("#ExecQR").parentNode.removeChild(document.querySelector("#ExecQR"));
        if(ambiente !== null){
            document.querySelector("#VoltarAtivo").href = "../pages/ativos.html?id="+ambiente;
        }

        let numero = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        document.querySelector("#DescricaoAtivo").value = "Ativo_"+ numero;
        document.querySelector("#CategoriaAtivo").value = "Categoria_"+ numero;
        document.querySelector("#ExecAtivo").onclick = function() {
            let body = {};
            body.descricao = document.querySelector("#DescricaoAtivo").value;
            body.categoria = document.querySelector("#CategoriaAtivo").value;
            if(document.querySelector("#AmbienteAtivo").value !== "null" && document.querySelector("#AmbienteAtivo").value !== '0'){
                body.ativo_ambiente = document.querySelector("#AmbienteAtivo").value;
            }
            options.method = "POST";
            options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
            options.body = JSON.stringify(body);
            fetch(Base_URI+'/ativos', options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    console.log(response.data.id);
                    Swal.fire({
                        title: 'Ativo Salvo com sucesso',
                        text: "",
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        window.location.assign("../pages/ativo.html?id="+response.data.id+"&ambiente="+document.querySelector("#AmbienteAtivo").value);
                    });
                })
                .catch(err => console.error(err));
        }
    }
    if(Nivel_acesso > 2){
        document.querySelector("#ExecPUTAtivo").remove();
    }
}

function ConsultaAtivo(id) {

    options.method = "GET";
    fetch(Base_URI + '/ativos/'+id, options)
        .then(response => response.json())
        .then(response => {
            console.log();
            if(response.message !== "Resultado não encontrado"){
                document.querySelector("#DescricaoAtivo").value = response[0].descricao;
                document.querySelector("#DescricaoAtivo").dataset.atual = response[0].descricao;
                document.querySelector("#CategoriaAtivo").value = response[0].categoria;
                document.querySelector("#CategoriaAtivo").dataset.atual = response[0].categoria;
                document.querySelector("#AmbienteAtivo").value = response[0].ativo_ambiente;
                document.querySelector("#AmbienteAtivo").dataset.atual = response[0].ativo_ambiente;

                if(response[0].ativo_ambiente !== null){
                    document.querySelector("#VoltarAtivo").href = "../pages/ativos.html?id="+response[0].ativo_ambiente;
                }
            } else {
                Swal.fire({
                    title: "Ativo não indentificado",
                    text: "Ativo não encontrado  com o código fornecido.",
                    icon: "info",
                    confirmButtonText: 'Ok'
                }).then(() => {
                    if(document.referrer.includes("/pages/scan.html")){
                        window.location.assign("../pages/scan.html");
                    } else {
                        window.history.go(-1);
                    }
                });
            }
        })
        .catch(err => console.error(err));
}

function montaSelectIrmaos(ambiente,id) {
    options.method = "GET";
    fetch(Base_URI + '/ativos/?ativo_ambiente='+ambiente, options)
        .then(response => response.json())
        .then(response => {
            if(response.message === undefined){
                let opg = document.createElement('optgroup');
                opg.label = "Irmãos";
                response.forEach(function(elemento) {
                    if(id === null || elemento.id !== id){
                        let opt = document.createElement('option');
                        opt.value = elemento.id;
                        opt.innerHTML = elemento.descricao;
                        opg.appendChild(opt);
                    }
                });
                document.querySelector("#AmbienteAtivo").appendChild(opg);
                document.querySelector("#AmbienteAtivo").value = ambiente;
            }
        })
        .catch(err => console.error(err));
}