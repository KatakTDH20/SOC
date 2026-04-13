// Configuración de Supabase
const supabaseUrl = "https://jfubhwuqlzlmpwhpilwj.supabase.co";
const supabaseKey = "sb_publishable_tT3vgF9kCFOGS9H9W1XKEA_2qFh2J9w";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Menú toggle
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (toggle && nav) {
    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

// Formulario de contacto
const form = document.getElementById("contactForm");
if (form) {
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
}

// Actualizar menú según rol
function actualizarMenu() {
    const rol = localStorage.getItem("rol");
    const login = document.getElementById("login-link");
    const user = document.getElementById("user-link");
    const admin = document.getElementById("admin-link");

    if (!login || !user || !admin) return;

    if (rol === "usuario") {
        login.style.display = "none";
        user.style.display = "inline";
        admin.style.display = "none";
    } else if (rol === "admin") {
        login.style.display = "none";
        user.style.display = "inline";
        admin.style.display = "inline";
    } else {
        login.style.display = "inline";
        user.style.display = "none";
        admin.style.display = "none";
    }
}

// Ejecutar al cargar
actualizarMenu();