import { useState, useEffect, useMemo } from "react";

export default function Brokers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [cityFilter, setCityFilter] = useState(""); // filtro por município

  const loadBrokers = async () => {
    try {
      setLoading(true);
      setErro(null);
      const res = await fetch("http://localhost:1880/brokers");
      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar as corretoras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrokers();
  }, []);

  const getBrokerFields = (item) => {
    if (typeof item === "string") {
      return {
        nome: item,
        cidade: "",
        cnpj: "",
      };
    }

    return {
      nome:
        item.nome_social ||
        item.nome_comercial ||
        item.name ||
        "Nome não informado",
      cidade: item.municipio || item.cidade || item.city || "",
      cnpj: item.cnpj || "",
    };
  };

  const normalize = (str) =>
    (str || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // lista de municípios únicos para o filtro (select)
  const cities = useMemo(() => {
    const set = new Set();
    data.forEach((item) => {
      const { cidade } = getBrokerFields(item);
      if (cidade) set.add(cidade);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [data]);

  // aplica apenas filtro de município
  const filteredData = useMemo(() => {
    const city = normalize(cityFilter.trim());
    return data.filter((item) => {
      const { cidade } = getBrokerFields(item);
      if (!city) return true;
      return normalize(cidade) === city;
    });
  }, [data, cityFilter]);

  const clearFilters = () => {
    setCityFilter("");
  };

  const hasFilters = !!cityFilter;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-50">
          Catálogo de Corretoras
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Lista de corretoras consumida via backend Node-RED, filtrável por
          município.
        </p>
      </header>

      {/* Status + contagem */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Node-RED · GET /brokers
        </span>

        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
          {loading
            ? "Carregando corretoras..."
            : Array.isArray(data) && data.length > 0
            ? `Corretoras carregadas: ${data.length} · Após filtro: ${filteredData.length}`
            : "Nenhuma corretora carregada"}
        </span>

        {erro && (
          <span className="rounded-full border border-rose-700 bg-rose-950/40 px-3 py-1 text-rose-200">
            {erro}
          </span>
        )}
      </div>

      {/* Filtro de município + botão limpar filtro */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1 max-w-sm w-full">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
              Filtrar por município
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Todos os municípios</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Selecione um município para ver apenas as corretoras daquela
              região.
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center self-start rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 hover:border-sky-500 hover:text-sky-200 hover:bg-slate-900 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Grid de cards – 5 colunas no desktop */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        {(!data || data.length === 0) && !loading ? (
          <p className="text-sm text-slate-500">
            Nenhuma corretora disponível no momento.
          </p>
        ) : filteredData.length === 0 && !loading ? (
          <p className="text-sm text-slate-500">
            Nenhuma corretora encontrada para o município selecionado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredData.map((item, idx) => {
              const { nome, cidade, cnpj } = getBrokerFields(item);
              return (
                <article
                  key={idx}
                  className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-100 shadow-sm shadow-slate-950/40"
                >
                  <h2 className="mb-2 text-sm font-semibold text-slate-50 line-clamp-3">
                    {nome}
                  </h2>

                  {cidade && (
                    <p className="text-slate-300">
                      <span className="font-medium text-slate-400">
                        Cidade:
                      </span>{" "}
                      {cidade}
                    </p>
                  )}

                  {cnpj && (
                    <p className="text-slate-300">
                      <span className="font-medium text-slate-400">CNPJ:</span>{" "}
                      {cnpj}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
