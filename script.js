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

function agregarFila() {
    const tabla = document.getElementById("tabla-perros");

    tabla.innerHTML += `
        <tr class="nueva-fila">
            <td>Nuevo</td>
            <td><input id="new-nombre"></td>
            <td><input id="new-sexo"></td>
            <td><input id="new-edad"></td>
            <td><input id="new-raza"></td>
            <td><input id="new-fecha"></td>
            <td><input id="new-adopcion"></td>
            <td><input id="new-entrenamiento"></td>
            <td><input id="new-salud"></td>
            <td>
                <button onclick="registrarPerro()">Registrar</button>
            </td>
        </tr>
    `;
}

// =========================
// TOGGLE LOGIN / REGISTRO
// =========================

function mostrarRegistro() {
    const login = document.getElementById("login-section");
    const register = document.getElementById("register-section");

    if (login && register) {
        login.classList.add("hidden");
        register.classList.remove("hidden");
    }
}

function mostrarLogin() {
    const login = document.getElementById("login-section");
    const register = document.getElementById("register-section");

    if (login && register) {
        login.classList.remove("hidden");
        register.classList.add("hidden");
    }
}

function verUsuario(id) {
    localStorage.setItem("usuario_ver", id);
    window.location.href = "perfil.html";
}

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
        const { data: users, error: errorUsers } = await db.from("usuarios").select("id").limit(1);
            
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
                    <td id="btn-${perro.id}">
                        ${perro.estado_adopcion === "Disponible"
                            ? `<button class="adoptar" onclick="adoptar(${perro.id})" id="btn-${perro.id}">Adoptar</button>`
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

        actualizarBotonesAdopcion();

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
    const inputs = document.querySelectorAll("input[data-id]");

    const cambios = {};

    inputs.forEach(input => {
        const id = input.dataset.id;
        const campo = input.dataset.campo;

        if (!cambios[id]) cambios[id] = {};
        cambios[id][campo] = input.value;
    });

    for (const id in cambios) {
        const { error } = await db.from("perros").update(cambios[id]).eq("id", id);

        if (error) {
            console.error(error);
            alert("Error al actualizar ID " + id);
        }
    }

    alert("✅ Cambios guardados");
    cargarPerros();
}

async function registrarPerro() {
    try {
        const nuevo = {
            nombre: document.getElementById("new-nombre").value,
            sexo: document.getElementById("new-sexo").value,
            edad: document.getElementById("new-edad").value,
            raza: document.getElementById("new-raza").value,
            fecha_rescate: document.getElementById("new-fecha").value,
            estado_adopcion: document.getElementById("new-adopcion").value,
            estado_entrenamiento: document.getElementById("new-entrenamiento").value,
            estado_salud: document.getElementById("new-salud").value
        };

        const { error } = await db.from("perros").insert([nuevo]);

        if (error) {
            alert("Error al registrar: " + error.message);
            return;
        }

        alert("✅ Perro registrado");
        cargarPerros();

    } catch (err) {
        console.error(err);
        alert("Error");
    }
}

async function adoptar(idPerro) {
    const idUsuario = localStorage.getItem("usuario_id");

    if (!idUsuario) {
        alert("Debes iniciar sesión");
        return;
    }

    const nuevaSolicitud = {
        id_perro: idPerro,
        id_usuario: idUsuario,
        fecha_solicitud: new Date().toISOString(),
        estado: "En revision",
        fecha_adopcion: null
    };

    const { error } = await db
        .from("adopciones")
        .insert([nuevaSolicitud]);

    if (error) {
        console.error(error); // 🔥 IMPORTANTE
        alert("Error real: " + error.message);
    } else {
        alert("🐕 Solicitud enviada");
        cargarPerros();
    }
}

