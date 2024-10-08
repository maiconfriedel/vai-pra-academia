import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

const Root = () => {
  return (
    <>
      <div className="h-[90vh]">
        <Outlet />
      </div>
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});
