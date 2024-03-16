import { Container, Row, Col } from 'react-bootstrap'


const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col sm={12} md={12} lg={9} xl={7}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer