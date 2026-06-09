import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isMobileMenuOpen:false,
    isHideHam:false
  },
  reducers: {
    setIsMobileMenuOpen:(state,action) => {
        state.isMobileMenuOpen = action.payload
    },
    setIsHide:(state,action) => {
        state.isHideHam=action.payload
    }
  },
});

export const { setIsMobileMenuOpen , setIsHide} =
  uiSlice.actions;
export default uiSlice.reducer;
