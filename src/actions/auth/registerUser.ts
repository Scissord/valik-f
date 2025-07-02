"use server"
import bcryptjs from "bcryptjs"
// Импорт Prisma удален

export const registerUser=async (name:string,email:string,password:string)=>{
    try{
        // Заглушка вместо работы с Prisma
        // Имитируем создание пользователя
        const user = {
            id: crypto.randomUUID(),
            name: name,
            email: email.toLowerCase()
        };

        return {
            ok:true,
            user:user
        }
    }catch(error){
        console.log(error)
        return {
            ok:false,
            message:"no se pudo crear la cuenta"
        }
    }
}