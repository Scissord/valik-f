import { LoginForm } from "@/components";
import { titleFont } from "@/config/fonts";
import MobileNavbar from "@/components/mobile/navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16 lg:pb-0 lg:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Декоративные элементы фона - скрыты на мобильных устройствах */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 hidden lg:block">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100 rounded-full opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-50 rounded-full opacity-70 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gray-100 rounded-full opacity-60"></div>
      </div>
      
      {/* Мобильная версия */}
      <div className="lg:hidden flex-1 flex flex-col justify-center">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-6 px-4 rounded-3xl shadow-md mb-6 mx-auto max-w-sm w-full">
          <h1 className={`${titleFont.className} text-3xl text-white text-center`}>
            Вход в аккаунт
          </h1>
        </div>
        
        <div className="p-5 mx-auto max-w-sm w-full">
          <LoginForm />
        </div>
      </div>
      
      {/* Десктопная версия */}
      <div className="hidden lg:flex items-center justify-center flex-1 z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full z-10 relative">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-6 px-8">
            <h1 className={`${titleFont.className} text-3xl text-white`}>
              Вход в аккаунт
            </h1>
          </div>
          
          <div className="p-8">
            <LoginForm />
          </div>
        </div>
      </div>
      
      {/* Мобильная навигация */}
      <MobileNavbar />
    </div>
  );
}
