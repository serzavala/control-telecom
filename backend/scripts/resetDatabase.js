// resetDatabase.js
// 🔔 Script para eliminar colecciones de la base de datos 'controlTelecom'.

const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno desde .env

const MONGO_URL = process.env.MONGO_URL; // URL que debe estar bien definida en tu archivo .env

async function resetDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGO_URL);

    const db = mongoose.connection.db;

    // 🔨 Colecciones que eliminaremos
    const collections = ['ingresos', 'gastos', 'nominas', 'personals', 'vehiculos'];

    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).hasNext();
      if (exists) {
        await db.collection(collection).drop();
        console.log(`✅ Colección '${collection}' eliminada.`);
      } else {
        console.log(`⚠️ La colección '${collection}' no existe.`);
      }
    }

    console.log('🎉 Base de datos reiniciada correctamente.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al reiniciar base de datos:', error.message);
    process.exit(1);
  }
}

resetDatabase();

