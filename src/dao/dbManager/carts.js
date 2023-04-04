import cartsModel from "../models/carts.js";
import productsModel from "../models/products.js";

export default class Carts {
    constructor() {
        console.log("trabajando en la BD, con carts");
    }

    getAll = async () => {
        let carts = await cartsModel.find().lean();
        return carts;
    }

    getOne = async (id) => {
        let cart = await cartsModel.findOne({_id: id}).lean();
        return cart;
    }

    getById = async (cid) => {
        const cart = await cartsModel.findOne({_id:cid}).populate("products.product");
        // console.log(cart);
        if(cart === null) {return cart} else {return cart.toObject()};
    }

    saveCart = async () => {
        let result = await cartsModel.create({
            products: []
        });
        return result;
    }

    saveId = async (cid, pid) => {
        const cart = await this.getById(cid);

        if (!cart) return;

        const productos = cart.products;
        const indexProd = productos.findIndex(prod => prod.product._id == pid);

        if(indexProd > -1){
            const result = await cartsModel.updateOne({_id: {$eq: cid}, "products.product" : pid}, {$inc:{"products.$.quantity" : 1}});
            return result;
        } else{ 
            const result = await cartsModel.updateOne({_id: {$eq: cid}}, {$push:{products:{product:pid, quantity:1}}});
            return result;
        }
    }  


    deleteCart = async (id) => {
        let result = await cartsModel.findByIdAndDelete(id);
        return result;
    }

    // addProductToCart(cid, pid) {
    //     return cartsModel.findOneAndUpdate(
    //       { _id: cid },
    //       { $push: { products: { id: pid } } }
    //     );
    //   }

    addProductToCart = async (cid, pid) => {
        try {
            const cartFound = await cartsModel.findById(cid);
            if (!cartFound)
                return {
                    status: 404,
                    error: `Cart with id ${cid} not found`,
                };

            const productFound = await productsModel.findById(pid);
            if (!productFound)
                return {
                    status: 404,
                    error: `Product with id ${pid} not found`,
                };

            let productIndex = cartFound.products.findIndex(p => p.product === pid)
            if(productIndex != -1) {
                let updateProducts = cartFound;
                updateProducts.products[productIndex].quantity++
                return await cartsModel.findByIdAndUpdate(cid , {products:updateProducts.products})
            }
            else{
                return await cartsModel.findByIdAndUpdate(cid , {$push:{products:{product:pid , quantity:1}}})
            }
            
        } catch (err) {
            console.log(err);
        }


    }

    save = async(cart) => {
        // const carts = await this.getAll();

        // if(carts.length === 0){
        //     cart.id = 1;
        // } else{
        //     cart.id =  carts[carts.length -1].id + 1;
        // }

        const result = await cartsModel.create({});
        return result;
    }


    updateCart = async(cid, cart) => {
        let result = await cartsModel.updateOne({_id: cid}, cart);
        return result;
    }

}