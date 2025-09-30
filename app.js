//npm packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const listing = require("./models/listing");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

//require errors utils
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

//momgodb connection
const mongo_URL = "mongodb://127.0.0.1:27017/xplore"
async function main() {
    await mongoose.connect(mongo_URL);
};
main().then(
    () => console.log('Connected to DB successfully..')
)
    .catch(
        err => console.log("Error in DB Connection", err)
    );
const port = 8080;

//middlewares 
app.engine('ejs', ejsMate);
app.set('view engine', "EJS");
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('this is root');
});
// route to show all listings

app.get('/listings', wrapAsync(
    async (req, res) => {
    const all_listings = await listing.find({})
    res.render('listings/index.ejs', { all_listings })
}
));

// go to new form route 
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
})
//add new list to listing  route 
app.post('/listings', wrapAsync(async (req, res,next) => {

        const { title, description, price, location, country, image } = req.body;
        let data = new listing({
            title, description, category, price, location, country, image: { url: image }
        });
        await data.save();
        if(!data){
            return next(new ExpressError(404,"Something went Wrong with data"));
        }

        res.redirect('/listings');
    }
    
));
// show route to detailed page
app.get('/listings/:id', wrapAsync(
    async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
     if (!list) throw new ExpressError(404, "Listing not found");
    res.render('listings/show.ejs', { list });
}
));
//edit form route
app.get('/listings/:id/edit', wrapAsync(
    async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    // if(!list) {
    //     return next(new ExpressError(404, "Listing not found"));
    // }
    if (!list) throw new ExpressError(404, "Listing not found");
    res.render('listings/edit.ejs', { list });
}
));
// edit and save it in db
app.put('/listings/:id', wrapAsync(
    async (req, res) => {
    let { id } = req.params;
    const { title, description, price, location, country, image, category } = req.body;

    let list = await listing.findByIdAndUpdate(id,
        {
            title,
            description,
            category,
            price,
            location,
            country,
            image: { url: image }
        }, { new: true });
    console.log("updated Successfully", list);
    res.redirect(`/listings/${id}`);
}
));

//route to delete a liat from 

app.delete('/listings/:id', wrapAsync(
    async (req, res) => {
    let { id } = req.params;
    let del_list = await listing.findByIdAndDelete(id);
    console.log("DElETED LIST Successfully", del_list);
    res.redirect('/listings');
    }
)
);


// Catch-all route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found 😢"));
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send("Error message : " + message);
});

// listening route
app.listen(port, (req, res) => {
    console.log(`App is listening to ${port}`);
});
