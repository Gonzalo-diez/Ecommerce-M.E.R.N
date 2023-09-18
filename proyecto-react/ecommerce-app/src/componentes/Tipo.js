import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Button } from 'react-bootstrap'; 
import './css/App.css';

function Tipo() {
    const navigate = useNavigate();
    const { tipo } = useParams();
    const [producto, setProducto] = useState([]);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/productos/${tipo}`);
                setProducto(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProducto();
    }, [tipo]);

    if (producto.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center alert">
                <p>No hay productos en este tipo.</p>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                {producto.map((item) => (
                    <Col key={item._id} md={6} lg={4}>
                        <Card className="card-producto">
                            <Card.Img variant="top" src={item.imagen_url} alt={item.nombre}  className="img-fluid card-image" />
                            <Card.Body>
                                <Card.Title>{item.nombre}</Card.Title>
                                <Card.Text>marca: {item.marca}</Card.Text>
                                <Card.Text>tipo: {item.tipo}</Card.Text>
                                <Card.Text>precio: ${item.precio}</Card.Text>
                                <Card.Text>stock: {item.stock}</Card.Text>
                                <Button onClick={() => navigate(`/productos/detalle/${item._id}`)}>Ver más</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default Tipo;

