const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

const scenarioSchema = new mongoose.Schema({
    city: String,
    panelArea: Number,
    batteryCap: Number,
    baselineCost: Number,
    optimizedCost: Number,
    savings: Number,
    createdAt: { type: Date, default: Date.now }
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'OptiGrid Express Engine Active' });
});

app.post('/api/scenarios', async (req, res) => {
    try {
        const { city, panelArea, batteryCap, baselineCost, optimizedCost, savings } = req.body;
        const newScenario = new Scenario({
            city, panelArea, batteryCap, baselineCost, optimizedCost, savings
        });
        await newScenario.save();
        res.status(201).json({ success: true, data: newScenario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/scenarios', async (req, res) => {
    try {
        const history = await Scenario.find().sort({ createdAt: -1 }).limit(10);
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 OptiGrid Server running on port ${PORT}`));