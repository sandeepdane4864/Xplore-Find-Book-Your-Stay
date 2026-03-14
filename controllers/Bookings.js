const Listing = require("../models/listing");
const Bookings = require("../models/bookings");

module.exports.getCheckoutPage =async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const { checkIn, checkOut, guests = 1 } = req.query;

    let nights = 0;
    let tax = 0;
    let total = 0;

    if (checkIn && checkOut) {

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights < 1) nights = 1;

        const subtotal = nights * listing.price;

        tax = Math.round(subtotal * 0.1);

        total = subtotal + tax;
    }

    res.render("bookings/checkout", {
        listing,
        checkIn,
        checkOut,
        guests,
        nights,
        tax,
        total
    });

};

module.exports.CreateCheckoutSession =async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const { checkIn, checkOut, guests } = req.body;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    let nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights < 1) nights = 1;

    const subtotal = nights * listing.price;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        mode: "payment",

        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: listing.title,
                        description: `${nights} nights stay`
                    },
                    unit_amount: total * 100
                },
                quantity: 1
            }
        ],

        success_url: `http://localhost:3000/payment/success`,
        cancel_url: `http://localhost:3000/payment/cancel`,

        metadata: {
            listingId: listing._id.toString(),
            checkIn,
            checkOut,
            guests,
            nights,
            total
        }

    });

    res.redirect(303, session.url);

};
