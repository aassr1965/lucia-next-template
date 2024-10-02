"use server";

import { z } from "zod";
import { SignUpSchema } from "./SignUpForm";
import prisma from "@/lib/prisma";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { SignInSchema } from "./SignInForm";
import { redirect } from "next/navigation";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  // console.log("I am runnig with values being ", values)
  try {
    //if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (existingUser) {
      return {
        error: "User already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(values.password);
    const user = await prisma.user.create({
      data: {
        email: values.email.toLocaleLowerCase(),
        name: values.name,
        hashedPassword,
      },
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    return { error: "Un problème est survenu", success: false };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const user = await prisma.user.findUnique({
    where: {
      email: values.email.toLocaleLowerCase(),
    },
  });
  if(!user || !user.hashedPassword){
    return {success: false, error: "Identifiants incorrects"}
  }

  const passwordMatch = await new Argon2id().verify(user.hashedPassword, values.password)

  if (!passwordMatch) {
    return {success: false, error: "Identifiants incorrects"}
  }
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return {success: true}
};

export const logOut = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/authenticate')
};