async function actualizarBotonesAdopcion() {
    const idUsuario = localStorage.getItem("usuario_id");
    if (!idUsuario) return;

    const { data } = await db
        .from("adopciones")
        .select("*")
        .eq("id_usuario", idUsuario);

    data.forEach(adopcion => {
        const btn = document.getElementById(`btn-${adopcion.id_perro}`);
        const contenedor = document.getElementById(`accion-${adopcion.id_perro}`);

        if (!contenedor) return;

        if (adopcion.estado === "En revisión" && btn) {
            btn.disabled = true;
            btn.style.background = "#ccc";
            btn.innerText = "En revisión";
        }

        if (adopcion.estado === "Aprobado") {
            contenedor.innerHTML =
                `<span style="color:green; font-weight:bold;">Adoptado</span>`;
        }

        if (adopcion.estado === "Rechazado" && btn) {
            btn.disabled = false;
            btn.style.background = "#72e48b";
            btn.innerText = "Adoptar";
        }
    });
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

async function registrar(event) {
    event.preventDefault();

    const email = document.getElementById("reg-email").value;

    // 🔍 verificar si ya existe
    const { data } = await db
        .from("usuarios")
        .select("correo")
        .eq("correo", email);

    if (data.length > 0) {
        alert("❌ Este correo ya está registrado");
        return;
    }

    const nuevo = {
        nombre: document.getElementById("reg-nombre").value,
        correo: email,
        contrasena: document.getElementById("reg-password").value,
        telefono: document.getElementById("reg-telefono").value,
        direccion: document.getElementById("reg-direccion").value
    };

    const { data: user, error } = await db
        .from("usuarios")
        .insert([nuevo])
        .select();

    if (error) {
        alert(error.message);
        return;
    }

    // 🔥 auto login
    localStorage.setItem("rol", "usuario");
    localStorage.setItem("usuario_id", user[0].id);

    window.location.href = "perfil.html";
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", login);
}

async function login(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Completa todos los campos");
        return;
    }

    try {
        // ADMIN
        const { data: admin } = await db
            .from("administradores")
            .select("*")
            .eq("correo", email)
            .eq("contrasena", password);

        if (admin.length > 0) {
            localStorage.setItem("rol", "admin");
            localStorage.setItem("usuario_id", admin[0].id);

            window.location.href = "admin.html";
            return;
        }

        // USUARIO
        const { data: user } = await db
            .from("usuarios")
            .select("*")
            .eq("correo", email)
            .eq("contrasena", password);

        if (user.length > 0) {
            localStorage.setItem("rol", "usuario");
            localStorage.setItem("usuario_id", user[0].id);

            window.location.href = "perfil.html";
            return;
        }

        alert("Correo o contraseña incorrectos");

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

async function cargarPerfil() {
    const rol = localStorage.getItem("rol");

    let id;

    // 🔥 ADMIN viendo usuario
    if (rol === "admin" && localStorage.getItem("usuario_ver")) {
        id = localStorage.getItem("usuario_ver");
    } else {
        id = localStorage.getItem("usuario_id");
    }

    if (!id) return;

    const { data, error } = await db
        .from("usuarios")
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

    // ✅ NUEVO (dirección)
    const direccion = document.getElementById("direccion");
    if (direccion) direccion.textContent = data.direccion;

    cargarAdopcionUsuario(id);
}

async function cargarAdopcionUsuario(idUsuario) {
    const rol = localStorage.getItem("rol");

    const { data, error } = await db
        .from("adopciones")
        .select(`
            id,
            estado,
            fecha_adopcion,
            perros(nombre)
        `)
        .eq("id_usuario", idUsuario)
        .maybeSingle();

    const info = document.getElementById("adopcion-info");
    const botones = document.getElementById("admin-botones");

    if (!data) {
        info.innerText = "Sin solicitud";
        botones.style.display = "none";
        return;
    }

    info.innerText = `Perro: ${data.perros.nombre} | Estado: ${data.estado}`;

    localStorage.setItem("adopcion_id", data.id);

    // 🔥 SOLO admin ve botones
    if (rol === "admin") {
        botones.style.display = "block";
    } else {
        botones.style.display = "none";
    }
}

async function aprobar() {
    const id = localStorage.getItem("adopcion_id");

    if (!id) {
        alert("No hay solicitud seleccionada");
        return;
    }

    const { error } = await db
        .from("adopciones")
        .update({
            estado: "Aprobado",
            fecha_adopcion: new Date().toISOString()
        })
        .eq("id", id);

    if (error) {
        console.error("Error real:", error);
        alert("Error al aprobar: " + error.message);
    } else {
        alert("✅ Adopción aprobada");
        location.reload();
    }
}

async function rechazar() {
    const id = localStorage.getItem("adopcion_id");

    if (!id) {
        alert("No hay solicitud seleccionada");
        return;
    }

    const { error } = await db
        .from("adopciones")
        .update({
            estado: "Rechazado",
            fecha_adopcion: null
        })
        .eq("id", id);

    if (error) {
        console.error("Error real:", error);
        alert("Error al rechazar: " + error.message);
    } else {
        alert("❌ Adopción rechazada");
        location.reload();
    }
}

async function cargarUsuarios() {
    const { data } = await db
        .from("usuarios")
        .select("*");

    const tabla = document.getElementById("tabla-usuarios");

    tabla.innerHTML = "";

    data.forEach(u => {
        tabla.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>
                <button onclick="verUsuario(${u.id})">Ver</button>
            </td>
        </tr>
        `;
    });
}

// Ejecutar diagnóstico al cargar
setTimeout(diagnosticarConexion, 1000);