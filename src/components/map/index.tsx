'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export const MonasteryLocationPicker = dynamic(() => import('./MonasteryLocationPicker'), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Chargement de la carte...</div>
});

export const MonasteryMap = dynamic(() => import('./MonasteryMap'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400">Chargement de la carte...</div>
});
