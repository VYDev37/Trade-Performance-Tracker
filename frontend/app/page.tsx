import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const storedCookies = await cookies();

  const token = storedCookies.get("token")?.value;

  if (!token)
    return redirect("/login")

  return redirect("/admin/dashboard")
}
