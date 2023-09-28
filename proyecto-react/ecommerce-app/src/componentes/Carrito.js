import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const Carrito = ({ carrito, removeFromCart }) => {
  const [formData, setFormData] = useState({
    pais: '',
    localidad: '',
    codigoPostal: '',
    calle: '',
    telefono: '',
    tarjeta: '',
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carritoVacioMessage, setCarritoVacioMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCompra = async () => {
    if (carrito.length === 0) {
      setCarritoVacioMessage('El carrito está vacío. Agrega productos antes de comprar.');
      return;
    }

    const producto = carrito[0]; // Obtener el primer producto del carrito

    try {
      // Aquí puedes enviar los datos del formulario junto con el producto al servidor
      const response = await axios.post("http://localhost:8800/comprar", {
        producto,
        formData,
      });

      console.log(response.data);
      removeFromCart(producto._id);
      // Oculta el formulario después de comprar
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al comprar:", error);
    }
  };


  return (
    <div className="carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p className='text-center'>{carritoVacioMessage}</p>
        ) : (
          <ul>
            {carrito.map((producto, index) => (
              <li key={`${producto._id}-${index}`}>
                {producto.nombre} - ${producto.precio}
                <Button variant="danger" onClick={() => removeFromCart(producto._id)}>Quitar</Button>
              </li>
            ))}
          </ul>
        )}
        {carrito.length > 0 && (
          <Button variant="primary" onClick={() => setMostrarFormulario(true)}>Realizar Compra</Button>
        )}
        {mostrarFormulario && (
          <Form>
            <Form.Group controlId="pais">
              <Form.Label>País</Form.Label>
              <Form.Control type="text" name="pais" value={formData.pais} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="localidad">
              <Form.Label>Localidad</Form.Label>
              <Form.Control type="text" name="localidad" value={formData.localidad} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="codigoPostal">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="telefono">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="tarjeta">
              <Form.Label>Tarjeta de Crédito/Débito</Form.Label>
              <Form.Control type="text" name="tarjeta" value={formData.tarjeta} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleCompra}>Realizar Compra</Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default Carrito;