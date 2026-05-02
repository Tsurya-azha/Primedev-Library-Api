import express from "express";
import prisma from "../database.js";

// GET: Mendapatkan semua daftar user
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.json({
      "success": true,
      "message": "Users retrieved successfully",
      "data": users
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// GET: Mendapatkan user berdasarkan ID
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.users.findUnique({
      where: { id: id }
    });

    if (!user) {
      return res.status(404).json({
        "success": false,
        "message": `User with ID: ${id} not found`
      });
    }

    res.json({
      "success": true,
      "message": "User retrieved successfully",
      "data": user
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// POST: Membuat user baru
export const createUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        role
      }
    });

    res.status(201).json({
      "success": true,
      "message": "User created successfully",
      "data": user
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// PUT: Memperbarui data user berdasarkan ID
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  try {
    // Cek apakah user ada
    const userExist = await prisma.users.findUnique({
      where: { id: id }
    });

    if (!userExist) {
      return res.status(404).json({
        "success": false,
        "message": `User with ID: ${id} not found`
      });
    }

    // Update data user
    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: {
        name,
        email,
        role
      }
    });

    res.json({
      "success": true,
      "message": "User updated successfully",
      "data": updatedUser
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// DELETE: Menghapus user berdasarkan ID
export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const userExist = await prisma.users.findUnique({
      where: { id: id }
    });

    if (!userExist) {
      return res.status(404).json({
        "success": false,
        "message": `User with ID: ${id} not found`
      });
    }

    await prisma.users.delete({
      where: { id: id }
    });

    res.json({
      "success": true,
      "message": "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};