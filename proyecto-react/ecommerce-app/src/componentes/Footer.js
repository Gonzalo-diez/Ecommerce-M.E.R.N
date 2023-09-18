import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
                                <a href="#" className="text-light">Facebook</a>
                            </li>
                            <li className="mx-2">
                                <a href="#" className="text-light">Twitter</a>
                            </li>
                            <li className="mx-2">
                                <a href="#" className="text-light">Instagram</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
