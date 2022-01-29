(function(){
    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', ()=>{
        console.log('Dom LOADED');
        conectarDB()

        formulario.addEventListener('submit', validarCliente)
    })



    function validarCliente(e){
        e.preventDefault()
        
        // Recoge inputs del formulario
        const nombre = document.querySelector('#nombre').value
        const email = document.querySelector('#email').value
        const telefono = document.querySelector('#telefono').value
        const empresa = document.querySelector('#empresa').value

        if(nombre === '' || email === ''|| telefono === '' || empresa ===''){
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return
        }

        // Crear objeto con la info

        const cliente = {
            nombre, email, telefono, empresa, 
            id : Date.now()
        }

        crearNuevoCliente(cliente);
    }


    function  crearNuevoCliente(cliente){
        console.log(DB);

        const transaction = DB.transaction(['crm'],'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.add(cliente)

        transaction.onerror = ()=>{
            imprimirAlerta('Error al crear cliente', 'error');
        }

        transaction.oncomplete = ()=>{
            imprimirAlerta(`Cliente con id ${cliente.id} creado`);

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);

        }

    }

})();
