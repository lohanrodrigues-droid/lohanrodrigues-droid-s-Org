import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ModalInstalacaoMobileProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const ModalInstalacaoMobile: React.FC<ModalInstalacaoMobileProps> = ({
  isOpen,
  onClose,
  deferredPrompt
}) => {
  const [copiado, setCopiado] = useState(false);
  const [abaPlataforma, setAbaPlataforma] = useState<'android' | 'coletor' | 'ios' | 'pc'>('android');

  if (!isOpen) return null;

  // URL real do app
  const urlApp = window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://ais-pre-ud6qcxqet5uhc3d64v5xwc-342009849112.us-east1.run.app';

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(urlApp);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleAbrirNovaAba = () => {
    window.open(urlApp, '_blank');
  };

  const handleInstalarNativo = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        onClose();
      });
    } else {
      // Se estiver dentro de iframe ou navegador não suportar o evento
      alert('DICA IMPORTANTE:\n\n1. Primeiro abra o app fora da tela de edição (em uma nova aba ou no celular).\n2. No celular: toque no menu do Chrome (⋮) e em "Instalar aplicativo" ou "Adicionar à tela inicial".\n3. No iPhone: toque em Compartilhar e em "Adicionar à Tela de Início".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-4 my-6">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 uppercase font-mono">
                PWA · Aplicativo Instalável
              </span>
              <h3 className="font-extrabold text-blue-950 text-lg tracking-tight mt-0.5">
                Por que não baixou e como instalar?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Motivo de não ter baixado e solução rápida */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Por que deu erro ou não apareceu o download?</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Se você clicou em "Instalar" <strong>aqui dentro da tela de desenvolvimento do Google AI Studio</strong>, o seu navegador (Chrome/Edge) bloqueia a instalação porque a tela roda dentro de uma janela de teste (iframe).
          </p>
          <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleAbrirNovaAba}
              className="w-full sm:w-auto px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
              <span>1. Abrir App em Nova Aba no Navegador</span>
            </button>
            <span className="text-[10px] text-slate-500 font-medium">ou aponte a câmera do celular para o QR Code abaixo</span>
          </div>
        </div>

        {/* Bloco QR Code e Link Compartilhável */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs flex flex-col items-center flex-shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(urlApp)}`}
              alt="QR Code MT - WMS"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
            <span className="text-[9px] text-slate-500 font-mono mt-1 font-bold">
              Abra a câmera do celular
            </span>
          </div>

          <div className="flex-1 space-y-2 text-xs w-full">
            <span className="font-extrabold text-blue-950 block text-xs uppercase tracking-wider">
              Link de Acesso Oficial (Envie no WhatsApp da Equipe):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={urlApp}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-mono text-[11px] text-slate-800 select-all font-semibold"
              />
              <button
                onClick={handleCopiarLink}
                className="flex items-center gap-1.5 bg-[#051336] hover:bg-[#0c2463] text-white px-3 py-2 rounded-xl font-bold text-xs flex-shrink-0 transition-colors shadow-xs"
              >
                {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Qualquer operador com este link conseguirá acessar e instalar instantaneamente.
            </p>
          </div>
        </div>

        {/* Abas com Instruções Passo a Passo */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setAbaPlataforma('android')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                abaPlataforma === 'android' ? 'bg-[#051336] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Android (Chrome)
            </button>
            <button
              onClick={() => setAbaPlataforma('coletor')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                abaPlataforma === 'coletor' ? 'bg-[#051336] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coletor (Zebra)
            </button>
            <button
              onClick={() => setAbaPlataforma('ios')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                abaPlataforma === 'ios' ? 'bg-[#051336] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              iPhone (Safari)
            </button>
            <button
              onClick={() => setAbaPlataforma('pc')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                abaPlataforma === 'pc' ? 'bg-[#051336] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PC (Windows)
            </button>
          </div>

          {/* Android */}
          {abaPlataforma === 'android' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span className="text-slate-700">Abra o link no navegador <strong>Google Chrome</strong> do celular.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span className="text-slate-700">Toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span className="text-slate-700">Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">4</span>
                <span className="text-slate-700">O ícone <strong>MT - WMS</strong> será criado na sua gaveta de aplicativos.</span>
              </div>
            </div>
          )}

          {/* Coletor */}
          {abaPlataforma === 'coletor' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span className="text-slate-700">No coletor Zebra/Honeywell com Android, abra o Chrome.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span className="text-slate-700">Acesse o link do app e toque no menu <strong>(⋮) → "Adicionar à tela inicial"</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span className="text-slate-700">O operador usará o app em tela inteira sem precisar digitar URLs.</span>
              </div>
            </div>
          )}

          {/* iPhone */}
          {abaPlataforma === 'ios' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span className="text-slate-700">Abra o link no navegador <strong>Safari</strong> do iPhone.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span className="text-slate-700">Toque no botão de <strong>Compartilhar</strong> (quadrado com a seta para cima na barra inferior).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span className="text-slate-700">Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
              </div>
            </div>
          )}

          {/* PC Windows */}
          {abaPlataforma === 'pc' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span className="text-slate-700">No Google Chrome ou Edge no computador, abra o link em uma nova aba.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span className="text-slate-700">Na barra de endereço (ao lado da estrelinha de favoritos), clique no ícone de <strong>computador com setinha (Instalar MT - WMS)</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span className="text-slate-700">O app vira um programa da sua área de trabalho do Windows!</span>
              </div>
            </div>
          )}
        </div>

        {/* Botão Principal de Ação */}
        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAbrirNovaAba}
            className="flex-1 py-3 bg-[#051336] hover:bg-[#0c2463] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>Abrir App em Nova Aba</span>
          </button>

          <button
            onClick={handleInstalarNativo}
            className="flex-1 py-3 bg-gradient-to-r from-blue-900 to-sky-600 hover:from-blue-800 hover:to-sky-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Tentar Instalação Direta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
