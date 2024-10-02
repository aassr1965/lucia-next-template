"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "./auth.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const SignInSchema = z.object({

  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "le mot de passe doit avoir au moins 08 caractères" }).max(32),
})

const SignInForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    const res = await signIn(values)
    if (res.success) {
      router.push('/dashboard')
      toast.success('Connexion réussie')
    } else {
      toast.error(res.error)
    }
      console.log(values)
  }
  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle className="mx-auto">Ravi de vous revoir</CardTitle>
        <CardDescription className="mx-auto">Connectez vous à votre espace</CardDescription>
      </CardHeader >
      <CardContent className="space-y-2">
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button type="submit">Entrez</Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  )
}

export default SignInForm