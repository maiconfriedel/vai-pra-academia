import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Textra from "react-textra";

const Index = () => {
  const { data, isLoading } = useQuery(userQueryOptions);
  const navigate = useNavigate();

  if (isLoading) return null;

  if (data) navigate({ to: "/dashboard" });

  return (
    <>
      <div className=" text-white h-full flex flex-row">
        <div className="text-[48px] font-bold  w-[600px]">
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
            className="text-white ml-32 mt-32 max-w-[450px]"
          />
        </div>
        <div className="flex flex-1 justify-start mr-20 mt-20 w-full">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="email" className="mr-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="bg-black text-white w-full p-2"
              placeholder="seu-melhor@email.com"
            />
            <label htmlFor="name" className="mr-2">
              Nome:
            </label>
            <input
              id="name"
              type="text"
              className="bg-black text-white w-full h-[50px] p-2"
              placeholder="Seu nome"
            />
            <Button className="w-full mt-4">Começar agora 🔥</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
