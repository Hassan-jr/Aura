"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from "next/image";

export default function TopStories() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full relative py-1 mt-1 md:mt-2 px-1 bg-card/100 rounded-lg">
      <Carousel items={cards} />
    </div>
  );
}

interface DetailedStoryProp {
  src: string
}

const DummyContent = ({ src }: DetailedStoryProp) => {
  return (
    <>

      <div
        className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
      >
        {/* <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            The first rule of Apple club is that you boast about Apple club.
          </span>{" "}
          Keep a journal, quickly jot down a grocery list, and take amazing
          class notes. Want to convert those notes to text? No problem.
          Langotiya jeetu ka mara hua yaar is ready to capture every
          thought.
        </p> */}
        <Image
          src={src}
          width={500}
          height={100}
          loading="lazy"
          decoding="async"
          // priority
          blurDataURL={
            typeof src === "string" ? src : undefined
          }
          alt={`myaishots`}
          className="w-full h-auto rounded-md cover"
        />
      </div>

    </>
  );
};

const data = [
  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(1).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(1).jpg" />,
  },
  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(2).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(2).jpg"/>,
  },
  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(3).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(2).jpg" />,
  },

  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(4).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(2).jpg" />,
  },
  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(5).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(2).jpg" />,
  },
  {
    category: "",
    title: "",
    src: "https://nomapos.com/model/hassanjr001%20(7).jpg",
    content: <DummyContent src="https://nomapos.com/model/hassanjr001%20(2).jpg" />,
  },
];
