"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from "next/image";

export default function TopStories() {

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="bg-card/100 mt-1  rounded-lg">
      <h1 className="text-2xl font-semibold">Models</h1>
      <div className="w-full relative py-1 mt-1 md:mt-2 pb-2">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

interface DetailedStoryProp {
  src: string;
}

const DummyContent = ({ src }: DetailedStoryProp) => {
  return (
    <>
      <div className="relative bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <Image
          src={src}
          width={600}
          height={100}
          loading="lazy"
          decoding="async"
          // priority //erros coz of  loading="lazy"
          blurDataURL={typeof src === "string" ? src : undefined}
          alt={`myaishots`}
          className="w-full h-auto cover"
        />
      </div>
    </>
  );
};

const cardWidth = 500
const cardHight = 5000

const data = [
  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(1).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(1).jpg" />
    ),
  },
  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(2).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(2).jpg" />
    ),
  },
  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(3).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(2).jpg" />
    ),
  },

  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(4).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(2).jpg" />
    ),
  },
  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(5).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(2).jpg" />
    ),
  },
  {
    category: "",
    w: cardWidth,
    h: cardHight,
    title: "",
    src: "https://r2.nomapos.com/model/hassanjr001%20(7).jpg",
    content: (
      <DummyContent src="https://r2.nomapos.com/model/hassanjr001%20(2).jpg" />
    ),
  },
];
