// ----- Inicialización de Swiper -----
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 4,
      }
    }
  });
  
  // ----- Variables del carrito -----
  const carrito = document.getElementById('carrito');
  const imgCarrito = document.getElementById('img-carrito');
  const carritoContainer = document.querySelector('.carrito-container');
  const listaCarrito = document.querySelector('#lista-carrito tbody');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  const finalizarCompraBtn = document.getElementById('finalizar-compra');
  const listaProductos = document.querySelectorAll('.agregar-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  
  let articulosCarrito = [];
  
  // ----- Eventos -----
  
  // Mostrar carrito al hacer clic en el ícono
  imgCarrito.addEventListener('click', (e) => {
    e.stopPropagation();
    carrito.classList.add('mostrar-carrito'); // Se mantiene abierto
  });
  
  // Mantener el carrito abierto si el mouse pasa sobre el contenedor
  carritoContainer.addEventListener('mouseenter', () => {
    carrito.classList.add('mostrar-carrito');
  });
  
  // Cerrar el carrito al hacer clic fuera del área del carrito
  document.addEventListener('click', (e) => {
    if (!carritoContainer.contains(e.target)) {
      carrito.classList.remove('mostrar-carrito');
    }
  });
  
  // Agregar productos al carrito
  listaProductos.forEach(boton => {
    boton.addEventListener('click', agregarProducto);
  });
  
  // Vaciar el carrito por completo
  vaciarCarritoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    articulosCarrito = [];
    carritoHTML();
  });
  
  // Finalizar compra y enviar datos a Firebase Firestore
  finalizarCompraBtn.addEventListener('click', async (e) => {
    e.preventDefault();
  
    if (articulosCarrito.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }
  
    // Objeto con los datos de la compra
    const compra = {
      productos: articulosCarrito,
      total: calcularTotalNum(),
      fecha: new Date().toISOString()
    };
  
    try {
      // Guardar en la colección "compras" en Firestore
      const docRef = await db.collection("compras").add(compra);
  
      alert(`¡Compra realizada con éxito! Código: ${docRef.id}`);
  
      // Vaciar el carrito después de la compra
      articulosCarrito = [];
      carritoHTML();
  
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert('Hubo un problema al realizar la compra. Inténtalo nuevamente.');
    }
  });
  
  // ----- Funciones principales -----
  
  // Agregar el producto al array del carrito
  function agregarProducto(e) {
    e.preventDefault();
    const productoSeleccionado = e.target.closest('.Cotillón');
    leerDatosProducto(productoSeleccionado);
  }
  
  // Obtener datos del producto y agregarlos al array
  function leerDatosProducto(producto) {
    const infoProducto = {
      imagen: producto.querySelector('img').src,
      titulo: producto.querySelector('h5').textContent,
      precio: producto.querySelector('.precio').textContent.replace('$', '').replace('.', '').replace('.', ''),
      id: producto.querySelector('a').getAttribute('data-id'),
      cantidad: 1
    };
  
    // Verificar si el producto ya existe en el carrito
    const existe = articulosCarrito.some(prod => prod.id === infoProducto.id);
  
    if (existe) {
      articulosCarrito = articulosCarrito.map(prod => {
        if (prod.id === infoProducto.id) {
          prod.cantidad++;
          return prod;
        }
        return prod;
      });
    } else {
      articulosCarrito = [...articulosCarrito, infoProducto];
    }
  
    carritoHTML();
  }
  
  // Generar el HTML dinámico para los productos en el carrito
  function carritoHTML() {
    limpiarHTML();
  
    articulosCarrito.forEach(producto => {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td><img src="${producto.imagen}" width="50"></td>
        <td>${producto.titulo}</td>
        <td>$${formatNumero(producto.precio)}</td>
        <td>${producto.cantidad}</td>
        <td><a href="#" class="borrar-producto" data-id="${producto.id}">X</a></td>
      `;
  
      listaCarrito.appendChild(row);
    });
  
    calcularTotal();
  
    // Botones para eliminar productos específicos
    const botonesEliminar = document.querySelectorAll('.borrar-producto');
    botonesEliminar.forEach(boton => {
      boton.addEventListener('click', eliminarProducto);
    });
  }
  
  // Eliminar un producto del carrito por su ID
  function eliminarProducto(e) {
    e.preventDefault();
    const productoId = e.target.getAttribute('data-id');
  
    articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
  
    carritoHTML();
  }
  
  // Calcular el total del carrito y actualizar el DOM
  function calcularTotal() {
    const total = calcularTotalNum();
  
    totalCarrito.textContent = `$${formatNumero(total)}`;
  }
  
  // Calcular el total numérico sin formatear
  function calcularTotalNum() {
    let total = 0;
  
    articulosCarrito.forEach(producto => {
      total += producto.cantidad * parseInt(producto.precio);
    });
  
    return total;
  }
  
  // Limpiar el contenido del carrito antes de renderizar
  function limpiarHTML() {
    while (listaCarrito.firstChild) {
      listaCarrito.removeChild(listaCarrito.firstChild);
    }
  }
  
  // Formatea números para mostrar separadores de miles
  function formatNumero(numero) {
    return new Intl.NumberFormat('es-CL').format(numero);
  }
  