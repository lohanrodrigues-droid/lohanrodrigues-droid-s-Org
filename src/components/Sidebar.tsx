import React from 'react';
import {
  Boxes,
  Smartphone,
  X
} from 'lucide-react';
import { PerfilAcesso } from '../types/wms';

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  perfilAcesso: PerfilAcesso;
  setPerfilAcesso: (perfil: PerfilAcesso) => void;
  pendentesCount: number;
  emAndamentoCount: number;
  concluidosHojeCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenInstalarModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  abaAtiva,
  setAbaAtiva,
  perfilAcesso,
  setPerfilAcesso,
  pendentesCount,
  emAndamentoCount,
  concluidosHojeCount,
  isOpenMobile,
  setIsOpenMobile,
  onOpenInstalarModal
}) => {
  // Portal GPFLOW - Painéis de Estoque
  const secaoHub = [
    {
      id: 'hub',
      label: 'Painéis de Estoque (GPFLOW)',
      icon: Boxes,
      badge: '4 painéis',
      badgeColor: 'bg-blue-600 text-white font-bold'
    }
  ];

  return (
    <>
      {/* Overlay para Mobile */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Principal em Azul Marinho Corporativo (#051336) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#051336] text-slate-200 flex flex-col justify-between border-r border-[#0d2259] transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Top Logo / Identidade MT - WMS */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#0d2358] bg-[#030e29] flex-none">
            <button
              onClick={() => {
                setAbaAtiva('hub');
                setIsOpenMobile(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              {/* Ícone de Nós Interconectados */}
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
                  <path d="M6 18a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
                  <path d="m15.5 8.5-9 7" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M18 9v6" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">MT - WMS</span>
                <span className="block text-[10px] text-sky-300/80 font-mono font-medium -mt-0.5">
                  CD TREVO · PERLOG
                </span>
              </div>
            </button>

            {/* Fechar no Mobile */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alternador Rápido de Perfil (Analista vs Mobile) */}
          <div className="p-3 border-b border-[#0e255e] flex-none">
            <div className="bg-[#030e29] p-1 rounded-xl border border-[#0d2259] grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button
                onClick={() => {
                  setPerfilAcesso('analista');
                  if (abaAtiva === 'retorno_mobile') setAbaAtiva('despacho');
                }}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  perfilAcesso === 'analista'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analista (PC)
              </button>
              <button
                onClick={() => {
                  setPerfilAcesso('mobile_equipe');
                  setAbaAtiva('retorno_mobile');
                }}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  perfilAcesso === 'mobile_equipe'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile Equipe
              </button>
            </div>
          </div>

          {/* Links de Navegação estilo GPFLOW - Apenas Portal GPFLOW */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto no-scrollbar text-xs">
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold text-sky-400/80 uppercase tracking-wider flex items-center justify-between">
                <span>Portal GPFLOW</span>
              </div>
              <div className="space-y-1">
                {secaoHub.map(item => {
                  const Icon = item.icon;
                  const isAtivo = abaAtiva === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAbaAtiva(item.id);
                        setIsOpenMobile(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isAtivo
                          ? 'bg-[#122e6b] text-white font-bold shadow-md border-l-4 border-sky-400'
                          : 'text-slate-300 hover:bg-[#0b1d4d] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-none ${isAtivo ? 'text-sky-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] flex-none ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atalho Informativo / Status das Rotinas */}
            <div className="px-3 pt-2 border-t border-[#0d2259]/60">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Painel Integrado
              </div>
              <button
                onClick={() => {
                  setAbaAtiva('painel');
                  setIsOpenMobile(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  abaAtiva === 'painel'
                    ? 'bg-[#0f275e] border-sky-400 text-white'
                    : 'bg-[#030e29]/60 border-[#0e255e] text-slate-300 hover:border-sky-500/50 hover:bg-[#071947]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">WMS Rotinas / Execução</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-sky-200/70 mb-2">
                  Despacho, Retorno Mobile, Ruas e Produtividade unificados neste painel.
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {pendentesCount} Pend
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                    {emAndamentoCount} Andam
                  </span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Rodapé da Sidebar: Usuário + Botão Baixar App */}
        <div className="p-3 border-t border-[#0e255e] bg-[#030e29]/95 space-y-2.5 flex-none">
          <button
            onClick={() => {
              onOpenInstalarModal();
              setIsOpenMobile(false);
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>📲 Baixar / Instalar App</span>
          </button>

          {/* Perfil do Usuário */}
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-7 h-7 rounded-full bg-[#4a5a9a] flex items-center justify-center text-xs font-bold text-white flex-none">
              L
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-white truncate">
                lohanrodrigues@perlog...
              </div>
              <div className="text-[10px] text-sky-300/80">
                Analista WMS · CD Trevo
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
