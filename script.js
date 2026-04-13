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
    const adminProfile = document.getElementById("admin-profile-link");
    const adminList = document.getElementById("admin-list-link");

    if (!login || !user || !adminProfile || !adminList) return;

    if (rol === "usuario") {
        login.style.display = "none";
        user.style.display = "inline";
        adminProfile.style.display = "none";
        adminList.style.display = "none";
    } 
    else if (rol === "admin") {
        login.style.display = "none";
        user.style.display = "none";
        adminProfile.style.display = "inline";
        adminList.style.display = "inline";
    } 
    else {
        login.style.display = "inline";
        user.style.display = "none";
        adminProfile.style.display = "none";
        adminList.style.display = "none";
    }
}

actualizarMenu();

function cerrarSesion() {
    // Limpiar datos de sesión
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario_nombre");

    // Redirigir a login
    window.location.href = "sesion.html";
}

function mostrarBotonesAdmin() {
    const rol = localStorage.getItem("rol");
    const botones = document.getElementById("admin-botones");

    if (botones && rol === "admin") {
        botones.style.display = "block";
    }
}

mostrarBotonesAdmin();

// Función de diagnóstico
async function diagnosticarConexion() {
    console.log("🔍 Diagnosticando conexión...");
    
    try {
        // Verificar si supabase está definido
        if (typeof db === 'undefined') {
            console.error("❌ Variable 'supabase' no definida");
            return;
        }
        
        // Probar conexión a Perros
        const { data: perros, error: errorPerros } = await db
            .from("perros")
            .select("id")
            .limit(1);
            
        if (errorPerros) {
            console.error("❌ Error en tabla Perros:", errorPerros);
        } else {
            console.log("✅ Tabla Perros accesible");
        }
        
        // Probar conexión a Administradores
        const { data: admins, error: errorAdmins } = await db
            .from("administradores")
            .select("id")
            .limit(1);
            
        if (errorAdmins) {
            console.error("❌ Error en tabla Administradores:", errorAdmins);
        } else {
            console.log("✅ Tabla Administradores accesible");
        }
        
        // Probar conexión a Usuarios
        const { data: users, error: errorUsers } = await db
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
    const rol = localStorage.getItem("rol");

    try {
        const { data, error } = await db.from("perros").select("*");

        if (error) throw error;

        tabla.innerHTML = "";

        data.forEach(perro => {

            if (rol === "admin") {
                tabla.innerHTML += `
                <tr>
                    <td>${perro.id}</td>

                    <td><input value="${perro.nombre}" id="nombre-${perro.id}"></td>
                    <td><input value="${perro.sexo}" id="sexo-${perro.id}"></td>
                    <td><input value="${perro.edad}" id="edad-${perro.id}"></td>
                    <td><input value="${perro.raza}" id="raza-${perro.id}"></td>
                    <td><input value="${perro.fecha_rescate}" id="fecha-${perro.id}"></td>
                    <td><input value="${perro.estado_adopcion}" id="adopcion-${perro.id}"></td>
                    <td><input value="${perro.estado_entrenamiento}" id="entrenamiento-${perro.id}"></td>
                    <td><input value="${perro.estado_salud}" id="salud-${perro.id}"></td>

                    <td>
                        <button class="eliminar" onclick="eliminarPerro(${perro.id})">Eliminar</button>
                    </td>
                </tr>
                `;
            } 
            
            else if (rol === "usuario") {
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
                        ${perro.estado_adopcion === "Disponible"
                            ? `<button class="adoptar">Adoptar</button>`
                            : ""}
                    </td>
                </tr>
                `;
            } 
            
            else {
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
                    <td>-</td>
                </tr>
                `;
            }

        });

    } catch (err) {
        console.error(err);
        tabla.innerHTML = "<tr><td colspan='10'>Error</td></tr>";
    }
}

async function eliminarPerro(id) {
    if (!confirm("¿Eliminar perro?")) return;

    const { error } = await db.from("perros").delete().eq("id", id);

    if (error) {
        alert("Error al eliminar");
        console.error(error);
    } else {
        alert("Eliminado");
        cargarPerros();
    }
}

async function guardarCambios() {
    const { data } = await db.from("perros").select("*");

    for (let perro of data) {
        const id = perro.id;

        await db.from("perros").update({
            nombre: document.getElementById(`nombre-${id}`).value,
            sexo: document.getElementById(`sexo-${id}`).value,
            edad: document.getElementById(`edad-${id}`).value,
            raza: document.getElementById(`raza-${id}`).value,
            fecha_rescate: document.getElementById(`fecha-${id}`).value,
            estado_adopcion: document.getElementById(`adopcion-${id}`).value,
            estado_entrenamiento: document.getElementById(`entrenamiento-${id}`).value,
            estado_salud: document.getElementById(`salud-${id}`).value
        }).eq("id", id);
    }

    alert("Cambios guardados");
    cargarPerros();
}

async function insertarPerro() {
    const { error } = await db.from("perros").insert([{
        nombre: "Nuevo",
        sexo: "M",
        edad: 1,
        raza: "Desconocida",
        fecha_rescate: new Date().toISOString().split("T")[0],
        estado_adopcion: "No disponible",
        estado_entrenamiento: "Sin adiestrar",
        estado_salud: "En revision"
    }]);

    if (error) {
        alert("Error al insertar");
    } else {
        cargarPerros();
    }
}

async function cargarAdmin() {
    const id = localStorage.getItem("usuario_id");

    if (!id) return;

    try {
        const { data, error } = await db
            .from("administradores")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error(error);
            return;
        }

        document.getElementById("nombre").textContent = data.nombre;
        document.getElementById("correo").textContent = data.correo;
        document.getElementById("telefono").textContent = data.telefono;

    } catch (err) {
        console.error(err);
    }
}
// Ejecutar diagnóstico al cargar
setTimeout(diagnosticarConexion, 1000);