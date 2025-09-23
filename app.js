const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const listing = require("./models/listing");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.get('/listings', async (req, res) => {
    const all_listings = await listing.find({})
    res.render('listings/index.ejs', { all_listings })
})

// go to new form route 
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
})
//add new list to listing  route 
app.post('/listings', async (req, res) => {
    const { title, description, price, location, country, image } = req.body;
    let data = new listing({
        title, description,category, price, location, country, image: { url: image }
    });
    await data.save();
    res.redirect('/listings');

})
// show route to detailed page
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    res.render('listings/show.ejs', { list });
});
//edit form route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    res.render('listings/edit.ejs', { list });
});
// edit and save it in db
app.put('/listings/:id', async (req, res) => {
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
});

//route to delete a liat from 

app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let del_list = await listing.findByIdAndDelete(id);
    console.log("DElETED LIST Successfully", del_list);
    res.redirect('/listings');
});

app.listen(port, (req, res) => {
    console.log(`App is listening to ${port}`);
});
