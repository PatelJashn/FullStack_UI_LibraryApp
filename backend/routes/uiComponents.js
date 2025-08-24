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

    // Validate code structure
    if (!code.html || !code.css) {
      return res.status(400).json({ 
        message: "HTML and CSS code are required" 
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
      console.log(`✅ New UI component saved to MongoDB: ${title}`);
    } else {
      console.log(`✅ New UI component saved locally: ${title}`);
    }

    console.log(`✅ New UI component created: ${title}`);
    res.status(201).json(newComponent);
  } catch (error) {
    console.error("Error creating component:", error);
    res.status(500).json({ message: "Error creating component", error: error.message });
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

// AI-powered code modification
router.post("/:id/ai-modify", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Get the component
    let component;
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      component = localComponents.get(req.params.id);
    } else {
      // MongoDB is connected - use database
      component = await UIComponent.findById(req.params.id);
    }
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Prepare the AI prompt
    const aiPrompt = `Modify this HTML and CSS based on the request: "${prompt}"

Original HTML: ${component.code.html}
Original CSS: ${component.code.css}

Return the modified code in this format:
HTML: [modified HTML]
CSS: [modified CSS]`;

    // Call Hugging Face API (you'll need to add your API key to environment variables)
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!hfApiKey) {
      return res.status(500).json({ 
        message: "Hugging Face API key not configured. Please add HUGGINGFACE_API_KEY to your environment variables." 
      });
    }

    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hfApiKey}`
      },
      body: JSON.stringify({
        inputs: aiPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return res.status(500).json({ 
        message: "Error calling AI service", 
        error: errorData.error?.message || 'Unknown error' 
      });
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text || data[0]?.text || data;

    // Parse the AI response to extract HTML and CSS
    const htmlMatch = aiResponse.match(/HTML:\s*([\s\S]*?)(?=CSS:|$)/i);
    const cssMatch = aiResponse.match(/CSS:\s*([\s\S]*?)$/i);

    if (!htmlMatch || !cssMatch) {
      return res.status(500).json({ 
        message: "Could not parse AI response. Please try again." 
      });
    }

    const modifiedHtml = htmlMatch[1].trim();
    const modifiedCss = cssMatch[1].trim();

    // Return the modified code
    res.json({
      success: true,
      modifiedCode: {
        html: modifiedHtml,
        css: modifiedCss
      },
      originalCode: {
        html: component.code.html,
        css: component.code.css
      }
    });

  } catch (error) {
    console.error("AI modification error:", error);
    res.status(500).json({ 
      message: "Error processing AI request", 
      error: error.message 
    });
  }
});

export default router; 