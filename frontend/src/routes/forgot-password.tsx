import { createFileRoute } from "@tanstack/react-router";

const ForgotPassword = () => {
  return <div>Hello /forgot-password!</div>;
};

export const Route = createFileRoute("/forgot-password")({
  component: () => <ForgotPassword />,
});
