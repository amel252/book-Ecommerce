import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// initialisé notre panier
// on vérifié si ya des article dans le panier , si oui on récupére
const initialState = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : // sinon
      { cartItems: [], shippingAddress: {}, paymentMethod: "Paypal" };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // on extrait les propriétés inutiles et on garde le reste dans 'item'
            const { user, rating, numReviews, reviews, ...item } =
                action.payload;
            //   on va trouvé et comparé des items ajouté dans le panier si il sont en double
            const existItem = state.cartItems.find((x) => x._id === item._id);
            // si existe on ajoute 1 sur le total quantité
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            return updateCart(state, item);
        },
        removeFromCart: (state, action) => {
            // filtrer pour voir si id avant de le supprimé
            state.cartItems = state.cartItems.filter(
                (x) => x._id !== action.payload
            );
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem("cart", JSON.stringify(state));
        },
        // vider completement le panier
        clearCartItems: (state, action) => {
            state.cartItems = [];
            localStorage.setItem("cart", JSON.stringify(state));
        },
        // renitialisé le panier aprés la modification (suppr ou ajout )
        resetCart: (state) => (state = initialState),
    },
});
export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    clearCartItems,
    resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
