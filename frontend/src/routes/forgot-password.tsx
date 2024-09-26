import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Informe um email válido" }),
});

const ForgotPassword = () => {
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      if (!captchaChecked)
        return toast({
          title: "Erro ao solicitar recuperação de senha",
          description: "Faça a verificação do captcha",
          variant: "destructive",
        });

      const response = await api.auth.password.reset.$post({
        json: {
          email: value.email,
        },
      });

      if (response.status === 404)
        toast({
          title: "Erro ao solicitar recuperação de senha",
          description: "Usuário não encontrado",
          variant: "destructive",
        });
      else {
        toast({
          title: "E-mail de recuperação enviado",
          description: "Verifique sua caixa de entrada",
        });
        navigate({ to: "/login" });
      }
    },
  });

  function onChange() {
    setCaptchaChecked(true);
  }

  return (
    <div className="p-20 flex flex-col flex-1 h-screen items-center bg-[url('/academia.avif')] bg-cover">
      <Card className="flex flex-col min-w-[500px] justify-start pb-6">
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
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
              validators={{ onChange: forgotPasswordSchema.shape.email }}
              children={(field) => (
                <div>
                  <label htmlFor="email" className="mr-2">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-black text-white w-full py-6 mt-1"
                    placeholder="seu@email.com"
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
            <ReCAPTCHA
              sitekey="6LfNHlAqAAAAAAz-blmtE7zJW5WwMtpFDTWTyGJn"
              onChange={onChange}
              className="mt-4"
            />
            <Button variant="success" type="submit" className="mt-4">
              Enviar e-mail de recuperação
            </Button>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/forgot-password")({
  component: () => <ForgotPassword />,
});
