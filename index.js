import express from 'express'
import axios from 'axios'

const app = express()
const port = 5050

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.search

        if (!searchQuery) {
            // If no search query provided, render the index.ejs template without search results
            res.render('index.ejs', { books: undefined });
            return;
        }

        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`)

        const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null
        }))

        res.render('index.ejs', {books})

    } catch(error) {
        console.log(`Error: ${error}`)
        res.status(500).send('Internal Server Error')
    }
})


app.listen(port, () => {
    console.log(`App running on port ${port}!`);
})