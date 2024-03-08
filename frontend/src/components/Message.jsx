import { Alert } from 'react-bootstrap'


const Message = ({ varient, children, className }) => {
    return (
        <Alert variant={varient} className={className}>
            {children}
        </Alert>
    )
}

Message.defaultProps = {
    variant: 'info'
}

export default Message