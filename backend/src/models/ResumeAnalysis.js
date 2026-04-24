const mongoose = require('mongoose');

// Stores each resume analysis attempt for a user.
const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: null,
    },
    extractedText: {
      type: String,
      required: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
