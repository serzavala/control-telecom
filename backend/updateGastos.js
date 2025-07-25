// updateGastos.js
// Script para actualizar documentos gastos agregando semana y cuadrilla
// Ejecuta este script solo como utilitario para pruebas

const mongoose = require("mongoose");
const Gasto = require("./models/Gasto"); // Ajusta la ruta si fuera necesario

// 🔧 Conexión directa a tu base de datos Atlas:
mongoose.connect("mongodb+srv://serzavala1977:Control2025Mongo@cluster0.zzowbmv.mongodb.net/controlTelecom?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Conectado a MongoDB Atlas para actualización de gastos...");

  try {
    const result = await Gasto.updateMany(
      { semana: { $exists: false } }, // Solo actualiza documentos que aún no tengan 'semana'
      {
        $set: {
          semana: 18,     // 🔧 Semana de prueba actual
          cuadrilla: 3    // 🔧 Cuadrilla 3 como ejemplo
        }
      }
    );

    console.log(`✅ Actualizados ${result.modifiedCount} documentos en gastos.`);
  } catch (err) {
    console.error("❌ Error al actualizar documentos:", err);
  } finally {
    mongoose.disconnect();
    console.log("🔌 Desconexión completa.");
  }
}).catch((err) => {
  console.error("❌ Error al conectar a MongoDB Atlas:", err);
});
