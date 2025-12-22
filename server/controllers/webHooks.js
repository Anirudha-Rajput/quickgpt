const Stripe = require("stripe");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebHooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent_succeeded": {
                const paymentIntent = event.data.object;

                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === "quickgpt") {
                    const transaction = await transactionModel.findOne({
                        _id: transactionId,
                        isPaid: false
                    });
                  // Update credits in user account
                    await userModel.updateOne(
                        { _id: transaction.userId },
                        { $inc: { credits: transaction.credits } }
                    );
                 // updates cedits payment status
                    transaction.isPaid = true;
                    await transaction.save();
                }
                else{
                    return res.json({
                        received:true,message:"ignored event:invalid app"
                    })
                }
                break;
            }

            default:console.log("unhandled event type:",event.type)
                break;
        }

         return res.status(200).json({ received: true });

    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

module.exports = stripeWebHooks;
