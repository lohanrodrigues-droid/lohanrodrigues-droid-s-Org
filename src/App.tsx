import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HubPaineisEstoque } from './components/HubPaineisEstoque';
import { PainelOcupacaoCD } from './components/paineis/PainelOcupacaoCD';
import { PainelComparativoEstoque } from './components/paineis/PainelComparativoEstoque';
import { PainelDivergencias } from './components/paineis/PainelDivergencias';
import { PainelRotinasExecucao, SubAbaRotinas } from './components/paineis/PainelRotinasExecucao';
import { ModalInstalacaoMobile } from './components/ModalInstalacaoMobile';
import { wmsStorage } from './services/wmsStorage';
import { AtividadeOperacional, CargoColaborador, Colaborador, MetaAtividade, PerfilAcesso } from './types/wms';
import { TarefaMatrizRotina } from './data/rotinaSemanal';
import { parsePainelParam, getUrlPainel, TipoPainelChave } from './utils/painelLinks';
import {
  Boxes,
  Building2,
  CheckSquare,
  Scale,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  Maximize2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [atividades, setAtividades] = useState<AtividadeOperacional[]>(() => wmsStorage.getAtividades());
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(() => wmsStorage.getColaboradores());
  const [metas, setMetas] = useState<MetaAtividade[]>(() => wmsStorage.getMetas());
  
  // Detecção de parâmetros na URL (?painel=... &standalone=1)
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const p = new URLSearchParams(window.location.search);
    return p.get('standalone') === '1' || p.get('standalone') === 'true';
  });

  const [abaAtiva, setAbaAtiva] = useState<string>(() => {
    if (typeof window === 'undefined') return 'hub';
    const p = new URLSearchParams(window.location.search);
    const parsed = parsePainelParam(p.get('painel'));
    return parsed ? parsed.abaId : 'hub';
  });

  const [subAbaRotinas, setSubAbaRotinas] = useState<SubAbaRotinas>('dashboard');
  const [perfilAcesso, setPerfilAcesso] = useState<PerfilAcesso>('analista');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isModalInstalarOpen, setIsModalInstalarOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiadoStandalone, setCopiadoStandalone] = useState<boolean>(false);

  // Sincroniza parâmetros de URL com a aba ativa
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      let painelSlug = '';
      if (abaAtiva === 'ocupacao_cd') painelSlug = 'ocupacao';
      else if (abaAtiva === 'painel' || ['despacho', 'retorno_mobile', 'ranking', 'ruas', 'rotina', 'base', 'diagnostico'].includes(abaAtiva)) painelSlug = 'rotinas';
      else if (abaAtiva === 'comparativo_estoque') painelSlug = 'comparativo';
      else if (abaAtiva === 'divergencias_produtos') painelSlug = 'divergencias';

      if (painelSlug) {
        url.searchParams.set('painel', painelSlug);
        if (isStandalone) {
          url.searchParams.set('standalone', '1');
        } else {
          url.searchParams.delete('standalone');
        }
      } else {
        url.searchParams.delete('painel');
        url.searchParams.delete('standalone');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignora erros de URL em ambientes isolados
    }
  }, [abaAtiva, isStandalone]);

  // Escuta evento nativo do navegador para instalação PWA
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Recarregar dados do storage
  const recarregarDados = () => {
    setAtividades(wmsStorage.getAtividades());
    setColaboradores(wmsStorage.getColaboradores());
    setMetas(wmsStorage.getMetas());
  };

  // Contagens para o cabeçalho
  const pendentesCount = useMemo(() => atividades.filter(a => a.status === 'Pendente').length, [atividades]);
  const emAndamentoCount = useMemo(() => atividades.filter(a => a.status === 'Em Andamento').length, [atividades]);
  const concluidosHojeCount = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0];
    return atividades.filter(a => a.status === 'Concluído' && a.data === hoje).length;
  }, [atividades]);

  // Handler: Analista cria despacho
  const handleCriarDespacho = (dados: {
    nomeCompleto: string;
    cargo: CargoColaborador;
    equipe: string;
    setor: string;
    secao?: string;
    atividade: string;
    itensPrevistos: number;
    rua: string;
    observacao?: string;
    prioridade?: 'Normal' | 'Urgente' | 'Alta';
    analistaCriador: string;
  }) => {
    wmsStorage.criarDespachoAnalista(dados);
    recarregarDados();
  };

  // Handler: Equipe inicia atividade no celular
  const handleIniciarAtividade = (id: string) => {
    wmsStorage.iniciarAtividadeMobile(id);
    recarregarDados();
  };

  // Handler: Equipe finaliza e dá retorno no celular
  const handleRetornarAtividade = (params: { id: string; itens: number; rua?: string; observacao?: string }) => {
    wmsStorage.retornarAtividadeMobile(params);
    recarregarDados();
  };

  // Handler: Lançamento manual avulso
  const handleAdicionarLancamentoManual = (dados: any) => {
    wmsStorage.adicionarLancamentoManual(dados);
    recarregarDados();
  };

  // Handler: Excluir atividade
  const handleExcluirAtividade = (id: string) => {
    wmsStorage.excluirAtividade(id);
    recarregarDados();
  };

  // Handler: Clique em tarefa na matriz de rotina semanal
  const handleDespacharTarefaRotina = (tarefa: TarefaMatrizRotina) => {
    setSubAbaRotinas('despacho');
    setAbaAtiva('painel');
  };

  const handleCopiarUrlStandalone = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiadoStandalone(true);
        setTimeout(() => setCopiadoStandalone(false), 2500);
      });
    }
  };

  // Determina a sub-aba atual para o Painel 2
  const subAbaCalculada: SubAbaRotinas = useMemo(() => {
    if (['despacho', 'retorno_mobile', 'ranking', 'ruas', 'rotina', 'base', 'diagnostico'].includes(abaAtiva)) {
      return abaAtiva as SubAbaRotinas;
    }
    return subAbaRotinas;
  }, [abaAtiva, subAbaRotinas]);

  // Conteúdo dos 4 painéis e módulos
  const renderConteudoPrincipal = () => {
    return (
      <>
        {/* Hub Central de Painéis de Estoque GPFLOW */}
        {abaAtiva === 'hub' && (
          <HubPaineisEstoque
            onNavegar={(destino) => {
              if (['despacho', 'retorno_mobile', 'ranking', 'ruas', 'rotina', 'base', 'diagnostico'].includes(destino)) {
                setSubAbaRotinas(destino as SubAbaRotinas);
                setAbaAtiva('painel');
              } else {
                setAbaAtiva(destino);
              }
            }}
            pendentesCount={pendentesCount}
            emAndamentoCount={emAndamentoCount}
            concluidosHojeCount={concluidosHojeCount}
          />
        )}

        {/* Painel 1: Ocupação do CD Trevo */}
        {abaAtiva === 'ocupacao_cd' && (
          <PainelOcupacaoCD
            onVoltarParaHub={() => {
              setIsStandalone(false);
              setAbaAtiva('hub');
            }}
            onIrParaDespacho={() => {
              setSubAbaRotinas('despacho');
              setAbaAtiva('painel');
            }}
            isStandalone={isStandalone}
          />
        )}

        {/* Painel 2: WMS Rotinas / Execução (Hospeda Operação e Apontamento internamente) */}
        {(abaAtiva === 'painel' ||
          abaAtiva === 'despacho' ||
          abaAtiva === 'retorno_mobile' ||
          abaAtiva === 'ranking' ||
          abaAtiva === 'ruas' ||
          abaAtiva === 'rotina' ||
          abaAtiva === 'base' ||
          abaAtiva === 'diagnostico') && (
          <PainelRotinasExecucao
            atividades={atividades}
            colaboradores={colaboradores}
            metas={metas}
            subAbaAtiva={subAbaCalculada}
            onChangeSubAba={(novaSub) => {
              setSubAbaRotinas(novaSub);
              setAbaAtiva('painel');
            }}
            onCriarDespacho={handleCriarDespacho}
            onIniciarAtividade={handleIniciarAtividade}
            onRetornarAtividade={handleRetornarAtividade}
            onAdicionarLancamentoManual={handleAdicionarLancamentoManual}
            onExcluirAtividade={handleExcluirAtividade}
            onRecarregarDados={recarregarDados}
            onVoltarParaHub={() => {
              setIsStandalone(false);
              setAbaAtiva('hub');
            }}
            isStandalone={isStandalone}
            onOpenInstalarModal={() => setIsModalInstalarOpen(true)}
          />
        )}

        {/* Painel 3: Comparativo WMS x ERP Consinco x Físico */}
        {abaAtiva === 'comparativo_estoque' && (
          <PainelComparativoEstoque
            onVoltarParaHub={() => {
              setIsStandalone(false);
              setAbaAtiva('hub');
            }}
            onIrParaDespacho={() => {
              setSubAbaRotinas('despacho');
              setAbaAtiva('painel');
            }}
            isStandalone={isStandalone}
          />
        )}

        {/* Painel 4: Divergências de Produtos */}
        {abaAtiva === 'divergencias_produtos' && (
          <PainelDivergencias
            onVoltarParaHub={() => {
              setIsStandalone(false);
              setAbaAtiva('hub');
            }}
            onIrParaDespacho={() => {
              setSubAbaRotinas('despacho');
              setAbaAtiva('painel');
            }}
            isStandalone={isStandalone}
          />
        )}
      </>
    );
  };

  // MODO STANDALONE: Página com URL própria e largura total (sem barra lateral)
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        
        {/* Barra Superior Standalone com Identidade MT - WMS / GPFLOW */}
        <header className="bg-[#051336] text-white border-b border-[#0d2259] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold">
              <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
                <path d="M6 18a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
                <path d="m15.5 8.5-9 7" />
                <circle cx="18" cy="18" r="3" />
                <path d="M18 9v6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">MT - WMS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Página Dedicada
                </span>
              </div>
              <span className="text-[10px] text-slate-300">
                CD Trevo · Perlog Logística (Padrão GPFLOW)
              </span>
            </div>
          </div>

          {/* Alternador Rápido entre os 4 Painéis */}
          <div className="flex items-center gap-1 bg-[#030e29] p-1 rounded-xl border border-[#0d2259] text-xs">
            <button
              onClick={() => setAbaAtiva('ocupacao_cd')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                abaAtiva === 'ocupacao_cd' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Ocupação
            </button>
            <button
              onClick={() => setAbaAtiva('painel')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                abaAtiva === 'painel' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. WMS Rotinas
            </button>
            <button
              onClick={() => setAbaAtiva('comparativo_estoque')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                abaAtiva === 'comparativo_estoque' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              3. Comparativo
            </button>
            <button
              onClick={() => setAbaAtiva('divergencias_produtos')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                abaAtiva === 'divergencias_produtos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              4. Divergências
            </button>
          </div>

          {/* Ações: Copiar Link e Voltar ao Hub */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopiarUrlStandalone}
              className="py-1.5 px-3 rounded-lg bg-[#030e29] hover:bg-[#0b1d4d] border border-[#123178] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Copiar URL desta página dedicada"
            >
              {copiadoStandalone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiadoStandalone ? 'Link Copiado!' : 'Copiar URL'}</span>
            </button>

            <button
              onClick={() => {
                setIsStandalone(false);
                setAbaAtiva('hub');
              }}
              className="py-1.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Hub</span>
            </button>
          </div>
        </header>

        {/* Conteúdo Standalone sem restrição de largura lateral */}
        <main className="flex-1 bg-slate-100">
          {renderConteudoPrincipal()}
        </main>

        <footer className="bg-white border-t border-slate-200 py-3 px-6 text-xs text-slate-500 text-center">
          MT - WMS · Visualização Dedicada do Painel · CD MT TREVO · Perlog Logística (Grupo Pereira)
        </footer>
      </div>
    );
  }

  // MODO PADRÃO COMPLETO COM SIDEBAR E HEADER
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans">
      
      {/* Sidebar Azul Marinho Corporativo (#051336) */}
      <Sidebar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        perfilAcesso={perfilAcesso}
        setPerfilAcesso={setPerfilAcesso}
        pendentesCount={pendentesCount}
        emAndamentoCount={emAndamentoCount}
        concluidosHojeCount={concluidosHojeCount}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenInstalarModal={() => setIsModalInstalarOpen(true)}
      />

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Branco com detalhes em azul */}
        <Header
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          perfilAcesso={perfilAcesso}
          setPerfilAcesso={setPerfilAcesso}
          pendentesCount={pendentesCount}
          emAndamentoCount={emAndamentoCount}
          concluidosHojeCount={concluidosHojeCount}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onOpenInstalarModal={() => setIsModalInstalarOpen(true)}
        />

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 bg-slate-100">
          {renderConteudoPrincipal()}
        </main>

        {/* Rodapé Corporativo em Azul e Branco */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-blue-950">
              MT - WMS · CD MT TREVO · Perlog Logística (Grupo Pereira)
            </span>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Padrão GPFLOW</span>
              <span>·</span>
              <span>4 Painéis com URLs Próprias</span>
              <span>·</span>
              <span>v4.1</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modal de Instalação e Baixar App no Celular / Coletor */}
      <ModalInstalacaoMobile
        isOpen={isModalInstalarOpen}
        onClose={() => setIsModalInstalarOpen(false)}
        deferredPrompt={deferredPrompt}
      />

    </div>
  );
}
