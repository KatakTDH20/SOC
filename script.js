document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    alert(
        "Gracias por tu mensaje, " + name +
        ".\nTu solicitud ha sido enviada correctamente (simulación)."
    );

    this.reset();
});

