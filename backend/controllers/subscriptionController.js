// backend/controllers/subscriptionController.js
const User = require("../models/User");
const { PLANS, getEffectivePlan } = require("../config/plans");

const buildStatus = (user) => {
    const plan = getEffectivePlan(user);
    const limit = PLANS[plan].campaignLimit;
    const used = user.campaignsSent || 0;
    return {
        plan,
        planName: PLANS[plan].name,
        planExpiresAt: user.planExpiresAt || null,
        campaignLimit: limit === Infinity ? null : limit, // null = unlimited
        campaignsSent: used,
        remaining: limit === Infinity ? null : Math.max(limit - used, 0),
    };
};

// GET /api/subscription/me
exports.getMySubscription = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(buildStatus(user));
};

// POST /api/subscription/activate  { plan }
// NOTE: no real payment gateway yet - this trusts the client. Before going live,
// call this only after verifying a Razorpay/Stripe payment on the server.
exports.activatePlan = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan" });

        const user = await User.findById(req.user.id);
        user.plan = plan;
        user.planExpiresAt =
            plan === "free" ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();

        res.json({ message: `${PLANS[plan].name} activated`, ...buildStatus(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.buildStatus = buildStatus;
