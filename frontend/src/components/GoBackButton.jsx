import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'


const GoBackButton = ({ url }) => {
    return (
        <>
            <Link to={url} className='btn btn-light my-3'>
                <FaArrowLeft className='mb-1' />
                {' '}
                <span>Go Back</span>
            </Link>
        </>
    )
}

export default GoBackButton