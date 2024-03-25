import { useState } from 'react'
import { Form} from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'


const SearchBox = () => {
    const navigate = useNavigate()
    const { keyword: urlKeyword } = useParams()
    const [keyword, setKeyword] = useState(urlKeyword || '')

    const searchHandler = (event) => {
        event.preventDefault()

        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
            setKeyword('')
        } else {
            navigate('/')
        }
    }

    return (
        <>
            <Form onSubmit={searchHandler} className="search-bar d-flex pe-3">
                <Form.Control
                    name="q"
                    type="text"
                    value={keyword}
                    className="mr-sm-2 ml-sm-5"
                    placeholder="Search Products"
                    onChange={(event) => setKeyword(event.target.value)}
                >
                </Form.Control>
                <FaSearch 
                    role="button" 
                    type="submit"
                    className="search-icon" 
                    onClick={searchHandler} 
                />
            </Form>
        </>
    )
}

export default SearchBox