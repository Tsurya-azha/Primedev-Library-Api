import express from "express";
import prisma from "../configs/database.config.js";
import { isCategoryExist } from './categories.controller.js';
import { validationResult } from "express-validator";
import { getFileUrl, uploadFile, deleteFile } from './cloudinary.controller.js';
import logger from '../configs/pino.config.js'; // Pintu masuk Pino Logger

// 1. GET ALL BOOKS
export const getBooks = async (req, res) => {
  try {
    const books = await prisma.books.findMany()

    books.forEach((book) => {
      // Disesuaikan dari cloudinaryId menjadi cloudinary sesuai skema database kamu
      if (!book.cloudinary) {
        book.coverUrl = null
      } else {
        book.coverUrl = getFileUrl(book.cloudinary)
      }
    })
    
    res.status(200).json({
      "success": true,
      "message": "Books retrieved successfully",
      "data": books
    })
  } catch (error) {
    logger.error(error, 'Error saat mengambil semua data buku')
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

// 2. GET BOOK BY ID
export const getBooksById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    const book = await prisma.books.findUnique({
      where: { id: id }
    })

    if (!book) {
      return res.status(404).json({
        "success": false,
        "message": `Book with ID: ${id} not found`
      })
    }

    // Generate url cover jika data penampung link gambar di database tersedia
    if (book.cloudinary) {
      book.coverUrl = getFileUrl(book.cloudinary)
    } else {
      book.coverUrl = null
    }

    res.json({
      "success": true,
      "message": "Book retrieved successfully",
      "data": book
    })
  } catch (error) {
    logger.error(error, `Error saat mengambil data buku dengan ID: ${req.params.id}`)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

// 3. CREATE BOOK
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
  let cloudinaryUrl = null

  try {
    if (cover) {
      const result = await uploadFile(cover)
      cloudinaryUrl = result.secure_url 
    }

    const { categoryId, title, author, year } = req.body

    const parsedCategoryId = parseInt(categoryId, 10)
    const parsedYear = parseInt(year, 10)

    const categoryExists = await prisma.categories.findUnique({
      where: { id: parsedCategoryId }
    })

    if (!categoryExists) {
      await prisma.categories.create({
        data: {
          id: parsedCategoryId, 
          name: `Kategori Otomatis ${parsedCategoryId}` 
        }
      })
      logger.info(`Kategori baru dengan ID: ${parsedCategoryId} berhasil dibuat otomatis!`)
    }

    const book = await prisma.books.create({
      data: {
        title,
        author,
        year: parsedYear,
        cloudinary: cloudinaryUrl, 
        categories: {
          connect: { id: parsedCategoryId } // Menggunakan gaya connect relasi agar lebih aman di Prisma
        }
      },
    })

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    })

  } catch (error) {
    logger.error(error, 'Error saat membuat buku baru')
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

// 4. UPDATE BOOK
export const updateBook = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validationErrors.array(),
    })
  }

  try {
    const id = parseInt(req.params.id, 10)

    const book = await prisma.books.findUnique({
      where: { id: id },
    })

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID: ${id} not found`,
      })
    }

    const { categoryId, title, author, year } = req.body
    const parsedCategoryId = parseInt(categoryId, 10)
    const parsedYear = parseInt(year, 10)

    const categoryExists = await prisma.categories.findUnique({
      where: { id: parsedCategoryId }
    })

    if (!categoryExists) {
      await prisma.categories.create({
        data: {
          id: parsedCategoryId,
          name: `Kategori Otomatis ${parsedCategoryId}`
        }
      })
      logger.info(`Kategori ID ${parsedCategoryId} dibuat otomatis saat update buku!`)
    }

    const cover = req.file
    let cloudinaryValue = book.cloudinary 

    if (cover) {
      if (book.cloudinary) {
        await deleteFile(book.cloudinary)
      }

      const result = await uploadFile(cover)
      cloudinaryValue = result.secure_url 
    }

    const updatedBook = await prisma.books.update({
      where: { id: id },
      data: {
        title,
        author,
        year: parsedYear,
        cloudinary: cloudinaryValue, 
        categories: {
          connect: { id: parsedCategoryId }
        },
      },
    })

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook, 
    })

  } catch (error) {
    logger.error(error, 'Error saat update data buku')
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

// 5. DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    const book = await prisma.books.findUnique({
      where: { id: id }
    })

    if (!book) {
      return res.status(404).json({
        "success": false,
        "message": `Book with ID: ${id} not found`
      })
    }

    // Diubah dari book.cloudinaryId ke book.cloudinary sesuai nama tabel asli
    if (book.cloudinary) {
      await deleteFile(book.cloudinary)
      logger.info(`File cover untuk buku ID ${id} sukses dihapus dari Cloudinary`)
    }

    await prisma.books.delete({
      where: { id: id }
    })

    res.status(200).json({
      "success": true,
      "message": "Book deleted successfully"
    })
  } catch (error) {
    logger.error(error, `Error saat menghapus data buku dengan ID: ${req.params.id}`)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

// 6. HELPER EXISTENCE CHECK
export const isBookExist = async (id) => {
  try {
    const book = await prisma.books.findUnique({
      where: { id: id },
    })
    return !!book 
  } catch (error) {
    logger.error(error, `Error saat mengecek isBookExist untuk ID: ${id}`)
    return false
  }
}