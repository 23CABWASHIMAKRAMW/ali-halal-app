const mongoose = require('mongoose');

const MenuCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    displayOrder: {
        type: Number,
        default: 0
    }
});

const MenuItemSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuCategory',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MenuCategory = mongoose.model('MenuCategory', MenuCategorySchema);
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = { MenuCategory, MenuItem };
