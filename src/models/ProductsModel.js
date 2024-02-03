import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema(
	{
		name: String,
		price: Number,
		photo: String,
		createdBy: Number,
		updatedBy: Number
	},
	{ timestamps: true }
);

const ProductsModels = mongoose.model('products', productsSchema);

export default ProductsModels;
