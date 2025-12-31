import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Item from './models/Menu.js';

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURI);
        console.log("✅ Connected to MongoDB for seeding");

        const data = JSON.parse(fs.readFileSync('./Cat.json', 'utf8'));

        const count = await Item.countDocuments();
        if (count === 0) {
            await Item.insertMany(data);
            console.log("✅ Database seeded successfully!");
        } else {
            console.log("ℹ️ Database already contains data, skipping seed.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
