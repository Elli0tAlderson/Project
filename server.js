const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const FormSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"]
    },
    email: {
        type: String,
        required: [true, "Please enter email id"]
    },
    role: {
        type: String,
        required: [true, "Please select a wallpaper type"]
    },
    message: {
        type: String,
        required: false
    },
    flag1: {
        type: Boolean,
        default: false 
    },
    flag2: {
        type: Boolean,
        default: false 
    },
    flag3: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

const Form = mongoose.model("Form", FormSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.post('/post', async (req, res) => {
    try {
        const { name, email, role, message, flag1, flag2, flag3 } = req.body;
        const formdata = new Form({
            name,
            email,
            role,
            message,
            flag1: flag1 === 'on',
            flag2: flag2 === 'on',
            flag3: flag3 === 'on'
        });
        await formdata.save();
        res.send("Form submitted successfully");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

mongoose.connect('mongodb+srv://anshulvashishth:DVA37dIYhzpb3oAh@cluster0.lvcqj.mongodb.net/forms?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("MongoDB connection successful");
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }).catch((err) => {
        console.log("Connection failed:", err);
    });