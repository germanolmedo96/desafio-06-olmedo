import { Router } from "express";
import Carts from "../dao/dbManager/carts.js";
import Messages from "../dao/dbManager/messages.js";
import Products from "../dao/dbManager/products.js";
import cartsModel from "../dao/models/carts.js";
import productsModel from "../dao/models/products.js";



const router = Router();
const productsManager = new Products();
const cartsManager = new Carts();
const messagesManager = new Messages();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products'); 
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login'); 
    next();
}

router.get('/products' , async (req,res) => {
    const isLogin = req.session.user ? true : false;
    const user = req.session.user;
    const {
        page=1,
        limit=5,
        sort,
        category="",
    } = req.query;
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = 
    await productsModel.paginate({category:{$regex:category}} , {sort:{price:sort}, limit , page , lean:true});
    
    const products = docs;
    res.render('products' , {
        isLogin,
        user,
        products,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page
    });
   
   
})

router.get('/cart', privateAccess, async (req, res) => {
    try {
        const cart = await cartsManager.getById(cartId);
        res.render('cart', { cart, style: 'cart.css' });
    } catch (err) {
        console.log(err);
    }
});

router.get('/carts/:cid' , async (req,res) => {
    let cid = req.params.cid;
    let cart = await cartsModel.findById(cid).populate("products.product").lean();
    console.log(cart);
    let cartProducts = cart.products
    res.render('carts' , {cart, cartProducts})
})

router.get('/messages' , async (req,res) => {
    let messages = await messagesManager.getAll();
    console.log(messages);
    res.render('chat' , {messages})
})


router.post('/cart/add/:id', async (req, res) => {
    const pid = req.params.id;

    try {
        let cart;
        if (!cartId) {
            cart = await cartsManager.save();
            cartId = cart._id;
        } else {
            cart = await cartsManager.getById(cartId);
        }

        const cid = cart._id;
        await cartsManager.saveId(cid, pid);

        res.redirect('/products');
    } catch (err) {
        console.log(err);
    }
  });


router.get('/cart/:cid', privateAccess, async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartsManager.getById(cid);
        res.render('cart', { cart, style: 'cart.css' });
    } catch (err) {
        console.log(err);
    }
});


router.get('/register', publicAccess, (req, res) => {
    res.render('register', { style: 'register.css' });
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login', { style: 'login.css' });
});

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
});

router.get('/', privateAccess, async (req, res) => {
    // const products = await manager.getAll();

    const products = await productsManager.getAll(); 
    res.render('home', {products, style: 'home.css'});
});

router.get('/realtimeproducts', privateAccess, async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
});

router.get('/chat', privateAccess, (req, res) => {
    res.render('chat', {style: 'chat.css'})
});

var cartId;
router.get('/products', privateAccess, async (req, res) => {
    const { limit = 10, page = 1, sort, category, stock} = req.query;

    let query = {};
    if(category) query = {category : `${category}`};
    if(stock) query = {stock : `${stock}`};
    if(category && stock) query = {$and: [ {category : `${category}`},{stock : `${stock}`} ]}  

    const result = await productsManager.getAllPage(limit, page, sort, query)

    const products = result.docs; 
    const hasPrevPage = result.hasPrevPage;
    const prevPage = result.prevPage;
    const hasNextPage = result.hasNextPage;
    const nextPage = result.nextPage;
    const Page = result.page;
    res.render('products', {products, hasPrevPage, prevPage, hasNextPage,  nextPage, Page, cartId, user: req.session.user, style: 'home.css'})
});

export default router;