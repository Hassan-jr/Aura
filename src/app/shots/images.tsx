import React from 'react';
import BlurFade from "@/components/magicui/blur-fade";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default function BlurFadeDemo() {
  const images = [
    "https://nomapos.com/model/hassanjr001%20(1).jpg",
    "https://nomapos.com/model/hassanjr001%20(2).jpg",
    "https://nomapos.com/model/hassanjr001%20(3).jpg",
    "https://nomapos.com/model/hassanjr001%20(4).jpg",
    "https://nomapos.com/model/hassanjr001%20(5).jpg",
    "https://nomapos.com/model/hassanjr001%20(6).jpg",
    "https://nomapos.com/model/hassanjr001%20(7).jpg",
    "https://nomapos.com/model/hassanjr001%20(11).jpg",
    "https://nomapos.com/model/hassanjr001%20(5).jpg",
  ];

  const aspectRatios = [
    1, // 1:1
    16/9, // 16:9
    4/3, // 4:3
    3/2, // 3:2
    9/16, // 9:16 (vertical)
    2/3, // 2:3 (vertical)
  ];

  const getRandomAspectRatio = () => {
    return aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  };

  return (
    <section id="photos" className="container mx-auto px-4 mt-2">
      <div className="columns-3 gap-4 sm:columns-3 md:columns-4 [&>div]:mb-4">
        {images.map((imageUrl, idx) => {
          const ratio = getRandomAspectRatio();
          return (
            <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
              <div className="w-full">
                <AspectRatio ratio={ratio} className="bg-muted">
                  <Image
                    src={imageUrl}
                    alt={`myaishots ${idx + 1}`}
                    sizes='auto'
                    fill
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}