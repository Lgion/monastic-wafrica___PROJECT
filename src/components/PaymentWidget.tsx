'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Phone, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { PaymentProvider } from '@/lib/payment/types';

interface PaymentWidgetProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export default function PaymentWidget({ amount, orderId, onSuccess, onCancel }: PaymentWidgetProps) {
  const [step, setStep] = useState<'provider' | 'phone' | 'otp' | 'processing' | 'success' | 'error'>('provider');
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(val);
  };

  const handleProviderSelect = (p: PaymentProvider) => {
    setProvider(p);
    if (p === 'WAVE') {
      setStep('processing');
      initiatePayment(p, '');
    } else {
      setStep('phone');
    }
  };

  const initiatePayment = async (p: PaymentProvider, phone: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, phoneNumber: phone, provider: p, orderId }),
      });
      const data = await res.json();

      if (data.success) {
        setTransactionId(data.transactionId);
        if (data.requiresOtp) {
          setStep('otp');
        } else if (data.paymentUrl) {
          // Simulate redirection and status check
          window.open(data.paymentUrl, '_blank');
          checkStatusInterval(data.transactionId, p);
        } else {
          setStep('success');
          onSuccess(data.transactionId);
        }
      } else {
        setError(data.message || "Une erreur est survenue lors de l'initialisation.");
        setStep('error');
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async () => {
    if (!otp || otp.length < 4) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, otp, provider }),
      });
      const data = await res.json();

      if (data.success) {
        setStep('success');
        onSuccess(transactionId!);
      } else {
        setError("Code OTP invalide. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Erreur de validation.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatusInterval = (id: string, p: PaymentProvider) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?transactionId=${id}&provider=${p}`);
        const data = await res.json();
        if (data.status === 'SUCCESS') {
          clearInterval(interval);
          setStep('success');
          onSuccess(id);
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }, 3000);

    // Safety timeout after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (step === 'processing') setStep('error');
    }, 120000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Paiement Mobile</h3>
          <p className="text-sm text-slate-500">Montant : <span className="font-semibold text-emerald-600">{formatAmount(amount)}</span></p>
        </div>
        <div className="p-2 bg-emerald-50 rounded-full">
          <CreditCard className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {step === 'provider' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">Choisissez votre moyen de paiement :</p>
          <button
            onClick={() => handleProviderSelect('ORANGE_MONEY')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">OM</div>
              <span className="font-semibold text-slate-800">Orange Money</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
          </button>

          <button
            onClick={() => handleProviderSelect('MTN_MONEY')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-bold">MTN</div>
              <span className="font-semibold text-slate-800">MTN Mobile Money</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-yellow-500 transition-colors" />
          </button>

          <button
            onClick={() => handleProviderSelect('WAVE')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">WV</div>
              <span className="font-semibold text-slate-800">Wave</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500 transition-colors" />
          </button>

          <button onClick={onCancel} className="w-full text-center text-slate-400 text-sm hover:text-slate-600 py-2">
            Annuler
          </button>
        </div>
      )}

      {step === 'phone' && (
        <div className="space-y-5">
          <div className="relative">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Numéro de téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                placeholder="07 00 00 00 00"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-lg"
              />
            </div>
          </div>
          <button
            onClick={() => initiatePayment(provider!, phoneNumber)}
            disabled={loading || phoneNumber.length < 8}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Payer maintenant"}
          </button>
          <button onClick={() => setStep('provider')} className="w-full text-center text-slate-500 text-sm hover:underline">
            Changer de méthode
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-5 text-center">
          <div className="p-4 bg-orange-50 rounded-xl mb-4">
            <p className="text-sm text-orange-800 font-medium">
              Veuillez saisir le code OTP envoyé par {provider === 'ORANGE_MONEY' ? 'Orange Money' : 'MTN'}.
              <br /><span className="text-xs font-normal opacity-75">(Pour le test, entrez 1234)</span>
            </p>
          </div>
          <input
            type="text"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-32 mx-auto text-center text-3xl font-bold tracking-[0.5em] py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="0000"
          />
          <button
            onClick={validateOtp}
            disabled={loading || otp.length < 4}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmer le code"}
          </button>
          <button onClick={() => setStep('phone')} className="text-slate-500 text-sm hover:underline">
            Retour
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
            <div className="w-20 h-20 border-t-4 border-emerald-600 rounded-full absolute top-0 animate-spin"></div>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-800">Traitement en cours...</h4>
            <p className="text-sm text-slate-500 max-w-[200px]">Ne fermez pas cette fenêtre, nous vérifions votre paiement.</p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-xl text-slate-800">Paiement Réussi !</h4>
            <p className="text-sm text-slate-500">Votre commande a été validée avec succès.</p>
          </div>
          <button
            onClick={() => window.location.href = '/compte/commandes'}
            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all"
          >
            Voir ma commande
          </button>
        </div>
      )}

      {step === 'error' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-xl text-slate-800">Oups, une erreur !</h4>
            <p className="text-sm text-slate-500 px-4">{error || "Le paiement n'a pas pu être finalisé."}</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => setStep('provider')}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
            >
              Réessayer
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-all"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
