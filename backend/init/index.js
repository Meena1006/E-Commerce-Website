const mongoose = require('mongoose');
const initData = require('./data.js');

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  }
});

main()
  .then(() => {
    console.log('Database connected...');
    initDB();
  })
  .catch(err => console.error(err));

async function main() {
  await mongoose.connect(
    'mongodb+srv://meena95510:EHEsK73gWPuZ3e5x@cluster0.ybace.mongodb.net/test?retryWrites=true&w=majority'
  );
}

const initDB = async () => {
  await Product.deleteMany({});

  const products = await Product.insertMany(initData.data);

  console.log(`${products.length} products created.`);
};
initDB();