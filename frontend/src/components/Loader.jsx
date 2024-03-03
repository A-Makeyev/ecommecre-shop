import { Spinner } from 'react-bootstrap'


const Loader = () => {
    return (
        <Spinner
            role="status"
            animation="border"
            style={{
                width: "30px",
                height: "30px",
                margin: "auto",
                display: "block"
            }}
        >

        </Spinner>
    )
}

export default Loader