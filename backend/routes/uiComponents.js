import express from "express";
import mongoose from "mongoose";
import UIComponent from "../models/UIComponent.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// In-memory store for UI components when MongoDB is not connected
const localComponents = new Map();
let componentIdCounter = 1;

// Get all UI components (with optional filtering)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    console.log(`🔍 GET /api/ui-components - Category: ${category}, Search: ${search}, Page: ${page}, Limit: ${limit}`);
    
    // Helper function to shuffle array randomly
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📦 Using local storage (MongoDB not connected)');
      
      // Get all components from local storage
      let components = Array.from(localComponents.values());
      
      // Remove duplicates by keeping only unique components based on id
      const uniqueComponents = [];
      const seenIds = new Set();
      
      for (const component of components) {
        const componentId = component.id || component._id;
        if (!seenIds.has(componentId)) {
          seenIds.add(componentId);
          uniqueComponents.push(component);
        }
      }
      
      components = uniqueComponents;
      console.log(`📊 Total components in local storage: ${components.length}`);
      
      // Filter by category - ONLY if category is specified AND not "All"
      if (category && category !== 'All') {
        components = components.filter(comp => comp.category === category);
        console.log(`📊 After category filter (${category}): ${components.length} components`);
      } else {
        console.log(`📊 No category filter applied - showing all components`);
      }
      
      // Search functionality
      if (search) {
        const searchLower = search.toLowerCase();
        components = components.filter(comp => 
          comp.title.toLowerCase().includes(searchLower) ||
          comp.description.toLowerCase().includes(searchLower) ||
          comp.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
        console.log(`📊 After search filter: ${components.length} components`);
      }
      
      // Separate forms from other components
      const forms = components.filter(comp => comp.category === "Forms");
      const nonForms = components.filter(comp => comp.category !== "Forms");
      
      // Shuffle non-form components randomly
      const shuffledNonForms = shuffleArray(nonForms);
      
      // Combine: shuffled non-forms first, then forms at the end
      components = [...shuffledNonForms, ...forms];
      
      console.log(`📊 After random shuffle: ${shuffledNonForms.length} non-forms + ${forms.length} forms = ${components.length} total`);
      
      const total = components.length;
      
      // For "All" category, return ALL components without pagination
      let paginatedComponents = components;
      if (category && category !== 'All') {
        // Only apply pagination for specific categories
        const skip = (page - 1) * limit;
        paginatedComponents = components.slice(skip, skip + parseInt(limit));
        console.log(`📊 After pagination: ${paginatedComponents.length} components (page ${page})`);
      } else {
        console.log(`📊 No pagination applied - returning all ${total} components`);
      }
      
      console.log(`✅ Local storage response: ${paginatedComponents.length} components for category: ${category || 'All'}`);
      
      return res.json({
        components: paginatedComponents,
        totalPages: category && category !== 'All' ? Math.ceil(total / limit) : 1,
        currentPage: parseInt(page),
        total,
        user: req.user || null
      });
    }

    // MongoDB is connected - use database
    console.log('🗄️ Using MongoDB (connected)');
    
    let query = { isPublic: true };
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const total = await UIComponent.countDocuments(query);
    const skip = (page - 1) * limit;
    
    let components = await UIComponent.find(query)
      .populate('author', 'fullName username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Separate forms from other components
    const forms = components.filter(comp => comp.category === "Forms");
    const nonForms = components.filter(comp => comp.category !== "Forms");
    
    // Shuffle non-form components randomly
    const shuffledNonForms = shuffleArray(nonForms);
    
    // Combine: shuffled non-forms first, then forms at the end
    components = [...shuffledNonForms, ...forms];
    
    console.log(`✅ MongoDB response: ${components.length} components for category: ${category || 'All'}`);
    
    res.json({
      components,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      user: req.user || null
    });
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ message: "Error fetching components", error: error.message });
  }
});

