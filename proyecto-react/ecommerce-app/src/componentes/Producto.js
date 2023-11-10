import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Toast, ToastContainer, Row, Col, Pagination } from 'react-bootstrap';
import { IoCart } from "react-icons/io5";
import { BiSolidCommentAdd } from "react-icons/bi";

function Producto({ isAuthenticated, addToCart, usuario }) {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [nombre, setNombre] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comentarios.slice(startIndex, endIndex);


    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                setProducto(res.data);
                const comentariosRes = await axios.get(`http://localhost:8800/productos/comentarios/${id}`);
                setComentarios(comentariosRes.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProducto();
    }, [id]);

    const item = producto;

    const handleAddToCart = () => {
        addToCart(item);
        setShowToast(true);
    };

    const usuarioId = usuario ? usuario._id : null;

    const handleComentarioChange = (event) => {
        setNuevoComentario(event.target.value);
    };

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                const comentarioData = {
                    texto: nuevoComentario,
                    usuarioId: usuarioId,
                    productoId: id,
                    nombre: nombre,
                };
                await axios.post(`https://ecommerce-mern-txdp.onrender.com/productos/comentarios/agregar`, comentarioData);

                const comentariosRes = await axios.get(`https://ecommerce-mern-txdp.onrender.com/productos/comentarios/${id}`);
                setComentarios(comentariosRes.data);
                setNuevoComentario("");
                setShowToastComentario(true);
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Debes iniciar sesión o registrarte para comentar.");
        }
    };

    if (!producto) {
        return <p>No hay productos de este tipo</p>;
    }

    return (
        <div className="producto-container">
            <div className="producto-details">
                <Card key={item._id} className="text-center card-producto m-auto mt-4">
                    <Card.Img variant="top" src={item.imagen_url} alt={item.nombre} />
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <Card.Text>marca: {item.marca}</Card.Text>
                        <Card.Text>$<strong>{item.precio}</strong></Card.Text>
                        <Card.Text>Cantidad: {item.stock}</Card.Text>
                        <Card.Text>{item.descripcion}</Card.Text>
                        {isAuthenticated && (
                            <Button onClick={handleAddToCart} variant="primary">Agregar al Carrito <IoCart /></Button>
                        )}
                    </Card.Body>
                </Card>
                <ToastContainer position="middle-center">
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={3000}
                        autohide
                        bg="success"
                        text="white"
                    >
                        <Toast.Header>
                            <strong className="mr-auto">Producto en carrito</strong>
                        </Toast.Header>
                        <Toast.Body>El producto se agrego a su carrito.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>

            <div className="comentarios-container">
                <h3>Comentarios</h3>
                {comentarios.length === 0 ? (
                    <p>Sin comentarios</p>
                ) : (
                    <Row>
                        {displayedComments.map((comentario) => (
                            <Col key={comentario._id} xs={12} md={6} lg={4}>
                                <div className="comentario">
                                    {comentario.nombre && (
                                        <p><strong>{comentario.nombre}:</strong></p>
                                    )}
                                    <p>{comentario.texto}</p>
                                    <p>Fecha: {new Date(comentario.fecha).toLocaleString()}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                {comentarios.length > COMMENTS_PER_PAGE && (
                    <div className="pagination-container">
                        <Pagination className="mt-3">
                            {Array.from({ length: Math.ceil(comentarios.length / COMMENTS_PER_PAGE) }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                )}
                {isAuthenticated && (
                    <div className="nuevo-comentario">
                        <Form>
                            <Form.Group controlId="nombre">
                                <Form.Label>Tu Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="nuevoComentario">
                                <Form.Label>Deja un comentario:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={nuevoComentario}
                                    onChange={handleComentarioChange}
                                />
                            </Form.Group>
                            <Button onClick={handleSubmitComentario} variant="primary" className="btn-comentario">
                               <BiSolidCommentAdd /> Comentario 
                            </Button>
                        </Form>
                        <Toast
                            show={showToastComentario}
                            onClose={() => setShowToastComentario(false)}
                            delay={3000}
                            autohide
                            bg="success"
                            text="white"
                        >
                            <Toast.Header>
                                <strong className="mr-auto">Comentario agregado</strong>
                            </Toast.Header>
                            <Toast.Body>Tu comentario se agrego.</Toast.Body>
                        </Toast>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Producto;
