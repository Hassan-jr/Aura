import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

export function SkeletonSpinner({text1, text2}: {text1: string, text2:string}) {
  return (
    <div className="fixed top-0 right-0 left-0 w-full h-full flex justify-center align-middle bg-black/80 backdrop-blur-lg z-50">
      <div className="m-auto bg-card/70 w-80 h-60 rounded-lg">
        <div className="w-full flex flex-row flex-nowrap justify-evenly mt-1">
          <Skeleton className="h-40 w-24" />
          <Skeleton className="h-40 w-24" />
          <Skeleton className="h-40 w-24" />
        </div>
        <div className="mt-2 w-full">
          <div className="flex flex-row flex-nowrap justify-center align-middle w-full font-semibold">
            <p>{text1}</p>
            <Icons.spinner className="size-4 animate-spin" />
          </div>
          <div className="flex flex-row flex-nowrap justify-center align-middle w-full font-bold items-center mt-2">
            <p className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              {text2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
