// Función para crear un nuevo proyecto
function createNewProject() {
    const projectName = prompt("Nombre del nuevo proyecto:");
    if (!projectName) return;

    const projectSection = document.createElement("div");
    projectSection.classList.add("project-folder");
    projectSection.innerHTML = `
        <h2>${projectName}</h2>
        <button onclick="createNewProduct('${projectName}')">➕ Agregar Producto</button>
        <div id="products-${projectName}" class="product-list"></div>
        <hr>
    `;
    document.getElementById("project-list").appendChild(projectSection);
}


// Función para crear un nuevo producto dentro de un proyecto
function createNewProduct(projectName) {
    const productName = prompt(`Ingresa el nombre del producto para el proyecto: ${projectName}`);
    if (productName) {
        const productContainer = document.getElementById(`products-${projectName}`);
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <h4>${productName}</h4>
            <button onclick="createNewTest('${projectName}', '${productName}')">+ Agregar test</button>
            <div id="tests-${projectName}-${productName}"></div>
        `;
        productContainer.appendChild(productDiv);
    }
}

// Función para crear un nuevo test dentro de un producto
function createNewTest(projectName, productName) {
    const testNumber = document.querySelectorAll(`#tests-${projectName}-${productName} .test`).length + 1;  // Contador de tests
    const testContainer = document.getElementById(`tests-${projectName}-${productName}`);
    const testDiv = document.createElement("div");
    testDiv.classList.add("test");
    testDiv.innerHTML = `
        <h5>Test ${testNumber} de ${productName}</h5>
        <input type="date" id="test-date-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="excel-file-${projectName}-${productName}-${testNumber}" onchange="processExcelFile('${projectName}', '${productName}', ${testNumber})" />
        <input type="file" id="photo1-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="photo2-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="video-${projectName}-${productName}-${testNumber}" />
        <input type="text" id="test-notes-${projectName}-${productName}-${testNumber}" placeholder="Notas del test" />
        <input type="file" accept=".csv" onchange="processCSVFile('proyectoX', 'productoY', 1)">


        <button onclick="generatePDF('${projectName}', '${productName}', ${testNumber})">Generar Reporte PDF</button>
        
        <div>
            <strong>Máximo Displacement: </strong><span id="max-displacement-${projectName}-${productName}-${testNumber}">N/A</span><br>
            <strong>Máximo Load: </strong><span id="max-load-${projectName}-${productName}-${testNumber}">N/A</span>
        </div>
    `;
    testContainer.appendChild(testDiv);
}


// Función para leer los datos del archivo Excel y obtener el valor máximo de displacement y load
function processCSVFile(projectName, productName, testNumber) {
    const fileInput = document.getElementById(`excel-file-${projectName}-${productName}-${testNumber}`);
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim());

        const dispIndex = headers.findIndex(h => h.toLowerCase().includes("displacement"));
        const loadIndex = headers.findIndex(h => h.toLowerCase().includes("load"));

        if (dispIndex === -1 || loadIndex === -1) {
            alert("El archivo CSV debe tener columnas 'Displacement' y 'Load'.");
            return;
        }

        const displacement = [];
        const load = [];

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",").map(val => parseFloat(val.trim()));
            displacement.push(row[dispIndex]);
            load.push(row[loadIndex]);
        }

        const maxDisp = Math.max(...displacement);
        const maxLoad = Math.max(...load);

        document.getElementById(`max-displacement-${projectName}-${productName}-${testNumber}`).innerText = maxDisp.toFixed(2) + " in";
        document.getElementById(`max-load-${projectName}-${productName}-${testNumber}`).innerText = maxLoad.toFixed(2) + " lbs";

        // Dibujar gráfica
        const ctx = document.getElementById(`chart-${projectName}-${productName}-${testNumber}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: displacement,
                datasets: [{
                    label: 'Load vs Displacement',
                    data: load,
                    borderColor: 'green',
                    backgroundColor: 'lightgreen',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Displacement (in)' }
                    },
                    y: {
                        title: { display: true, text: 'Load (lbs)' }
                    }
                }
            }
        });
    };

    reader.readAsText(file); // Lee como texto plano (CSV)
}


// Función para generar el PDF con los datos del test
function generatePDF(projectName, productName, testNumber) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener los archivos seleccionados
    const excelFile = document.getElementById(`excel-file-${projectName}-${productName}-${testNumber}`).files[0];
    const photo1 = document.getElementById(`photo1-${projectName}-${productName}-${testNumber}`).files[0];
    const photo2 = document.getElementById(`photo2-${projectName}-${productName}-${testNumber}`).files[0];
    const video = document.getElementById(`video-${projectName}-${productName}-${testNumber}`).files[0];
    const testNotes = document.getElementById(`test-notes-${projectName}-${productName}-${testNumber}`).value;

    // Obtener los valores máximos de displacement y load
    const maxDisplacement = document.getElementById(`max-displacement-${projectName}-${productName}-${testNumber}`).innerText;
    const maxLoad = document.getElementById(`max-load-${projectName}-${productName}-${testNumber}`).innerText;

    // Aquí agregaríamos los datos del archivo Excel, las fotos y el video (esto es un ejemplo simple)
    doc.text(`Reporte de Test: ${productName}`, 10, 10);
    doc.text(`Proyecto: ${projectName}`, 10, 20);
    doc.text(`Test No: ${testNumber}`, 10, 30);
    doc.text(`Notas: ${testNotes}`, 10, 40);
    doc.text(`Máximo Displacement: ${maxDisplacement}`, 10, 50);
    doc.text(`Máximo Load: ${maxLoad}`, 10, 60);

    // Mostrar imágenes (de las fotos seleccionadas, por ejemplo)
    if (photo1) {
        const photo1URL = URL.createObjectURL(photo1);
        doc.addImage(photo1URL, 'JPEG', 10, 70, 50, 50);
    }

    if (photo2) {
        const photo2URL = URL.createObjectURL(photo2);
        doc.addImage(photo2URL, 'JPEG', 70, 70, 50, 50);
    }

    // Generar el PDF
    doc.save(`${projectName}_${productName}_Test_Report_${testNumber}.pdf`);

    // Actualizar la tabla con los resultados del test
    updateSummaryTable(projectName, productName, testNumber);
}


// Función para actualizar la tabla de resumen con los resultados
function updateSummaryTable(projectName, productName, testNumber) {
    const testDate = document.getElementById(`test-date-${projectName}-${productName}-${testNumber}`).value;
    const testNotes = document.getElementById(`test-notes-${projectName}-${productName}-${testNumber}`).value;
    const result = "Resultado del Test";  // Aquí puedes agregar lógica para calcular el resultado del test (por ejemplo, de los datos Excel)

    // Crear una fila para la tabla de resumen
    const tableBody = document.querySelector("#summary-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><a href="#" onclick="viewTestDetails('${projectName}', '${productName}', ${testNumber})">${productName}</a></td>
        <td>${testNumber}</td>
        <td>${testDate}</td>
        <td>${result}</td>
        <td>${testNotes}</td>
    `;
    tableBody.appendChild(row);
}

