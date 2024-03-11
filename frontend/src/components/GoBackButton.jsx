import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'


const GoBackButton = ({ text, url }) => {
    return (
        <>
            <Link to={url} className='btn btn-light my-3'>
                <FaArrowLeft className='mb-1' />
                {' '}
                <span>{text}</span>
            </Link>
        </>
    )
}

export default GoBackButton