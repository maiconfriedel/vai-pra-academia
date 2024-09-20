import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Textra from "react-textra";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  function handleStart() {
    setShowForm(true);
  }

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      desiredWeeklyFrequency: 3,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className=" text-white h-full flex flex-row">
      <div
        className={`text-[64px] font-bold mr-4 h-screen bg-[url('src/assets/academia.avif')] bg-cover flex flex-1 justify-start items-start`}
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
          stopDuration={5000}
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
            <label htmlFor="name" className="mr-2">
              Nome
            </label>
            <form.Field
              name="name"
              children={(field) => (
                <Input
                  id="name"
                  type="text"
                  className="bg-black text-white w-full py-6"
                  placeholder="Seu nome"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <label htmlFor="email" className="mr-2">
              E-mail
            </label>
            <form.Field
              name="email"
              children={(field) => (
                <Input
                  id="email"
                  type="email"
                  className="bg-black text-white w-full py-6"
                  placeholder="seu-melhor@email.com"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <label htmlFor="email" className="mr-2">
              Senha
            </label>
            <form.Field
              name="password"
              children={(field) => (
                <Input
                  id="password"
                  type="password"
                  className="bg-black text-white w-full py-6"
                  placeholder="*******"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <label htmlFor="desiredWeeklyFrequency" className="mr-2">
              Meta por Semana
            </label>
            <form.Field
              name="desiredWeeklyFrequency"
              children={(field) => (
                <Input
                  id="name"
                  type="number"
                  className="bg-black text-white w-full py-6"
                  required
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
