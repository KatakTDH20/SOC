const form = document.getElementById("contactForm");

form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const formData = new FormData(form);

    try {

        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {

            const name = document.getElementById("name").value;

            alert("Gracias por tu mensaje, " + name + ". Te responderemos pronto.");

            form.reset();

        } else {

            alert("Hubo un problema al enviar el mensaje.");

        }

    } catch (error) {

        alert("Error al enviar el mensaje.");

    }

});

