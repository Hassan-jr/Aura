import { Input } from "@/components/ui/input";
import TrainImgUpload from "../uploadImgs";
import { Card } from "@/components/ui/card";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center mt-1">
     <Card className=" w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-start justify-center">
        {/* character name */}
        <Input type="text" placeholder="Character Name" className="max-w-sm" />
        {/* character gender */}
        <Input type="text" placeholder="Gender" className="max-w-sm"  />
        {/* token */}
     </Card>
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
       <TrainImgUpload />
      </div>
    </main>
  );
}
