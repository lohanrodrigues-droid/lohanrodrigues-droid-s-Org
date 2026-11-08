import React, { useEffect, useState } from 'react';
import {
  Menu,
  Clock,
  Smartphone,
  CheckCircle2,
  Zap,
  Boxes
} from 'lucide-react';
import { PerfilAcesso } from '../types/wms';

interface HeaderProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  perfilAcesso: PerfilAcesso;
  setPerfilAcesso: (perfil: PerfilAcesso) => void;
  pendentesCount: number;
  emAndamentoCount: number;
  concluidosHojeCount: number;
  onOpenMobileMenu: () => void;
  onOpenInstalarModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  abaAtiva,
  setAbaAtiva,
  perfilAcesso,
  setPerfilAcesso,
  pendentesCount,
  emAndamentoCount,
  concluidosHojeCount,
  onOpenMobileMenu,
  onOpenInstalarModal
}) => {
  const [horaAtual, setHoraAtual] = useState('');

  useEffect(() => {
    const atualizar = () => {
      const agora = new Date();
      setHoraAtual(
        agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    atualizar();
    const interval = setInterval(atualizar, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTituloAba = () => {
    switch (abaAtiva) {
      case 'hub': return 'Hub de Painéis de Estoque (GPFLOW)';
      case 'ocupacao_cd': return 'Painel 1: Ocupação do CD Trevo';
      case 'painel': return 'Painel 2: WMS Rotinas & Execução';
      case 'comparativo_estoque': return 'Painel 3: Comparativo WMS × ERP Consinco';
      case 'divergencias_produtos': return 'Painel 4: Divergências de Produtos & Aging';
      case 'despacho': return 'Despacho de Atividades (Analista PC)';
      case 'retorno_mobile': return 'Terminal Mobile de Retorno (Coletor)';
      case 'ranking': return 'Produtividade Aux. & Assistentes';
      case 'ruas': return 'Monitoramento por Rua (Check)';
      case 'rotina': return 'Matriz Semanal por Seções';
      case 'base': return 'Base de Lançamentos (Google Forms)';
      case 'diagnostico': return 'Diagnóstico da Base de Dados';
      default: return 'Sistema WMS CD MT Trevo';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Lado Esquerdo: Botão Mobile + Título / Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAbaAtiva('hub')}
                  className="text-xs font-bold text-blue-900 tracking-wider uppercase font-mono hover:text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Boxes className="w-3.5 h-3.5 text-blue-600 inline" />
                  <span>GPFLOW</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">MT-WMS</span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  {getTituloAba()}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Centro de Distribuição MT Trevo · Perlog Logística (Grupo Pereira)
              </p>
            </div>
          </div>

          {/* Lado Direito: Status em Tempo Real e Ações */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Relógio em Tempo Real */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>{horaAtual}</span>
            </div>

            {/* Badges de Status Operacional */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setAbaAtiva('despacho')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors font-medium text-[11px]"
                title="Atividades aguardando equipe no celular"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{pendentesCount} Pendentes</span>
              </button>

              <button
                onClick={() => setAbaAtiva('retorno_mobile')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 transition-colors font-medium text-[11px]"
                title="Atividades sendo executadas no celular agora"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                <span>{emAndamentoCount} Em Andamento</span>
              </button>

              <button
                onClick={() => setAbaAtiva('painel')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors font-medium text-[11px]"
                title="Retornos concluídos hoje"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{concluidosHojeCount} Concluídos Hoje</span>
              </button>
            </div>

            {/* Ação Rápida: Atalho para o Hub de Painéis */}
            <button
              onClick={() => setAbaAtiva('hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                abaAtiva === 'hub'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Abrir Hub de Painéis de Estoque"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hub Painéis</span>
            </button>

            {/* Ação Rápida: Instalar App */}
            {onOpenInstalarModal && (
              <button
                onClick={onOpenInstalarModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                title="Como baixar e instalar o app no celular ou coletor"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline">Instalar App</span>
              </button>
            )}

            {/* Ação Rápida: Novo Despacho */}
            <button
              onClick={() => setAbaAtiva('despacho')}
              className="flex items-center gap-1.5 bg-[#051336] hover:bg-[#0c2463] text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Despachar</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
