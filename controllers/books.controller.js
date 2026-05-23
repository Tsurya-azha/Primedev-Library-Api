import express from "express";
import prisma from "../configs/database.config.js";
import {isCategoryExist} from './categories.controller.js';
import { validationResult } from "express-validator";
import { getFileUrl, uploadFile } from './cloudinary.controller.js';

export const getBooks = async (req, res) => {

const books = await prisma.books.findMany()

 books.forEach((book) => {
    if (!book.cloudinaryId) {
      book.coverUrl = null
    } else {
	    book.coverUrl = getFileUrl(book.cloudinaryId)
    }
  })
  
  res.status(200).json({
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
    return res.status(404).json({
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

  const validationErrors = validationResult(req)

if (!validationErrors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: validationErrors.array(),
  })
}

const cover = req.file
  let cloudinaryId = null

  if (cover) {
    const result = await uploadFile(cover)

    cloudinaryId = result.public_id
  }

  const { categoryId, title, author, year } = req.body

  // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year,
      cloudinaryId,
    },
  })

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  })
}

export const updateBook = async (req, res) => {

  const validationErrors = validationResult(req)

if (!validationErrors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: validationErrors.array(),
  })
}

  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { categoryId, title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  const cover = req.file
  let cloudinaryId = book.cloudinaryId

  // Jika ada file cover yang diunggah, unggah ke Cloudinary dan dapatkan public_id-nya
  if (cover) {
    // Jika buku sudah memiliki cover sebelumnya,
    // hapus file cover lama dari Cloudinary menggunakan public_id yang disimpan di database
    if (book.cloudinaryId) {
      const deleted = await deleteFile(book.cloudinaryId)
    }

    const result = await uploadFile(cover)
    cloudinaryId = result.public_id
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id,
    },
    data: {
      categoryId,
      title,
      author,
      year,
      cloudinaryId,
    },
  })

  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book,
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
    return res.status(404).json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

   if (book.cloudinaryId) {
    const deleted = await deleteFile(book.cloudinaryId)
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })

  res.status(200 ).json({
    "success": true,
    "message": "Book deleted successfully"
  })
}

export const isBookExist = async (id) => {

  const book = await prisma.books.findUnique({
    where: {
      id:id,
    },
  })

  return !!book 
}


