import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface lora {
  characterName: string;
  gender: string;
  token: string;
  closeUp: string[];
  halfbody: string[];
  fullbody: string[];
}

const initialState: lora = {
  characterName: "",
  gender: "",
  token: "",
  closeUp: [],
  halfbody: [],
  fullbody: [],
};

export const trainloraSlice = createSlice({
  name: "trainlora",
  initialState,
  reducers: {
    addCharacterName: (state, action: PayloadAction<string>) => {
      state.characterName = action.payload;
    },
    addGenderType: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    addTokenName: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    addCloseUpPhotoes: (state, action: PayloadAction<string[]>) => {
      state.closeUp = action.payload;
    },
    addHalfbodyPhotoes: (state, action: PayloadAction<string[]>) => {
      state.halfbody = action.payload;
    },
    addFullbodyPhotoes: (state, action: PayloadAction<string[]>) => {
      state.fullbody = action.payload;
    },
  },
});

export const {
  addCharacterName,
  addGenderType,
  addTokenName,
  addCloseUpPhotoes,
  addHalfbodyPhotoes,
  addFullbodyPhotoes,
} = trainloraSlice.actions;

// export const selectTrainLoraParams = (state: RootState) => ({
//   ...state.trainlora,
// });

const selectCharacterName = (state: RootState) => state.trainlora.characterName;
const selectGender = (state: RootState) => state.trainlora.gender;
const selectToken = (state: RootState) => state.trainlora.token;
const selectCloseUp = (state: RootState) => state.trainlora.closeUp;
const selectHalfbody = (state: RootState) => state.trainlora.halfbody;
const selectFullbody = (state: RootState) => state.trainlora.fullbody;

// Memoized selector that combines all properties
export const selectTrainLoraParams = createSelector(
  [
    selectCharacterName,
    selectGender,
    selectToken,
    selectCloseUp,
    selectHalfbody,
    selectFullbody,
  ],
  (characterName, gender, token, closeUp, halfbody, fullbody) => ({
    characterName,
    gender,
    token,
    closeUp,
    halfbody,
    fullbody,
  })
);

export default trainloraSlice.reducer;
