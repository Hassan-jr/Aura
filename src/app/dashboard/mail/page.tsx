// import { cookies } from "next/headers";
import Image from "next/image";

import { Mail } from "./components/mail";
// import { mails } from "./data"
import FetchEmails from "@/lib/fetchEmail";
// import { auth } from "@/app/auth";
// import { findChatsForEmail, getProducts } from "@/actions/fetch.actions";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";

export default async function MailPage() {
  // const session = await auth();
  // const cookieStore = await cookies();
  // const layout = cookieStore.get("react-resizable-panels:layout:mail");
  // const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const data = await FetchEmails();
  // const products = await getProducts();


  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        {/* <Button className="bg-black text-white" onClick={refresh}>
          Refresh
        </Button> */}
        <Mail
          // accounts={[]}
          mails={data}
          // defaultLayout={defaultLayout}
          // defaultCollapsed={defaultCollapsed}
          data={data}
          // products = {products}
          // bid = { session?.user?.id}
          // bidEmail = {session?.user.email}

          // navCollapsedSize={4}
        />
      </div>
    </>
  );
}
