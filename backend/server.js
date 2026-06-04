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

// Schema (👇 यही लिखना है)
const LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    source: String,
    status: { type: String, default: "New" },
    notes: String
});

const Lead = mongoose.model("Lead", LeadSchema);

// Routes (👇 यही लिखना है)

// GET all leads
app.get("/test", (req, res) => {
    res.json({ ok: "server working" });
});
app.get("/api/leads", async (req, res) => {
    const leads = await Lead.find();
    res.json(leads);
});

// ADD lead
app.post("/api/leads", async (req, res) => {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(lead);
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