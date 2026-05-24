import express from "express";
import prisma from "../configs/database.config.js";
import logger from '../configs/pino.config.js'

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profiles.findMany({
      include: { users: true }
    });

    res.json({
      "success": true,
      "message": "Profiles retrieved successfully",
      "data": profiles
    });
  } catch (error) {
    logger.error(error, 'Error saat mengambil semua data profile')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const getProfileById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: id },
      include: { users: true }
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
    logger.error(error, `Error saat mengambil profile ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const createProfile = async (req, res) => {
  const { bio, avatar, userId } = req.body;

  try {
    const profile = await prisma.profiles.create({
      data: {
        bio,
        avatar,
        userId: parseInt(userId, 10)
      }
    });

    logger.info(`Profile baru sukses dibuat untuk User ID: ${userId}`)

    res.status(201).json({
      "success": true,
      "message": "Profile created successfully",
      "data": profile
    });
  } catch (error) {
    logger.error(error, 'Error saat membuat profile baru')
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const updateProfile = async (req, res) => {
  const id = parseInt(req.params.id, 10);
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
      data: { bio, avatar }
    });

    logger.info(`Profile ID ${id} sukses diperbarui`)

    res.json({
      "success": true,
      "message": "Profile updated successfully",
      "data": updatedProfile
    });
  } catch (error) {
    logger.error(error, `Error saat memperbarui profile ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};

export const deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id, 10);

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

    await prisma.profiles.delete({ where: { id: id } });

    logger.info(`Profile ID ${id} sukses dihapus`)

    res.json({
      "success": true,
      "message": "Profile deleted successfully"
    });
  } catch (error) {
    logger.error(error, `Error saat menghapus profile ID: ${req.params.id}`)
    res.status(500).json({ "success": false, "message": "Internal server error", "error": error.message });
  }
};