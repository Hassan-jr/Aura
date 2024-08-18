import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <main>
      {/* <Card className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto "> */}
        <div className="relative md:w-1/2 mx-1 md:mx-auto my-1 p-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 z-20">
          {/* Top Profile Card */}
          <div className="flex flex-row justify-between align-middle">
            {/* Profile */}
            <div className="bg-white w-20 h-20 rounded-full  flex justify-center align-middle">
              <Image
                src="https://nomapos.com/model/hassanjr001%20(7).jpg"
                width={70}
                height={70}
                alt="Avatar"
                className="overflow-hidden rounded-full m-auto"
              />
            </div>
            {/* shots, following, followers, characters */}
            <div className="flex flex-1 flex-row justify-evenly align-middle text-white">
              {/* shots */}
              <div className="flex flex-col justify-center items-center ">
                <p className="font-bold">345</p>
                <p className="mt-[-5px] text-xs md:text-sm font-semibold">
                  shots
                </p>
              </div>
              {/* Characters */}
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold">2</p>
                <p className="mt-[-5px] text-xs md:text-sm font-semibold">
                  characters
                </p>
              </div>
              {/* followers */}
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold">453K</p>
                <p className="mt-[-5px] text-xs md:text-sm font-semibold">
                  followers
                </p>
              </div>
              {/* following */}
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold">673</p>
                <p className="mt-[-5px] text-xs md:text-sm font-semibold">
                  following
                </p>
              </div>
            </div>
          </div>
          {/* Bottom Profile Card */}
          <div className="text-white font-semibold text-sm">
            <p className="font-bold text-lg">Abdiladif Hassan</p>
            {/* <p>abdiladif@gmail.com</p> */}
            <p>Transforming data into intelligent solutions with machine learning. 🚀</p>
          </div>
        </div>
      {/* </Card> */}
    </main>
  );
}
