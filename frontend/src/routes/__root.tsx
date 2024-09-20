import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

// const NavBar = () => {
//   return (
//     <div className="p-4 bg-black flex justify-start items-baseline text-white gap-3 sticky top-0 z-50">
//       <Link to="/">
//         <h1 className="text-2xl font-bold">Vai pra Academia</h1>
//       </Link>
//       <div className="flex gap-2">
//         <Link to="/profile" className="[&.active]:font-bold">
//           Profile
//         </Link>
//       </div>
//     </div>
//   );
// };

const Root = () => {
  return (
    <>
      {/* <NavBar /> */}
      <div className="bg-zinc-950 h-screen">
        <Outlet />
      </div>
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});
