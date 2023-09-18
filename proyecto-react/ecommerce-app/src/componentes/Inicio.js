import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Col, Row } from 'react-bootstrap';
import "./css/App.css"

const Inicio = ({ isAuthenticated }) => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get("http://localhost:8800/");
                setProductos(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProductos();
    }, []);

    const handleEliminarProducto = async (productId) => {
        try {
            navigate(`/productos/borrarProducto/${productId}`);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleAgregarProducto = () => {
        navigate('/agregarProductos');
    };

    return (
        <div>
            <div className="text-center">
                <h2>Bienvenido a la app</h2>
                {isAuthenticated && ( 
                    <Button onClick={handleAgregarProducto} className="mb-2">Agregar algún producto?</Button>
                )}
            </div>
            <div>
                <Row>
                    {productos.map((producto) => (
                        <Col key={producto._id} md={6}>
                            <Card className="mb-3 card-inicio">
                                <Card.Img variant="top" src={producto.imagen_url} alt={producto.nombre} className="img-fluid card-image" />
                                <Card.Body>
                                    <Card.Title>{producto.nombre}</Card.Title>
                                    <Card.Text>marca: {producto.marca}</Card.Text>
                                    <Card.Text>tipo: {producto.tipo}</Card.Text>
                                    <Card.Text>precio: ${producto.precio}</Card.Text>
                                    <Card.Text>stock: {producto.stock}</Card.Text>
                                    <div className="d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => navigate(`/productos/detalle/${producto._id}`)}>Ver más</Button>
                                        {isAuthenticated && (
                                            <div className="inicio-link-container">
                                                <Button variant="warning" onClick={() => navigate(`/productos/actualizarProducto/${producto._id}`)}>Actualizar</Button>
                                                <Button variant="danger" onClick={() => handleEliminarProducto(producto._id)}>Eliminar</Button>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Inicio;