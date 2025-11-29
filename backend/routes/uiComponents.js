import express from "express";
import mongoose from "mongoose";
import UIComponent from "../models/UIComponent.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Health route for testing backend
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Get all components (public)
router.get("/", async (req, res) => {
  try {
    const components = await UIComponent.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: "Error fetching components" });
  }
});

// ✅ Create new component (main goal)
router.post("/", async (req, res) => {
  try {
    const { title, description, category, code, tags = [], useTailwind = false } = req.body;

    if (!title || !description || !category || !code?.html) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const newComponent = new UIComponent({
      title,
      description,
      category,
      code,
      tags,
      useTailwind,
      isPublic: true,
      downloads: 0,
      likes: []
    });

    await newComponent.save();
    res.status(201).json({ message: "ok", id: newComponent._id });  // 201 success
  } catch (err) {
    res.status(500).json({ message: "Error creating component" });
  }
});

// ✅ Increment download count
router.post("/:id/download", async (req, res) => {
  try {
    const component = await UIComponent.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!component) return res.status(404).json({ message: "Not found" });
    res.json({ status: "ok", downloads: component.downloads });
  } catch (err) {
    res.status(500).json({ message: "Error updating downloads" });
  }
});

export default router;
