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
        <div className="bg-card/100 mt-2 rounded-md p-1">
          <h1 className="text-xl font-semibold">Start Training Your Model</h1>
          <Stepper steps={steps} />
        </div>
      </Navheader>
    </>
  );
};

export default MyPage;
