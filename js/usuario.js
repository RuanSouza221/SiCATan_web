"use strict";
window.onload = function() {
    if(localStorage.getItem("token") !== null) {
        document.querySelector("#VoltarUsuario").href = "../pages/organizacao.html";
        document.querySelector("#CampoPermissao").innerHTML = "<div class=\"form-floating mb-3\">\n" +
            "                <select id=\"NivelUsuario\" class=\"form-select\" id=\"floatingSelect\" aria-label=\"Floating label select example\">\n" +
            "                    <option value=\"null\" selected>Selecione um nivel</option>\n" +
            "                    <option value=\"1\">Dono</option>\n" +
            "                    <option value=\"2\">Administrador</option>\n" +
            "                    <option value=\"3\">Normal</option>\n" +
            "                </select>\n" +
            "                <label for=\"NivelUsuario\">Nivel de Acesso</label>\n" +
            "            </div>";

        let modo = (new URLSearchParams(window.location.search)).get("modo");
        let id_user_org = (new URLSearchParams(window.location.search)).get("id");
        var id;
        if(modo === "pessoal"){
            id = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;
        } else if (modo === "organizacao" && id_user_org !== null){
            id = (new URLSearchParams(window.location.search)).get("id");
            document.querySelector("#SenhaUsuario").parentNode.parentNode.removeChild(document.querySelector("#SenhaUsuario").parentNode);
        }
        if(modo === "pessoal" || (modo === "organizacao" && id_user_org !== null)){
            document.querySelector("#ExecUsuario").innerHTML = "Atualizar Conta";
            document.querySelector("#ExecUsuario").id = "ExecPUTUsuario";
            options.method = "GET";
            fetch(Base_URI + '/usuarios/'+id, options)
                .then(response => response.json())
                .then(response => {
                    document.querySelector("#NomeUsuario").value = response[0].nome;
                    document.querySelector("#NomeUsuario").dataset.atual = response[0].nome;
                    document.querySelector("#EmailUsuario").value = response[0].email;
                    document.querySelector("#EmailUsuario").dataset.atual = response[0].email;
                    document.querySelector("#NivelUsuario").value = response[0].nivel;
                    document.querySelector("#NivelUsuario").dataset.atual = response[0].nivel;
                })
                .catch(err => console.error(err));
        }
    }

    if(document.querySelector("#ExecPUTUsuario")){
        document.querySelector("#ExecPUTUsuario").onclick = function () {
            let body = {};
            body.id = id;
            if(document.querySelector("#NomeUsuario").value !== document.querySelector("#NomeUsuario").dataset.atual){
                body.nome = document.querySelector("#NomeUsuario").value;
                document.querySelector("#NomeUsuario").dataset.atual = body.nome;
            }
            if(document.querySelector("#EmailUsuario").value !== document.querySelector("#EmailUsuario").dataset.atual){
                body.email = document.querySelector("#EmailUsuario").value;
                document.querySelector("#EmailUsuario").dataset.atual = body.email;
            }
            if(document.querySelector("#SenhaUsuario") !== null && document.querySelector("#SenhaUsuario").value !== ''){
                body.senha = document.querySelector("#SenhaUsuario").value;
                document.querySelector("#SenhaUsuario").value = "";
            }
            if(document.querySelector("#NivelUsuario").value !== document.querySelector("#NivelUsuario").dataset.atual){
                body.nivel = document.querySelector("#NivelUsuario").value;
                document.querySelector("#NivelUsuario").dataset.atual = body.nivel;
            }
            if(body.nome !== undefined || body.email !== undefined || body.senha !== undefined || body.nivel !== undefined){
                options.method = "PUT";
                options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
                options.body = JSON.stringify(body);
                fetch(Base_URI+'/usuarios', options)
                    .then(response => response.json())
                    .then(response => {
                        if(response.status !== "error"){
                            Swal.fire({
                                title: 'Atualizado com sucesso',
                                text: "suas alterações foram salvas",
                                icon: 'success',
                                confirmButtonText: 'Ok'
                            })
                        } else {
                            Swal.fire({
                                title: 'Problema ao Atualizar',
                                text: response.message,
                                icon: 'warning',
                                confirmButtonText: 'Ok'
                            })
                        }

                    })
                    .catch(err => console.error(err));
            }

        };
    }

    if(document.querySelector("#ExecUsuario")){
        // let numero = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        // document.querySelector("#NomeUsuario").value = "Usuario_"+numero;
        // document.querySelector("#EmailUsuario").value = "Usuario_"+numero+"@mail.com";
        // document.querySelector("#SenhaUsuario").value = "123";
        document.querySelector("#ExecUsuario").onclick = function() {
            let body = {};
            body.nome = document.querySelector("#NomeUsuario").value;
            body.email = document.querySelector("#EmailUsuario").value;
            body.senha = document.querySelector("#SenhaUsuario").value;
            if((new URLSearchParams(window.location.search)).get("modo") === "organizacao"){
                body.nivel = document.querySelector("#NivelUsuario").value
                if(body.nivel === 'null'){
                    body.nivel = 3;
                }
                options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
            }

            options.method = "POST";
            options.body = JSON.stringify(body);
            fetch(Base_URI+'/usuarios', options)
                .then(response => response.json())
                .then(response => {

                    if(typeof response.data !== "undefined"){
                        if(localStorage.getItem("token") === null && (new URLSearchParams(window.location.search)).get("modo") === null){
                            let body = {};
                            body.email = document.querySelector("#EmailUsuario").value;
                            body.senha = document.querySelector("#SenhaUsuario").value;
                            options.method = "POST";
                            options.body = JSON.stringify(body);
                            fetch(Base_URI+'/login', options)
                                .then(response => response.json())
                                .then(response => {
                                    if(response.status === "success" && typeof response.data.access_token === "string"){
                                        localStorage.setItem('token', response.data.access_token);
                                        body = {};
                                        body.descricao = "Descrição_organização_" + Math.floor(Math.random() * 1000000000).toString().padStart(20, '0');
                                        options.method = "POST";
                                        options.headers.Authorization = "Bearer "+ localStorage.getItem("token");
                                        options.body = JSON.stringify(body);
                                        fetch(Base_URI+'/organizacao', options)
                                            .then(response => response.json())
                                            .then(response => {
                                                console.log(response);
                                                if(response.status === "success"){
                                                    localStorage.removeItem("token");
                                                    Swal.fire({
                                                        title: 'Criação concluida',
                                                        text: "Você irá retornar a tela de login para continuar",
                                                        icon: 'success',
                                                        confirmButtonText: 'Ok'
                                                    }).then(() => {
                                                        window.location.assign("../pages/login.html");
                                                    });
                                                }
                                            })
                                            .catch(err => console.error(err));
                                    }
                                })

                        } else {
                            Swal.fire({
                                title: 'Criação concluida',
                                text: "Você irá retornar a tela anterior para continuar",
                                icon: 'success',
                                confirmButtonText: 'Ok'
                            }).then(() => {
                                window.location.assign("../pages/organizacao.html");
                            });
                        }
                    } else if(typeof response.errors !== "undefined"){
                        Swal.fire({
                            title: 'Criação Falhou',
                            text: response.errors.message,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                    }
                })
                .catch(err => console.error(err));
        };
    }
};