const { firefox } = require('playwright');
const fs = require('fs');
const path = require('path');

module.exports = async function(numero) {
    const browser = await firefox.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 }); // Establecer el tamaño de la ventana

    // 1. Visitar el sitio
    await page.goto('https://hiukim.github.io/mind-ar-js-doc/tools/compile/');

    // 2. Subir la imagen
    const image = `${numero}.png`; // Usa el número para formar el nombre del archivo
    const filePath = path.resolve(__dirname, `./public/markers/${image}`);
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('button.dz-button') // El botón para abrir el selector de archivos
    ]);
    await fileChooser.setFiles(filePath);

    // 3. Iniciar la compilación haciendo clic en el botón "Start"
    await page.click('button.startButton_OY2G');

    // Esperar a que el botón de "Download compiled" esté disponible
    try {
        await page.waitForSelector('button.startButton_OY2G:has-text("Download compiled")', { timeout: 60000 });
    } catch (error) {
        console.error('Error al esperar el botón de descarga:', error);
        await browser.close();
        return;
    }

    // 4. Descargar el archivo
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('button.startButton_OY2G:has-text("Download compiled")')
    ]);

    // Obtener el nombre original del archivo descargado
    const originalFileName = download.suggestedFilename();
    const fileExtension = path.extname(originalFileName); // Extraer la extensión del archivo

    // Crear el nombre final con el nombre base y la extensión original
    const finalFileName = `${numero}${fileExtension}`;
    
    // Definir la ruta para guardar en la carpeta "public./public/markers" dentro del proyecto
    const downloadPath = path.resolve(__dirname, './public/markers', finalFileName);

    // Asegurarse de que la carpeta "./public/markers" exista
    if (!fs.existsSync(path.resolve(__dirname, './public/markers'))) {
        fs.mkdirSync(path.resolve(__dirname, './public/markers'), { recursive: true });
    }

    // Guardar el archivo descargado en la carpeta de destino
    await download.saveAs(downloadPath);

    console.log('Archivo descargado en:', downloadPath);

    // Cerrar el navegador
    await browser.close();
};
