import { LandingHeader } from "@/components/landing/header";
import { ImageTree } from "@/components/landing/imgtree";
import { LandingNav } from "@/components/landing/nav";


export default function Home() {

  return (
    <main>
      <LandingNav />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <LandingHeader />
        <ImageTree />
      </div>
    </main>
  );
}
