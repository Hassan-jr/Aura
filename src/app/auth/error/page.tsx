import AuthError from "./customerror";
import { Suspense } from "react";

const Home = () => {
  return (
    <Suspense>
      <AuthError />
    </Suspense>
  );
};

export default Home;
