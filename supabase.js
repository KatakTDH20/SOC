// Configuración centralizada de Supabase
const SUPABASE_URL = "https://jfubhwuqlzlmpwhpilwj.supabase.co";
const SUPABASE_KEY = "sb_publishable_tT3vgF9kCFOGS9H9W1XKEA_2qFh2J9w";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Inicializar Supabase
try {
    console.log("✅ Supabase inicializado correctamente");
    
    // Verificar conexión
    db.from("perros").select("count", { count: 'exact', head: true })
        .then(({ count, error }) => {
            if (error) {
                console.error("❌ Error de conexión:", error.message);
            } else {
                console.log("✅ Conexión exitosa a Supabase");
            }
        });
} catch (error) {
    console.error("❌ Error al inicializar Supabase:", error);
}

// Función para verificar el estado de la conexión
async function verificarConexion() {
    try {
        const { data, error } = await db.from("perros").select("id").limit(1);
        if (error) throw error;
        console.log("✅ Conexión a Supabase funcionando");
        return true;
    } catch (error) {
        console.error("❌ Error de conexión:", error.message);
        return false;
    }
}

// Función auxiliar para manejar errores comunes
function handleSupabaseError(error) {
    console.error("Error Supabase:", error);
    
    if (error.code === 'PGRST301') {
        return "Error: No se encontraron resultados";
    } else if (error.code === '42501') {
        return "Error: Sin permisos para acceder a esta tabla";
    } else if (error.message.includes('JWT')) {
        return "Error: Problema con la autenticación";
    } else if (error.message.includes('network')) {
        return "Error: Problema de conexión a internet";
    }
    
    return error.message || "Error desconocido";
}