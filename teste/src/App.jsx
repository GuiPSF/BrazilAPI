import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Brokers from "./pages/Brokers";
import Cep from "./pages/Cep";

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-sky-300 border-sky-400 bg-sky-500/10"
      : "text-slate-300 border-transparent hover:border-slate-500 hover:bg-slate-800/60";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_#020617_55%)] opacity-60" />

      <div className="relative flex flex-col min-h-screen">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/40">
                <span className="text-sm font-semibold text-sky-300">BR</span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-100">
                  BrazilAPI
                </span>
                <span className="text-xs text-slate-400">
                  Broker Catalog & Zip Code Search
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className={`rounded-full border px-4 py-1.5 font-medium ${isActive("/")}`}
              >
                Início
              </Link>
              <Link
                to="/brokers"
                className={`rounded-full border px-4 py-1.5 font-medium ${isActive("/brokers")}`}
              >
                Catálogo de Corretoras
              </Link>
              <Link
                to="/cep"
                className={`rounded-full border px-4 py-1.5 font-medium ${isActive("/cep")}`}
              >
                Buscar CEP
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        </main>

        <footer className="border-t border-slate-800 bg-slate-950/80">
          <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-500 flex items-center justify-between">
            <span>BrazilAPI Explorer</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brokers" element={<Brokers />} />
          <Route path="/cep" element={<Cep />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
