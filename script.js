// Función para crear un nuevo proyecto
function createNewProject() {
    const projectName = prompt("Ingresa el nombre del nuevo proyecto:");
    if (projectName) {
        const projectContainer = document.getElementById("project-list");
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");
        projectDiv.innerHTML = `
            <h3>${projectName}</h3>
            <button onclick="createNewProduct('${projectName}')">+ Agregar producto</button>
            <div id="products-${projectName}"></div>
        `;
        projectContainer.appendChild(projectDiv);
    }
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
        <input type="file" id="excel-file-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="photo1-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="photo2-${projectName}-${productName}-${testNumber}" />
        <input type="file" id="video-${projectName}-${productName}-${testNumber}" />
        <input type="text" id="test-notes-${projectName}-${productName}-${testNumber}" placeholder="Notas del test" />
        <button onclick="generatePDF('${projectName}', '${productName}', ${testNumber})">Generar Reporte PDF</button>
    `;
    testContainer.appendChild(testDiv);
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

    // Aquí agregaríamos los datos del archivo Excel, las fotos y el video (esto es un ejemplo simple)
    doc.text(`Reporte de Test: ${productName}`, 10, 10);
    doc.text(`Proyecto: ${projectName}`, 10, 20);
    doc.text(`Test No: ${testNumber}`, 10, 30);
    doc.text(`Notas: ${testNotes}`, 10, 40);

    // Mostrar imágenes (de las fotos seleccionadas, por ejemplo)
    if (photo1) {
        const photo1URL = URL.createObjectURL(photo1);
        doc.addImage(photo1URL, 'JPEG', 10, 50, 50, 50);
    }

    if (photo2) {
        const photo2URL = URL.createObjectURL(photo2);
        doc.addImage(photo2URL, 'JPEG', 70, 50, 50, 50);
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

