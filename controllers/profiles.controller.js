import express from "express";
import prisma from "../configs/database.config.js";

// GET: Mendapatkan semua daftar profile
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profiles.findMany({
      include: {
        users: true // Opsional: Menampilkan data user pemilik profile
      }
    });

    res.json({
      "success": true,
      "message": "Profiles retrieved successfully",
      "data": profiles
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// GET: Mendapatkan profile berdasarkan ID
export const getProfileById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: id },
      include: {
        users: true
      }
    });

    if (!profile) {
      return res.status(404).json({
        "success": false,
        "message": `Profile with ID: ${id} not found`
      });
    }

    res.json({
      "success": true,
      "message": "Profile retrieved successfully",
      "data": profile
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// POST: Membuat profile baru
export const createProfile = async (req, res) => {
  const { bio, avatar, userId } = req.body;

  try {
    const profile = await prisma.profiles.create({
      data: {
        bio,
        avatar,
        userId: parseInt(userId) // Memastikan userId berupa angka
      }
    });

    res.status(201).json({
      "success": true,
      "message": "Profile created successfully",
      "data": profile
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// PUT: Memperbarui data profile berdasarkan ID
export const updateProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const { bio, avatar } = req.body;

  try {
    const profileExist = await prisma.profiles.findUnique({
      where: { id: id }
    });

    if (!profileExist) {
      return res.status(404).json({
        "success": false,
        "message": `Profile with ID: ${id} not found`
      });
    }

    const updatedProfile = await prisma.profiles.update({
      where: { id: id },
      data: {
        bio,
        avatar
      }
    });

    res.json({
      "success": true,
      "message": "Profile updated successfully",
      "data": updatedProfile
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};

// DELETE: Menghapus profile berdasarkan ID
export const deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const profileExist = await prisma.profiles.findUnique({
      where: { id: id }
    });

    if (!profileExist) {
      return res.status(404).json({
        "success": false,
        "message": `Profile with ID: ${id} not found`
      });
    }

    await prisma.profiles.delete({
      where: { id: id }
    });

    res.json({
      "success": true,
      "message": "Profile deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ "success": false, "message": error.message });
  }
};