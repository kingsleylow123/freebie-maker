import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  if (host.includes("claudemalaysia.com")) {
    redirect("/malaysia");
  }
  redirect("/generate");
}
