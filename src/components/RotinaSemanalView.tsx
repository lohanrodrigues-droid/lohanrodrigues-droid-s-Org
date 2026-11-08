import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  Send,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { MATRIZ_ROTINA_SEMANAL, SECOES_CD_MT, TarefaMatrizRotina } from '../data/rotinaSemanal';

interface RotinaSemanalViewProps {
  onDespacharTarefa: (tarefa: TarefaMatrizRotina) => void;
}

export const RotinaSemanalView: React.FC<RotinaSemanalViewProps> = ({ onDespacharTarefa }) => {
  const [diaSelecionado, setDiaSelecionado] = useState<string>('todos');
  const [secaoSelecionada, setSecaoSelecionada] = useState<string>('todas');
  const [cargoFiltro, setCargoFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const dias = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira'];

  const tarefasFiltradas = useMemo(() => {
    return MATRIZ_ROTINA_SEMANAL.filter(t => {
      if (diaSelecionado !== 'todos' && t.diaSemana !== diaSelecionado) return false;
      if (secaoSelecionada !== 'todas' && t.secao !== secaoSelecionada) return false;
      if (cargoFiltro !== 'todos' && t.cargoSugerido !== cargoFiltro) return false;
      if (busca) {
        const termo = busca.toLowerCase();
        return (
          t.atividade.toLowerCase().includes(termo) ||
          t.secao.toLowerCase().includes(termo) ||
          t.setorGeral.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [diaSelecionado, secaoSelecionada, cargoFiltro, busca]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-blue-950 tracking-tight">
              Matriz Operacional de Rotina Semanal (CD MT Trevo)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Programação padrão de rotinas dividida por Dia da Semana e Seção Comercial (Líquida, Alimentar, Bazar, Limpeza, Perfumaria, Insumo).
          </p>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
          Total de {MATRIZ_ROTINA_SEMANAL.length} rotinas catalogadas
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        
        {/* Busca */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar atividade ou rotina..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Filtro Dia */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setDiaSelecionado('todos')}
            className={`px-2.5 py-1 rounded font-bold ${
              diaSelecionado === 'todos' ? 'bg-[#051336] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os Dias
          </button>
          {dias.map(d => (
            <button
              key={d}
              onClick={() => setDiaSelecionado(d)}
              className={`px-2.5 py-1 rounded font-bold ${
                diaSelecionado === d ? 'bg-[#051336] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d.replace('-Feira', '')}
            </button>
          ))}
        </div>

        {/* Filtro Seção */}
        <select
          value={secaoSelecionada}
          onChange={(e) => setSecaoSelecionada(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todas">Todas as Seções</option>
          {SECOES_CD_MT.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Filtro Cargo */}
        <select
          value={cargoFiltro}
          onChange={(e) => setCargoFiltro(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todos">Todos os Cargos</option>
          <option value="Auxiliar">Apenas Auxiliar</option>
          <option value="Assistente">Apenas Assistente</option>
        </select>
      </div>

      {/* Tabela da Matriz em Fundo Branco */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Seq</th>
                <th className="py-3 px-4">Dia da Semana</th>
                <th className="py-3 px-4">Atividade Operacional</th>
                <th className="py-3 px-4">Seção Comercial (Setor1)</th>
                <th className="py-3 px-4">Setor Armazém</th>
                <th className="py-3 px-4">Cargo Sugerido</th>
                <th className="py-3 px-4">Meta Padrão</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tarefasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-sans">
                    Nenhuma atividade encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                tarefasFiltradas.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      {t.seq}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {t.diaSemana}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {t.atividade}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-blue-50 text-blue-900 border border-blue-200">
                        {t.secao}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.setorGeral}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-bold ${
                        t.cargoSugerido === 'Assistente' ? 'text-sky-700' : 'text-blue-900'
                      }`}>
                        {t.cargoSugerido}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {t.metaPadrao} {t.unidade}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDespacharTarefa(t)}
                        className="py-1 px-3 bg-[#051336] hover:bg-[#0c2463] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 ml-auto text-[11px] shadow-2xs"
                      >
                        <Send className="w-3 h-3 text-sky-400" />
                        <span>Despachar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