// Función para ver los detalles del test al hacer clic en la tabla
function viewTestDetails(projectName, productName, testNumber) {
    alert(`Ver detalles del Test ${testNumber} de ${productName} en el Proyecto: ${projectName}`);
}

function processExcelFile(projectName, productName, testNumber) {
    const excelFile = document.getElementById(`excel-file-${projectName}-${productName}-${testNumber}`).files[0];

    if (excelFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            let displacement = [];
            let load = [];

            jsonData.forEach(row => {
                displacement.push(row["Displacement (inches)"]);
                load.push(row["Load (lbs)"]);
            });

            // Calcular máximos
            const maxDisp = Math.max(...displacement);
            const maxLoad = Math.max(...load);

            document.getElementById(`max-displacement-${projectName}-${productName}-${testNumber}`).innerText = maxDisp + " in";
            document.getElementById(`max-load-${projectName}-${productName}-${testNumber}`).innerText = maxLoad + " lbs";

            // Dibujar gráfico
            const ctx = document.getElementById(`chart-${projectName}-${productName}-${testNumber}`).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: displacement,
                    datasets: [{
                        label: 'Load vs Displacement',
                        data: load,
                        borderColor: 'blue',
                        backgroundColor: 'lightblue',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: { display: true, text: 'Displacement (in)' }
                        },
                        y: {
                            title: { display: true, text: 'Load (lbs)' }
                        }
                    }
                }
            });
        };
        reader.readAsBinaryString(excelFile);
    }
}
