const transactionModel = require("../models/transaction.model");
const Stripe = require("stripe")
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];


const getPlansController = async (req, res) => {
    try {
        return res.status(200).json({
            plan: plans,
            message: "hey"
        })
    } catch (error) {
        console.log("error in ", error)
        return res.status(500).json({
            error: error,
            message: "error in getting plan"
        })
    }
}

// stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const purchasePlanController = async (req,res) => {
    try {
        const origin = req.headers.origin;
        console.log(origin)
        const { planId } = req.params
        const userId = req.user._id;
        const plan = plans.find((plan) => plan._id === planId)
        if (!plan) return res.status(404).json({
            message: "invalid plan"
        })


        const transaction = await transactionModel.create({
            userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: plan.price * 100,
                        product_data: {
                            name: plan.name
                        }
                    },

                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata: { transactionId: transaction._id.toString()  , appId:"quickgpt",}
            ,
         
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,  // expires in 30 min
        });
       console.log(session)

        return res.status(200).json({
            message: "payment successfull",
            url: session.url

        })
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "error in getting plan"
        })
    }
};

module.exports = { purchasePlanController, getPlansController }