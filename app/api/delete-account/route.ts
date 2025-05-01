import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
