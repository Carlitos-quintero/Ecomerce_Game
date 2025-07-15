const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

// Conexión a PostgreSQL
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  logging: false
});

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log("Conexión exitosa a PostgreSQL"))
  .catch(err => console.error("Error al conectar a PostgreSQL:", err));

const app = express();
app.use(express.json());
app.use(cors());

/* ===========================
   MODELOS
=========================== */

// Usuario
const Usuario = sequelize.define("Usuario", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Producto
const Producto = sequelize.define("Producto", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true }) // Cambiar a { force: true } si deseas reiniciar las tablas
  .then(() => console.log("Modelos sincronizados"))
  .catch(err => console.error("Error al sincronizar modelos:", err));

/* ===========================
   RUTAS
=========================== */

// Registro
app.post("/registro", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const totalUsuarios = await Usuario.count();

    const nuevoUsuario = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: totalUsuarios === 0
    });

    res.status(201).json({ usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
});

// Obtener productos (Dashboard)
app.get("/dashboard", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// CRUD de productos
app.get("/productos", async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

app.post("/productos", async (req, res) => {
  const nuevoProducto = await Producto.create(req.body);
  res.status(201).json(nuevoProducto);
});

app.put("/productos/:id", async (req, res) => {
  const id = req.params.id;
  const actualizado = await Producto.update(req.body, { where: { id }, returning: true });
  res.json(actualizado[1][0]);
});

app.delete("/productos/:id", async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Servidor funcionando en el puerto ${PORT}`);
});