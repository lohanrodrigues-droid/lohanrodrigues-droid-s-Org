import { StatusMeta } from '../types/wms';

const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

/**
 * Retorna o dia da semana a partir de uma data no formato YYYY-MM-DD
 */
export function getDiaSemana(dataStr: string): string {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  return DIAS_SEMANA[data.getDay()] || '';
}

/**
 * Retorna o número da semana do ano (1 a 53)
 */
export function getNumeroSemana(dataStr: string): number {
  if (!dataStr) return 1;
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
  const diasPassados = Math.floor((data.getTime() - primeiroDiaAno.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((diasPassados + primeiroDiaAno.getDay() + 1) / 7);
}

/**
 * Calcula a duração em minutos entre hora de início e hora de fim
 * Suporta virada de turno noturno (ex: 22:00 até 02:00)
 */
export function calcularTempoMinutos(horaInicio: string, horaFim: string): number {
  if (!horaInicio || !horaFim) return 0;

  const [hI, mI] = horaInicio.split(':').map(Number);
  const [hF, mF] = horaFim.split(':').map(Number);

  if (isNaN(hI) || isNaN(mI) || isNaN(hF) || isNaN(mF)) return 0;

  const minInicio = hI * 60 + mI;
  let minFim = hF * 60 + mF;

  // Se o fim for menor que o início, houve virada de dia/noite (+ 24 horas)
  if (minFim < minInicio) {
    minFim += 24 * 60;
  }

  return minFim - minInicio;
}

/**
 * Formata minutos em string HH:mm:ss
 */
export function formatarTempoMinutos(minutos: number): string {
  if (minutos <= 0) return '00:00:00';
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

/**
 * Calcula meta proporcional, itens por hora e status de meta
 */
export function avaliarProdutividade(itens: number, tempoMinutos: number, metaHora: number): {
  metaCalculada: number;
  itensPorHora: number;
  statusMeta: StatusMeta;
} {
  const horas = tempoMinutos / 60;
  const metaCalculada = Math.max(1, Math.round(metaHora * (horas > 0 ? horas : 1)));
  const itensPorHora = horas > 0 ? Math.round(itens / horas) : itens;

  let statusMeta: StatusMeta = 'Atingiu a Meta';

  if (horas <= 0) {
    statusMeta = itens >= metaHora ? 'Acima da Meta' : 'Abaixo da Meta';
  } else {
    const razao = itens / metaCalculada;
    if (razao >= 1.05) {
      statusMeta = 'Acima da Meta';
    } else if (razao >= 0.90) {
      statusMeta = 'Atingiu a Meta';
    } else {
      statusMeta = 'Abaixo da Meta';
    }
  }

  return {
    metaCalculada,
    itensPorHora,
    statusMeta
  };
}

/**
 * Data atual no formato YYYY-MM-DD
 */
export function getDataHojeISO(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Hora atual no formato HH:mm
 */
export function getHoraAtual(): string {
  const hoje = new Date();
  const h = String(hoje.getHours()).padStart(2, '0');
  const m = String(hoje.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Retorna timestamp formatado para o Brasil DD/MM/YYYY HH:mm:ss
 */
export function getCarimboFormatado(dataObj = new Date()): string {
  const d = String(dataObj.getDate()).padStart(2, '0');
  const m = String(dataObj.getMonth() + 1).padStart(2, '0');
  const y = dataObj.getFullYear();
  const h = String(dataObj.getHours()).padStart(2, '0');
  const min = String(dataObj.getMinutes()).padStart(2, '0');
  const sec = String(dataObj.getSeconds()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}:${sec}`;
}
