// Creo un array vacío para listaArticulos
let listaArticulos = [];
let numeroNuevoProducto = 1;

document.getElementById('cargarListaAnterior').addEventListener('click', function() {
    cargarListaAnterior();
});

function cargarListaAnterior() {
    const listaAlmacenada = localStorage.getItem('listaArticulos');
    if (listaAlmacenada) {
        const productosAlmacenados = JSON.parse(listaAlmacenada);

        listaArticulos.length = 0;

        listaArticulos.push(...productosAlmacenados);

        numeroNuevoProducto = Math.max(...productosAlmacenados.map(producto => producto.numero), 0) + 1;

        console.log('Productos cargados desde el localStorage:', listaArticulos);

        actualizarInterfaz(listaArticulos);
    } else {
        console.log('No se encontraron productos en el localStorage.');
    }
}

function actualizarInterfaz(listaArticulos) {
    const listaProductos = document.getElementById("listaProductos");
    listaProductos.innerHTML = ''; 

    listaArticulos.forEach(function (producto, index) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
        <td class="numero-producto">${index + 1}</td>
        <td>${producto.nombre}</td>
        <td>$${(parseFloat(producto.precio1) < parseFloat(producto.precio2) ? producto.precio1 : producto.precio2).toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.precioTotal}</td>
        <td class="ahorroProducto">${producto.ahorro}</td>
        <td><button onclick="eliminarFilaProducto(this)">Eliminar</button></td>
    `;

        listaProductos.appendChild(fila);
    });

    actualizarTotalesProductos();
    blanquearTotales();
}

document.querySelector('button[onclick="capturar()"]').addEventListener('click', function() {
    console.log('Botón "Agregar Artículo" clickeado');
    capturar();
});

function capturar() {
    function Articulo(nombre, precio1, precio2, cantidad, precioTotal, ahorro) {
        this.numero = listaArticulos.length + 1; 
        this.nombre = nombre;
        this.precio1 = parseFloat(precio1);
        this.precio2 = parseFloat(precio2);
        this.cantidad = parseInt(cantidad);
        this.precioTotal = precioTotal;
        this.ahorro = ahorro;
    }

    const nombreCapturar = document.getElementById('nombreArtículo').value;
    const precio1Capturar = document.getElementById('precioArtículo1').value;
    const precio2Capturar = document.getElementById('precioArtículo2').value;
    const cantidadCapturar = document.getElementById('cantidad').textContent;
    const precioTotalCapturar = document.getElementById('precioTotal').textContent;
    const ahorroCapturar = document.getElementById('ahorro').textContent;

    const nuevoArticulo = new Articulo(nombreCapturar, precio1Capturar, precio2Capturar, cantidadCapturar, precioTotalCapturar, ahorroCapturar);

    agregarArticulo(nuevoArticulo);

    document.getElementById('nombreArtículo').value = '';
    document.getElementById('precioArtículo1').value = '';
    document.getElementById('precioArtículo2').value = '';
    document.getElementById('cantidad').textContent = '0';
    document.getElementById('precioTotal').textContent = '0.00';
    document.getElementById('ahorro').textContent = '0.00';

    const mensaje = document.getElementById('mensajeProdAgregado');
    mensaje.textContent = 'Agregado';
    mensaje.style.display = 'block';

    setTimeout(function () {
        mensaje.style.display = 'none';
    }, 3000);
}


function agregarArticulo(nuevoArticulo) {
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

    if (!isNaN(precio1Capturar) && !isNaN(precio2Capturar) && cantidadCapturar > 0) {
        const precioTotalCapturar = (cantidadCapturar * (precio1Capturar < precio2Capturar ? precio1Capturar : precio2Capturar)).toFixed(2);
        const ahorroCapturar = Math.abs(((precio1Capturar - precio2Capturar) * cantidadCapturar).toFixed(2));

        listaArticulos.push(nuevoArticulo);

        const listaProductos = document.getElementById("listaProductos");

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="numero-producto">${listaArticulos.length}</td>
            <td>${nombreCapturar}</td>
            <td>$${(precioTotalCapturar / cantidadCapturar).toFixed(2)}</td>
            <td>${cantidadCapturar}</td>
            <td>$${precioTotalCapturar}</td>
            <td class="ahorroProducto">$${ahorroCapturar.toFixed(2)}</td>
            <td><button onclick="eliminarFilaProducto(this)">Eliminar</button></td>
        `;

        listaProductos.appendChild(fila);

        nombreInput.value = '';
        precio1Input.value = '';
        precio2Input.value = '';
        cantidadElement.textContent = '0';
        precioTotalElement.textContent = '0.00';
        ahorroElement.textContent = '0.00';

        actualizarTotalesProductos();
        blanquearTotales();

        localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));
    } else {
        console.log('Error: Los valores ingresados no son válidos.');
    }
}    

