import { useState , useEffect  } from 'react'
import axios from 'axios'
import './App.css'




function App() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [Search , setSearch] = useState('')

  useEffect(() => {
    ;(async()=>{
      try {
      setError(false)
      setLoading(true)
      const res = await axios.get('/api/books?q='+Search+'&fields=key,title,author_name,editions')
      console.log(res.data.docs)
      setBooks(res.data.docs)
      setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
        console.log(error)
      }
    })()
  }, [Search]);

  // if(loading) return <h1>Loading...</h1>
  // if(error) return <h1>Something went wrong</h1>

  console.log(books)

  return (
    <>
     <h1>Hello World</h1>
     <input type="text" value = {Search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search for books' style={{padding:10, width:'300px', fontSize:20}} />
     <br />
     <br />
     <h2> No of books : {books.length}</h2>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Something went wrong</h1>}
      {/* {!loading && !error && books.map((book)=>(
        <div key={book.key} style={{marginBottom:20}}>
          <h2>{book.title}</h2>
          <p>Author: {book.author_name?.join(', ')}</p>
          <p>Editions: {book.editions?.length}</p>
        </div>
      ))} */}
     <h1></h1>
    </>
  )
}

export default App
