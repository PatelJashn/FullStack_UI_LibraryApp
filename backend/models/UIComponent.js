import mongoose from "mongoose";

const UIComponentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    default: function() {
      return `Component ${Date.now()}`;
    }
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: function() {
      return `UI Component in ${this.category} category`;
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['All', 'Buttons', 'Checkboxes', 'Toggle switches', 'Cards', 'Loaders', 'Inputs', 'Radio buttons', 'Forms']
  },
  code: {
    html: {
      type: String,
      required: true
    },
    css: {
      type: String,
      required: function() {
        return !this.useTailwind; // CSS is only required when not using Tailwind
      },
      default: ""
    },
    js: {
      type: String,
      default: ""
    }
  },
  preview: {
    type: String, // Base64 encoded preview image
    default: ""
  },
  tags: [{
    type: String,
    trim: true
  }],
  useTailwind: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downloads: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
UIComponentSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('UIComponent', UIComponentSchema); 