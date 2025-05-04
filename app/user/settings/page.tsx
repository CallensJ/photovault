// app/user/settings/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function UserSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth-required"); // ou "/login"
  }

  return <SettingsClient session={session} />;
}
