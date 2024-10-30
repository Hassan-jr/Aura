"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { selectTrainLoraParams } from "@/redux/slices/trainlora";
import Image from "next/image";
// import { Card } from "@/components/ui/card";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";


const cardWidth = 500
const cardHight = 5000

export default function LoraDetails() {
  const params = useAppSelector(selectTrainLoraParams);

  // prepare data
  const closeUpData = params.closeUp.map((img, i) => {
    return {
      category: "",
      w: cardWidth,
      h: cardHight,
      title: "",
      src: img,
      content: (
        <>
          <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <Image
              src={img}
              width={500}
              height={500}
              loading="lazy"
              decoding="async"
              alt={`Close-up Image ${i + 1}`}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        </>
      ),
    };
  });


  const halfBodyData = params.halfbody.map((img, i) => {
    return {
      category: "",
      w: cardWidth,
      h: cardHight,
      title: "",
      src: img,
      content: (
        <>
          <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <Image
              src={img}
              width={500}
              height={500}
              loading="lazy"
              decoding="async"
              alt={`Close-up Image ${i + 1}`}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        </>
      ),
    };
  });

  const fullBodyData = params.fullbody.map((img, i) => {
    return {
      category: "",
      w: cardWidth,
      h: cardHight,
      title: "",
      src: img,
      content: (
        <>
          <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <Image
              src={img}
              width={500}
              height={500}
              loading="lazy"
              decoding="async"
              alt={`Close-up Image ${i + 1}`}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        </>
      ),
    };
  });

  async function base64ToFileArray(base64Array: string[]): Promise<File[]> {
    // Convert each base64 string to a File object
    const files = await Promise.all(
      base64Array.map(async (base64, index) => {
        // Create a blob from the base64 data
        const response = await fetch(base64);
        const blob = await response.blob();

        // Create a File object from the blob
        const fileName = `file-${index + 1}.jpg`; // Customize the file name and extension as needed
        return new File([blob], fileName, { type: blob.type });
      })
    );

    return files;
  }

  base64ToFileArray(params.closeUp).then((files) => {
    console.log(files); // Array of File objects
  });

  // prepare cards
  const closeUpCards = closeUpData.map((card, index: number) => (
    <Card key={index} card={card} index={index} />
  ));

  const halfBodyCards = halfBodyData.map((card, index: number) => (
    <Card key={index} card={card} index={index} />
  ));

  const fullBodyCards = fullBodyData.map((card, index: number) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <main className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-center justify-center mt-1 p-1">
      {/* Character Details*/}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Character Name */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="character">Character Name</Label>
          <Input
            type="text"
            id="character"
            placeholder="Character Name"
            value={params.characterName}
            disabled={true}
          />
        </div>

        {/* Gender */}
        <div className="w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="gender">Gender</Label>
          <Select disabled={true} value={params.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select Character Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Male"
                >
                  Male
                </SelectItem>
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Female"
                >
                  Female
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Token */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="token">Token</Label>
          <Input
            type="text"
            id="token"
            placeholder="Token"
            value={params.token}
            disabled={true}
          />
        </div>
      </div>

      {/* Train Images */}
      <div className="w-full relative py-1 mt-1 md:mt-2 px-1 bg-card/100 rounded-lg ">
        {/* close up */}
        <div>
          <p className="text-xl font-semibold">Close-Up Photos</p>
          <Carousel items={closeUpCards} />
        </div>
        {/* half body*/}
        <div>
          <p className="text-xl font-semibold">Half-Body Shot Photos</p>
          <Carousel items={halfBodyCards} />
        </div>
        {/* full body */}
        <div>
          <p className="text-xl font-semibold">Full-Body Shot Photos</p>
          <Carousel items={fullBodyCards} />
        </div>
      </div>
    </main>
  );
}
