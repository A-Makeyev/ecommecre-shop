import { Spinner } from 'react-bootstrap'


const Loader = ({ signIn, register, order }) => {
    return (
        <Spinner
            role="status"
            animation="border"
            style={{
                width: signIn || register || order ? "25px" : "40px",
                height: signIn || register || order ? "25px" : "40px",
                display: signIn || register ? "block" : "inline-block",
                margin: signIn ? "0 12px -1px 12px" : register ? "0 16px -1px 16px" : order ? "1px 18px -1px 18px" : "auto"
            }}
        >

        </Spinner>
    )
}

export default Loader