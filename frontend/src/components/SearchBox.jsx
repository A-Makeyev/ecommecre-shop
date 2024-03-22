import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'


const SearchBox = () => {
    const navigate = useNavigate()
    const { keyword: urlKeyword } = useParams()
    const [keyword, setKeyword] = useState(urlKeyword || '')

    const submitHandler = (event) => {
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
            <Form onSubmit={submitHandler} className="d-flex pe-3">
                <Form.Control
                    name="q"
                    type="text"
                    value={keyword}
                    className="mr-sm-2 ml-sm-5"
                    placeholder="Search Products"
                    onChange={(event) => setKeyword(event.target.value)}
                >
                </Form.Control>
                <Button type="submit">
                    <FaSearch />
                </Button>
            </Form>
        </>
    )
}

export default SearchBox