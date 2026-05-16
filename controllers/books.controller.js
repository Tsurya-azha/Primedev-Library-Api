import express from "express";
import prisma from "../configs/database.config.js";

export const getBooks = async (req, res) => {

const books = await prisma.books.findMany()
  
  res.json({
    "success": true,
    "message": "Books retrieved successfully",
    "data": books
  })
}

export const getBooksById = async (req, res) => {

const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  res.json({
    "success": true,
    "message": "Book retrieved successfully",
    "data": book
  })
}

export const createBook = async (req, res) => {

const { title, author, year } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book created successfully",
    "data": book
  })
}

export const updateBook = async (req, res) => {

const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book updated successfully",
    "data": book
  })
}

export const deleteBook = async (req, res) => {
    
const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })

  res.json({
    "success": true,
    "message": "Book deleted successfully"
  })
}