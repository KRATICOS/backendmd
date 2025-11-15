require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// Variables de entorno
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/materials-dispenser";
const PORT = process.env.PORT || 5000;

// Crear servidor HTTP
const server = http.createServer(app);

// Crear instancia de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  pingInterval: 25000,
  pingTimeout: 60000
});

// Exportar io para usar en controladores
module.exports.io = io;

// Evento al conectar un cliente
io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Conexión a MongoDB
mongoose
  .connect(DB_URL)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API funcionando con Socket.IO");
});

// Iniciar servidor
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Servidor corriendo en el puerto ${PORT}`);
});
