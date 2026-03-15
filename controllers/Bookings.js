const Listing = require("../models/listing");
const Booking = require("../models/bookings");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.getMyBookings = async (req, res) => {
   const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")

   res.render("bookings/mybookings", { bookings });
};

module.exports.CreateCheckoutSession = async (req, res) => {
   try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
         req.flash("error", "Listing not found");
         return res.redirect("/listings");
      }

      // GET request - render checkout page
      if (req.method === "GET") {
         return res.render("bookings/checkout.ejs", { listing });
      }

      // POST request - create Stripe checkout session
      const { checkIn, checkOut, guests } = req.body;
      if (!checkIn || !checkOut) {
         req.flash("error", "Please select check-in and check-out dates");
         return res.redirect(`/listings/${listing._id}`);
      }

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      let nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (nights < 1) nights = 1;

      const subtotal = nights * listing.price;
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + tax;

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         mode: "payment",
         line_items: [
            {
               price_data: {
                  currency: "inr",
                  product_data: {
                     name: listing.title,
                     description: `${nights} nights stay`,
                     images: [listing.image.url],
                  },
                  unit_amount: total * 100, // Stripe expects amount in paise
               },
               quantity: 1,
            },
         ],
         success_url: `${req.protocol}://${req.get("host")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.protocol}://${req.get("host")}/payment/cancel`,
         metadata: {
            listingId: listing._id.toString(),
            checkIn,
            checkOut,
            guests,
            nights,
            total,
         },
      });

      // Redirect to Stripe checkout
      res.redirect(303, session.url);
   } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong with payment");
      res.redirect(`/listings/${req.params.id}`);
   }
};


module.exports.Successpage = async (req, res) => {
   try {
      const session_id = req.query.session_id;
      if (!session_id) {
         req.flash("error", "No session ID found.");
         return res.redirect("/bookings/mybookings");
      }

      // Retrieve Stripe session
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== "paid") {
         req.flash("error", "Payment not completed yet. Please try again.");
         return res.redirect("/bookings/mybookings");
      }

      // Extract booking details from metadata
      const { listingId, checkIn, checkOut, guests, nights, total } = session.metadata;

      // Check if booking already exists (prevent duplicates)
      let booking = await Booking.findOne({ stripeSessionId: session_id });
      if (booking) {
         await booking.populate("listing");
         return res.render("bookings/success.ejs", { booking });
      }

      // Create new booking
      booking = new Booking({
         user: req.user._id,
         listing: listingId,
         checkIn: new Date(checkIn),
         checkOut: new Date(checkOut),
         guests,
         nights,
         total,
         stripeSessionId: session_id,
         createdAt: new Date(),
      });

      await booking.save();
      await booking.populate("listing"); // populate for EJS template

      res.render("bookings/success.ejs", { booking });
   } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong while confirming booking.");
      res.redirect("/bookings/mybookings");
   }
};

module.exports.PaymentCancelpage = (req, res) => {
    req.flash("error", "Payment canceled.");
    res.render("bookings/cancel.ejs");
}