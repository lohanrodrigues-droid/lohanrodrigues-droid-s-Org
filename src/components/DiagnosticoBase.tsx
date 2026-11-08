import React from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Smartphone,
  Monitor,
  Zap,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const DiagnosticoBase: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Banner Principal de Diagnóstico */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-blue-950 tracking-tight">
              Diagnóstico da Base de Dados WMS (CD MT Trevo - Perlog)
            </h1>
            <p className="text-xs text-slate-500">
              Análise técnica da planilha do Google Forms original e das melhorias implementadas na nova aplicação.
            </p>
          </div>
        </div>
      </div>

      {/* Amostra da Linha Original do Usuário */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-2 font-mono">
          Amostra da Base Original enviada pelo cliente (WMS_CD_MT_TREVO_1a2ada5c):
        </span>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto">
          <code>
            Carimbo de data/hora, Nome Completo, Equipe, Setor, Atividades Realizadas, Itens, Rua (Check), Observação, Hora Inicio, Hora FIm, Data, Dia da Semana, Semana, Column 20, Ano, Column 21, Column 22, Column 23, Column 24, Column 25, Column 26, Tempo, META, STATUS META, Column 26, tese
            <br />
            ,,,,,,,,,,,,52,,1899,,,,,,,00:00:00,,Acima da Meta,0,0
          </code>
        </div>
      </div>

      {/* Grid de Problemas vs Soluções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* Card 1: Erro do Ano 1899 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>1. Diagnóstico do "Ano 1899" na Planilha</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            No Google Sheets antigo, quando o operador preenchia apenas o horário no Forms (ex: "08:00" e "09:00"), a fórmula de subtração gerava uma data serial zero do sistema operacional da planilha, exibindo <strong>"1899"</strong> na coluna de Ano.
          </p>
          <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolvido: O novo sistema calcula em minutos reais e registra o ano e semana com precisão.</span>
          </div>
        </div>

        {/* Card 2: Colunas Auxiliares Fantasmas */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>2. Colunas "Column 20 a 26" e "tese"</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            As colunas Column 20 a 26 e a coluna "tese" eram fórmulas de apoio que quebravam quando novos colaboradores ou novas atividades eram lançados, poluindo o relatório do Looker Studio.
          </p>
          <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolvido: Todas as metas e cálculos foram incorporados no código do sistema sem poluir a base.</span>
          </div>
        </div>

        {/* Card 3: Despacho do Analista vs Retorno Mobile */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <Zap className="w-4 h-4" />
            <span>3. Novo Fluxo: Analista Despacha & Equipe Dá Retorno</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            O Google Forms dependia de digitação manual tardia. Agora, o <strong>Analista lança a demanda pelo computador</strong> e os <strong>Auxiliares e Assistentes recebem no celular</strong> para dar início e retorno com 1 toque.
          </p>
          <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolvido: Contabilização exata de Tempo Médio de Retorno (SLA da demanda).</span>
          </div>
        </div>

        {/* Card 4: Quem Fez Mais (Ranking por Cargo) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-sky-800 font-bold">
            <Zap className="w-4 h-4" />
            <span>4. Gráfico Looker Studio: "Quem Fez Mais"</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            O painel agora separa de forma nítida os <strong>Auxiliares de Logística</strong> dos <strong>Assistentes de Operações</strong>, gerando rankings de volume de itens e velocidade de atendimento.
          </p>
          <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolvido: Indicador claro de produtividade, TMR e medalhas para reconhecimento da equipe.</span>
          </div>
        </div>

      </div>

      {/* Seções Comerciais */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-xs">
        <h3 className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-700" />
          Seções Comerciais Incorporadas na Operação do CD MT Trevo
        </h3>
        <p className="text-slate-500">
          A matriz enviada pelo cliente foi 100% incorporada, permitindo acompanhar as rotinas de segunda a sábado em cada seção do centro de distribuição:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
          {[
            { nome: 'Líquida', desc: 'Bebidas e fluidos' },
            { nome: 'Alimentar', desc: 'Mercearia e secos' },
            { nome: 'Bazar', desc: 'Utilidades e eletrônicos' },
            { nome: 'Limpeza', desc: 'Higiene e químicos' },
            { nome: 'Perfumaria', desc: 'Cosméticos e beleza' },
            { nome: 'Insumo', desc: 'Caixas, filmes e paletes' }
          ].map(s => (
            <div key={s.nome} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center hover:border-blue-300 transition-colors">
              <span className="font-bold text-blue-950 text-xs block capitalize">{s.nome}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
