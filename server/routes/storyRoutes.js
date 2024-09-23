import express from 'express';
import Story from '../models/Story.js';
import OpenAI from 'openai';

const router = express.Router();

import dotenv from 'dotenv'; 
dotenv.config(); 

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure your API key is set correctly
});

// Route to generate a story
router.post('/generate', async (req, res) => {
  const { title, prompt } = req.body;

  console.log("fvdvf",req.body)

  try {
    // Call OpenAI's GPT to generate story content using gpt-3.5-turbo
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",  // Update model here
      prompt: `${prompt}`,
      max_tokens: 500,
    });

    const content = response.choices[0].text;

    // Save the story to the database
    const newStory = new Story({ title, content });
    await newStory.save();

    res.status(201).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating story' });
  }
});

export default router;