function eliminarFilaProducto(button) {
    const fila = button.closest('tr');
    const numeroProducto = parseInt(fila.querySelector('.numero-producto').textContent);

    listaArticulos = listaArticulos.filter(producto => producto.numero !== numeroProducto);

    listaArticulos.forEach((producto, index) => {
        producto.numero = index + 1;
    });

    actualizarNumerosProductos();

    localStorage.setItem('listaArticulos', JSON.stringify(listaArticulos));

    fila.remove();
    actualizarTotalesProductos();
    actualizarInterfaz(listaArticulos);

    // Muestra el mensaje de eliminación
    const mensaje = document.getElementById('mensajeProdEliminado');
    mensaje.textContent = 'Eliminado';
    mensaje.style.display = 'block';

    setTimeout(function () {
        mensaje.style.display = 'none';
    }, 3000);
}

function actualizarNumerosProductos() {
    const numerosProductos = document.querySelectorAll('.numero-producto');
    
    numerosProductos.forEach((numero, index) => {
        numero.textContent = index + 1;
    });
}

function actualizarTodo() {
    actualizarTotales();
};

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

function actualizarAhorro(fila) {
    const precioProducto1 = parseFloat(fila.querySelector('.precioProducto1').value);
    const precioProducto2 = parseFloat(fila.querySelector('.precioProducto2').value);
    const cantidad = parseInt(fila.querySelector('.cantidad p').textContent);

    if (!isNaN(precioProducto1) && !isNaN(precioProducto2)) {
        let ahorro = (precioProducto1 - precioProducto2) * cantidad;

        if (ahorro < 0) {
            ahorro *= -1;
        }

        if (Number.isInteger(ahorro)) {
            fila.querySelector('.ahorro').textContent = '$' + ahorro.toFixed(2);
        } else {
            fila.querySelector('.ahorro').textContent = '$' + ahorro.toFixed(2);
        }
    } else {
        fila.querySelector('.ahorro').textContent = '0.00';
    }
}

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

function blanquearTotales() {
    document.getElementById('totalCantidad').textContent = 0;
    document.getElementById('totalPrecioTotal').textContent = "0.00";
    document.getElementById('totalAhorro').textContent = "0.00";
}

function actualizarTotales() {
    const filas = document.querySelectorAll('#listaCompras tr');
    let totalCantidad = 0;
    let totalPrecioTotal = 0;
    let totalAhorro = 0;

    filas.forEach(fila => {
        const cantidad = parseInt(fila.querySelector('.cantidad p').textContent);
        const precioTotal = parseFloat(fila.querySelector('.precioTotal').textContent.replace('$', '')); 
        const ahorro = parseFloat(fila.querySelector('.ahorro').textContent.replace('$', '')); 

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
    document.getElementById('totalPrecioTotal').textContent = '$' + totalPrecioTotal.toFixed(2); 
    document.getElementById('totalAhorro').textContent = '$' + totalAhorro.toFixed(2); 
};

function actualizarTotalesProductos() {
    const filasProductos = document.querySelectorAll('#listaProductos tr');
    let totalCantidadProductos = 0;
    let totalPrecioTotalProductos = 0;
    let totalAhorroProductos = 0;

    filasProductos.forEach(fila => {
        const cantidadProducto = parseInt(fila.querySelector('td:nth-child(4)').textContent);
        const precioTotalProducto = parseFloat(fila.querySelector('td:nth-child(5)').textContent.replace('$', '')); 
        const ahorroProducto = parseFloat(fila.querySelector('td:nth-child(6)').textContent.replace('$', '')); 

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


function filtrarProductos() {
    const campoBusqueda = document.getElementById("campoBusqueda").value.toLowerCase();
    const filasProductos = document.querySelectorAll("#listaProductos tr");

    filasProductos.forEach(fila => {
        const nombreProducto = fila.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nombreProducto.includes(campoBusqueda)) {
            fila.style.display = "table-row";
        } else {
            fila.style.display = "none";
        }
    });
}; 

function limpiarLocalStorage() {
    localStorage.removeItem('listaArticulos');
    const mensaje = document.getElementById('mensajeListaVaciada');
    mensaje.textContent = 'Lista Vaciada';
    mensaje.style.display = 'block';

    listaArticulos = [];    
    actualizarInterfaz(listaArticulos);
    setTimeout(function () {
        mensaje.style.display = 'none';
    }, 3000);
}

const listaArticulosManuales = [
    {
        "numero": 1,
        "nombre": "Carne",
        "precio1": 980,
        "precio2": 500,
        "cantidad": 3,
        "precioTotal": "$1500.00",
        "ahorro": "$1440.00"
    },
    {
        "numero": 2,
        "nombre": "Leche",
        "precio1": 120,
        "precio2": 130,
        "cantidad": 2,
        "precioTotal": "$240.00",
        "ahorro": "$20.00"
    },
    {
        "numero": 3,
        "nombre": "Pan",
        "precio1": 50,
        "precio2": 60,
        "cantidad": 5,
        "precioTotal": "$250.00",
        "ahorro": "$50.00"
    },
    {
        "numero": 4,
        "nombre": "Manzanas",
        "precio1": 80,
        "precio2": 75,
        "cantidad": 4,
        "precioTotal": "$320.00",
        "ahorro": "$20.00"
    }
];

function insertarLista () {
    localStorage.setItem('listaArticulos', JSON.stringify(listaArticulosManuales));
}