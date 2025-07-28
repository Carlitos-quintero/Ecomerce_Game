const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("Conexión exitosa a PostgreSQL"))
  .catch((err) => console.error("Error al conectar a PostgreSQL:", err));

/**
 * MODELOS
 */

const Usuario = sequelize.define("Usuario", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Producto = sequelize.define("Producto", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoriaId: { type: DataTypes.INTEGER },
});

const Categoria = sequelize.define("Categoria", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Carrito = sequelize.define("Carrito", {
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  productoId: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// Relaciones
Categoria.hasMany(Producto, { foreignKey: "categoriaId" });
Producto.belongsTo(Categoria, { foreignKey: "categoriaId" });

sequelize.sync({ alter: true })
  .then(() => console.log("Modelos sincronizados con la base de datos"))
  .catch((err) => console.error("Error al sincronizar modelos:", err));

/**
 * AUTENTICACIÓN
 */

app.post("/registro", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) return res.status(400).json({ message: "Correo ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const totalUsuarios = await Usuario.count();

    const nuevoUsuario = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: totalUsuarios === 0,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error en el login" });
  }
});

/**
 * CRUD USUARIOS (ADMIN)
 */

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.json(usuario);
});

app.put("/usuarios/:id", async (req, res) => {
  const { name, email } = req.body;
  await Usuario.update({ name, email }, { where: { id: req.params.id } });
  const actualizado = await Usuario.findByPk(req.params.id);
  res.json(actualizado);
});

app.delete("/usuarios/:id", async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

/**
 * CRUD PRODUCTOS
 */

app.get("/productos", async (req, res) => {
  const productos = await Producto.findAll({ include: Categoria });
  res.json(productos);
});

app.get("/productos/:id", async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.json(producto);
});

app.post("/productos", async (req, res) => {
  const nuevoProducto = await Producto.create(req.body);
  res.status(201).json(nuevoProducto);
});

app.put("/productos/:id", async (req, res) => {
  await Producto.update(req.body, { where: { id: req.params.id } });
  const actualizado = await Producto.findByPk(req.params.id);
  res.json(actualizado);
});

app.delete("/productos/:id", async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

/**
 * CRUD CATEGORÍAS
 */

app.get("/categorias", async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
});

app.get("/categorias/:id", async (req, res) => {
  const productos = await Producto.findAll({ where: { categoriaId: req.params.id } });
  res.json(productos);
});

app.post("/categorias", async (req, res) => {
  const nueva = await Categoria.create(req.body);
  res.status(201).json(nueva);
});

app.put("/categorias/:id", async (req, res) => {
  await Categoria.update(req.body, { where: { id: req.params.id } });
  const actualizada = await Categoria.findByPk(req.params.id);
  res.json(actualizada);
});

app.delete("/categorias/:id", async (req, res) => {
  await Categoria.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

/**
 * CARRITO DE COMPRA
 */

app.get("/carrito/:usuarioId", async (req, res) => {
  const carrito = await Carrito.findAll({ where: { usuarioId: req.params.usuarioId }, include: Producto });
  res.json(carrito);
});

app.post("/carrito/:usuarioId", async (req, res) => {
  const { productoId, cantidad } = req.body;
  const item = await Carrito.create({ usuarioId: req.params.usuarioId, productoId, cantidad });
  res.status(201).json(item);
});

app.put("/carrito/:usuarioId", async (req, res) => {
  const { productoId, cantidad } = req.body;
  await Carrito.update(
    { cantidad },
    { where: { usuarioId: req.params.usuarioId, productoId } }
  );
  const actualizado = await Carrito.findOne({ where: { usuarioId: req.params.usuarioId, productoId } });
  res.json(actualizado);
});

app.delete("/carrito/:usuarioId/:prodId", async (req, res) => {
  await Carrito.destroy({ where: { usuarioId: req.params.usuarioId, productoId: req.params.prodId } });
  res.status(204).send();
});

app.delete("/carrito/:usuarioId", async (req, res) => {
  await Carrito.destroy({ where: { usuarioId: req.params.usuarioId } });
  res.status(204).send();
});

/**
 * INICIAR SERVIDOR
 */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});