import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

const Root = () => {
  return (
    <>
      <div className="bg-zinc-950 h-[93.1vh]">
        <Outlet />
      </div>
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});
