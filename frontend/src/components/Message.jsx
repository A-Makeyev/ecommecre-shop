import { Alert } from 'react-bootstrap'


const Message = ({ varient, children }) => {
    return (
        <Alert variant={varient} className="p-0">
            {children}
        </Alert>
    )
}

Message.defaultProps = {
    variant: 'info'
}

export default Message