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

app.get('/books', async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()
  
  res.send(books)
})

app.post('/books', (req, res) =>{

	const {title, author, year} = req.body

	const newId = books.length + 1

	const newBook = { id: newId, title, author, year }

	books.push(newBook)

	res.send('Books created successfuly')
})

app.put('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;

  try {
    // 1. Check if the book exists in the database
    const book = await prisma.books.findUnique({
      where: { id: id }
    });

    if (!book) {
      return res.status(404).send(`Book with ID: ${id} not found`);
    }

    // 2. Update the book in the database
    const updatedBook = await prisma.books.update({
      where: { id: id },
      data: {
        title: title || book.title,   // If no title provided, keep the old one
        author: author || book.author,
        year: year || book.year
      }
    });

    res.send({ message: `Book ${id} successfully changed`, data: updatedBook });
  } catch (error) {
    res.status(500).send("Error updating database");
  }
});

app.delete('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.books.delete({
      where: { id: id }
    });
    res.send(`Successfully deleted book ${id}`);
  } catch (error) {
    res.status(404).send(`Could not delete book ${id}. It might not exist.`);
  }
});