import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center mt-1">
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl z-20">
        <Link href="/train/newmodel" legacyBehavior passHref>
          <Button>Train New Character</Button>
        </Link>
      </div>
    </main>
  );
}
