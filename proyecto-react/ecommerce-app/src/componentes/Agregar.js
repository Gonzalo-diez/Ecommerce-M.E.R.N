import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css"

function AgregarProductos({ isAuthenticated }) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState("");

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      console.log("Debes estar autenticado para agregar productos.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post("https://ecommerce-mern-txdp.onrender.com/agregarProductos", {
        nombre,
        marca,
        descripcion,
        precio,
        stock,
        tipo,
        imagen_url: url
      });

      console.log(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <div className="agregar-container">
      <h2>Agregar productos</h2>
      <Form>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="marca">
          <Form.Label>Marca del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Marca del producto"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="descripcion">
          <Form.Label>Descripción del producto:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Descripción del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="precio">
          <Form.Label>Precio del producto:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Precio del producto"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="stock">
          <Form.Label>Stock:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="url">
          <Form.Label>URL de la imagen:</Form.Label>
          <Form.Control
            type="url"
            placeholder="URL de la imagen"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="tipo">
          <Form.Label>Tipo:</Form.Label>
          <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option>---</option>
            <option value="celulares">Celulares</option>
            <option value="indumentaria">Indumentaria</option>
            <option value="computadoras">Computadoras</option>
            <option value="consolas">Consolas</option>
            <option value="libros">Libros</option>
            <option value="autos">Autos</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={handleAgregar} className="button-link-container">Agregar producto</Button>
      </Form>
    </div>
  );
}

export default AgregarProductos;
