import ProductsModel from '../models/ProductsModel.js';
import CustomError from '../utils/CustomError.js';
import { unlinkSync, unlink, existsSync } from 'fs';
import { upload } from '../middlewares/imageUpload.js';

const showProduct = async (req, res, next) => {
    try {
        res.status(200).json(req.product);
    } catch (err) {
        next(err);
    }
};

const findProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit ?? 20);
        const page = parseInt(req.query.page ?? 1);
        const offset = limit * page - limit;

        const name = req.query.name ?? '';
        const price = req.query.price ?? '0-999999999999';

        const filter = {
            name: { $regex: name },
            price: {
                $gte: parseInt(price.split('-')[0]),
                $lte: parseInt(price.split('-')[1])
            }
        };

        const all_data = (await ProductsModel.find(filter)).length;
        const data = await ProductsModel.find(filter).skip(offset).limit(limit);

        const result = {
            all_data: all_data,
            all_page: Math.ceil(all_data / limit),
            crr_page: page,
            data: data
        };

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const data = {
            name: req.body.name,
            price: req.body.price,
            createdBy: req.uid || null,
            updatedBy: req.uid || null
        };

        const newProduct = new ProductsModel(data);
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const response = req.product;

        const data = {
            name: req.body.name,
            price: req.body.price,
            createdBy: req.uid || null,
            updatedBy: req.uid || null
        };

        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            response.id,
            data,
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const response = req.product;

        const deletedProduct = await ProductsModel.findByIdAndDelete(
            response.id
        );

        if (existsSync(response.photo)) unlinkSync(response.photo);

        res.status(200).json(deletedProduct);
    } catch (err) {
        next(err);
    }
};

const uploadImage = async (req, res, next) => {
    upload.single('photo')(req, res, err => {
        if (err) return next(new CustomError(400, err.message));

        const response = req.product;
        if (existsSync(response.photo))
            unlink(response.photo, err => {
                if (err) return next(new CustomError(500, err.message));
            });

        ProductsModel.findByIdAndUpdate(
            req.product.id,
            {
                photo: req.file.path
            },
            { new: true }
        )
            .then(result => res.status(200).json(result))
            .catch(e => next(e));
    });
};

export {
    showProduct,
    findProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};
