import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();


// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/Ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");
});

// Define el modelo de usuario en Mongoose
const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo_electronico: String,
  contrasena: String,
});

const User = mongoose.model("User", userSchema);

const productoSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  tipo: String,
  imagen_url: String,
});

const Producto = mongoose.model("Producto", productoSchema);



// Configuración de Passport para autenticación local
passport.use(
  new LocalStrategy(
    {
      usernameField: "correo_electronico",
      passwordField: "contrasena",
    },
    async (correo_electronico, contrasena, done) => {
      try {
        const user = await User.findOne({ correo_electronico }).exec();

        if (!user || user.contrasena !== contrasena) {
          return done(null, false, { message: "Credenciales inválidas" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  try {
    const productos = await Producto.find({});
    return res.json(productos);
  } catch (err) {
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});


app.get("/productos/:tipo", async (req, res) => {
  const tipo = req.params.tipo;

  try {
    // Utiliza el método find de Mongoose para buscar productos por tipo
    const productos = await Producto.find({ tipo }).exec();
    return res.json(productos);
  } catch (err) {
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});

app.get("/productos/detalle/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const productId = new mongoose.Types.ObjectId(id); // Utiliza 'new' para crear una instancia de ObjectId

    const producto = await Producto.findOne({ _id: productId }).exec();

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (err) {
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});

app.post("/agregarProductos", async (req, res) => {
  const {
    nombre,
    marca,
    descripcion,
    precio,
    stock,
    tipo,
    imagen_url,
  } = req.body;

  try {
    const nuevoProducto = new Producto({
      nombre,
      marca,
      descripcion,
      precio,
      stock,
      tipo,
      imagen_url,
    });

    await nuevoProducto.save(); 

    return res.json("Producto creado!!!");
  } catch (err) {
    console.error("Error al guardar el producto:", err);
    return res
      .status(500)
      .json({ error: "Error en la base de datos", details: err.message });
  }
});


app.post("/registro", async (req, res, next) => {
  const { nombre, apellido, correo_electronico, contrasena } = req.body;

  try {
    const newUser = new User({
      nombre,
      apellido,
      correo_electronico,
      contrasena,
    });

    await newUser.save(); // Utiliza await para manejar la promesa devuelta por save()
    passport.authenticate("local")(req, res, () => {
      return res.json({ message: "Usuario registrado!" });
    });
  } catch (err) {
    return next(err);
  }
});



app.post("/login", (req, res, next) => {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ message: "Inicio de sesión exitoso", usuario: user });
    });
  })(req, res, next);
});

// Para actualizar un documento en Mongoose, puedes utilizar el método `findByIdAndUpdate`
app.put("/productos/actualizarProducto/:id", async (req, res) => {
  const productId = req.params.id;
  const { nombre, marca, descripcion, precio, stock, tipo, imagen_url } = req.body;

  try {
    const updatedProduct = await Producto.findByIdAndUpdate(
      productId, // Utilizar el método findByIdAndUpdate para buscar y actualizar por ObjectId
      {
        nombre,
        marca,
        descripcion,
        precio,
        stock,
        tipo,
        imagen_url,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json("Producto actualizado!");
  } catch (err) {
    console.error("Error en la actualización:", err);
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});

// Método para borrar un producto
app.delete("/productos/borrarProducto/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await Producto.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json("Producto eliminado!");
  } catch (err) {
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});

// Endpoint para realizar una compra
app.post("/comprar", (req, res) => {
  const productId = req.body.productId;

  Producto.findById(productId, (err, product) => {
    if (err) {
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.stock === 0) {
      return res.status(400).json({ error: "Producto agotado" });
    }

    // Actualizar el stock del producto después de la compra
    product.stock -= 1;

    product.save((saveErr, updatedProduct) => {
      if (saveErr) {
        return res.status(500).json({ error: "Error en la base de datos", details: saveErr.message });
      }
      return res.json({ message: "Compra exitosa, stock actualizado", producto: updatedProduct });
    });
  });
});

app.listen(8800, () => {
  console.log("Backend conectado");
});