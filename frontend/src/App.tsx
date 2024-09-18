import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <>
      <div className="bg-zinc-950 text-3xl font-bold text-white flex h-screen items-center justify-center flex-col gap-3">
        Vai pra Academia! 💪
        <Button variant="secondary" onClick={() => alert("Birl")}>
          Fui pra academia 🔥
        </Button>
      </div>
    </>
  );
};

export default App;
