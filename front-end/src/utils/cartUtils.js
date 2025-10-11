export const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
    // Somme des produits
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty),
        0
    );
    state.itemsPrice = addDecimal(itemsPrice);

    // Livraison
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    state.shippingPrice = addDecimal(shippingPrice);

    // TVA
    const taxPrice = 0.15 * itemsPrice;
    state.taxPrice = addDecimal(taxPrice);

    // Total commande
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    state.totalPrice = addDecimal(totalPrice);

    // Sauvegarde dans localStorage
    localStorage.setItem("cart", JSON.stringify(state));

    return state;
};
// ********************************
// export const addDecimal = (num) => {
//     return (Math.round(num * 100) / 100).toFixed(2);
// };

// export const updateCart = (state) => {
//     // Somme des produits
//     const itemsPrice = state.cartItems.reduce(
//         (acc, item) => acc + Number(item.price) * Number(item.qty),
//         0
//     );
//     const shippingPrice = itemsPrice > 100 ? 0 : 10;
//     const taxPrice = 0.15 * itemsPrice;
//     const totalPrice = itemsPrice + shippingPrice + taxPrice;

//     // Retourne un nouvel objet au lieu de modifier l'ancien
//     const updatedState = {
//         ...state,
//         itemsPrice: addDecimal(itemsPrice),
//         shippingPrice: addDecimal(shippingPrice),
//         taxPrice: addDecimal(taxPrice),
//         totalPrice: addDecimal(totalPrice),
//     };

//     // Sauvegarde dans localStorage
//     localStorage.setItem("cart", JSON.stringify(updatedState));

//     return updatedState;
// };
