import { LoginForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center ">
      <div className="bg-white rounded-md p-10 w-[400px]">
        <h1 className={`${titleFont.className} text-4xl mb-2`}>Login</h1>
        <div className="w-full bg-slate-300 h-0.5 rounded mb-4" />
        <LoginForm />
      </div>
    </div>
  );
}
