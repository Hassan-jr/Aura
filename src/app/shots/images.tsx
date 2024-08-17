import React from 'react';
import BlurFade from "@/components/magicui/blur-fade";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
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
    <section className="container pt-3 px-0 bg-card/100 rounded-lg">
      <div className="columns-3 gap-0.5 mx-1 md:gap-1 sm:columns-3 md:columns-4 [&>div]:mb-1">
        {images.map((imageUrl, idx) => {
          const ratio = getRandomAspectRatio();
          return (
            <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
              <div className="w-full">
                {/* <AspectRatio ratio={ratio} className="bg-muted"> */}
                  <Image
                    src={imageUrl}
                    alt={`myaishots ${idx + 1}`}
                    width={100}
                    height={100}
                    // loading='lazy'
                    // decoding="async"
                    // sizes='auto'
                    // fill
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-md object-cover"
                  />
                {/* </AspectRatio> */}
              </div>
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}