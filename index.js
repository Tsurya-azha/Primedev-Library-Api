import express from 'express'
import { books } from './data.js'
import prisma from './database.js' 

const app = express()
const port = 3000
app.use(express.json())



app.get('/', (req, res) => {
  res.send('test!!')
})

app.get('/books/:id', (req, res) => {

	const id = parseInt(req.params.id)

	const book = books.find((book) => book.id == id)

	if (!book){
		return res.send(`Books with ID: ${id} are not found`)
	}
	res.send( book )
})

app.post('/books', (req, res) =>{

	const {title, author, year} = req.body

	const newId = books.length + 1

	const newBook = { id: newId, title, author, year }

	books.push(newBook)

	res.send('Books created successfuly')
})

app.put('/books/:id', (req, res) => {
	const id = parseInt(req.params.id)

	const { title, author, year } = req.body

	const bookIndex = books.findIndex((book) => book.id === id)

	if(bookIndex === -1){
		res.send(`Books with ID: ${id} are not found`)
		return
	}

books[bookIndex] = {
	id: book[bookIndex].id,
	title,
	author,
	year,
}

	res.send(`Books ${id} succesfully changed`)
})

app.delete('/books/:id', (req, res) => {
	const id = req.params.id

	res.send(`Succesfully deleting book ${id}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})