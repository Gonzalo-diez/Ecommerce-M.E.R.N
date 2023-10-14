import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/App.css"

const Login = ({ setIsAuthenticated, setUsuario }) => {
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://ecommerce-mern-txdp.onrender.com/login", {
        correo_electronico: correoElectronico,
        contrasena: contrasena,
      });
      if (res.status === 200) {
        setUsuario(res.data.usuario);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setShowErrorToast(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar sesión</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico:</Form.Label>
          <Form.Control
            type="email"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
          <Link to="/registro">Registro</Link>
        </div>
      </Form>
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        bg="danger"
        text="white"
      >
        <Toast.Header>
          <strong className="mr-auto">Email o contraseña incorrectos</strong>
        </Toast.Header>
        <Toast.Body>Si usted no tiene cuenta registrese.</Toast.Body>
      </Toast>
    </div>
  );
};

export default Login;