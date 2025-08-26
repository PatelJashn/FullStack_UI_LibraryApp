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
        message: "Using local storage - components will be lost on server restart"
      });
    }

    // MongoDB is connected - use database
    console.log('🗄️ Using MongoDB (connected)');
    
    let query = { isPublic: true };
    
    // Filter by category - ONLY if category is specified AND not "All"
    if (category && category !== 'All') {
      query.category = category;
      console.log(`📊 MongoDB query with category filter: ${category}`);
    } else {
      console.log(`📊 MongoDB query without category filter - showing all components`);
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
      console.log(`📊 MongoDB query with search: ${search}`);
    }
    
    const total = await UIComponent.countDocuments(query);
    console.log(`📊 MongoDB total documents matching query: ${total}`);
    
    // For "All" category, return ALL components without pagination
    let components;
    if (category && category !== 'All') {
      // Only apply pagination for specific categories
      const skip = (page - 1) * limit;
      components = await UIComponent.find(query)
        .populate('author', 'username fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      console.log(`📊 MongoDB paginated result: ${components.length} components (page ${page})`);
    } else {
      // Return all components without pagination for "All" category
      components = await UIComponent.find(query)
        .populate('author', 'username fullName')
        .sort({ createdAt: -1 });
      console.log(`📊 MongoDB all components result: ${components.length} components`);
      
      // Separate forms from other components
      const forms = components.filter(comp => comp.category === "Forms");
      const nonForms = components.filter(comp => comp.category !== "Forms");
      
      // Shuffle non-form components randomly
      const shuffledNonForms = shuffleArray(nonForms);
      
      // Combine: shuffled non-forms first, then forms at the end
      components = [...shuffledNonForms, ...forms];
      
      console.log(`📊 After random shuffle: ${shuffledNonForms.length} non-forms + ${forms.length} forms = ${components.length} total`);
    }
    
    console.log(`✅ MongoDB response: ${components.length} components for category: ${category || 'All'}`);
    
    res.json({
      components,
      totalPages: category && category !== 'All' ? Math.ceil(total / limit) : 1,
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Error in GET /api/ui-components:', error);
    res.status(500).json({ message: "Error fetching components", error: error.message });
  }
});

// Get a single UI component by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use local storage - check both id and _id
      const component = localComponents.get(req.params.id) || localComponents.get(req.params.id);
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
    if (!code.html) {
      return res.status(400).json({ 
        message: "HTML code is required" 
      });
    }

    // CSS is only required when not using Tailwind
    if (!code.css && !req.body.useTailwind) {
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
      useTailwind: req.body.useTailwind || false,
      author: authorId || "local-user",
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
        useTailwind: req.body.useTailwind || false,
        author: authorId || "507f1f77bcf86cd799439011" // Placeholder
      });
      await mongoComponent.save();
      console.log(`✅ New UI component saved to MongoDB: ${title}`);
    } else {
      console.log(`✅ New UI component saved locally: ${title} (Total: ${localComponents.size / 2})`);
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
      // Use local storage - check both id and _id
      const component = localComponents.get(req.params.id) || localComponents.get(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      // Delete from both id and _id keys
      localComponents.delete(component.id);
      localComponents.delete(component._id);
      console.log(`🗑️ Component deleted from local storage: ${component.title}`);
      
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