import express from "express";
import prisma from "../configs/database.config.js";
import logger from '../configs/pino.config.js'

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.json({
      "success": true,
      "message": "Users retrieved successfully",
      "data": users
    });
  } catch (error) {
    logger.error(error, 'Error saat mengambil daftar user')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

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
    logger.error(error, `Error saat mengambil user ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const getUserByIdWithProfile = async (req, res) => {
  const id = parseInt(req.params.id, 10)

  try {
    const user = await prisma.users.findUnique({
      where: { id: id },
      include: { profiles: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${id} not found`,
      })
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    })
  } catch (error) {
    logger.error(error, `Error saat mengambil data user + profile ID: ${req.params.id}`)
    res.status(500).json({ success: false, message: "Internal server error", error: error.message })
  }
}

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await prisma.users.create({
      data: { name, email, password, role }
    });

    logger.info(`User baru dibuat manual via dashboard: ${email}`)

    res.status(201).json({
      "success": true,
      "message": "User created successfully",
      "data": user
    });
  } catch (error) {
    logger.error(error, 'Error saat membuat user baru')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, password, role } = req.body; // Ditambahkan password agar aman

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

    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: { name, password, email, role }
    });

    logger.info(`Data user ID ${id} sukses diperbarui`)

    res.json({
      "success": true,
      "message": "User updated successfully",
      "data": updatedUser
    });
  } catch (error) {
    logger.error(error, `Error saat mengupdate user ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

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

    await prisma.users.delete({ where: { id: id } });

    logger.info(`User ID ${id} sukses dihapus dari database`)

    res.json({
      "success": true,
      "message": "User deleted successfully"
    });
  } catch (error) {
    logger.error(error, `Error saat menghapus data user ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const isUserExist = async (id) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: id } })
    return !!user
  } catch (error) {
    logger.error(error, `Error saat cek isUserExist ID: ${id}`)
    return false
  }
}