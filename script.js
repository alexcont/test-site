const charts = {};
let projectCount = 0;

function createNewProject() {
    const projectName = `Proyecto${++projectCount}`;
    const container = document.createElement("div");
    container.className = "project";
    container.id = `project-${projectName}`;
    container.innerHTML = `
        <h2>${projectName}</h2>
        <button onclick="createNewProduct('${projectName}')">➕ Agregar Producto</button>
        <div id="products-${projectName}"></div>
    `;
    document.getElementById("project-list").appendChild(container);
}

function createNewProduct(projectName) {
    const productId = `Producto${Date.now()}`;
    const container = document.createElement("div");
    container.className = "product";
    container.id = `product-${projectName}-${productId}`;
    container.innerHTML = `
        <h3>${productId}</h3>
        <button onclick="createNewTest('${projectName}', '${productId}')">➕ Agregar Test</button>
        <div id="tests-${projectName}-${productId}"></div>
    `;
    document.getElementById(`products-${projectName}`).appendChild(container);
}

function createNewTest(project, product) {
    const testNum = Date.now();
    const container = document.createElement("div");
    container.className = "test";
    container.innerHTML = `
        <h4>Test #${testNum}</h4>
        <input type="file" accept=".csv" id="excel-file-${project}-${product}-${testNum}"
            onchange="processCSVFile('${project}', '${product}', ${testNum})">
        <p class="metrics">
            Máx Displacement: <span id="max-displacement-${project}-${product}-${testNum}">-</span><br>
            Máx Load: <span id="max-load-${project}-${product}-${testNum}">-</span>
        </p>
        <canvas id="chart-${project}-${product}-${testNum}" width="400" height="200"></canvas><br>
        <button onclick="exportTestToPDF('${project}', '${product}', ${testNum})">📄 Exportar PDF</button>
    `;
    document.getElementById(`tests-${project
