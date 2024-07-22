const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Define a schema
const formSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    treatmentRequirement: String
});

// Create a model
const FormData = mongoose.model('FormData', formSchema);

// Route to handle form submission
app.post('/api/submit', (req, res) => {
    const { fullName, email, phoneNumber, treatmentRequirement } = req.body;

    const newFormData = new FormData({ fullName, email, phoneNumber, treatmentRequirement });

    newFormData.save((err) => {
        if (err) {
            return res.status(500).send({ message: 'Error saving data' });
        }
        res.send({ message: 'Data saved successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
