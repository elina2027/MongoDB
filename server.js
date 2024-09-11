const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const mongoURI = "mongodb+srv://elinanaghashyanfd:3w2za1MPmAWhf8N0@book-directory.tw3uq.mongodb.net/book-directory?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });



const Book = mongoose.model('Book', bookSchema);

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/books', async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
    });
    const book = await newBook.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      book.title = req.body.title;
      book.author = req.body.author;
      await book.save();
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete book with ID: ${req.params.id}`);
    const result = await Book.findByIdAndDelete(req.params.id);
    console.log('Delete result:', result);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error in DELETE /books/:id:', err);
    res.status(500).send('Server Error');
  }
});


