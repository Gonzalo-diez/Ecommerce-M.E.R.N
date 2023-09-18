import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button } from 'react-bootstrap';

function Producto({ isAuthenticated, addToCart }) {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                // Haciendo una solicitud GET al servidor para obtener el producto por su ID
                const res = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                setProducto(res.data); // Actualizando el estado con el producto obtenido
            } catch (err) {
                console.log(err);
            }
        };
        fetchProducto();
    }, [id]);

    if (!producto) { 
        return <p>No hay productos de este tipo</p>;
    }

    // Ya que solo se espera un producto, no necesitas mapear un array
    const item = producto;

    const handleAddToCart = () => {
        addToCart(item);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card key={item._id} className="text-center card-producto">
                <Card.Img variant="top" src={item.imagen_url} alt={item.nombre} />
                <Card.Body>
                    <Card.Title>{item.nombre}</Card.Title>
                    <Card.Text>marca: {item.marca}</Card.Text>
                    <Card.Text>tipo: {item.tipo}</Card.Text>
                    <Card.Text>precio: ${item.precio}</Card.Text>
                    <Card.Text>stock: {item.stock}</Card.Text>
                    {isAuthenticated && (
                        <Button onClick={handleAddToCart} variant="primary">Agregar al Carrito</Button>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default Producto;
