import { Button } from "@/components/ui/button";
import { api, getCurrentUser } from "@/lib/api";
import { useEffect } from "react";

const App = () => {
  async function login() {
    const response = await api.auth.login.$post({
      json: {
        email: "maicon.friedel@gmail.com",
        password: "abcd123",
      },
    });

    console.log(response);
  }

  useEffect(() => {
    async function fetchUser() {
      console.log(await getCurrentUser());
    }

    fetchUser();
  }, []);

  return (
    <>
      <div className="bg-zinc-950 text-3xl font-bold text-white flex h-screen items-center justify-center flex-col gap-3">
        Vai pra Academia! 💪
        <Button variant="secondary" onClick={() => login()}>
          🔥 Fui pra academia
        </Button>
      </div>
    </>
  );
};

export default App;
