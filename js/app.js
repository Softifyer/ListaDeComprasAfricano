let listaArticulos = [];
let numeroNuevoProducto = 1;

fetch('https://dolarapi.com/v1/dolares')
    .then(response => response.json())
    .then(data => {
        dolarOficial = data[0].venta;
        dolarBlue = data[1].venta;

        console.log('Dólar Oficial: ' + dolarOficial.toFixed(2));
        console.log('Dólar Blue: ' + dolarBlue.toFixed(2));

        document.getElementById('tasaDolar').textContent = '$' + dolarBlue.toFixed(2);
        document.getElementById('tasaDolarOficial').textContent = '$' + dolarOficial.toFixed(2);

        actualizarPrecioTotalDolares();

    })
    .catch(error => {
        console.error('Error al obtener datos de la API: ' + error);
    });


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
        <td class="ahorroProducto">US$${producto.dolar}</td>
        <td class="ahorroProducto">US$${producto.dolarOficial}</td>
        <td><button class="btn btn-danger" onclick="eliminarFilaProducto(this)">Eliminar</button></td>
    `;

        listaProductos.appendChild(fila);
    });

    actualizarTotalesProductos();
    blanquearTotales();
}

function capturar() {
    function Articulo(nombre, precio1, precio2, cantidad, precioTotal, ahorro, dolar, dolarOficial) {
        this.numero = listaArticulos.length + 1; 
        this.nombre = nombre;
        this.precio1 = parseFloat(precio1);
        this.precio2 = parseFloat(precio2);
        this.cantidad = parseInt(cantidad);
        this.precioTotal = precioTotal;
        this.ahorro = ahorro;
        this.dolar = dolar;
        this.dolarOficial = dolarOficial;
    }

    const nombreCapturar = document.getElementById('nombreArtículo').value;
            const precio1Capturar = document.getElementById('precioArtículo1').value;
            const precio2Capturar = document.getElementById('precioArtículo2').value;
            const cantidadCapturar = document.getElementById('cantidad').textContent;
            const precioTotalCapturar = document.getElementById('precioTotal').textContent;
            const ahorroCapturar = document.getElementById('ahorro').textContent;
            const precioTotalSinSimbolo = parseFloat(precioTotalCapturar.replace('$', ''));
            const precioProductoDolar = (precioTotalSinSimbolo / dolarBlue).toFixed(2);
            const precioProductoDolarOficial = (precioTotalSinSimbolo / dolarOficial).toFixed(2);

            const nuevoArticulo = new Articulo(nombreCapturar, precio1Capturar, precio2Capturar, cantidadCapturar, precioTotalCapturar, ahorroCapturar, precioProductoDolar, precioProductoDolarOficial);

            agregarArticulo(nuevoArticulo);
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
            <td class="precioTotalDolaresProducto">US$${(precioTotalCapturar/dolarBlue).toFixed(2)}</td>
            <td class="precioTotalDolarOficialProducto">US$${(precioTotalCapturar/dolarOficial).toFixed(2)}</td>
            <td><button class="btn btn-danger" onclick="eliminarFilaProducto(this)">Eliminar</button></td>
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

    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: 'success',
        title: 'Producto agregado'
    })
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

    const Toast = Swal.mixin({
        toast: true,
        position: 'center', 
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: 'error',
        title: 'Producto eliminado'
    })
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

    const precioTotal = parseFloat(fila.querySelector('.precioTotal').textContent.replace('$', ''));
    const precioDolaresCell = fila.querySelector('.precioDolar');
    const precioDolares = calcularPrecioDolares(precioTotal, dolarBlue);
    precioDolaresCell.textContent = 'US$' + precioDolares;

    const precioDolarOficialCell = fila.querySelector('.precioDolarOficial');
    const precioDolarOficial = calcularPrecioDolarOficial(precioTotal, dolarOficial);
    precioDolarOficialCell.textContent = 'US$' + precioDolarOficial;
}

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
    document.getElementById('totalPrecioDolares').textContent = "0.00";
    document.getElementById('precioDolares').textContent = "0.00";
    document.getElementById('totalPrecioDolarOficial').textContent = "0.00";
    document.getElementById('precioDolarOficial').textContent = "0.00";
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

    document.getElementById('totalCantidad').textContent = totalCantidad;
    document.getElementById('totalPrecioTotal').textContent = '$' + totalPrecioTotal.toFixed(2); 
    document.getElementById('totalAhorro').textContent = '$' + totalAhorro.toFixed(2); 
    document.getElementById('totalPrecioDolares').textContent = 'US$' + (totalPrecioTotal/dolarBlue).toFixed(2); 
    document.getElementById('totalPrecioDolarOficial').textContent = 'US$' + (totalPrecioTotal/dolarOficial).toFixed(2); 
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

    document.getElementById('totalCantidadFinal').textContent = totalCantidadProductos;
    document.getElementById('totalPrecioTotalFinal').textContent = `$${totalPrecioTotalProductos.toFixed(2)}`;
    document.getElementById('totalAhorroFinal').textContent = `$${totalAhorroProductos.toFixed(2)}`;
    document.getElementById('totalPrecioDolarFinal').textContent = 'US$' + (totalPrecioTotalProductos / dolarBlue).toFixed(2);
    
    document.getElementById('totalPrecioDolarOficialFinal').textContent = 'US$' + (totalPrecioTotalProductos / dolarOficial).toFixed(2);


}


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
    listaArticulos = [];    
    actualizarInterfaz(listaArticulos);

    const Toast = Swal.mixin({
        toast: true,
        position: 'center', 
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: 'warning',
        title: 'Has vaciado la lista de productos'
    })
}

function insertarLista() {

    const urlListaArticulos = './js/listaArticulosManuales.json';

    fetch(urlListaArticulos)
        .then(response => response.json())
        .then(data => {

            localStorage.setItem('listaArticulos', JSON.stringify(data));
            listaArticulos = data;
            actualizarInterfaz(listaArticulos);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON: ' + error);
        });
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Productos cargados correctamente'
        });
}

function lugarCompra() {
    const lugarCompra = document.getElementById('nombreMercado').value;
    const mercadoSelected = document.getElementById('mercadoSelected');
    const mercadoSelected2 = document.getElementById('mercadoSelected2');
    mercadoSelected.textContent = `Precio en ${lugarCompra}`;
    mercadoSelected2.textContent = `Precio en ${lugarCompra}`;
}

function calcularPrecioDolares(precioTotal, dolarBlue) {
    const precioEnDolares = (precioTotal / dolarBlue).toFixed(2);
    return precioEnDolares;
}

function calcularPrecioDolarOficial(precioTotal, dolarOficial) {
    const precioEnDolarOficial = (precioTotal / dolarOficial).toFixed(2);
    return precioEnDolarOficial;
}

function actualizarPrecioTotalDolares() {
    const filasProductos = document.querySelectorAll('#listaProductos tr');
    let totalPrecioDolares = 0;
    let totalPrecioDolarOficialFinal = 0;

    filasProductos.forEach(fila => {
        const precioTotal = parseFloat(fila.querySelector('td:nth-child(5)').textContent.replace('$', ''));
        const precioDolares = precioTotal / dolarBlue;
        const precioDolarOficial = precioTotal / dolarOficial;
        totalPrecioDolares += precioDolares;
        totalPrecioDolarOficialFinal += precioDolarOficial;
    });

    const totalPrecioDolaresTh = document.getElementById('totalPrecioDolares');
    const totalPrecioDolarOficialFinalTh = document.getElementById('totalPrecioDolarOficialFinal');
    totalPrecioDolaresTh.textContent = '' + totalPrecioDolares.toFixed(2);
    totalPrecioDolarOficialFinalTh.textContent = 'US$' + (totalPrecioDolarOficialFinal / dolarOficial).toFixed(2);
}

function exportarAExcel() {
    const nombreArchivo = 'Lista de Articulos.xlsx';
    const datos = [];
    const encabezados = ["#", "Nombre", "Cantidad", "Precio Total", "Ahorro", "Precio al US$ Blue", "Precio al US$ Oficial"];
    
    datos.push(encabezados);

    listaArticulos.forEach((articulo) => {
        const fila = [
            articulo.numero,
            articulo.nombre,
            articulo.cantidad,
            articulo.precioTotal,
            articulo.ahorro,
            'US$' + articulo.dolar,
            'US$' + articulo.dolarOficial,
        ];
        datos.push(fila);
    });

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.aoa_to_sheet(datos);

    const estiloEncabezado = {
        fill: {
            fgColor: { rgb: "95B3D7" },
        },
        font: {
            bold: true,
            color: { rgb: "000000" },
        },
        border: {
            top: { style: "thin", color: { auto: 1 } },
            bottom: { style: "thin", color: { auto: 1 } },
            left: { style: "thin", color: { auto: 1 } },
            right: { style: "thin", color: { auto: 1 } },
        },
    };

    for (let i = 0; i < encabezados.length; i++) {
        const letraColumna = String.fromCharCode(65 + i);
        hoja[letraColumna + '1'].s = estiloEncabezado;
    }

    XLSX.utils.book_append_sheet(libro, hoja, "ListaArticulos");

    XLSX.writeFile(libro, nombreArchivo);
}

function exportarACSV() {
    const nombreArchivo = 'ListaDeArticulos.csv';

    let csv = 'Número,Nombre,Cantidad,Precio Total,Ahorro,Precio al US$ Blue,Precio al US$ Oficial\n';

    listaArticulos.forEach((articulo) => {
        csv += `${articulo.numero},"${articulo.nombre}",${articulo.cantidad},${articulo.precioTotal},${articulo.ahorro},"${articulo.dolar}","${articulo.dolarOficial}"\n`;
    });

    const enlace = document.createElement('a');
    enlace.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    enlace.target = '_blank';
    enlace.download = nombreArchivo;

    enlace.click();
}
