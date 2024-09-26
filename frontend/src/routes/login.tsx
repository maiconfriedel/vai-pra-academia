import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api, userQueryOptions } from "@/lib/api";
import { registerSchema } from "@/sharedTypes";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

const loginSchema = registerSchema.omit({
  desiredWeekFrequency: true,
  name: true,
});

const Login = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(userQueryOptions);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      const response = await api.auth.login.$post({
        json: value,
      });

      if (response.status === 404) {
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha inválidos",
          variant: "destructive",
        });
      }

      if (response.status === 204) {
        navigate({
          to: "/dashboard",
        });
      }
    },
  });

  if (isLoading) return null;

  if (data) return navigate({ to: "/dashboard" });

  return (
    <div className="p-10 flex flex-col flex-1 h-screen items-center bg-[url('/academia.avif')] bg-cover">
      <div className="text-4xl font-bold mb-8">Vai pra Academia 💪</div>
      <Card className="flex flex-col min-w-[500px] max-w-[500px] justify-start pb-6">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
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
              name="email"
              validators={{ onChange: loginSchema.shape.email }}
              children={(field) => (
                <div>
                  <label htmlFor="email" className="mr-2">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-black text-white w-full py-6"
                    placeholder="seu-melhor@email.com"
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
              name="password"
              validators={{ onChange: loginSchema.shape.password }}
              children={(field) => (
                <div>
                  <div className="flex flex-row justify-between">
                    <label htmlFor="email" className="mr-2">
                      Senha
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-blue-700 hover:text-blue-400"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="bg-black text-white w-full py-6"
                    placeholder="*******"
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
              Fazer Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: Login,
});
