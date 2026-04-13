// Ya no declaramos supabase aquí, usamos la variable global del config

// Menú toggle
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (toggle && nav) {
    toggle.addEventListener("click", (e) => {
        e.preventDefault();
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
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const name = document.getElementById("name").value;
                alert("Gracias por tu mensaje, " + name);
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

actualizarMenu();

// Función de diagnóstico
async function diagnosticarConexion() {
    console.log("🔍 Diagnosticando conexión...");
    
    try {
        // Verificar si supabase está definido
        if (typeof supabase === 'undefined') {
            console.error("❌ Variable 'supabase' no definida");
            return;
        }
        
        // Probar conexión a Perros
        const { data: perros, error: errorPerros } = await supabase
            .from("Perros")
            .select("id")
            .limit(1);
            
        if (errorPerros) {
            console.error("❌ Error en tabla Perros:", errorPerros);
        } else {
            console.log("✅ Tabla Perros accesible");
        }
        
        // Probar conexión a Administradores
        const { data: admins, error: errorAdmins } = await supabase
            .from("Administradores")
            .select("id")
            .limit(1);
            
        if (errorAdmins) {
            console.error("❌ Error en tabla Administradores:", errorAdmins);
        } else {
            console.log("✅ Tabla Administradores accesible");
        }
        
        // Probar conexión a Usuarios
        const { data: users, error: errorUsers } = await supabase
            .from("Usuarios")
            .select("id")
            .limit(1);
            
        if (errorUsers) {
            console.error("❌ Error en tabla Usuarios:", errorUsers);
        } else {
            console.log("✅ Tabla Usuarios accesible");
        }
        
    } catch (error) {
        console.error("❌ Error general:", error);
    }
}

// Ejecutar diagnóstico al cargar
setTimeout(diagnosticarConexion, 1000);