import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Eliminar({ isAuthenticated }) {
    const [producto, setProducto] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const datosProducto = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                setProducto(datosProducto.data);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProducto();
    }, [id]);

    const handleEliminar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para eliminar productos.");
            navigate("/login");
            return;
        }
        try {
            await axios.delete(`http://localhost:8800/productos/borrarProducto/${id}`);
            setShowToast(true);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleCancelar = () => {
        navigate(`/productos/detalle/${id}`);
    };

    return (
        <Container className="text-center">
            <h2>Eliminar Producto</h2>
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            {producto && (
                <div className="eliminar-container">
                    <h2>{producto.nombre}</h2>
                    <img src={producto.imagen_url} alt={producto.nombre} />
                </div>
            )}
            <Button variant="danger" onClick={handleEliminar} className="m-2">Sí, eliminar</Button>
            <Button variant="secondary" onClick={handleCancelar}>No, cancelar</Button>
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                bg="warning"
                text="white"
            >
                <Toast.Header>
                    <strong className="mr-auto">Producto eliminado</strong>
                </Toast.Header>
                <Toast.Body>Se elimino el producto con éxito.</Toast.Body>
            </Toast>
        </Container>
    );
}

export default Eliminar;
