import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { act } from "react";

interface lora {
  characterName: string;
  gender: string;
  token: string;
  closeUp: string[];
  halfbody: string[];
  fullbody: string[];
  caption_dropout_rate: number;
  batch_size: number;
  steps: number;
  optimizer: string;
  lr: number;
  quantize: boolean;
  loraPath: string;
  status: string;
}

const initialState: lora = {
  characterName: "",
  gender: "",
  token: "",
  closeUp: [],
  halfbody: [],
  fullbody: [],
  caption_dropout_rate: 0.0,
  batch_size: 2,
  steps: 2000,
  optimizer: "adamw",
  lr: 1e-4,
  quantize: true,
  loraPath: "",
  status: "Training",
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
    addOtherConfig: (state, action) => {
      // other config here
      state.caption_dropout_rate = action.payload.caption_dropout_rate;
      state.batch_size = action.payload.batch_size;
      state.steps = action.payload.steps;
      state.optimizer = action.payload.optimizer;
      state.lr = action.payload.lr;
      state.quantize = state.quantize;
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
  addOtherConfig,
} = trainloraSlice.actions;

const selectCharacterName = (state: RootState) => state.trainlora.characterName;
const selectGender = (state: RootState) => state.trainlora.gender;
const selectToken = (state: RootState) => state.trainlora.token;
const selectCloseUp = (state: RootState) => state.trainlora.closeUp;
const selectHalfbody = (state: RootState) => state.trainlora.halfbody;
const selectFullbody = (state: RootState) => state.trainlora.fullbody;
const Select_caption_dropout_rate = (state: RootState) =>
  state.trainlora.caption_dropout_rate;

const Select_batch_size = (state: RootState) => state.trainlora.batch_size;
const Select_steps = (state: RootState) => state.trainlora.steps;
const Select_optimizer = (state: RootState) => state.trainlora.optimizer;
const Select_lr = (state: RootState) => state.trainlora.lr;
const Select_quantize = (state: RootState) => state.trainlora.quantize;
const Select_loraPath = (state: RootState) => state.trainlora.loraPath;
const Select_status = (state: RootState) => state.trainlora.status;

// Memoized selector that combines all properties
export const selectTrainLoraParams = createSelector(
  [
    selectCharacterName,
    selectGender,
    selectToken,
    selectCloseUp,
    selectHalfbody,
    selectFullbody,
    Select_caption_dropout_rate,

    Select_batch_size,
    Select_steps,
    Select_optimizer,
    Select_lr,
    Select_quantize,
    Select_loraPath,
    Select_status,
  ],
  (
    characterName,
    gender,
    token,
    closeUp,
    halfbody,
    fullbody,
    caption_dropout_rate,
    batch_size,
    steps,
    optimizer,
    lr,
    quantize,
    loraPath,
    status
  ) => ({
    characterName,
    gender,
    token,
    closeUp,
    halfbody,
    fullbody,
    caption_dropout_rate,
    batch_size,
    steps,
    optimizer,
    lr,
    quantize,
    loraPath,
    status,
  })
);

export default trainloraSlice.reducer;
