const PurchaseService = require('../services/purchaseService');

async function createPurchase(req, res) {
    try {
        console.log(req);
        const userId = req.user.userId; // Ensure this is set correctly
        const { addressId } = req.body;
        
        console.log(`UserId: ${userId}, AddressId: ${addressId}`);

        const purchase = await PurchaseService.createPurchase(userId, addressId);
        res.status(200).json(purchase);
    } catch (error) {
        console.error("Error in createPurchase controller:", error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createPurchase
};
