"use client";
import TrainImgUpload from "../uploadImgs";
import React from "react";
import { Wizard } from "react-use-wizard";
import DataFormat from "../data";
import Caption from "../caption";
import SubmitTrain from "../submitTrain";
import StepperFooter from "../Footer";

const Home = () => {
  return (
    <Wizard footer={<StepperFooter />}>
      <DataFormat />
      <TrainImgUpload />
      <Caption />
      <SubmitTrain />
    </Wizard>
  );
};

export default Home;
