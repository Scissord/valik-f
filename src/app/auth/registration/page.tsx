import { RegistrationForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center p-6">
      <div className="bg-white rounded-md p-10 w-[400px]">
        <h1 className={`${titleFont.className} text-4xl mb-2`}>
          Регистрация
        </h1>
        <div className="w-full bg-slate-300 h-0.5 rounded mb-4" />
        <RegistrationForm />
      </div>
    </div>
  );
}
