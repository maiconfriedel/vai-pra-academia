import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

const Login = () => {
  const navigate = useNavigate();

  async function handleLogin() {
    const response = await api.auth.login.$post({
      json: {
        email: "maicon.friedel@gmail.com",
        password: "MMMMMM",
      },
    });

    if (response.status === 204) {
      console.log("aqui");
      navigate({
        to: "/dashboard",
      });
    }
  }
  return (
    <div className="text-white h-screen flex items-center justify-center">
      <Button variant="default" onClick={handleLogin}>
        Fazer Login
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: Login,
});
