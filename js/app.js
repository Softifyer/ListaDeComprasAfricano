//Captura nuevos artículos
function capturar () {
    function Articulo (nombre, precio1, precio2, cantidad, precioTotal, ahorro) {
        this.nombre = nombre;
        this.precio1 = parseFloat(precio1);
        this.precio2 = parseFloat(precio2);
        this.cantidad = parseInt(cantidad);        
        this.precioTotal = precioTotal;
        this.ahorro = ahorro;

    }; 

    //Captura los datos para los nuevos artículos
    const nombreCapturar = document.getElementById('nombreArtículo').value;
    const precio1Capturar = document.getElementById('precioArtículo1').value;
    const precio2Capturar = document.getElementById('precioArtículo2').value;
    const cantidadCapturar = document.getElementById('cantidad').textContent;
    const precioTotalCapturar = document.getElementById('precioTotal').textContent;
    const ahorroCapturar = document.getElementById('ahorro').textContent;

    //Creo el nuevo artículo
    nuevoArticulo = new Articulo (nombreCapturar, precio1Capturar, precio2Capturar, cantidadCapturar, precioTotalCapturar, ahorroCapturar);
    console.log(nuevoArticulo);
    agregarArticulo();

};

//Creo un array vacío y lo lleno con los datos de los artículos para mostrarlos en el HTML
const listaArticulos = [];

filaActualProductos = 0; // Inicializo el contador de filas de productos

