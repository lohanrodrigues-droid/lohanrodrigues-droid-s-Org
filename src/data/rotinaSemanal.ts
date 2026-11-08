export interface TarefaMatrizRotina {
  seq: number;
  diaSemana: string;
  atividade: string;
  secao: 'Líquida' | 'Alimentar' | 'Bazar' | 'Limpeza' | 'Perfumaria' | 'Insumo';
  setorGeral: string;
  cargoSugerido: 'Auxiliar' | 'Assistente';
  metaPadrao: number;
  unidade: string;
}

export const SECOES_CD_MT: Array<'Líquida' | 'Alimentar' | 'Bazar' | 'Limpeza' | 'Perfumaria' | 'Insumo'> = [
  'Líquida',
  'Alimentar',
  'Bazar',
  'Limpeza',
  'Perfumaria',
  'Insumo'
];

export const MATRIZ_ROTINA_SEMANAL: TarefaMatrizRotina[] = [
  // SEGUNDA-FEIRA
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'posições' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'posições' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 40, unidade: 'posições' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Normas por Seção', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 30, unidade: 'posições' },

  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 80, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 90, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 75, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 65, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Pulmão Vazio', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'endereços' },

  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 55, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'endereços' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 40, unidade: 'endereços' },

  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Líquida', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 80, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Alimentar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 100, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Bazar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Limpeza', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Perfumaria', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 65, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Validade In Loco', secao: 'Insumo', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'itens' },

  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 35, unidade: 'itens' },

  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Líquida', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 120, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Alimentar', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 150, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Bazar', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 90, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Limpeza', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 100, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Perfumaria', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 85, unidade: 'itens' },
  { seq: 1, diaSemana: 'Segunda-Feira', atividade: 'Inventario Rotativo', secao: 'Insumo', setorGeral: 'Inventário', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'itens' },

  // TERÇA-FEIRA
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Negativo', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 35, unidade: 'itens' },

  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 55, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 40, unidade: 'endereços' },

  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Líquida', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 80, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Alimentar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 100, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Bazar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Limpeza', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Perfumaria', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 65, unidade: 'itens' },
  { seq: 2, diaSemana: 'Terça-Feira', atividade: 'Check de Validade In Loco', secao: 'Insumo', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'itens' },

  // QUARTA-FEIRA
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 80, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 65, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 55, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'endereços' },

  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'posições' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'posições' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 40, unidade: 'posições' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check de Normas por Seção', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 30, unidade: 'posições' },

  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 75, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 90, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Reservado', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'endereços' },

  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 75, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 90, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'endereços' },
  { seq: 3, diaSemana: 'Quarta-Feira', atividade: 'Check Pulmão Bloqueado', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'endereços' },

  // QUINTA-FEIRA
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 55, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking C/Saldo Sem estoque', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 40, unidade: 'endereços' },

  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Líquida', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 80, unidade: 'itens' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Alimentar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 100, unidade: 'itens' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Bazar', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'itens' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Limpeza', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 70, unidade: 'itens' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Perfumaria', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 65, unidade: 'itens' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Validade In Loco', secao: 'Insumo', setorGeral: 'Qualidade/Estoque', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'itens' },

  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 80, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 60, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 65, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 55, unidade: 'endereços' },
  { seq: 4, diaSemana: 'Quinta-Feira', atividade: 'Check de Picking Inativos (Disponibilizar)', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Auxiliar', metaPadrao: 45, unidade: 'endereços' },

  // SEXTA-FEIRA
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 60, unidade: 'posições' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'posições' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 45, unidade: 'posições' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 40, unidade: 'posições' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Check de Normas por Seção', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Assistente', metaPadrao: 30, unidade: 'posições' },

  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Líquida', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 40, unidade: 'endereços' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Alimentar', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 50, unidade: 'endereços' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Bazar', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 35, unidade: 'endereços' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Limpeza', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 40, unidade: 'endereços' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Perfumaria', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 35, unidade: 'endereços' },
  { seq: 5, diaSemana: 'Sexta-Feira', atividade: 'Ajuste Picking (Curva ABC)', secao: 'Insumo', setorGeral: 'Separação', cargoSugerido: 'Assistente', metaPadrao: 25, unidade: 'endereços' },

  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 100, unidade: 'etiquetas' },
  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Alimentar', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 120, unidade: 'etiquetas' },
  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Bazar', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 90, unidade: 'etiquetas' },
  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Limpeza', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 95, unidade: 'etiquetas' },
  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Perfumaria', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 80, unidade: 'etiquetas' },
  { seq: 6, diaSemana: 'Sexta-Feira', atividade: 'Check de Etiqueta de Longarinas', secao: 'Insumo', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 70, unidade: 'etiquetas' },

  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Líquida', setorGeral: 'Armazenagem', cargoSugerido: 'Auxiliar', metaPadrao: 80, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Alimentar', setorGeral: 'Auxiliar', cargoSugerido: 'Auxiliar', metaPadrao: 90, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Bazar', setorGeral: 'Auxiliar', cargoSugerido: 'Auxiliar', metaPadrao: 75, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Limpeza', setorGeral: 'Auxiliar', cargoSugerido: 'Auxiliar', metaPadrao: 75, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Perfumaria', setorGeral: 'Auxiliar', cargoSugerido: 'Auxiliar', metaPadrao: 65, unidade: 'endereços' },
  { seq: 2, diaSemana: 'Sexta-Feira', atividade: 'Check de Pulmão Disponível', secao: 'Insumo', setorGeral: 'Auxiliar', cargoSugerido: 'Auxiliar', metaPadrao: 50, unidade: 'endereços' },
];

export function getMatrizPorDia(diaSemanaNome: string): TarefaMatrizRotina[] {
  const norm = diaSemanaNome.toLowerCase().replace('-feira', '');
  return MATRIZ_ROTINA_SEMANAL.filter(t => t.diaSemana.toLowerCase().includes(norm));
}

export function getMatrizPorSecao(secao: string): TarefaMatrizRotina[] {
  return MATRIZ_ROTINA_SEMANAL.filter(t => t.secao === secao);
}

export function getDiaSemanaAtualNome(): string {
  const dias = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  const hoje = new Date().getDay();
  return dias[hoje] || 'Segunda-Feira';
}
