export type TipoPainelChave = 'ocupacao' | 'rotinas' | 'comparativo' | 'divergencias';

export interface MetaPainelLink {
  id: TipoPainelChave;
  abaId: string;
  titulo: string;
  subtitulo: string;
  slug: string;
}

export const PAINEIS_METADATA: Record<TipoPainelChave, MetaPainelLink> = {
  ocupacao: {
    id: 'ocupacao',
    abaId: 'ocupacao_cd',
    titulo: 'Ocupação do CD Trevo',
    subtitulo: 'Posições ocupadas, vagas e bloqueadas por rua com mapa de calor',
    slug: 'ocupacao'
  },
  rotinas: {
    id: 'rotinas',
    abaId: 'painel',
    titulo: 'WMS Rotinas / Execução',
    subtitulo: 'Rotinas planejadas versus executadas por turno e produtividade',
    slug: 'rotinas'
  },
  comparativo: {
    id: 'comparativo',
    abaId: 'comparativo_estoque',
    titulo: 'Comparativo de Estoque',
    subtitulo: 'WMS × ERP Consinco × Inventário Físico por SKU e endereço',
    slug: 'comparativo'
  },
  divergencias: {
    id: 'divergencias',
    abaId: 'divergencias_produtos',
    titulo: 'Divergências de Produtos',
    subtitulo: 'Peso, quantidade, endereço e validade com aging e workflow',
    slug: 'divergencias'
  }
};

/**
 * Gera a URL própria de cada painel para abertura em nova aba ou compartilhamento
 */
export function getUrlPainel(tipo: TipoPainelChave, standalone: boolean = true): string {
  if (typeof window === 'undefined') return `?painel=${tipo}${standalone ? '&standalone=1' : ''}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?painel=${tipo}${standalone ? '&standalone=1' : ''}`;
}

/**
 * Converte parâmetro de URL no ID da aba correspondente
 */
export function parsePainelParam(param: string | null): { abaId: string; tipo: TipoPainelChave } | null {
  if (!param) return null;
  const p = param.toLowerCase().trim();

  if (p === 'ocupacao' || p === 'ocupacao_cd' || p === 'capacidade') {
    return { abaId: 'ocupacao_cd', tipo: 'ocupacao' };
  }
  if (p === 'rotinas' || p === 'wms_rotinas' || p === 'painel' || p === 'execucao') {
    return { abaId: 'painel', tipo: 'rotinas' };
  }
  if (p === 'comparativo' || p === 'comparativo_estoque' || p === 'consinco') {
    return { abaId: 'comparativo_estoque', tipo: 'comparativo' };
  }
  if (p === 'divergencias' || p === 'divergencia' || p === 'divergencias_produtos' || p === 'anomalias') {
    return { abaId: 'divergencias_produtos', tipo: 'divergencias' };
  }
  return null;
}
