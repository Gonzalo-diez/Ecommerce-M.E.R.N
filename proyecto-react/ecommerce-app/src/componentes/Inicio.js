import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Col, Row, Pagination } from 'react-bootstrap';
import { IoTrash, IoPencil, IoAddCircleOutline } from "react-icons/io5";
import "./css/App.css"

const Inicio = ({ isAuthenticated }) => {
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6); 
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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="text-center">
                <h2>Bienvenido a la app</h2>
                {isAuthenticated && ( 
                    <Button onClick={handleAgregarProducto} className="mb-2"><IoAddCircleOutline /> Agregar algún producto?</Button>
                )}
            </div>
            <div>
                <Row>
                    {currentProducts.map((producto) => (
                        <Col key={producto._id} md={4}>
                            <Card className="mb-3 card-inicio">
                                <Card.Img variant="top" src={producto.imagen_url} alt={producto.nombre} className="img-fluid card-image" />
                                <Card.Body>
                                    <Card.Title>{producto.nombre}</Card.Title>
                                    <Card.Text>marca: {producto.marca}</Card.Text>
                                    <Card.Text>tipo: {producto.tipo}</Card.Text>
                                    <Card.Text>$<strong>{producto.precio}</strong></Card.Text>
                                    <Card.Text>Cantidad: {producto.stock}</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="primary" onClick={() => navigate(`/productos/detalle/${producto._id}`)}>Ver más</Button>
                                        {isAuthenticated && (
                                            <div className="inicio-link-container">
                                                <Button variant="warning" onClick={() => navigate(`/productos/actualizarProducto/${producto._id}`)}><IoPencil /></Button>
                                                <Button variant="danger" onClick={() => handleEliminarProducto(producto._id)}><IoTrash /></Button>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <Pagination className="justify-content-center">
                {Array.from({ length: Math.ceil(productos.length / productsPerPage) }, (_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default Inicio;