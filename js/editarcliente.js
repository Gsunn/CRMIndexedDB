(function () {
  let idCliente
  document.addEventListener("DOMContentLoaded", () => {
      
    conectarDB();

    const nombreInput = document.querySelector('#nombre')
    const emailInput = document.querySelector('#email')
    const telefonoInput = document.querySelector('#telefono')
    const empresaInput = document.querySelector('#empresa')

    const formulario = document.querySelector('#formulario')

    formulario.addEventListener('submit', actulizarCliente)

    // Varificar ID de la URL que corresponde con la id del cliente
    const parmaetrosURL = new URLSearchParams(window.location.search);

    idCliente = parmaetrosURL.get('id');

    if (idCliente) {
      setTimeout(() => {
        const clienteForm = obtenerCliente(idCliente);

      }, 1000);
    }

    function conectarDB() {
      const abrirDB = window.indexedDB.open("crm", 1);
      abrirDB.onerror = function () {
        console.log("Error DB");
      };

      abrirDB.onsuccess = function () {
        DB = abrirDB.result;
      };
    }

    function obtenerCliente(id) {

      const transaction = DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      const cliente = objectStore.openCursor();
      cliente.onsuccess = (e) => {
        const cursor = e.target.result;        
        if (cursor) {

          if (cursor.value.id === Number(id)) {
              console.log(cursor.value);
              llenarFormulario (cursor.value)
          }
          cursor.continue();
        }
      };
    }

    function llenarFormulario(clienteForm){

        const {nombre, empresa , telefono ,email} = clienteForm

        nombreInput.value = nombre
        emailInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa 
    }

    function actulizarCliente(e){
        e.preventDefault()
        if(nombreInput.value === '' || emailInput.value === ''|| telefonoInput.value === '' || empresaInput.value ===''){
            imprimirAlerta('Los campos son obligatorios','error');
            return
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }
        
        const transaction = DB.transaction(['crm'],'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        transaction.oncomplete = ()=>{
          imprimirAlerta('Cambios guardados');

          setTimeout(() => {
            window.location.href = './index.html'
          }, 3000);
        }

        transaction.onerror = (error)=>{
          console.log(error);
          imprimirAlerta('Error en la actualización','error');
        }

    }

  });
})();
