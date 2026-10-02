// backend/config/plans.js
// campaignLimit = how many campaigns a user may SEND on this plan (Infinity = unlimited)
const PLANS = {
    free: { name: "Free Plan", price: 0, campaignLimit: 5 },
    starter: { name: "Starter Plan", price: 499, campaignLimit: 500 },
    pro: { name: "Pro Analytics", price: 1999, campaignLimit: Infinity },
};

// A paid plan that has expired behaves like the free plan.
const getEffectivePlan = (user) => {
    if (user.role === "admin") return "pro";
    if (user.plan !== "free" && user.planExpiresAt && user.planExpiresAt < new Date()) return "free";
    return user.plan || "free";
};

module.exports = { PLANS, getEffectivePlan };
