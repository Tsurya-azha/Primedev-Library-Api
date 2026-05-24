import express from "express";
import prisma from "../configs/database.config.js"
import logger from '../configs/pino.config.js'

export const getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await prisma.borrowings.findMany({
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    res.json({
      success: true,
      message: 'Borrowings retrieved successfully',
      data: borrowings,
    })
  } catch (error) {
    logger.error(error, 'Error saat mengambil semua data peminjaman')
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}

export const getBorrowingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    const borrowing = await prisma.borrowings.findUnique({
      where: { id: id },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: `Borrowing with ID: ${id} not found`,
      })
    }

    res.json({
      success: true,
      message: 'Borrowing retrieved successfully',
      data: borrowing,
    })
  } catch (error) {
    logger.error(error, `Error saat mengambil peminjaman ID: ${req.params.id}`)
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}

export const createBorrowing = async (req, res) => {
  try {
    const { userId, bookId } = req.body

    const borrowing = await prisma.borrowings.create({
      data: {
        userId: parseInt(userId, 10),
        bookId: parseInt(bookId, 10),
      },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    await prisma.books.update({
      where: { id: parseInt(bookId, 10) },
      data: { available: false },
    })

    logger.info(`Buku ID ${bookId} sukses dipinjam oleh User ID ${userId}`)

    res.json({
      success: true,
      message: 'Borrowing created successfully',
      data: borrowing,
    })
  } catch (error) {
    logger.error(error, 'Error saat membuat data peminjaman baru')
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params

    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id, 10) },
    })

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing not found',
      })
    }

    if (borrowing.returned_at) {
      return res.status(400).json({
        success: false,
        message: 'Book already returned',
      })
    }

    const returnedBorrowing = await prisma.borrowings.update({
      where: { id: parseInt(id, 10) },
      data: { returned_at: new Date() },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    await prisma.books.update({
      where: { id: returnedBorrowing.bookId },
      data: { available: true },
    })

    logger.info(`Buku pada peminjaman ID ${id} telah dikembalikan`)

    res.json({
      success: true,
      message: 'Book returned successfully',
      data: returnedBorrowing,
    })
  } catch (error) {
    logger.error(error, `Error saat proses pengembalian buku ID: ${req.params.id}`)
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}

export const deleteBorrowing = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    const borrowing = await prisma.borrowings.findUnique({
      where: { id: id },
    })

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing not found',
      })
    }

    await prisma.borrowings.delete({ where: { id: id } })

    if (!borrowing.returned_at) {
      await prisma.books.update({
        where: { id: borrowing.bookId },
        data: { available: true },
      })
    }

    logger.info(`Data peminjaman ID ${id} berhasil dihapus dari sistem`)

    res.json({
      success: true,
      message: 'Borrowing deleted successfully',
    })
  } catch (error) {
    logger.error(error, `Error saat menghapus peminjaman ID: ${req.params.id}`)
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}