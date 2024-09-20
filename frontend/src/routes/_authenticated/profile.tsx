import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const Profile = () => {
  const { data } = useQuery(userQueryOptions);

  return (
    <div className="h-full flex flex-col items-center justify-center text-white text-center">
      Profile
      <div>
        <p>{data?.user.name}</p>
        <p>{data?.user.email}</p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});
