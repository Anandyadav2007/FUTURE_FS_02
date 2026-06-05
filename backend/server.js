const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://cmruser:Pratibha%404126@ac-cpqjegg-shard-00-00.6560wa4.mongodb.net:27017,ac-cpqjegg-shard-00-01.6560wa4.mongodb.net:27017,ac-cpqjegg-shard-00-02.6560wa4.mongodb.net:27017/crm?ssl=true&replicaSet=atlas-vn98lw-shard-0&authSource=admin")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", UserSchema);

// Schema (👇 यही लिखना है)
const LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    source: String,
    status: { type: String, default: "New" },
    notes: String,
    followupDate: String,
});

const Lead = mongoose.model("Lead", LeadSchema);
async function createAdmin() {
    const user = await User.findOne({
        email: "admin@gmail.com",
    });

    if (!user) {
        const hashed = await bcrypt.hash(
            "admin123",
            10
        );

        await User.create({
            email: "admin@gmail.com",
            password: hashed,
        });

        console.log("Admin Created");
    }
}

createAdmin();

// Routes (👇 यही लिखना है)

// GET all leads
app.get("/test", (req, res) => {
    res.json({ ok: "server working" });
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "User not found" });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res
                .status(400)
                .json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            { id: user._id },
            "crmsecret"
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});
app.get("/api/leads", async (req, res) => {
    const leads = await Lead.find();
    res.json(leads);
});

// ADD lead
app.post("/api/leads", async (req, res) => {
    console.log("FOLLOWUP DATE:", req.body.followupDate);
    try {
        const { name, email, source, notes, followupDate } = req.body;

        const lead = new Lead({
            name,
            email,
            source,
            notes,
            followupDate: followupDate
        });

        await lead.save();

        res.json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE lead
app.put("/api/leads/:id", async (req, res) => {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
});

// DELETE lead
app.delete("/api/leads/:id", async (req, res) => {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Test route
app.get("/test", (req, res) => {
    res.json({ message: "API Working 🚀" });
});

// Server start
app.listen(5000, () => {
    console.log("Server running on port 5000");
});