// Debug utility for wishlist issues
// Run this in the browser console to inspect and fix wishlist data

console.log("=== Wishlist Debug Utility ===");

// 1. Check current wishlist
// Helper to get current key
const getWishlistKey = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
            const user = JSON.parse(userStr);
            if (user && user.id) return `khmerwork_wishlist_${user.id}`;
        }
    } catch (e) { }
    return "khmerwork_wishlist";
};

const wishlistKey = getWishlistKey();
const rawData = localStorage.getItem(wishlistKey);
console.log(`Checking wishlist for key: ${wishlistKey}`);
console.log("Raw localStorage data:", rawData);

if (rawData) {
    try {
        const parsed = JSON.parse(rawData);
        console.log("Parsed data:", parsed);
        console.log("Number of items:", parsed.length);

        // Check for duplicates
        const unique = Array.from(new Set(parsed));
        console.log("Unique items:", unique);
        console.log("Number of unique items:", unique.length);

        if (parsed.length !== unique.length) {
            console.warn("⚠️ DUPLICATES FOUND!");
            console.log("Duplicates:", parsed.filter((item, index) => parsed.indexOf(item) !== index));
        }

        // Check for invalid entries
        const invalid = parsed.filter(id => id == null || id === "");
        if (invalid.length > 0) {
            console.warn("⚠️ INVALID ENTRIES FOUND:", invalid);
        }

    } catch (error) {
        console.error("❌ Failed to parse wishlist:", error);
    }
}

// 2. Fix function
window.fixWishlist = function () {
    const rawData = localStorage.getItem(wishlistKey);
    if (!rawData) {
        console.log("No wishlist data to fix");
        return;
    }

    try {
        const parsed = JSON.parse(rawData);
        const fixed = Array.from(new Set(parsed.filter(id => id != null && id !== "")));
        localStorage.setItem(wishlistKey, JSON.stringify(fixed));
        console.log("✅ Wishlist fixed!");
        console.log("Before:", parsed);
        console.log("After:", fixed);
        window.location.reload();
    } catch (error) {
        console.error("❌ Failed to fix wishlist:", error);
    }
};

// 3. Clear function
window.clearWishlist = function () {
    localStorage.removeItem(wishlistKey);
    console.log("✅ Wishlist cleared!");
    window.location.reload();
};

console.log("\n=== Available Commands ===");
console.log("fixWishlist()  - Remove duplicates and invalid entries");
console.log("clearWishlist() - Clear all saved jobs");
