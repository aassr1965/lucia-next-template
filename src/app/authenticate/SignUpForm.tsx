"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signUp } from "./auth.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Un nom doit être entré" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8).max(32),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe sont différents",
  path: ['confirmPassword'],
})

const SignUpForm = () => {

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const router = useRouter()
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const res = await signUp(values)

    if (res.success){
      toast.success('Le compte a bien été créé')
      router.push("/dashboard")
    } else {
      toast.error(res.error)
    }
  }
  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle className="mx-auto">Bienvenu</CardTitle>
        <CardDescription className="mx-auto">Créer un compte</CardDescription>
      </CardHeader >
      <CardContent className="space-y-2">
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrez votre nom ..." type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrez votre email ..." type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" onChange={(e) => {
                      e.target.value = e.target.value.trim()
                      field.onChange(e)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merci de confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" onChange={(e) => {
                      e.target.value = e.target.value.trim()
                      field.onChange(e)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Validez</Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  )
}

export default SignUpForm