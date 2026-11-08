/**
 * Types for WMS CD MT TREVO (Perlog Logística - Grupo Pereira)
 * Sistema de Lançamento e Gestão de Atividades Operacionais:
 * - Despacho pelo Analista (Desktop)
 * - Retorno e Execução por Auxiliares e Assistentes (Mobile-First)
 * - Métricas de Tempo Médio de Retorno e Ranking "Quem fez mais"
 * - Compatibilidade com a base Google Forms / Looker Studio
 */

export type CargoColaborador = 'Auxiliar' | 'Assistente' | 'Analista' | 'Líder';
export type StatusAtividade = 'Pendente' | 'Em Andamento' | 'Concluído';
export type StatusMeta = 'Acima da Meta' | 'Atingiu a Meta' | 'Abaixo da Meta';

export interface AtividadeOperacional {
  id: string;
  // Campos originais da base Google Forms / Sheets
  carimboDataHora: string; // Data/Hora do retorno ou criação
  nomeCompleto: string; // Auxiliar ou Assistente responsável
  cargo: CargoColaborador; // 'Auxiliar' ou 'Assistente'
  equipe: string; // Ex: Equipe A (Manhã), Equipe B (Tarde), etc.
  setor: string; // Recebimento, Armazenagem, Separação, Conferência, etc.
  secao?: string; // Líquida, Alimentar, Bazar, Limpeza, Perfumaria, Insumo
  atividade: string; // Separação, Conferência de Carga, Guardar, etc.
  itens: number; // Quantidade realizada
  itensPrevistos?: number; // Quantidade despachada pelo analista
  rua: string; // Rua / Check (ex: Rua 04, Rua 12)
  observacao?: string; // Ocorrências, avarias, etc.
  horaInicio: string; // HH:mm
  horaFim: string; // HH:mm (hora do retorno)
  data: string; // YYYY-MM-DD
  diaSemana: string; // Segunda-feira, etc.
  semana: number; // 1 a 53
  ano: number; // 2026
  tempoFormatado: string; // HH:mm:ss (tempo de execução)
  tempoExecucaoMinutos: number; // Duração da execução
  metaCalculada: number;
  statusMeta: StatusMeta;
  itensPorHora: number;

  // Campos específicos do fluxo Analista -> Equipe -> Retorno
  status: StatusAtividade;
  analistaCriador: string; // Nome do analista que despachou
  horaDespacho: string; // HH:mm ou ISO quando o analista lançou
  horaRetorno?: string; // HH:mm quando o auxiliar/assistente retornou
  tempoRetornoMinutos: number; // Tempo total entre despacho do analista e retorno final
  tempoRetornoFormatado: string; // HH:mm:ss
  prioridade?: 'Normal' | 'Urgente' | 'Alta';
}

export interface Colaborador {
  id: string;
  nome: string;
  cargo: CargoColaborador;
  equipe: string;
  setorPadrao: string;
  ativo: boolean;
  avatarUrl?: string;
}

export interface MetaAtividade {
  id: string;
  atividade: string;
  setor: string;
  itensPorHora: number;
  unidade: 'itens' | 'caixas' | 'paletes' | 'volumes';
  descricao: string;
}

export interface FiltrosWMS {
  busca: string;
  cargo: string;
  equipe: string;
  setor: string;
  status: string;
  statusMeta: string;
  dataInicio: string;
  dataFim: string;
  rua: string;
}

export type PerfilAcesso = 'analista' | 'mobile_equipe';
