// Función para leer los datos del archivo Excel y obtener el valor máximo de displacement y load
function processExcelFile(projectName, productName, testNumber) {
    const excelFile = document.getElementById(`excel-file-${projectName}-${productName}-${testNumber}`).files[0];

    if (excelFile) {
        const reader = new FileReader();
        
        // Cuando el archivo Excel se cargue
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            // Suponemos que los datos de displacement y load están en la primera hoja
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Convertimos la hoja en un objeto JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            let maxDisplacement = 0;
            let maxLoad = 0;

            // Iterar sobre las filas para encontrar los máximos de displacement y load
            jsonData.forEach(row => {
                const displacement = row["Displacement (inches)"];
                const load = row["Load (lbs)"];

                if (displacement > maxDisplacement) {
                    maxDisplacement = displacement;
                }
                if (load > maxLoad) {
                    maxLoad = load;
                }
            });

            // Actualizamos la interfaz con los valores máximos de displacement y load
            document.getElementById(`max-displacement-${projectName}-${productName}-${testNumber}`).innerText = maxDisplacement + " in";
            document.getElementById(`max-load-${projectName}-${productName}-${testNumber}`).innerText = maxLoad + " lbs";
        };

        // Leemos el archivo como binario
        reader.readAsBinaryString(excelFile);
    }
}
