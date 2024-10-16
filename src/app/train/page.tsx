import Stepper from "./stepper";
import DataFormat from "./data";
import LoraDetails from "./loradetails";
import TrainImgUpload from "./uploadImgs";
import SubmitTrain from "./submitTrain";
import Navheader from "@/customui/navheader";

const steps = [
  {
    title: "Get Training Images Right",
    description: " ",
    content: <DataFormat />,
  },
  {
    title: "Ai Character Details",
    description: "",
    content: <LoraDetails />,
  },
  {
    title: "Upload Training Images",
    description: "",
    content: <TrainImgUpload />,
  },
  {
    title: "Start Training",
    description: "",
    content: <SubmitTrain />,
  },
];

const MyPage = () => {
  return (
    <>
      <Navheader>
        <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <h1>My Stepper Page</h1>
          <Stepper steps={steps} />
        </div>
      </Navheader>
    </>
  );
};

export default MyPage;
