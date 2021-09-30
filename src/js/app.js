let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', ()=>iniciarApp());

function iniciarApp(){
    mostrarServicios();
    //resalta el div segun tag
    mostrarSeccion();
    //oculta o muestra seccion
    cambiarSeccion();
    //paginacion, siguiente anterior
    paginaSiguiente();
    paginaAnterior();
    //comprobar pagina actual
    botonesPaginador();
    //muestra el resumen de la cita
    mostrarResumen();
    //nombre de la cita
    nombreCita();
    //guarda fecha
    fechaCita();
    //deshabilitar dias pasados
    deshabilitarFechaAnterior();
    //hora de la cita
    horaCita();
}

function mostrarSeccion(){
    //eliminar 'mostrar-seccion'
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');        
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    
    //eliminar clase "actual"
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //resalta tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace=>enlace.addEventListener('click', e=>{
        e.preventDefault();
        pagina = parseInt(e.target.dataset.paso);
        //llamar funcion mostrarSeccion()
        mostrarSeccion();
        botonesPaginador();
    }));
}

//mostrar servicios
async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        //generar HTML
        servicios.forEach(servicio=>{ 
            const {id, nombre, precio} = servicio;
            //DOM scripting
            //generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //generar precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //generar Div contenedor servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.servicioId = id;

            //selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //insertar el nombre y precio en el div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //insertar en html
            const listadoServicios = document.querySelector('#servicios');
            listadoServicios.appendChild(servicioDiv);
        });        
    } catch (error) {
        console.log(error)
    }
}
function seleccionarServicio(e){
    let elemento;
    //seleccionar el div padre al hacer click
    e.target.tagName === 'P' ? elemento = e.target.parentElement : elemento = e.target;
    
    //insert o remover clase .seleccionado al div
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.servicioId);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');
        const servicioObj = {
            id: parseInt(elemento.dataset.servicioId),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }        
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
}
function agregarServicio(objeto){
    const {servicios} = cita;
    cita.servicios = [...servicios, objeto];
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=> {
        pagina++;
        botonesPaginador();
    });
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=> {
        pagina--;
        botonesPaginador();
    });
}
function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    if(pagina===1){
        paginaAnterior.classList.add('ocultar');
    }else if(pagina===3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        console.log(cita)
        mostrarResumen();//estamos en pag 3, carga el resumen
    }else{
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.remove('ocultar'); 
    }
    mostrarSeccion();
}

function mostrarResumen(){
    //destructuring
    const {nombre,fecha,hora,servicios} = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpiar html
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre.';
        noServicios.classList.add('invalidar-cita');
        //agregar a resumen
        resumenDiv.appendChild(noServicios);
        return;
    }


    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    //mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //iterar en servicios
    servicios.forEach( servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('pagar');
    cantidadPagar.innerHTML = `<span>Total a Pagar:</span>$ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);

    
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e=>{
        const nombreTexto = e.target.value.trim();
        //validar nombretexto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido', 'error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //si hay una alerta previa, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error')
    }

    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e=>{
        const dia = new Date(e.target.value).getUTCDay();
        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no permitido','error')
        }else{
            cita.fecha = fechaInput.value;
        }
    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate() +1;
    
    //formato de fecha aaa-mm-dd
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia<10 ? `0${dia}` : dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e=>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] >18){
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        }else{
            cita.hora = horaCita;
        }
    }); 
}