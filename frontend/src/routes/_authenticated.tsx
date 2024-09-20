import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/drodpown-menu";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

const NavBar = () => {
  const { data } = useQuery(userQueryOptions);

  if (!data) return null;

  function handleLogout() {
    window.location.href = "/api/auth/logout";
  }

  return (
    <div className="p-4 bg-black flex flex-row justify-between items-center text-white sticky top-0 z-50">
      <div className="flex flex-row items-baseline gap-3">
        <Link to="/dashboard">
          <h1 className="text-xl font-bold">Vai pra Academia</h1>
        </Link>
      </div>
      <div className="flex items-center mr-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <img
              src={
                data.user.imageUrl ?? "https://www.gravatar.com/avatar/?d=mp"
              }
              alt={data.user.name}
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex flex-row gap-2 items-center">
              {data.user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/dashboard">Página Inicial</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer"
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: "/login" });
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      console.log("aqui");
      const data = await queryClient.fetchQuery(userQueryOptions);
      console.log(data);
      return data;
    } catch {
      return { user: null };
    }
  },
  component: Component,
});
