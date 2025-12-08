import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
            Node-RED / React
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            Descubra as corretoras disponíveis e faça buscas pelo CEP
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            O Brasil inteiro em um só lugar
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/brokers"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-colors"
            >
              Ir para o Catálogo de Corretoras
              <span className="text-xs">→</span>
            </Link>

            <Link
              to="/cep"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 hover:border-sky-500/60 hover:bg-slate-900/90 transition-colors"
            >
              Buscar CEP
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-4 max-w-md text-xs text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Backend
              </dt>
              <dd className="mt-1 font-semibold text-slate-100">
                Node-RED
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
              <dt className="text-[11px] tracking-wide text-slate-500">
                APIs
              </dt>
              <dd className="mt-1 font-semibold text-slate-100">
                BrazilAPI · Catálogo de Corretoras & CEP
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-[32px] bg-sky-500/20 blur-3xl opacity-40" />
          <div className="relative rounded-[28px] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/60">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-medium text-slate-300">
                Serviços Disponíveis
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2">
                <div>
                  <div className="font-semibold">Catálogo de Corretoras</div>
                </div>
                <Link
                  to="/brokers"
                  className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
                >
                  Abrir →
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2">
                <div>
                  <div className="font-semibold">Busca de CEP</div>
                </div>
                <Link
                  to="/cep"
                  className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
                >
                  Abrir →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
