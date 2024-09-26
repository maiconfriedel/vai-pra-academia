import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { registerSchema } from "@/sharedTypes";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const resetPasswordSchema = registerSchema
  .omit({
    email: true,
    desiredWeekFrequency: true,
    name: true,
  })
  .extend({
    code: z.string().min(1, { message: "Código inválido" }),
    confirmPassword: z
      .string()
      .regex(
        /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Senha deve possuir no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial",
        },
      ),
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const { code } = Route.useSearch();

  const form = useForm({
    defaultValues: {
      code,
      password: "",
      confirmPassword: "",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return toast({
          title: "Erro ao redefinir senha",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
      }

      const response = await api.auth.password.$put({
        json: value,
      });

      if (response.status === 404) {
        toast({
          title: "Erro ao redefinir senha",
          description: "Código inválido",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Senha redefinida com sucesso",
          description: "Faça login com a nova senha",
        });

        navigate({ to: "/login" });
      }
    },
  });

  return (
    <div className="p-20 flex flex-col flex-1 h-screen items-center bg-[url('/academia.avif')] bg-cover">
      <Card className="flex flex-col min-w-[500px] max-w-[500px] justify-start pb-6">
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="code"
              validators={{
                onChange: resetPasswordSchema.shape.code,
              }}
              children={(field) => (
                <div>
                  <label htmlFor="code" className="mr-2">
                    Código
                  </label>
                  <Input
                    id="code"
                    type="code"
                    className="bg-black text-white w-full py-6 mt-1 read-only:text-zinc-400 read-only:bg-zinc-800"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    readOnly
                  />
                  {field.state.meta.errors ? (
                    <em className="text-red-800">{field.state.meta.errors}</em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: resetPasswordSchema.shape.password,
              }}
              children={(field) => (
                <div>
                  <label htmlFor="password" className="mr-2">
                    Nova senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-black text-white w-full py-6 mt-1"
                    placeholder="********"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors ? (
                    <em className="text-red-800">{field.state.meta.errors}</em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: resetPasswordSchema.shape.confirmPassword,
              }}
              children={(field) => (
                <div>
                  <label htmlFor="confirmPassword" className="mr-2">
                    Confirmar senha
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-black text-white w-full py-6 mt-1"
                    placeholder="********"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors ? (
                    <em className="text-red-800">{field.state.meta.errors}</em>
                  ) : null}
                </div>
              )}
            />

            <Button variant="success" type="submit" className="mt-4">
              Redefinir Senha
            </Button>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/reset-password")({
  component: () => <ResetPassword />,
  validateSearch: (search) => {
    return {
      code: (search.code || "") as string,
    };
  },
});
