const Stripe = require("stripe");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");


const stripeWebHooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);    
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent=event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;
                console.log(transactionId)
                
                if (appId === "quickgpt") {
                    const transaction = await transactionModel.findOne({
                        _id: transactionId,
                        isPaid: false
                    });
                    if (!transaction) {
                        return response.json({ received: true, message: "Transaction already processed" });
                    }
                    // Update credits in user account
                    await userModel.updateOne(
                        { _id: transaction.userId },
                        { $inc: { credits: transaction.credits } }
                    );
                    // updates credits payment status
                    transaction.isPaid = true;
                    await transaction.save();
                }
                else {
                    return response.json({
                        received: true, message: "ignored event:invalid app"
                    })
                }
                break;
            }

            default:
                 console.log("unhandled event type:", event.type)
                break;
        }

        return response.status(200).json({ received: true });

    } catch (error) {
        console.log("error in webhook controller ->",error)
        return response.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

module.exports = stripeWebHooks;
