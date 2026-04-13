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
            .from("perros")
            .select("id")
            .limit(1);
            
        if (errorPerros) {
            console.error("❌ Error en tabla Perros:", errorPerros);
        } else {
            console.log("✅ Tabla Perros accesible");
        }
        
        // Probar conexión a Administradores
        const { data: admins, error: errorAdmins } = await supabase
            .from("administradores")
            .select("id")
            .limit(1);
            
        if (errorAdmins) {
            console.error("❌ Error en tabla Administradores:", errorAdmins);
        } else {
            console.log("✅ Tabla Administradores accesible");
        }
        
        // Probar conexión a Usuarios
        const { data: users, error: errorUsers } = await supabase
            .from("usuarios")
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

async function cargarPerros() {
    const tabla = document.getElementById("tabla-perros");

    try {
        const { data, error } = await supabase
            .from("perros")
            .select("*");

        if (error) {
            console.error(error);
            tabla.innerHTML = "<tr><td colspan='10'>Error al cargar</td></tr>";
            return;
        }

        if (!data || data.length === 0) {
            tabla.innerHTML = "<tr><td colspan='10'>No hay perros</td></tr>";
            return;
        }

        tabla.innerHTML = "";

        data.forEach(perro => {
            tabla.innerHTML += `
                <tr>
                    <td>${perro.id}</td>
                    <td>${perro.nombre}</td>
                    <td>${perro.sexo}</td>
                    <td>${perro.edad}</td>
                    <td>${perro.raza}</td>
                    <td>${perro.fecha_rescate}</td>
                    <td>${perro.estado_adopcion}</td>
                    <td>${perro.estado_entrenamiento}</td>
                    <td>${perro.estado_salud}</td>
                    <td>
                        ${localStorage.getItem("rol") === "usuario" && perro.estado_adopcion === "Disponible"
                            ? `<button class="adoptar">Adoptar</button>`
                            : ""}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        tabla.innerHTML = "<tr><td colspan='10'>Error de conexión</td></tr>";
    }
}
// Ejecutar diagnóstico al cargar
setTimeout(diagnosticarConexion, 1000);