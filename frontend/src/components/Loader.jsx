import { Spinner } from 'react-bootstrap'


const Loader = ({ signIn, register, update, order, create }) => {
    return (
        <Spinner
            role="status"
            animation="border"
            style={{
                display: "block",
                width: signIn || register || order || update || create ? "25px" : "40px",
                height: signIn || register || order || update || create ? "25px" : "40px",
                margin: signIn ? "0 12px -1px 12px" 
                : register ? "0 16px -1px 16px" 
                : order || update ? "0px auto -1px" 
                : create ? "0 50.5px -1px 50.5px" 
                : "auto"
            }}
        >

        </Spinner>
    )
}

export default Loader