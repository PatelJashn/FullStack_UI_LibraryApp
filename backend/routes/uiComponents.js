import express from "express";
import mongoose from "mongoose";
import UIComponent from "../models/UIComponent.js";

const router = express.Router();

// In-memory store for UI components when MongoDB is not connected
const localComponents = new Map();
let componentIdCounter = 1;

// Get all UI components (with optional filtering)
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      let components = Array.from(localComponents.values());
      
      // Filter by category
      if (category && category !== 'All') {
        components = components.filter(comp => comp.category === category);
      }
      
      // Search functionality
      if (search) {
        const searchLower = search.toLowerCase();
        components = components.filter(comp => 
          comp.title.toLowerCase().includes(searchLower) ||
          comp.description.toLowerCase().includes(searchLower) ||
          comp.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // Sort by creation date (newest first)
      components.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const total = components.length;
      const skip = (page - 1) * limit;
      const paginatedComponents = components.slice(skip, skip + parseInt(limit));
      
      return res.json({
        components: paginatedComponents,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        message: "Using local storage - components will be lost on server restart"
      });
    }

    // MongoDB is connected - use database
    let query = { isPublic: true };
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const components = await UIComponent.find(query)
      .populate('author', 'username fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await UIComponent.countDocuments(query);
    
    res.json({
      components,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching components", error: error.message });
  }
});

// Get a single UI component by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      return res.json(component);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(req.params.id)
      .populate('author', 'username fullName');
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Error fetching component", error: error.message });
  }
});

// Create a new UI component
router.post("/", async (req, res) => {
  try {
    const { title, description, category, code, tags, authorId } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !code) {
      return res.status(400).json({ 
        message: "Title, description, category, and code are required" 
      });
    }

    const newComponent = {
      id: componentIdCounter.toString(),
      title,
      description,
      category,
      code,
      tags: tags || [],
      author: authorId || "local-user",
      isPublic: true,
      likes: [],
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store locally
    localComponents.set(newComponent.id, newComponent);
    componentIdCounter++;

    // If MongoDB is connected, also save there
    if (mongoose.connection.readyState === 1) {
      const mongoComponent = new UIComponent({
        title,
        description,
        category,
        code,
        tags: tags || [],
        author: authorId || "507f1f77bcf86cd799439011" // Placeholder
      });
      await mongoComponent.save();
    }

    console.log(`✅ New UI component created: ${title}`);
    res.status(201).json(newComponent);
  } catch (error) {
    console.error("Error creating component:", error);
    res.status(400).json({ message: "Error creating component", error: error.message });
  }
});

// Update a UI component
router.put("/:id", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      // Update component
      Object.assign(component, req.body, { updatedAt: new Date() });
      localComponents.set(req.params.id, component);
      
      return res.json(component);
    }

    // MongoDB is connected - use database
    const updatedComponent = await UIComponent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedComponent) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    res.json(updatedComponent);
  } catch (error) {
    res.status(400).json({ message: "Error updating component", error: error.message });
  }
});

// Delete a UI component
router.delete("/:id", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      localComponents.delete(req.params.id);
      return res.json({ message: "Component deleted successfully" });
    }

    // MongoDB is connected - use database
    const deletedComponent = await UIComponent.findByIdAndDelete(req.params.id);
    
    if (!deletedComponent) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting component", error: error.message });
  }
});

// Like/Unlike a component
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      const likeIndex = component.likes.indexOf(userId);
      
      if (likeIndex > -1) {
        // Unlike
        component.likes.splice(likeIndex, 1);
      } else {
        // Like
        component.likes.push(userId);
      }
      
      component.updatedAt = new Date();
      localComponents.set(req.params.id, component);
      
      return res.json(component);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(req.params.id);
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    const likeIndex = component.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      component.likes.splice(likeIndex, 1);
    } else {
      // Like
      component.likes.push(userId);
    }
    
    await component.save();
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Error updating likes", error: error.message });
  }
});

// Increment download count
router.post("/:id/download", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      component.downloads += 1;
      component.updatedAt = new Date();
      localComponents.set(req.params.id, component);
      
      return res.json(component);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Error updating downloads", error: error.message });
  }
});

export default router; 