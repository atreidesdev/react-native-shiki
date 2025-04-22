import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import SimilarTitlesList from './SimilarTitlesList';

export type SimilarTitleType = {
    id: number;
    russian?: string;
    name: string;
    score?: number;
    aired_on: string | null;
    kind: string;
    image: {
        original: string;
    };
    episodes?: number;
};

export type UserRate = {
    target_id: number;
    status: string;
    episodes: number;
    score: number;
};

type Props = {
    similarTitles: SimilarTitleType[];
    onPress: (id: number, title: string) => void;
    userId: number | null;
    accessToken: string | null;
};

const SimilarTitlesSection = ({ similarTitles, onPress, userId, accessToken }: Props) => {
    const { fetchWithAuth } = useApi();
    const [userRates, setUserRates] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserRates = async () => {
            if (!userId || !accessToken || similarTitles.length === 0) return;

            try {
                const titleIds = similarTitles.map((item) => item.id);
                const url = `https://shikimori.one/api/v2/user_rates`;
                const params = {
                    user_id: userId.toString(),
                    target_type: 'Anime',
                };

                const data: UserRate[] = await fetchWithAuth(url, { params });

                const filteredUserRates = data.filter((rate) => titleIds.includes(rate.target_id));

                const updatedUserRates = similarTitles.map((title) => {
                    const userRate = filteredUserRates.find((rate) => rate.target_id === title.id);
                    return { ...title, userRate: userRate || null };
                });

                setUserRates(updatedUserRates);
            } catch (error) {
                console.error('Ошибка при получении user_rates:', error);
            }
        };

        fetchUserRates();
    }, [userId, similarTitles, accessToken]);

    return <SimilarTitlesList similarTitles={userRates} onPress={onPress} />;
};

export default SimilarTitlesSection;
