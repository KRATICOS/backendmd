require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// Variables de entorno
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/materials-dispenser";
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Ruta de prueba para verificar servidor
app.get("/", (req, res) => {
  res.send("🚀 API pública funcionando correctamente en Render");
});

// Inicializar servidor
// "0.0.0.0" permite acceso desde cualquier red o dispositivo (Internet, móvil, etc.)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Servidor corriendo en el puerto ${PORT}`);
});
