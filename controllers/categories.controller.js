import express from "express";
import prisma from "../configs/database.config.js";

// GET: Mendapatkan semua daftar category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();

    res.json({
      "success": true,
      "message": "Categories retrieved successfully",
      "data": categories
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
}

export const getAllBooksByCategoryId = async (req, res) => {
  
  const id = parseInt(req.params.id);

  try {
    const category = await prisma.categories.findUnique({
      where: {
         id: id,
        },
        include: {
          books: true,
        },
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
    res.status(500).json({ "success": false, "message": error.message }); 
  }
  };

// GET: Mendapatkan category berdasarkan ID
export const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id);

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
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// POST: Membuat category baru
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await prisma.categories.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      "success": true,
      "message": "Category created successfully",
      "data": category
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// PUT: Memperbarui data category berdasarkan ID
export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
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
      data: {
        name,
        description
      }
    });

    res.json({
      "success": true,
      "message": "Category updated successfully",
      "data": updatedCategory
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// DELETE: Menghapus category berdasarkan ID
export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

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

    await prisma.categories.delete({
      where: { id: id }
    });

    res.json({
      "success": true,
      "message": "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};