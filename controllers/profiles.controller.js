// profiles.controller.js

import prisma from '../configs/database.config.js'

export const getAllProfiles = async (req, res) => {
try {
  const profiles = await prisma.profiles.findMany();

  res.json({
    "success": true,
    "message": "Profiles retrieved successfully",
    "data": profiles
  });
} catch (error) {
  res.status(500).json({
    "success": false,
    "message": error.message
  });
}

};

export const getProfileById = async (req, res) => {
  // TODO: CODE GET CATEGORY BY ID
}

export const createProfile = async (req, res) => {
  // TODO: CODE CREATE CATEGORY
}

export const updateProfile = async (req, res) => {
  // TODO: CODE UPDATE CATEGORY
}

export const deleteProfile = async (req, res) => {
  // TODO: CODE DELETE CATEGORY
}