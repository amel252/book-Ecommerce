import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // si ses info existent retourne nous les infos sinon donne moi null
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null, // toujours mettre un fallback
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        // si user se déconnecte les donné seront supprime de notre local storage
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.clear();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
