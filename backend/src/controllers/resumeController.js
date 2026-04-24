const pdfParse = require('pdf-parse');
const path = require('path');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { SKILL_KEYWORDS } = require('../utils/skillKeywords');

const extractPdfTextWithPdfJs = async (pdfBuffer) => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
  });

  const pdfDocument = await loadingTask.promise;
  let fullText = '';

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str || '').join(' ');
    fullText += ` ${pageText}`;
  }

  return fullText.trim();
};

// Converts resume content to plain text using file or direct text input.
const extractResumeText = async (file, resumeText) => {
  if (file) {
    const mimeType = (file.mimetype || '').toLowerCase();
    const extension = path.extname(file.originalname || '').toLowerCase();

    const isPdf = mimeType === 'application/pdf' || mimeType === 'application/x-pdf' || extension === '.pdf';
    const isText = mimeType === 'text/plain' || extension === '.txt';

    if (isPdf) {
      try {
        const parsed = await pdfParse(file.buffer);
        return parsed.text || '';
      } catch (primaryParseError) {
        try {
          const fallbackText = await extractPdfTextWithPdfJs(file.buffer);
          return fallbackText;
        } catch (fallbackParseError) {
          throw new Error(
            'Unable to read PDF content. Please upload a text-based (non-image), non-password-protected PDF or use TXT input.'
          );
        }
      }
    }

    if (isText) {
      return file.buffer.toString('utf8');
    }

    throw new Error('Unsupported file type. Upload PDF or TXT file only.');
  }

  if (resumeText && typeof resumeText === 'string') {
    return resumeText;
  }

  throw new Error('Please upload a resume file or provide resumeText.');
};

// Performs keyword-based resume analysis.
const analyzeResumeText = (text) => {
  const normalizedText = text.toLowerCase();

  const matchedSkills = SKILL_KEYWORDS.filter((skill) => normalizedText.includes(skill));
  const missingSkills = SKILL_KEYWORDS.filter((skill) => !normalizedText.includes(skill));

  const rawScore = (matchedSkills.length / SKILL_KEYWORDS.length) * 100;
  const score = Math.round(rawScore);

  const suggestions = [];
  if (missingSkills.length > 0) {
    suggestions.push(
      `Add these missing skills where relevant: ${missingSkills.slice(0, 8).join(', ')}.`
    );
  }

  if (!normalizedText.includes('project')) {
    suggestions.push('Include a clear Projects section with impact and tech stack.');
  }

  if (!normalizedText.includes('intern') && !normalizedText.includes('experience')) {
    suggestions.push('Add practical experience, internship, or freelance work details.');
  }

  if (!normalizedText.includes('achievement') && !normalizedText.includes('result')) {
    suggestions.push('Use measurable outcomes (e.g., improved X by Y%).');
  }

  if (suggestions.length === 0) {
    suggestions.push('Great baseline resume. Tailor keywords for each job description.');
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    suggestions,
  };
};

// @desc    Analyze uploaded resume or text and save result
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const extractedText = await extractResumeText(req.file, req.body.resumeText);

    const cleanText = extractedText.replace(/\s+/g, ' ').trim();
    if (!cleanText) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract meaningful text from resume.',
      });
    }

    const analysisResult = analyzeResumeText(cleanText);

    const saved = await ResumeAnalysis.create({
      user: req.user._id,
      fileName: req.file?.originalname || null,
      extractedText: cleanText,
      matchedSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
      score: analysisResult.score,
      suggestions: analysisResult.suggestions,
    });

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis: {
        id: saved._id,
        fileName: saved.fileName,
        score: saved.score,
        matchedSkills: saved.matchedSkills,
        missingSkills: saved.missingSkills,
        suggestions: saved.suggestions,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Resume analysis failed.',
      error: error.message,
    });
  }
};

module.exports = { analyzeResume };
