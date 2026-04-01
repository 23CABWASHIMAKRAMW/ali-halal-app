const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { MenuCategory, MenuItem } = require('./models/Menu');

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        await MenuCategory.deleteMany();
        await MenuItem.deleteMany();

        const categories = [
            { name: 'Appetizers', displayOrder: 1 },
            { name: 'Grilled Items', displayOrder: 2 },
            { name: 'Indian Cuisine', displayOrder: 3 },
            { name: 'Thai Cuisine', displayOrder: 4 },
            { name: 'Chinese Cuisine', displayOrder: 5 },
            { name: 'Malaysian Cuisine', displayOrder: 6 },
            { name: 'Biryani', displayOrder: 7 },
            { name: 'Fried Rice', displayOrder: 8 },
            { name: 'Desserts', displayOrder: 9 },
            { name: 'Beverages', displayOrder: 10 }
        ];

        const createdCategories = await MenuCategory.insertMany(
            categories.map(c => ({ categoryName: c.name, displayOrder: c.displayOrder }))
        );

        const categoryMap = {};
        createdCategories.forEach(c => categoryMap[c.categoryName] = c._id);

        const menuItems = [
            // Grilled Items
            { name: 'Grilled Chicken Tikka', price: 12.99, cat: 'Grilled Items', desc: 'Marinated chicken pieces grilled to perfection' },
            { name: 'Lamb Seekh Kebab', price: 14.99, cat: 'Grilled Items', desc: 'Spiced minced lamb on skewers' },

            // Indian
            { name: 'Butter Chicken', price: 13.99, cat: 'Indian Cuisine', desc: 'Creamy tomato-based curry with tender chicken' },
            { name: 'Lamb Rogan Josh', price: 15.99, cat: 'Indian Cuisine', desc: 'Aromatic lamb curry with Kashmiri spices' },

            // Thai
            { name: 'Pad Thai', price: 12.99, cat: 'Thai Cuisine', desc: 'Stir-fried rice noodles with shrimp and peanuts' },

            // Biryani
            { name: 'Chicken Biryani', price: 13.99, cat: 'Biryani', desc: 'Fragrant basmati rice layered with spiced chicken' },
            { name: 'Hyderabadi Dum Biryani', price: 14.99, cat: 'Biryani', desc: 'Traditional slow-cooked biryani with boiled egg' },

            // Appetizers
            { name: 'Samosa (2 pieces)', price: 4.99, cat: 'Appetizers', desc: 'Crispy pastry with spiced potato filling' },

            // Beverages
            { name: 'Mango Lassi', price: 4.99, cat: 'Beverages', desc: 'Yogurt-based mango drink' },
            { name: 'Lemon Juice', price: 3.99, cat: 'Beverages', desc: 'Freshly squeezed lemon juice' },
            { name: 'Fuljar Soda', price: 4.99, cat: 'Beverages', desc: 'Spicy and fizzy kerala style soda' },

            // Chinese Cuisine
            { name: 'Peking Duck', price: 24.99, cat: 'Chinese Cuisine', desc: 'Famous roasted duck with crispy skin' },
            { name: 'Chinese Egg Roll', price: 5.99, cat: 'Chinese Cuisine', desc: 'Crispy rolls filled with vegetables and meat' },
            { name: 'Chinese Dumpling', price: 8.99, cat: 'Chinese Cuisine', desc: 'Steamed or fried dough filled with meat and vegetables' },

            // Malaysian Cuisine
            { name: 'Hot Beef', price: 16.99, cat: 'Malaysian Cuisine', desc: 'Spicy stir-fried beef dish' },
            { name: 'Murtabak', price: 10.99, cat: 'Malaysian Cuisine', desc: 'Stuffed pancake or pan-fried bread' },

            // Fried Rice
            { name: 'Chicken Fried Rice', price: 12.99, cat: 'Fried Rice', desc: 'Stir-fried rice with chicken and vegetables' },
            { name: 'Schezwan Rice', price: 13.99, cat: 'Fried Rice', desc: 'Spicy fried rice with schezwan sauce' },
            { name: 'Veg Fried Rice', price: 11.99, cat: 'Fried Rice', desc: 'Stir-fried rice with mixed vegetables' },

            // Desserts
            { name: 'Gulab Jamun', price: 5.99, cat: 'Desserts', desc: 'Deep-fried dough balls soaked in sweet syrup' },
            { name: 'Rasamalai', price: 6.99, cat: 'Desserts', desc: 'Soft cheese patties in sweet, thickened milk' },
            { name: 'Pal Gova', price: 7.99, cat: 'Desserts', desc: 'Traditional milk-based sweet' }
        ];

        const itemsToInsert = menuItems.map(item => ({
            categoryId: categoryMap[item.cat],
            itemName: item.name,
            price: item.price,
            description: item.desc
        }));

        await MenuItem.insertMany(itemsToInsert);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
