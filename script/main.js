

// Swipper
var swiper = new Swiper(".testimonialSwiper", {

      loop: true,
      spaceBetween: 30,
      speed: 900,

      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },

      breakpoints: {

        0: {
          slidesPerView: 1,
        },

        768: {
          slidesPerView: 2,
        },

        1200: {
          slidesPerView: 3,
        }
      }
    });

// Form
document
    .getElementById("waForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        let nama =
            document.getElementById("nama").value;

        let gadget =
            document.getElementById("gadget").value;

        let pesan =
            document.getElementById("pesan").value;

        let nomor =
            "6285174174001";

        let text =
            `Halo VIT Gadget,

Perkenalkan saya *${nama}*.

Saya ingin berkonsultasi mengenai perangkat:
*${gadget}*

Keluhan yang saya alami:
*${pesan}*

Mohon informasi dan estimasi penanganannya.

Terima kasih.`;

        let url =
            `https://wa.me/${nomor}?text=${encodeURIComponent(text)}`;

        window.open(url, "_blank");

    });

    const whatsappButtons = document.querySelectorAll(
  '.wa-button, .cta-btn, .service-btn1'
);

whatsappButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();

    const phone = '6285174174001';

    const message = `Halo Vit Gadget,

Saya menghubungi melalui website Vit Gadget dan ingin berkonsultasi mengenai layanan service yang tersedia.

Mohon informasi lebih lanjut.

Terima kasih.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  });
});
