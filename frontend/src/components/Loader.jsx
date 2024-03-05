import { Spinner } from 'react-bootstrap'


const Loader = () => {
    return (
        <Spinner
            role="status"
            animation="border"
            style={{
                width: "25px",
                height: "25px",
                margin: "auto",
                display: "block"
            }}
        >

        </Spinner>
    )
}

export default Loader