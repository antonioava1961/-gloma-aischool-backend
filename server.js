require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares esenciales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Rutas de la API académica conectada con Gemini
const aiRoutes = require('./routes/aiRoutes');
app.use('/api', aiRoutes);

// Ruta comodín para redirigir al index.html si no se encuentra un archivo (Útil para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Servidor de GLOMA AI SCHOOL corriendo con éxito`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 Acceso local: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
