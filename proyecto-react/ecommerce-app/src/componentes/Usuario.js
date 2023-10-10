import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from "axios";

const Usuario = ({isAuthenticated}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productoUsuario, setProductoUsuario] = useState([]);
    const [comprasUsuario, setComprasUsuario] = useState([]);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [showEditar, setShowEditar] = useState(false);

    useEffect(() => {
        const fetchProductoUsuario = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/usuario/${id}/productos`);
                setProductoUsuario(res.data);
            }
            catch(err) {
                console.log(err)
            }
        };
        fetchProductoUsuario();

        const fetchComprasUsuario = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/usuario/${id}/compras`);
                setComprasUsuario(res.data);
            }
            catch(err) {
                console.log(err)
            }
        };
        fetchComprasUsuario();
    }, [id]);

    const handleActualizarUsuario = async() => {
        try {
            // Realizar una solicitud al servidor para actualizar los datos del usuario
            const response = await axios.put(`http://localhost:8800/usuario/${id}`, {
                nuevoNombre,
                nuevaContrasena
            });
            // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
            if (response.data.message === "Datos de usuario actualizados") {
                alert("Datos actualizados con éxito");
                setShowEditar(false); // Cerrar el formulario de edición
            } else {
                alert("Hubo un error al actualizar los datos del usuario");
            }
        } catch (error) {
            console.error(error);
            alert("Hubo un error al actualizar los datos del usuario");
        }
    }

    return (
        <div className="d-flex flex-column align-items-center min-vh-100">
            <h2>Mi Perfil</h2>

            <Button onClick={() => setShowEditar(true)}>Editar Usuario</Button>

            <Modal show={showEditar} onHide={() => setShowEditar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col} controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nuevo nombre"
                                value={nuevoNombre}
                                onChange={(e) => setNuevoNombre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formContrasena">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nueva contraseña"
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditar(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleActualizarUsuario}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <h2>Mis Productos</h2>
            <Row>
                {productoUsuario.map((item) => (
                    <Col key={item._id} md={4}>
                        <Card className="mt-5 card-inicio">
                            <Card.Img variant="top" src={item.imagen_url} alt={item.nombre} className="img-fluid card-image" />
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

            <h2>Mis Compras</h2>
            <ul>
                {comprasUsuario.map((compra) => (
                    <li key={compra._id}>
                        <p>Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>
                        <ul>
                            {compra.productos.map((producto) => (
                                <li key={producto.producto._id}>
                                    <p>Producto: {producto.producto.nombre}</p>
                                    <p>Cantidad: {producto.cantidad}</p>
                                </li>
                            ))}
                        </ul>
                        <p>Total: ${compra.total.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Usuario;
