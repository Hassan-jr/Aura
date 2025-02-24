import Stepper from "./stepper";
import DataFormat from "./data";
import LoraDetails from "./loradetails";
import TrainImgUpload from "./uploadImgs";
import SubmitTrain from "./submitTrain";

const steps = [
  // {
  //   title: "Get Training Images Right",
  //   description: " ",
  //   content: <DataFormat />,
  // },
  {
    title: "Vision Model Details",
    description: "",
    content: (
      <div className="flex flex-col gap 1">
        <LoraDetails />
        <TrainImgUpload />
      </div>
    ),
  },
  // {
  //   title: "Upload Training Images",
  //   description: "",
  //   content: <TrainImgUpload />,
  // },
  // {
  //   title: "Start Training",
  //   description: "",
  //   content: <SubmitTrain />,
  // },
];

const Train = () => {
  return (
    <div className="mt-2 rounded-md p-1">
      <h1 className="text-xl font-semibold">Start Training Your Model</h1>
      <Stepper steps={steps} />
    </div>
  );
};

export default Train;
