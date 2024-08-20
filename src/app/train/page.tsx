// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="flex items-center justify-center mt-1">
//       <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl z-20">
//         <Link href="/train/newmodel" legacyBehavior passHref>
//           <Button>Train New Character</Button>
//         </Link>
//       </div>
//     </main>
//   );
// }
import Stepper from "./stepper";

const steps = [
  {
    title: "Get Training Images Right",
    description: " ",
    content: (
      <div className="flex items-center justify-center text-3xl font-semibold text-gray-900">
        Step 1 Content
      </div>
    ),
  },
  {
    title: "Ai Character Details",
    description: "",
    content: (
      <div className="flex items-center justify-center text-3xl font-semibold text-gray-900">
        Step 2 Content
      </div>
    ),
  },
  {
    title: "Upload Training Images",
    description: "",
    content: (
      <div className="flex items-center justify-center text-3xl font-semibold text-gray-900">
        Step 3 Content
      </div>
    ),
  },
  {
    title: "Start Training",
    description: "",
    content: (
      <div className="flex items-center justify-center text-3xl font-semibold text-gray-900">
        Step 4 Content
      </div>
    ),
  },
];

const MyPage = () => {
  return (
    <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      <h1>My Stepper Page</h1>
      <Stepper steps={steps} />
    </div>
  );
};

export default MyPage;
