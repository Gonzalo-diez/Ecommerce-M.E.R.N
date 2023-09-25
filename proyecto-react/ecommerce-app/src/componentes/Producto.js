import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form } from 'react-bootstrap';

function Producto({ isAuthenticated, addToCart, usuario }) {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");

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
    };

    const usuarioId = usuario ? usuario._id : null;

    const handleComentarioChange = (event) => {
        setNuevoComentario(event.target.value);
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                await axios.post(`http://localhost:8800/productos/comentarios/agregar`, {
                    texto: nuevoComentario,
                    usuarioId: usuarioId,
                    productoId: id,
                });

                const comentariosRes = await axios.get(`http://localhost:8800/productos/comentarios/${id}`);
                setComentarios(comentariosRes.data);

                setNuevoComentario("");
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
                        <Card.Text>tipo: {item.tipo}</Card.Text>
                        <Card.Text>precio: ${item.precio}</Card.Text>
                        <Card.Text>stock: {item.stock}</Card.Text>
                        {isAuthenticated && (
                            <Button onClick={handleAddToCart} variant="primary">Agregar al Carrito</Button>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <div className="comentarios-container">
                <h3>Comentarios</h3>
                {comentarios.map((comentario) => (
                    <div key={comentario._id} className="comentario">
                        <p>{comentario.texto}</p>
                        <p>Fecha: {new Date(comentario.fecha).toLocaleString()}</p>
                    </div>
                ))}
                {isAuthenticated && (
                    <div className="nuevo-comentario">
                        <Form>
                            <Form.Group controlId="nuevoComentario">
                                <Form.Label>Deja un comentario:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={nuevoComentario}
                                    onChange={handleComentarioChange}
                                />
                            </Form.Group>
                            <Button onClick={handleSubmitComentario} variant="primary">
                                Agregar Comentario
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Producto;
