const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = function(numero) {
    const folderPath = path.join(__dirname, './public/markers');
    const fileName = `${numero}.png`;
    const filePath = path.join(folderPath, fileName);
    const mindFilePath = path.join(folderPath, `${numero}.mind`);

    // Verifica si la carpeta existe, si no, la crea
    if (!fs.existsSync(folderPath)) {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Carpeta markers creada.');
        } catch (err) {
            console.error('Error creando la carpeta:', err);
            process.exit(1); // Salir del proceso en caso de error
        }
    }

    async function generarQRCode() {
        const link = 'https://datalab-um.github.io/Chec-AR/'; // Enlace que quieres codificar

        try {
            // Ajusta el tamaño del QR con la opción width
            await QRCode.toFile(filePath, link, { width: 300 });
            console.log(`Código QR guardado como ${numero}.png en la carpeta markers`);
            
            // Llama a la función para convertir el archivo después de generarlo
            await convertirPNGAMind();
        } catch (err) {
            console.error('Error generando el QR o convirtiendo el archivo:', err);
        }
    }

    async function convertirPNGAMind() {
        try {
            await sharp(filePath).toFile(mindFilePath);
            console.log(`Archivo convertido guardado como ${numero}.mind en la carpeta markers`);
        } catch (err) {
            console.error('Error convirtiendo el archivo:', err);
        }
    }

    // Ejecuta la función para generar el QR
    generarQRCode();
};
