import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const formatCep = (value) => {
  const digits = (value || "").replace(/[^0-9]/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export default function Cep() {
  const params = useParams();
  const [cep, setCep] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const searchCep = async (overrideCep) => {
    try {
      setLoading(true);
      setErro(null);
      setData(null);

      const raw = overrideCep ?? cep;
      const clean = (raw || "").replace(/[^0-9]/g, "");
      if (clean.length !== 8) {
        throw new Error("Digite um CEP válido com 8 dígitos.");
      }

      const res = await fetch(`http://localhost:1880/cep/v2/${clean}`);
      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setErro(err.message || "Erro ao buscar CEP.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCep();
    }
  };

  const handleChange = (e) => {
    const masked = formatCep(e.target.value);
    setCep(masked);
  };

  useEffect(() => {
    if (params.cep) {
      const masked = formatCep(params.cep);
      setCep(masked);
      searchCep(params.cep);
    }
  }, [params.cep]);

  const rua = data?.street || data?.logradouro || "Não informado";
  const bairro = data?.neighborhood || data?.bairro || "Não informado";
  const cidade = data?.city || data?.cidade || "Não informado";
  const estado = data?.state || data?.uf || "Não informado";
  const cepResultado = data?.cep || cep || "Não informado";

  const hasAddress =
    rua !== "Não informado" &&
    cidade !== "Não informado" &&
    estado !== "Não informado";

  const mapsQuery = hasAddress
    ? `${rua}, ${cidade} - ${estado}, Brasil`
    : `${cepResultado}, Brasil`;

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    mapsQuery
  )}&z=16&output=embed`;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">Busca de CEP</h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Consulte um CEP pelo campo abaixo, ou acesse diretamente a rota{" "}
          <code className="font-mono text-sky-300">/cep/000000000</code>.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 space-y-1">
            <label
              htmlFor="cep"
              className="block text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              CEP
            </label>
            <input
              id="cep"
              type="text"
              placeholder="Ex.: 00000-000"
              value={cep}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <button
            type="button"
            onClick={() => searchCep()}
            disabled={loading}
            className="mt-1 md:mt-6 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Buscando..." : "Buscar CEP"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
          {erro && (
            <span className="inline-flex items-center rounded-full border border-rose-700 bg-rose-950/40 px-3 py-1 text-rose-200">
              {erro}
            </span>
          )}
        </div>
      </section>

      {data && !erro && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-100">
            <h2 className="mb-3 text-base font-semibold text-slate-50">
              Detalhes do CEP
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-400">Rua:</span> {rua}
              </p>
              <p>
                <span className="font-medium text-slate-400">Bairro:</span>{" "}
                {bairro}
              </p>
              <p>
                <span className="font-medium text-slate-400">Cidade:</span>{" "}
                {cidade}
              </p>
              <p>
                <span className="font-medium text-slate-400">Estado:</span>{" "}
                {estado}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
            <h3 className="mb-2 text-xs font-medium text-slate-200">
              Localização no mapa
            </h3>
            <div className="h-72 w-full overflow-hidden rounded-2xl border border-slate-800">
              <iframe
                title="Mapa do endereço"
                src={mapsUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
