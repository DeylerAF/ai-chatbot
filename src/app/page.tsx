import ChatApp from "./components/ChatApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4">
      <main className="flex-grow">
        <ChatApp />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
