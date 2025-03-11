var swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,  // Número de productos visibles a la vez
  spaceBetween: 10,
  loop: true,  // Permite hacer scroll infinito
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
      slidesPerView: 2, // Para tablets
    },
    1024: {
      slidesPerView: 4, // Para pantallas grandes
    }
  }
});