function agregarArticulo() {

    // Capturo los datos
    const nombreInput = document.getElementById('nombreArtículo');
    const precio1Input = document.getElementById('precioArtículo1');
    const precio2Input = document.getElementById('precioArtículo2');
    const cantidadElement = document.getElementById('cantidad');
    const precioTotalElement = document.getElementById('precioTotal');
    const ahorroElement = document.getElementById('ahorro');

    const nombreCapturar = nombreInput.value;
    const precio1Capturar = parseFloat(precio1Input.value);
    const precio2Capturar = parseFloat(precio2Input.value);
    const cantidadCapturar = parseInt(cantidadElement.textContent);
    const precioTotalCapturar = cantidadCapturar * (precio1Capturar < precio2Capturar ? precio1Capturar : precio2Capturar);

    listaArticulos.push(nuevoArticulo);
    const listaProductos = document.getElementById("listaProductos");

    filaActualProductos = filaActualProductos + 1;

    //Inserto HTML en el código
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${filaActualProductos}</td>
        <td>${nombreCapturar}</td>
        <td>${precioTotalCapturar/cantidadCapturar}</td>
        <td>${cantidadCapturar}</td>
        <td>${precioTotalCapturar}</td>
        <td class="ahorroProducto">${nuevoArticulo.ahorro}</td>
        <td><button onclick="eliminarFilaProducto(this)">Eliminar</button></td>`;
    
    listaProductos.appendChild(fila);

    // Limpio los campos de entrada
    nombreInput.value = '';
    precio1Input.value = '';
    precio2Input.value = '';
    cantidadElement.textContent = '0';
    precioTotalElement.textContent = '0.00';
    ahorroElement.textContent = '0.00';

    // Llamo a la función para actualizar los totales en listaProductos
    actualizarTotalesProductos();
    blanquearTotales();
};

//Esta función elimina el producto de la fila seleccionada
function eliminarFilaProducto(button) {
    const fila = button.closest('tr');
    filaActualProductos = filaActualProductos - 1; 
    fila.remove();
    actualizarTotalesProductos();
};

//Blanquear los totales al agregar productos
function blanquearTotales () {
    document.getElementById('totalCantidad').textContent = 0;
    document.getElementById('totalPrecioTotal').textContent = "0.00";
    document.getElementById('totalAhorro').textContent = "0.00";

};

// Llama a actualizarTotales después de cada cambio
function actualizarTodo() {
    actualizarTotales();
};

//Actualiza el precio total de la lista
function actualizarPrecioTotal(fila) {
    const cantidad = parseInt(fila.querySelector('.cantidad p').textContent);
    const precioProducto1 = parseFloat(fila.querySelector('.precioProducto1').value);
    const precioProducto2 = parseFloat(fila.querySelector('.precioProducto2').value);

    if (!isNaN(cantidad) && !isNaN(precioProducto1)) {
        if (precioProducto1 > precioProducto2) {
            const precioTotal = cantidad * precioProducto2;
            fila.querySelector('.precioTotal').textContent = ('$' + precioTotal.toFixed(2));
            actualizarTotales();
        }else if (precioProducto2 > precioProducto1) {
            const precioTotal = cantidad * precioProducto1;
            fila.querySelector('.precioTotal').textContent = ('$' + precioTotal.toFixed(2));
            actualizarTotales();
        }                    
    } else {
        fila.querySelector('.precioTotal').textContent = '0.00';
        actualizarTotales();
    }
};

//Actualiza la cantidad de la columna ahorro
function actualizarAhorro(fila) {
    const precioProducto1 = parseFloat(fila.querySelector('.precioProducto1').value);
    const precioProducto2 = parseFloat(fila.querySelector('.precioProducto2').value);
    const cantidad = parseInt(fila.querySelector('.cantidad p').textContent);

    if (!isNaN(precioProducto1) && !isNaN(precioProducto2)) {
        const ahorro = (precioProducto1 - precioProducto2) * cantidad;
        if (ahorro < 0) {
            fila.querySelector('.ahorro').textContent = ('$' + ahorro.toFixed(2)*(-1));
        }else{
            fila.querySelector('.ahorro').textContent = ('$' + ahorro.toFixed(2));
        }             
        
    } else {
        fila.querySelector('.ahorro').textContent = '0.00';
    }
};

//Aumenta las unidades de un artículo
function aumentarCantidad(button) {
    const fila = button.closest('tr');
    const cantidadElement = fila.querySelector('.cantidad p');
    let cantidad = parseInt(cantidadElement.textContent);
    cantidad++;
    cantidadElement.textContent = cantidad;
    actualizarPrecioTotal(fila);
    actualizarAhorro(fila);
    actualizarTotales();
};

//Disminuye las unidades de un artículo
function disminuirCantidad(button) {
    const fila = button.closest('tr');
    const cantidadElement = fila.querySelector('.cantidad p');
    let cantidad = parseInt(cantidadElement.textContent);
    if (cantidad > 0) {
        cantidad--;
        cantidadElement.textContent = cantidad;
        actualizarPrecioTotal(fila);
        actualizarAhorro(fila);
        actualizarTotales();
    }
};

//Actualiza todos los totales
function actualizarTotales() {
    const filas = document.querySelectorAll('#listaCompras tr');
    let totalCantidad = 0;
    let totalPrecioTotal = 0;
    let totalAhorro = 0;

    filas.forEach(fila => {
        const cantidad = parseInt(fila.querySelector('.cantidad p').textContent);
        const precioTotal = parseFloat(fila.querySelector('.precioTotal').textContent.replace('$', '')); // Elimina el símbolo '$' y convierte a número
        const ahorro = parseFloat(fila.querySelector('.ahorro').textContent.replace('$', '')); // Elimina el símbolo '$' y convierte a número

        if (!isNaN(cantidad)) {
            totalCantidad += cantidad;
        }

        if (!isNaN(precioTotal)) {
            totalPrecioTotal += precioTotal;
        }

        if (!isNaN(ahorro)) {
            totalAhorro += ahorro;
        }
    });

    // Actualizar los valores en la fila de totales
    document.getElementById('totalCantidad').textContent = totalCantidad;
    document.getElementById('totalPrecioTotal').textContent = '$' + totalPrecioTotal.toFixed(2); // Agrega el símbolo '$'
    document.getElementById('totalAhorro').textContent = '$' + totalAhorro.toFixed(2); // Agrega el símbolo '$'
};

//Actualizo los totales de los productos agregados
function actualizarTotalesProductos() {
    const filasProductos = document.querySelectorAll('#listaProductos tr');
    let totalCantidadProductos = 0;
    let totalPrecioTotalProductos = 0;
    let totalAhorroProductos = 0;

    filasProductos.forEach(fila => {
        const cantidadProducto = parseInt(fila.querySelector('td:nth-child(4)').textContent);
        const precioTotalProducto = parseFloat(fila.querySelector('td:nth-child(5)').textContent.replace('$', '')); // Elimina el símbolo '$' y convierte a número
        const ahorroProducto = parseFloat(fila.querySelector('td:nth-child(6)').textContent.replace('$', '')); // Elimina el símbolo '$' y convierte a número

        if (!isNaN(cantidadProducto)) {
            totalCantidadProductos += cantidadProducto;
        }

        if (!isNaN(precioTotalProducto)) {
            totalPrecioTotalProductos += precioTotalProducto;
        }

        if (!isNaN(ahorroProducto)) {
            totalAhorroProductos += ahorroProducto;
        }
    });

    // Actualizar los valores en la fila de totales de listaProductos
    document.getElementById('totalCantidadFinal').textContent = totalCantidadProductos;
    document.getElementById('totalPrecioTotalFinal').textContent = `$${totalPrecioTotalProductos.toFixed(2)}`;
    document.getElementById('totalAhorroFinal').textContent = `$${totalAhorroProductos.toFixed(2)}`;
};

//Método de filtrado y búsqueda de productos
function filtrarProductos() {
    const campoBusqueda = document.getElementById("campoBusqueda").value.toLowerCase();
    const filasProductos = document.querySelectorAll("#listaProductos tr");

    filasProductos.forEach(fila => {
        const nombreProducto = fila.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nombreProducto.includes(campoBusqueda)) {
            fila.style.display = "table-row"; // Muestra la fila si el nombre coincide
        } else {
            fila.style.display = "none"; // Oculta la fila si el nombre no coincide
        }
    });
}; 