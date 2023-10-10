import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Button, Pagination } from 'react-bootstrap'; 
import './css/App.css';

function Tipo() {
    const navigate = useNavigate();
    const { tipo } = useParams();
    const [producto, setProducto] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    const productsPerPage = 6;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = producto.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (currentProducts.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center alert">
                <p>No hay productos en este tipo.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center min-vh-100">
            <Row>
                {currentProducts.map((item) => (
                    <Col key={item._id} md={4}>
                        <Card className="mt-5 card-categoria">
                            <Card.Img variant="top" src={item.imagen_url} alt={item.nombre}  className="img-fluid card-image" />
                            <Card.Body>
                                <Card.Title>{item.nombre}</Card.Title>
                                <Card.Text>marca: {item.marca}</Card.Text>
                                <Card.Text>$<strong>{item.precio}</strong></Card.Text>
                                <Card.Text>Cantidad: {item.stock}</Card.Text>
                                <Button onClick={() => navigate(`/productos/detalle/${item._id}`)}>Ver más</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(producto.length / productsPerPage) }).map((_, index) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default Tipo;
