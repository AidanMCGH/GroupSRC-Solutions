const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
origin: '*',
methods:['GET', 'POST', 'OPTIONS'],
allowedHeaders:['Content-Type', 'Authorization']
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use((err, req, res, next)=>{
	console.error('${req.method} ${req.path}');
	next();
});

// Rutas
app.use('/api', routes);

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use((err, req, res, next)=>{
	console.error('Error global:', err);
	res.status(500).json({
	success:false,
	error: 'Error interno del servidor'
	});
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:',process.env.NODE_ENV || 'development');
});