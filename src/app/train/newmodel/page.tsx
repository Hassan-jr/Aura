"use client";
import TrainImgUpload from "../uploadImgs";
import React from "react";
import DataFormat from "../data";
import Caption from "../caption";
import SubmitTrain from "../submitTrain";

const Home = () => {
  return (
    <div>
      <DataFormat />
      <TrainImgUpload />
      <Caption />
      <SubmitTrain />
    </div>
  );
};

export default Home;
