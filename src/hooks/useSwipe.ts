"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Interaction } from '@/types';

export function useSwipe() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSwipe = async (
        userId: string,
        facultyId: string,
        status: 'shortlisted' | 'rejected',
        relevanceScore?: number
    ) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: sbError } = await supabase
                .from('interactions')
                .upsert(
                    {
                        user_id: userId,
                        faculty_id: facultyId,
                        status,
                        relevance_score: relevanceScore,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id,faculty_id' }
                )
                .select()
                .single();

            if (sbError) throw sbError;
            return data as Interaction;
        } catch (err: any) {
            console.error('Swipe error:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleSwipe, loading, error };
}
