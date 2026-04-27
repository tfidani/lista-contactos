let numeros = localStorage.getItem("numeros") !== null ? JSON.parse(localStorage.getItem("numeros")) : [];

const $listaTareas = document.querySelector("#lista-numeros");

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
    $listaTareas.innerHTML = "";

    numeros.forEach(element => {
        $listaTareas.innerHTML += `
            <li>
                <div>
                    <h2>> ${element.nombre}</h2>
                    <p>${element.numero}</p>
                </div>
                <button onclick="deleteTarea('${element.id}')">Eliminar</button>
            </li>
            <hr />
        `
    });
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

render()