// Get a single component by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      // Add user ownership info
      const componentWithOwnership = {
        ...component,
        isOwner: req.user && component.author === req.user._id,
        canEdit: req.user && component.author === req.user._id,
        canDelete: req.user && component.author === req.user._id
      };
      
      return res.json(componentWithOwnership);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(id)
      .populate('author', 'fullName username profilePic');
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    // Add user ownership info
    const componentWithOwnership = {
      ...component.toObject(),
      isOwner: req.user && component.author._id.toString() === req.user._id.toString(),
      canEdit: req.user && component.author._id.toString() === req.user._id.toString(),
      canDelete: req.user && component.author._id.toString() === req.user._id.toString()
    };
    
    res.json(componentWithOwnership);
  } catch (error) {
    console.error("Error fetching component:", error);
    res.status(500).json({ message: "Error fetching component", error: error.message });
  }
});

// Create a new UI component (requires authentication)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, category, code, tags, useTailwind } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !code) {
      return res.status(400).json({ 
        message: "Title, description, category, and code are required" 
      });
    }

    // Validate code structure
    if (!code.html) {
      return res.status(400).json({ 
        message: "HTML code is required" 
      });
    }

    // CSS is only required when not using Tailwind
    if (!code.css && !useTailwind) {
      return res.status(400).json({ 
        message: "CSS code is required when not using Tailwind" 
      });
    }

    const newComponent = {
      id: componentIdCounter.toString(),
      _id: componentIdCounter.toString(), // Add _id for consistency
      title,
      description,
      category,
      code,
      tags: tags || [],
      useTailwind: useTailwind || false,
      author: req.user._id.toString(), // Use authenticated user's ID
      authorName: req.user.fullName, // Store author name for local storage
      isPublic: true,
      likes: [],
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store locally - use both id and _id as keys to ensure consistency
    localComponents.set(newComponent.id, newComponent);
    localComponents.set(newComponent._id, newComponent);
    componentIdCounter++;

    // If MongoDB is connected, also save there
    if (mongoose.connection.readyState === 1) {
      const mongoComponent = new UIComponent({
        title,
        description,
        category,
        code,
        tags: tags || [],
        useTailwind: useTailwind || false,
        author: req.user._id // Use authenticated user's ID
      });
      await mongoComponent.save();
      console.log(`✅ New UI component saved to MongoDB: ${title} by ${req.user.email}`);
    } else {
      console.log(`✅ New UI component saved locally: ${title} by ${req.user.email} (Total: ${localComponents.size / 2})`);
    }

    console.log(`✅ New UI component created: ${title} by ${req.user.email}`);
    res.status(201).json(newComponent);
  } catch (error) {
    console.error("Error creating component:", error);
    res.status(500).json({ message: "Error creating component", error: error.message });
  }
});

// Update a UI component (requires authentication and ownership)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      // Check ownership
      if (component.author !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only edit your own components" });
      }
      
      // Update component
      Object.assign(component, req.body, { updatedAt: new Date() });
      localComponents.set(id, component);
      
      console.log(`✅ Component updated locally: ${component.title} by ${req.user.email}`);
      return res.json(component);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(id);
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    // Check ownership
    if (component.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own components" });
    }
    
    const updatedComponent = await UIComponent.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'fullName username profilePic');
    
    console.log(`✅ Component updated in MongoDB: ${updatedComponent.title} by ${req.user.email}`);
    res.json(updatedComponent);
  } catch (error) {
    console.error("Error updating component:", error);
    res.status(400).json({ message: "Error updating component", error: error.message });
  }
});

// Delete a UI component (requires authentication and ownership)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      // Check ownership
      if (component.author !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only delete your own components" });
      }
      
      // Delete from both id and _id keys
      localComponents.delete(component.id);
      localComponents.delete(component._id);
      console.log(`🗑️ Component deleted from local storage: ${component.title} by ${req.user.email}`);
      
      return res.json({ message: "Component deleted successfully" });
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(id);
    
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    
    // Check ownership
    if (component.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own components" });
    }
    
    await UIComponent.findByIdAndDelete(id);
    console.log(`🗑️ Component deleted from MongoDB: ${component.title} by ${req.user.email}`);
    
    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    res.status(500).json({ message: "Error deleting component", error: error.message });
  }
});

// Like/Unlike a component (requires authentication)
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage
      const component = localComponents.get(id);
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
      localComponents.set(id, component);
      
      return res.json(component);
    }

    // MongoDB is connected - use database
    const component = await UIComponent.findById(id);
    
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
    console.error("Error updating likes:", error);
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

// AI-powered code modification (requires authentication)
router.post("/:id/ai-modify", authenticateToken, async (req, res) => {
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