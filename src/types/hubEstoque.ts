export type TipoPosicao = 'Picking Fracionado' | 'Pulmão Aéreo' | 'Mezanino';
export type StatusPosicao = 'Ocupada' | 'Vaga' | 'Bloqueada';
export type SecaoComercial = 'Líquida' | 'Alimentar' | 'Bazar' | 'Limpeza' | 'Perfumaria' | 'Insumo';

export interface ResumoRuaOcupacao {
  rua: string;
  secao: SecaoComercial;
  totalPosicoes: number;
  ocupadas: number;
  vagas: number;
  bloqueadas: number;
  percentualOcupacao: number;
  tipoPredominante: TipoPosicao;
  alertaGargalo: boolean; // > 90%
}

export interface ItemComparativoEstoque {
  id: string;
  sku: string;
  descricao: string;
  secao: SecaoComercial;
  rua: string;
  endereco: string;
  estoqueWms: number;
  estoqueConsinco: number; // ERP Consinco
  estoqueFisico: number; // Contagem física
  divergenciaUn: number; // Físico - WMS
  valorUnitario: number;
  impactoFinanceiro: number;
  status: 'Acurado' | 'Divergência Negativa' | 'Divergência Positiva';
  dataUltimaContagem: string;
  responsavelContagem: string;
}

export type TipoDivergencia = 'Peso' | 'Quantidade' | 'Endereço' | 'Validade / Shelf Life';
export type StatusDivergencia = 'Aberta' | 'Em Validação' | 'Resolvida';

export interface HistoricoDivergencia {
  data: string;
  usuario: string;
  acao: string;
  observacao?: string;
}

export interface DivergenciaProduto {
  id: string;
  sku: string;
  descricao: string;
  secao: SecaoComercial;
  tipo: TipoDivergencia;
  endereco: string;
  rua: string;
  valorEsperado: string;
  valorIdentificado: string;
  diferenca: string;
  dataAbertura: string;
  tempoAbertoHoras: number;
  agingFaixa: '< 24h' | '24h - 48h' | '> 48h' | '> 90 dias';
  responsavelAbertura: string;
  responsavelTratativa?: string;
  status: StatusDivergencia;
  historico: HistoricoDivergencia[];
}

export interface MetricasOcupacaoGeral {
  totalPosicoes: number;
  posicoesOcupadas: number;
  posicoesVagas: number;
  posicoesBloqueadas: number;
  taxaOcupacaoGeral: number;
  pickingOcupacao: number;
  pulmaoOcupacao: number;
  mezaninoOcupacao: number;
  ruasCriticas: number; // >90%
}
