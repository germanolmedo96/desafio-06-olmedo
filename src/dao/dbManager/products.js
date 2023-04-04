import productsModel from "../models/products.js";

export default class Products {
    constructor() {
        console.log("trabajando en la BD con products");
    }
    
    
    getAll = async () => {
        let products = await productsModel.find().lean();
        return products;
    }

    getOne = async (id) => {
        let product = await productsModel.findOne({_id: id}).lean();
        return product;
    }

    async getProductById(id) {
        return await productsModel.findById(id);
      }

    saveProduct = async (product) => {
        let result = await productsModel.create(product);
        return result;
    }

    updateProduct = async (id,update) => {
        let result = await productsModel.findByIdAndUpdate(id,update)
        return result;
    }

    deleteProduct = async (id) => {
        let result = await productsModel.findByIdAndDelete(id)
        return result;
    }
}