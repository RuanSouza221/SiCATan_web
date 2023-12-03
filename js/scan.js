window.onload = function() {
    let intervalId;
    const video = document.querySelector("#video");
    // const resultDiv = document.querySelector("#result");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                // Define o stream de vídeo no elemento video
                video.srcObject = stream;
                video.play();

                // Chama a função de processamento a cada quadro do vídeo
                video.addEventListener('canplay', () => {
                    intervalId = setInterval(() => {
                        processarQuadro(video);
                    }, 300);
                });
            })
            .catch((error) => {
                console.error('Erro ao acessar a câmera:', error);
            });
    } else {
        console.error('getUserMedia não suportado no navegador.');
    }

    function processarQuadro(video) {
        // Obtém o contexto do canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Obtém os dados do quadro e decodifica o código QR
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        // Exibe o resultado no elemento resultDiv
        if (code) {
            console.log(code.data);

            if((new URLSearchParams(window.location.search)).get("id") !== null){
                let title;
                let icon;
                let text;

                if(code.data === (new URLSearchParams(window.location.search)).get("id")){
                    title = "Verificado com sucesso";
                    text = "Ativo escaneado condiz com o registro";
                    icon = "success";
                } else {
                    title = "Registro não condiz";
                    text = "Ativo escaneado não é o mesmo do registro";
                    icon = "warning";
                }
                window.clearInterval(intervalId);

                Swal.fire({
                    title: title,
                    text: text,
                    icon: icon,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    let get = '';
                    if((new URLSearchParams(window.location.search)).get("ambiente") !== null){
                        get = "?id="+(new URLSearchParams(window.location.search)).get("ambiente");
                    }
                    window.location.assign("../pages/ativos.html"+get);
                });
            } else {
                window.location.assign("../pages/ativo.html?id="+code.data);
            }
            // resultDiv.textContent = 'Código QR encontrado: ' + code.data;
        } else {
            console.log("falha")
            // resultDiv.textContent = 'Nenhum código QR encontrado.';
        }
    }

}