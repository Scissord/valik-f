import { RegistrationForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function NewAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100 rounded-full opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-50 rounded-full opacity-70 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gray-100 rounded-full opacity-60"></div>
      </div>
      
      {/* Модальное окно регистрации */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full z-10 relative">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-6 px-8">
          <h1 className={`${titleFont.className} text-3xl text-white`}>
            Создание аккаунта
          </h1>
          <p className="text-white/80 mt-1">Зарегистрируйтесь, чтобы начать покупки</p>
        </div>
        
        <div className="p-8">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
