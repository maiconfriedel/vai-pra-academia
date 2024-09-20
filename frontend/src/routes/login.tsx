import { Button } from "@/components/ui/button";
import { api, userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

const Login = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(userQueryOptions);

  if (isLoading) return null;

  if (data) navigate({ to: "/dashboard" });

  async function handleLogin() {
    const response = await api.auth.login.$post({
      json: {
        email: "maicon.friedel@gmail.com",
        password: "MMMMMM",
      },
    });

    if (response.status === 204) {
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
