import { Spinner } from 'react-bootstrap'


const Loader = ({ signIn, register, order }) => {
    return (
        <Spinner
            role="status"
            animation="border"
            style={{
                display: "block",
                width: signIn || register || order ? "25px" : "40px",
                height: signIn || register || order ? "25px" : "40px",
                margin: signIn ? "0 12px -1px 12px" : register ? "0 16px -1px 16px" : order ? "0px auto -1px" : "auto"
            }}
        >

        </Spinner>
    )
}

export default Loader