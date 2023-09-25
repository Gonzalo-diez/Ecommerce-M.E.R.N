import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/App.css"

const Login = ({ setIsAuthenticated, setUsuario }) => {
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/login", {
        correo_electronico: correoElectronico,
        contrasena: contrasena,
      });
      if (res.status === 200) {
        setUsuario(true)
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
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
    </div>
  );
};

export default Login;