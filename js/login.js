"use strict";

if(document.querySelector("#ExecLogin")){
    document.querySelector("#ExecLogin").onclick = function() {
        let body = {};
        body.email = document.querySelector("#EmailLogin").value;
        body.senha = document.querySelector("#SenhaLogin").value;

        options.method = "POST";
        options.body = JSON.stringify(body);
        Swal.fire({allowOutsideClick:false,allowEscapeKey:false,didOpen:()=>{Swal.showLoading()}});
        fetch(Base_URI+'/login', options)
            .then(response => response.json())
            .then(response => {
                Swal.close();
                if(response.status === "success" && typeof response.data.access_token === "string"){
                    localStorage.setItem('token', response.data.access_token);
                    window.location.assign("../pages/organizacao.html");
                } else if(response.status === "error") {
                    Swal.fire({
                        title: 'Login Falhou',
                        text: response.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }
            })
            .catch(err => {console.error(err);Swal.close();});
    };
}