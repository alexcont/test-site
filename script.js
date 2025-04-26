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
   
        <button onclick="exportTestToPDF('miProyecto', 'miProducto', 1)">📄 Exportar PDF</button>

        <div>
            <strong>Máximo Displacement: </strong><span id="max-displacement-${projectName}-${productName}-${testNumber}">N/A</span><br>
            <strong>Máximo Load: </strong><span id="max-load-${projectName}-${productName}-${testNumber}">N/A</span>
        </div>
    `;
    testContainer.appendChild(testDiv);
}


// Función para leer los datos del archivo Excel y obtener el valor máximo de displacement y load
const charts = {}; // Almacena instancias para reiniciar si es necesario

function processCSVFile(project, product, test) {
    const input = document.getElementById(`excel-file-${project}-${product}-${test}`);
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());

        const dispIdx = headers.findIndex(h => h.includes("displacement"));
        const loadIdx = headers.findIndex(h => h.includes("load"));

        if (dispIdx === -1 || loadIdx === -1) {
            alert("CSV debe incluir columnas 'Displacement' y 'Load'");
            return;
        }

        const displacement = [];
        const load = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(c => parseFloat(c.trim()));
            displacement.push(cols[dispIdx]);
            load.push(cols[loadIdx]);
        }

        const maxDisp = Math.max(...displacement).toFixed(2);
        const maxLoad = Math.max(...load).toFixed(2);

        document.getElementById(`max-displacement-${project}-${product}-${test}`).innerText = `${maxDisp} in`;
        document.getElementById(`max-load-${project}-${product}-${test}`).innerText = `${maxLoad} lbs`;

        const canvasId = `chart-${project}-${product}-${test}`;
        const ctx = document.getElementById(canvasId).getContext("2d");

        // Si ya hay una gráfica previa, destruirla
        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }

        // Crear nueva gráfica
        charts[canvasId] = new Chart(ctx, {
            type: "line",
            data: {
                labels: displacement,
                datasets: [{
                    label: "Load vs Displacement",
                    data: load,
                    borderColor: "blue",
                    backgroundColor: "lightblue",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Displacement (in)" }},
                    y: { title: { display: true, text: "Load (lbs)" }}
                }
            }
        });
    };
    reader.readAsText(file);
}


// Función para generar el PDF con los datos del test
async function exportTestToPDF(projectName, productName, testNumber) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const testInfo = document.getElementById(`test-info-${projectName}-${productName}-${testNumber}`);
    const canvas = document.getElementById(`chart-${projectName}-${productName}-${testNumber}`);

    // Capturar texto del test
    const resultText = testInfo.innerText;

    // Capturar imagen de la gráfica
    const chartImage = await html2canvas(canvas).then(canvas => canvas.toDataURL("image/png"));

    // Agregar texto al PDF
    const lines = pdf.splitTextToSize(resultText, 180);
    pdf.text(lines, 10, 10);

    // Agregar la gráfica al PDF (después del texto)
    pdf.addImage(chartImage, 'PNG', 10, 50, 180, 90);

    pdf.save(`${projectName}_${productName}_Test${testNumber}.pdf`);
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
