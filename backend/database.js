const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://serzavala1977:Control2025Mongo@cluster0.zzowbmv.mongodb.net/controlTelecom?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conexión a MongoDB Atlas exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
  }
};

module.exports = connectDB;
