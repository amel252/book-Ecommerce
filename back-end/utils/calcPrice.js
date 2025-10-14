// function addDecimals(num) {
//     // avoir 2 chiffre avec virgule
//     return (Math.round(num * 100) / 100).toFixed(2);
// }

// export function calcPrice(orderItems) {
//     const itemsPrice = addDecimals(
//         orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//     );
//     const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
//     const taxPrice = addDecimals(Number(0.15 * itemsPrice).toFixed(2));
//     const totalPrice =
//         Number(itemsPrice) +
//         Number(shippingPrice) +
//         Number(taxPrice).toFixed(2);
//     return { itemsPrice, shippingPrice, taxPrice, totalPrice };
// }
function addDecimals(num) {
    // Retourne un nombre arrondi à 2 décimales
    return Number((Math.round(num * 100) / 100).toFixed(2));
}

export function calcPrice(orderItems) {
    const itemsPrice = addDecimals(
        orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(0.15 * itemsPrice);
    const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
