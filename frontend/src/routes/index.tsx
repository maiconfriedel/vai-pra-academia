import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useState } from "react";
import Textra from "react-textra";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome deve possuir no mínimo 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .regex(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        "Senha deve possuir no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial",
    }),
  desiredWeekFrequency: z.number().int().min(0).max(7),
});

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  function handleStart() {
    setShowForm(true);
  }

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      desiredWeekFrequency: 3,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      console.log(value);
      const reponse = await api.auth.register.$post({
        json: value,
      });

      if (reponse.status === 409)
        toast({
          title: "Erro ao criar conta",
          description: "Usuário com este e-mail já existe",
          variant: "destructive",
        });

      if (reponse.status === 201) {
        await api.auth.login.$post({
          json: {
            email: value.email,
            password: value.password,
          },
        });

        navigate({ to: "/dashboard" });
      }
    },
  });

  return (
    <div className=" text-white h-full flex flex-row">
      <div
        className={`text-[64px] font-bold mr-4 h-screen bg-[url('/academia.avif')] bg-cover flex flex-1 justify-start items-start`}
      >
        <Textra
          data={[
            "Defina sua meta 📈",
            "Registre seus treinos 💪",
            "Suba de nível 🚀",
            "Compartilhe com os amigos 🔥",
          ]}
          effect="scale"
          duration={500}
          stopDuration={1000}
          className="text-white m-12 drop-shadow-2x"
        />
      </div>
      <div className="flex flex-1 flex-col mr-10 ml-4 mt-10 w-full h-full">
        <h1 className="text-5xl font-bold mb-8">Vai pra Academia 💪</h1>
        {showForm && (
          <form
            className="flex flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              validators={{ onChange: registerSchema.shape.name }}
              children={(field) => (
                <div>
                  <label htmlFor="name" className="mr-2">
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="bg-black text-white w-full py-6"
                    placeholder="Seu nome"
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
              name="email"
              validators={{ onChange: registerSchema.shape.email }}
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
              validators={{ onChange: registerSchema.shape.password }}
              children={(field) => (
                <div>
                  <label htmlFor="email" className="mr-2">
                    Senha
                  </label>
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
            <label htmlFor="desiredWeeklyFrequency" className="mr-2">
              Meta por Semana
            </label>
            <form.Field
              name="desiredWeekFrequency"
              validators={{
                onChange: registerSchema.shape.desiredWeekFrequency,
              }}
              children={(field) => (
                <Input
                  id="name"
                  type="number"
                  className="bg-black text-white w-full py-6"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  min={1}
                  max={7}
                />
              )}
            />
            <Button className="w-full mt-4" type="submit">
              Criar conta
            </Button>
            <Button
              className="w-full "
              variant="secondary"
              asChild
              type="button"
            >
              <Link to="/login">Já tenho conta 💪</Link>
            </Button>
          </form>
        )}
        {!showForm && (
          <div className="h-full flex justify-end flex-col">
            <Button className="mt-2" type="button" onClick={handleStart}>
              Começar agora 🔥
            </Button>
            <Button
              className="w-full mt-2"
              variant="secondary"
              asChild
              type="button"
            >
              <Link to="/login">Já tenho conta 💪</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
