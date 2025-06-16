import { auth } from "@/auth";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function profilePage() {
  const session = await auth();
  if (!session?.user)
    redirect("/")
  return (
    <div>
      <Title title="Профиль"></Title>
      <pre>
        {
          JSON.stringify(session)
        }
      </pre>
    </div>
  );
};
