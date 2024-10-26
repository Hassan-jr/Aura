"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import Image from "next/image";

import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

const images = [
  "https://r2.nomapos.com/model/hassanjr001%20(1).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(2).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(3).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(4).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(5).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(6).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(7).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(11).jpg",
  "https://r2.nomapos.com/model/hassanjr001%20(5).jpg",
];

const results = [
  "https://r2.nomapos.com/model/Full.png",
  "https://r2.nomapos.com/model/Full2.png",
  "https://r2.nomapos.com/model/Full4.png",
  "https://r2.nomapos.com/model/image5Step4.png",
  "https://r2.nomapos.com/model/image17.png",
  "https://r2.nomapos.com/model/image7.png",
];

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex w-auto h-auto items-center justify-evenly rounded-lg border-border bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function ImageTree({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);
  const div10Ref = useRef<HTMLDivElement>(null);
  const div11Ref = useRef<HTMLDivElement>(null);
  const div12Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center align-middle overflow-hidden p-1  w-full h-auto bg-transparent",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch align-middle justify-center gap-10 w-full h-auto mt-10 md:mt-20">
        {/* upload arrow */}
        <div className="font-bold absolute right-0  md:right-1/4 top-0 flex flex-row justify-center align-middle z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 442.136"
            width="100"
            height="100"
            className="w-20 md:w-auto fill-current text-black dark:text-white"
          >
            <path d="M13.465 442.136c31.386-25.228 67.041-47.435 83.064-62.714 5.281-5.036 11.006-12.153 1.663-8.574-25.872 9.91-54.003 27.668-75.003 49.745 2.547-18.499-2.366-41.616-9.997-60.505-.938-2.328-3.886-11.918-7.546-15.088-1.359-1.177-2.82-1.473-4.308-.18-.849.738-1.279 1.995-1.333 3.707-.152 4.982 3.388 19.557 6.693 33.834 4.905 21.183 7.422 37.783 6.767 59.775z" />
            <path d="M268.172 236.348c-4.322-22.157-5.797-44.278-4.95-66.742-45.792 16.982-86.744 47.758-120.988 82.094-41.377 41.487-75.893 91.78-100.677 142.433-7.709 15.756-12.142 22.106-22.78 36.216 19.82-95.783 137.212-251.197 246.697-274.194C279.782 29.162 408.945-53.716 512 40.704c-95.354-64.986-210.522-25.748-234.658 113.479 11.685-1.413 23.233-1.218 34.515.824 26.693 4.831 52.462 12.783 72.736 38.719 28.125 35.979 26.324 94.976-19.286 115.588-54.862 24.792-87.927-25.74-97.135-72.966zm7.016-67.488c-.889 23.576 1.128 48.171 6.111 71.196 8.03 37.107 29.726 69.192 65.407 62.821 22.084-3.944 35.695-18.675 40.56-38.117 17.522-70.029-62.617-107.875-112.078-95.9z" />
          </svg>
          {/* <p>Upload Your Selfies</p> */}
          <HeroHighlight
            className=""
            containerClassName="h-10 w-22 bg-transparent dark:bg-transparent"
          >
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <Highlight className="text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white">
                <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white dark:text-white mr-1 px-3 py-2 rounded-full">
                  1
                </span>
                Upload Your Selfies
              </Highlight>
            </motion.h1>
          </HeroHighlight>
        </div>

        {/* selfies 1 */}
        <div className="container z-40">
          <div className="columns-2 md:columns-2 justify-evenly w-full">
            <Circle ref={div2Ref}>
              <Image
                src={images[1]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-contain"
                alt="img"
              />
            </Circle>
            <Circle ref={div4Ref}>
              <Image
                src={images[3]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-contain"
                alt="img"
              />
            </Circle>
          </div>
        </div>

        {/* selfies 2 */}
        <div className="container z-40 p-0">
          <div className="columns-3 md:columns-3 flex justify-between w-full mt-[-100px] md:mt-[-150px]">
            <Circle ref={div1Ref}>
              <Image
                src={images[0]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover"
                alt="img"
              />
            </Circle>

            <Circle ref={div3Ref}>
              <Image
                src={images[2]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover"
                alt="img"
              />
            </Circle>

            <Circle ref={div5Ref}>
              <Image
                src={images[4]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover"
                alt="img"
              />
            </Circle>
          </div>
        </div>

        {/* Train Arrow arrow */}
        <div className="font-bold absolute right-0 top-1/2 flex flex-row justify-start align-middle items-center z-50 mt-[-100px] md:mt-[-70px] w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 190.285"
            width={100}
            height={100}
            className="fill-current text-black dark:text-white"
          >
            <path d="M0 128.016c32.208-3.503 65.126-11.155 82.935-11.576 5.87-.14 13.175.651 5.825 3.93-17.743 7.914-39.85 13.414-61.461 14.29 4.787 1.077 9.548 2.473 15.993 4.683 42.916 14.717 91.165 23.694 138.308 23.756 39.015.053 79.822-5.736 115.535-22.126-13.263-12.299-25.007-25.723-35.154-40.787-21.629-32.106-31.567-79.665 13.75-96.773 37.675-14.221 72.262 18.318 76.731 54.788 3.222 26.289-6.915 45.474-19.352 63.408-5.258 7.58-11.717 14.261-19.168 20.104C406.881 207.19 494.724 163.992 512 72.774c-4.91 112.345-125.544 138.675-205.932 74.569-70.469 46.003-210.713 30.084-282.411-7.501 9.463 9.291 17.535 22.446 22.866 35.006.79 1.859 4.569 8.993 4.29 12.878-.102 1.444-.766 2.442-2.348 2.553-.903.063-1.863-.407-2.868-1.35-2.92-2.749-9.199-13.053-15.44-23.058C20.896 151.03 12.885 140.155 0 128.016zm304.367 6.573c-13.918-12.906-26.764-28.048-37.028-43.982-16.542-25.678-22.453-56.275 1.472-72.95 14.806-10.319 30.931-9.682 44.76-1.39 49.808 29.872 25.747 96.995-9.204 118.322z" />
          </svg>
          <HeroHighlight
            className=""
            containerClassName="h-10 bg-transparent dark:bg-transparent"
          >
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <Highlight className="ml-0 md:ml-[-60px] text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white">
                <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white dark:text-white mr-1 px-3 py-2 rounded-full">
                  2
                </span>
                We Train an AI Version Of You
              </Highlight>
            </motion.h1>
          </HeroHighlight>
        </div>

        {/* Inprime  */}
        <div className="flex flex-row justify-center align-middle">
          <Circle
            ref={div6Ref}
            className="w-[9.5rem] h-10 border-0  rounded-full"
          >
            <div className="z-10 flex min-h-64 items-center justify-center">
              <AnimatedGradientText>
                🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                  )}
                >
                  Inprime AI
                </span>
                {/* <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
              </AnimatedGradientText>
            </div>
          </Circle>
        </div>

        {/* Generate Arrow arrow */}
        <div className="font-bold absolute left-0 top-1/2 flex flex-col justify-center align-middle items-center z-50 mt-[-70px] md:mt-[-35px] w-1/2">
          <HeroHighlight
            className=""
            containerClassName="h-10 w-22 bg-transparent dark:bg-transparent"
          >
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <Highlight className=" text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white">
                <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white dark:text-white mr-1 px-3 py-2 rounded-full">
                  3
                </span>
                Then Generate Images
              </Highlight>
            </motion.h1>
          </HeroHighlight>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 190 511.232"
            width={100}
            height={100}
            className="w-20 fill-current text-black dark:text-white"
          >
            <path d="M62.175 511.232c3.498-32.16 11.139-65.029 11.559-82.81.14-5.862-.65-13.156-3.923-5.817-7.903 17.716-13.395 39.79-14.27 61.369-1.074-4.78-2.469-9.534-4.675-15.969-14.695-42.852-23.659-91.029-23.721-138.1-.052-38.957 5.728-79.703 22.093-115.362 12.281 13.243 25.685 24.969 40.725 35.101 32.059 21.597 79.546 31.519 96.629-13.73 14.199-37.618-18.291-72.153-54.706-76.615-26.25-3.217-45.406 6.905-63.312 19.323-7.57 5.25-14.241 11.699-20.074 19.139C-16.88 104.961 26.254 17.25 117.335 0 5.158 4.903-21.132 125.356 42.877 205.623c-45.933 70.364-30.038 210.397 7.49 281.987-9.277-9.448-22.412-17.508-34.953-22.831-1.856-.789-8.98-4.562-12.858-4.284-1.442.101-2.439.765-2.55 2.345-.063.901.406 1.86 1.348 2.863 2.745 2.916 13.033 9.185 23.023 15.417 14.819 9.247 25.678 17.246 37.798 30.112zm-6.562-303.91c12.887 13.897 28.005 26.723 43.915 36.972 25.64 16.517 56.191 22.419 72.841-1.47 10.303-14.784 9.667-30.885 1.387-44.692-29.827-49.734-96.848-25.709-118.143 9.19z" />
          </svg>
        </div>

        {/* character */}
        <div className="flex flex-row justify-center align-middle mt-14">
          <Circle
            ref={div7Ref}
            className="w-[9.5rem] h-10 border-0  rounded-full"
          >
            <div className="z-10 flex min-h-64 items-center justify-center">
              <AnimatedGradientText>
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                  )}
                >
                  Your AI Character
                </span>
              </AnimatedGradientText>
            </div>
          </Circle>
        </div>

        {/* Result 1 */}
        <div className="container z-40 p-0 mt-5">
          <div className="columns-3 md:columns-3 flex justify-between w-full">
            <Circle ref={div10Ref}>
              <Image
                src={results[1]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover mt-[-50px]  md:mt-[0px]"
                alt="img"
              />
            </Circle>

            <Circle ref={div11Ref}>
              <Image
                src={results[2]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover  md:mt-[36px]"
                alt="img"
              />
            </Circle>

            <Circle ref={div12Ref}>
              <Image
                src={results[4]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover mt-[-50px]  md:mt-[0px]"
                alt="img"
              />
            </Circle>
          </div>
        </div>

        {/* Result 2 */}
        <div className="container z-40 p-0 mt-5 md:mt-[-100px]">
          <div className="columns-2 md:columns-2 flex justify-evenly w-full mt-[-55px]">
            <Circle ref={div8Ref}>
              <Image
                src={results[0]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover"
                alt="img"
              />
            </Circle>
            <Circle ref={div9Ref}>
              <Image
                src={results[3]}
                width={500}
                height={100}
                loading="lazy"
                decoding="async"
                className="w-24 md:w-32 h-auto rounded-md object-cover"
                alt="img"
              />
            </Circle>
          </div>
        </div>
      </div>

      {/* Selfies */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        curvature={-100}
        startYOffset={0}
        startXOffset={0}
        duration={3}
        endYOffset={0}
        endXOffset={-83}
        reverse={false}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        curvature={-150}
        startYOffset={0}
        startXOffset={0}
        duration={3}
        endYOffset={-30}
        endXOffset={-50}
        reverse={false}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        curvature={0}
        startYOffset={0}
        startXOffset={0}
        duration={3}
        endYOffset={-35}
        endXOffset={0}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        curvature={-150}
        startYOffset={0}
        startXOffset={0}
        duration={3}
        endYOffset={-25}
        endXOffset={60}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        curvature={-100}
        startYOffset={0}
        startXOffset={0}
        duration={3}
        endYOffset={-10}
        endXOffset={83}
        reverse={true}
      />

      {/* Inprime to Character */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
        curvature={0}
        startYOffset={0}
        startXOffset={0}
        endYOffset={-35}
        endXOffset={0}
        reverse={true}
      />

      {/* From Character to Results */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div8Ref}
        curvature={50}
        startYOffset={0}
        startXOffset={-25}
        duration={3}
        endYOffset={-80}
        endXOffset={10}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div9Ref}
        curvature={50}
        startYOffset={0}
        startXOffset={25}
        duration={3}
        endYOffset={-100}
        endXOffset={-10}
        reverse={false}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div10Ref}
        curvature={50}
        startYOffset={15}
        duration={3}
        endYOffset={-124}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div11Ref}
        curvature={0}
        startYOffset={0}
        duration={3}
        endYOffset={-110}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div12Ref}
        curvature={50}
        startYOffset={15}
        duration={3}
        endYOffset={-124}
        reverse={false}
      />
    </div>
  );
}
