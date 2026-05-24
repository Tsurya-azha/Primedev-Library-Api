import express from "express";
import prisma from "../configs/database.config.js";
import logger from '../configs/pino.config.js'

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();

    res.json({
      "success": true,
      "message": "Categories retrieved successfully",
      "data": categories
    });
  } catch (error) {
    logger.error(error, 'Error saat mengambil seluruh kategori')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
}

export const getAllBooksByCategoryId = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const category = await prisma.categories.findUnique({
      where: { id: id },
      include: { books: true },
    })

    if (!category) {
      return res.status(404).json({
        "success": false,
        "message": `Category with ID: ${id} not found`
      });
    }

    res.json({
      "success": true,
      "message": "Category retrieved successfully",
      "data": category
    });
  } catch (error) {
    logger.error(error, `Error saat mengambil buku berdasarkan kategori ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message }); 
  }
};

export const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const category = await prisma.categories.findUnique({
      where: { id: id }
    });

    if (!category) {
      return res.status(404).json({
        "success": false,
        "message": `Category with ID: ${id} not found`
      });
    }

    res.json({
      "success": true,
      "message": "Category retrieved successfully",
      "data": category
    });
  } catch (error) {
    logger.error(error, `Error saat mengambil kategori ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await prisma.categories.create({
      data: { name, description }
    });

    logger.info(`Kategori baru dibuat: ${name}`)

    res.status(201).json({
      "success": true,
      "message": "Category created successfully",
      "data": category
    });
  } catch (error) {
    logger.error(error, 'Error saat membuat kategori baru')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body;

  try {
    const categoryExist = await prisma.categories.findUnique({
      where: { id: id }
    });

    if (!categoryExist) {
      return res.status(404).json({
        "success": false,
        "message": `Category with ID: ${id} not found`
      });
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: id },
      data: { name, description }
    });

    logger.info(`Kategori ID ${id} sukses diperbarui`)

    res.json({
      "success": true,
      "message": "Category updated successfully",
      "data": updatedCategory
    });
  } catch (error) {
    logger.error(error, `Error saat memperbarui kategori ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const categoryExist = await prisma.categories.findUnique({
      where: { id: id }
    });

    if (!categoryExist) {
      return res.status(404).json({
        "success": false,
        "message": `Category with ID: ${id} not found`
      });
    }

    await prisma.categories.delete({ where: { id: id } });

    logger.info(`Kategori ID ${id} berhasil dihapus`)

    res.json({
      "success": true,
      "message": "Category deleted successfully"
    });
  } catch (error) {
    logger.error(error, `Error saat menghapus kategori ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const isCategoryExist = async (id) => {
  try {
    const category = await prisma.categories.findUnique({ where: { id: id } })
    return !!category
  } catch (error) {
    logger.error(error, `Error saat cek isCategoryExist ID: ${id}`)
    return false
  }
}