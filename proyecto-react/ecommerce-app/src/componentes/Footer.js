import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { BiLogoGmail } from "react-icons/bi";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <p className="mb-0">&copy; {new Date().getFullYear()} Todos los derechos reservados</p>
                    </Col>
                    <Col md={6}>
                        <ul className="list-unstyled d-flex justify-content-end mb-0">
                            <li className="mx-2">
                                <a href="www.linkedin.com/in/gdiezbuchanan" className="text-light"><BsLinkedin /></a>
                            </li>
                            <li className="mx-2">
                                <a href="https://github.com/Gonzalo-diez" className="text-light"><BsGithub /></a>
                            </li>
                            <li className="mx-2">
                                <a href="mailto:gonzalodiez97@gmail.com" className="text-light"><BiLogoGmail /></a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;