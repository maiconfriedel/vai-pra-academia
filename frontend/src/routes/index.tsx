import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import Textra from "react-textra";

const Index = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <div className=" text-white h-full flex flex-row">
        <div
          className={`text-[48px] max-w-[40%] font-bold mr-4 h-screen bg-[url('src/assets/vai-pra-academia.jpg')] bg-cover flex flex-1 justify-start items-end`}
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
            stopDuration={3000}
            className="text-white m-24 drop-shadow-2xl"
          />
        </div>
        <div className="flex flex-1 flex-col justify-start mr-10 ml-4 mt-20 w-full">
          <h1 className="text-5xl font-bold mb-10">Vai pra Academia 💪</h1>
          <form
            className="flex flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
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
            <label htmlFor="name" className="mr-2">
              Nome:
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

            <Button className="w-full mt-4" type="submit">
              Começar agora 🔥
            </Button>
            <Button
              className="w-full mt-4"
              variant="secondary"
              asChild
              type="button"
            >
              <Link to="/login">Já tenho conta 💪</Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
