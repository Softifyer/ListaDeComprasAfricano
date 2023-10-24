emailjs.init("u_R8TRNg4BCGayQ3_");

document.getElementById('enviarPorEmail').addEventListener('click', async function() {
    const {value: email} = await Swal.fire({
        title: 'Ingrese su dirección de correo:',
        input: 'email',
        inputLabel: 'Correo electrónico',
        inputPlaceholder: 'Ingrese su dirección de correo:',
        showCancelButton: true,
    });

    if (email) {

        let mensaje = '';

        listaArticulos.forEach(function(articulo) {
            mensaje += `
                #: ${articulo.numero}
                Nombre: ${articulo.nombre}
                Cantidad: ${articulo.cantidad}
                Precio: ${articulo.precioTotal}
                -------------------
            `;
        });

        const emailData = {            
            to_email: email,
            message: mensaje
        };

        emailjs.send('service_86hx8c5', 'template_cpjaz5r', emailData)
            .then(function(response) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Email enviado con éxito.',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log('Enviado', response.status, response.text);
            }, function(error) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al enviar el e-mail.',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log('No enviado', error);
            });
    };
});