import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useApi } from '../hooks/useApi';
import { UserListScreenRouteProp } from '../AppNavigator.tsx';
import { AuthContext } from '../context/AuthContext.tsx';
import {SearchBar} from "../components/SearchBar.tsx";
import {ListItem} from "../components/ListItem.tsx";

export type Title = {
    id: number;
    name: string;
    russian: string;
    imageUrl: string;
    score: number;
    status: string;
    episodes: number;
    watchedEpisodes: number;
    rateId?: number;
};

type UserListScreenProps = {
    route: UserListScreenRouteProp;
};

const UserListScreen = ({ route }: UserListScreenProps) => {
    const { userId } = useContext(AuthContext);
    const { listStatus, listName } = route.params;
    const [titles, setTitles] = useState<Title[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { fetchWithAuth } = useApi();

    useEffect(() => {
        const fetchListTitles = async () => {
            try {
                setLoading(true);
                const userRates: any[] = await fetchWithAuth<any[]>(
                    `https://shikimori.one/api/users/${userId}/anime_rates`,
                    {
                        params: {
                            status: listName,
                            limit: 5000,
                        },
                    }
                );
                console.log(userRates);
                const formattedTitles = userRates.map((rate) => ({
                    id: rate.anime.id,
                    name: rate.anime.name,
                    russian: rate.anime.russian,
                    imageUrl: `https://shikimori.one${rate.anime.image.preview}`,
                    score: rate.score,
                    status: rate.status,
                    episodes: rate.anime.episodes,
                    watchedEpisodes: rate.episodes,
                    rateId: rate.id
                }));
                setTitles(formattedTitles);
                setError(null);
            } catch (err) {
                console.error('Ошибка при загрузке тайтлов списка:', err);
                setError('Не удалось загрузить тайтлы.');
            } finally {
                setLoading(false);
            }
        };
        fetchListTitles();
    }, [listStatus]);

    const filteredTitles = titles.filter((title) =>
        title.russian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        title.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            <ScrollView style={styles.scrollView}>
                {filteredTitles.length > 0 ? (
                    filteredTitles.map((item) => (
                        <ListItem key={item.id} item={item} />
                    ))
                ) : (
                    <Text style={styles.noResultsText}>Нет результатов</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'white',
        marginTop: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
    },
});

export default UserListScreen;
