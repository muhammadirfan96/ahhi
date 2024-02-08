import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema(
	{
		name: String,
		price: Number,
		photo: String,
		createdBy: String,
		updatedBy: String
	},
	{ timestamps: true }
);

const ProductsModels = mongoose.model('products', productsSchema);

export default ProductsModels;
