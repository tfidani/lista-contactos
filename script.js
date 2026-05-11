let numeros = localStorage.getItem("numeros") !== null ? JSON.parse(localStorage.getItem("numeros")) : [];

const $listaTareas = document.querySelector("#lista-numeros");
let filtroEmpiezaCon = "";


function escapeHTML(str) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}


function render() {

    let listaFinal = numeros;

    if (filtroEmpiezaCon.trim() !== "") {
        listaFinal = numeros.filter(num =>
            num.nombre.toLowerCase().startsWith(filtroEmpiezaCon.toLowerCase())
        );
    }

    $listaTareas.innerHTML = "";

    if (listaFinal.length !== 0) {
        listaFinal.forEach(element => {
        $listaTareas.innerHTML += `
            <li>
                <div>
                    <h2>> ${element.nombre}</h2>
                    <p>${element.numero}</p>
                </div>
                <button class="btn-eliminar" onclick="deleteTarea('${element.id}')">Eliminar 🗑️</button>
            </li>
            <hr />
        `
        });
    } else {
        $listaTareas.innerHTML = "<p id='vacio'>Vacio!</p>"
    }
        
}

function guardarLocalStorage() {
    localStorage.setItem("numeros", JSON.stringify(numeros))
}

function addTarea(nombre, numero) {

    const escapedNombre = escapeHTML(nombre);
    const escapedNumero = escapeHTML(numero)

    numeros.push({
        nombre: escapedNombre,
        numero: escapedNumero,
        id: crypto.randomUUID()
    })

    guardarLocalStorage()
    render()
}

function deleteTarea(numeroID) {
    numeros = numeros.filter(numero => numero.id !== numeroID)
    guardarLocalStorage()
    render()
}

const $formulario = document.querySelector("#form-add")

$formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData($formulario);

    const nombre = formData.get("input-name");
    const tel = formData.get("input-tel");

    if (nombre.trim() !== "" && tel.trim() !== "") {

        addTarea(nombre, tel)

    }

})

const $dialog = document.querySelector("#dialog");

function cerrarDialog() {
    $dialog.close()
}

function exportarContactos() {

    const b64 = btoa(JSON.stringify(numeros));
    $dialog.showModal()

    $dialog.innerHTML = `
        <h1>Exportar contactos</h1>
        <pre>${b64}</pre>
        <button onclick='cerrarDialog()'>Cerrar dialog</button>
    `
}

function importarContactosDialog(data) {

    $dialog.innerHTML = `
        <h1>Importar contactos</h1>
        <textarea id="textarea-dialog" style='width: 100%'></textarea>
        <br/>
        <button onclick='importarContactosFuncion()'>Importar</button>
        <button onclick='cerrarDialog()'>Cerrar</button>
    `
    $dialog.showModal()
}

function importarContactosFuncion() {
    const value = document.querySelector("#textarea-dialog").value;

    try {
        const b64 = atob(value);
        const imported = JSON.parse(b64)
        numeros = imported;
        guardarLocalStorage()
        $dialog.close()
        render()
    } catch {
        alert("No se pudo importar los contactos")
        $dialog.close()
    }
}

const $busqueda = document.querySelector("#busqueda")

$busqueda.addEventListener("input", (e) => {
    filtroEmpiezaCon = e.target.value;
    render()
})

render()
