const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para descargar el video en base64, convertirlo a mp4 y guardarlo
module.exports = function(numero) {
    const url = `https://lucy.chec.com.co/backchatweb/videofactura/videofactura?niu=${numero}`;
    const videoFileName = `${numero}.mp4`;
    const videoFilePath = path.join(__dirname, './public/markers', videoFileName);

    if (!fs.existsSync(path.resolve(__dirname, './public/markers'))) {
        fs.mkdirSync(path.resolve(__dirname, './public/markers'), { recursive: true });
        console.log('Carpeta markers creada.');
    }

    const options = {
        rejectUnauthorized: false
    };

    https.get(url, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const jsonResponse = JSON.parse(data);
4
                if (jsonResponse && jsonResponse.videofactura) {
                    const base64Data = jsonResponse.videofactura;
                    const buffer = Buffer.from(base64Data, 'base64');
                    fs.writeFile(videoFilePath, buffer, (err) => {
                        if (err) {
                            console.error('Error al guardar el archivo de video:', err);
                        } else {
                            console.log(`Video de factura guardado como ${videoFileName} en la carpeta markers.`);
                        }
                    });
                } else {
                    console.error('Error: La respuesta JSON no contiene el campo base64 esperado.');
                }
            } catch (error) {
                console.error('Error al procesar la respuesta:', error);
            }
        });

        response.on('error', (err) => {
            console.error('Error al recibir los datos:', err.message);
        });
    }).on('error', (err) => {
        console.error('Error al realizar la solicitud:', err.message);
    });
};
