import LoginForm from "@/components/Login/Form";
import Image from "next/image";

export default async function Login() {
  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 items-center place-items-center px-4">
      <Image src="/login.svg" alt="login" width={600} height={600} priority />
      <LoginForm />
    </div>
  );
}
