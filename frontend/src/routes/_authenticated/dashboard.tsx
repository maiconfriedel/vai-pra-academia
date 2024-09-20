import { createFileRoute } from "@tanstack/react-router";

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-white text-center">
      Hello Dashboard
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});
