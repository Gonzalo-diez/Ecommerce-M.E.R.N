import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const Carrito = ({ carrito, removeFromCart }) => {
  const handleCompra = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de comprar.");
      return;
    }
  
    try {
      for (const producto of carrito) {
        const productId = producto._id;
  
        const response = await axios.post("http://localhost:8800/comprar", { productId });
        console.log(response.data);
        removeFromCart(productId);
      }
    } catch (error) {
      console.error("Error al comprar:", error);
    }
  };
  
  return (
    <div className="carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((producto) => (
            <li key={producto._id}>
              {producto.nombre} - ${producto.precio}
              <Button variant="danger" onClick={() => removeFromCart(producto.id)}>Quitar</Button>
            </li>
          ))}
        </ul>
        <Button variant="primary" onClick={handleCompra}>Realizar Compra</Button>
      </div>
    </div>
  );
};

export default Carrito;