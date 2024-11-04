import { Suspense } from "react";
import VerifyEmail from './verifyEmail'

const Home = () => {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  )
}

export default Home