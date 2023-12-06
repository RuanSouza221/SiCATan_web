"use strict";
window.onload = function() {
    const id = (new URLSearchParams(window.location.search)).get("id");
    const ambiente = (new URLSearchParams(window.location.search)).get("ambiente");

    new QRCode(document.querySelector("#qrcode"), {
        text: id,
        width: 128,
        height: 128
    });
    document.querySelector("#qrcode > img").onload = function () {
        document.querySelector("#qrcode > img").removeAttribute("style");
        document.querySelector("#ExecQRcode").href = this.src;
        document.querySelector("#ExecQRcode").download = id+".png"
    }

    let ambiente_get = "";
    if(ambiente !== null && ambiente !== 'null'){
        ambiente_get = "&ambiente="+ambiente;
    }
    document.querySelector("#VoltarAtivo").href = "../pages/ativo.html?id="+id;
}