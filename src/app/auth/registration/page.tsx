import { RegisterForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>
        Регистрация
      </h1>
      <RegisterForm />
    </div>
  );
}
