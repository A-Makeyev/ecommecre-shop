import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3 mt-5">
                        <p>Shop &copy; {new Date().getFullYear()}</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer