"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function registerUser(data: z.infer<typeof registerSchema>) {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid input" };

    const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (exists) return { error: "Email already registered" };

    const hashed = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            password: hashed,
        },
    });

    return { success: true };
}

export async function loginUser(email: string, password: string) {
    try {
        await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    } catch (e) {
        if (e instanceof AuthError) return { error: "Invalid email or password" };
        throw e;
    }
}

export async function logoutUser() {
    await signOut({ redirectTo: "/login" });
}