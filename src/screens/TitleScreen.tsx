import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useApi } from '../hooks/useApi';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import SimilarTitlesSection from '../components/SimilarTitlesSection';
import StatsSection from '../components/StatsSection';
import UserRateSection from '../components/UserRateSection';
import { cleanDescription } from '../utils/cleanDescription';

type RootStackParamList = {
    Title: { id: number; russian?: string };
};

const TitleScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { id } = route.params as { id: number };
    const { fetchWithAuth, fetchWithoutAuth } = useApi();
    const { accessToken, userId } = useContext(AuthContext);

    const [title, setTitle] = React.useState<any>(null);
    const [similarTitles, setSimilarTitles] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchWithOrWithoutAuth = accessToken ? fetchWithAuth : fetchWithoutAuth;
                const titleData = await fetchWithOrWithoutAuth(`https://shikimori.one/api/animes/${id}`);
                setTitle(titleData);
                const similarData = await fetchWithOrWithoutAuth(`https://shikimori.one/api/animes/${id}/similar`);
                setSimilarTitles(similarData);
                console.log(titleData)
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        fetchData();
    }, [id, accessToken]);

    const handlePressSimilarTitle = (newId: number, newTitle: string) => {
        navigation.push('Title', { id: newId, russian: newTitle });
    };

    const renderGenres = (genres: any[]) => {
        return (
            <View style={styles.genresContainer}>
                {genres.map((genre) => (
                    <Text key={genre.id} style={styles.genreText}>
                        {genre.russian || genre.name}
                    </Text>
                ))}
            </View>
        );
    };

    if (!title) {
        return <Text>Загрузка...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titleText}>
                {title?.russian || title?.name || 'Нет названия'}
            </Text>

            <View style={styles.imageAndStatsContainer}>
                {title?.image?.original && (
                    <Image
                        source={{ uri: `https://shikimori.one${title.image.original}` }}
                        style={styles.mainImage}
                    />
                )}

                <StatsSection
                    scoreStats={title?.rates_scores_stats || []}
                    ratesStatusesStats={title?.rates_statuses_stats || []}
                    maxScoreValue={Math.max(...(title?.rates_scores_stats || []).map((stat: any) => stat.value), 1)}
                    maxRatesValue={Math.max(...(title?.rates_statuses_stats || []).map((stat: any) => stat.value), 1)}
                />
            </View>

            <UserRateSection
                userRate={title?.user_rate}
                totalEpisodes={title?.episodes || 0}
                titleId = {title.id}
            />
            <View >
                <Text style={styles.sectionTitle}>Описание:</Text>
                <Text style={styles.descriptionText}>
                    {cleanDescription(title?.description)}
                </Text>
            </View>
            {title?.genres && (
                <View >
                    <Text style={styles.sectionTitle}>Жанры:</Text>
                    {renderGenres(title.genres)}
                </View>
            )}

            <Text style={styles.sectionTitle}>Похожие тайтлы:</Text>
            <SimilarTitlesSection
                similarTitles={similarTitles}
                onPress={handlePressSimilarTitle}
                userId={userId}
                accessToken={accessToken}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageAndStatsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainImage: {
        width: 200,
        height: 300,
        borderRadius: 8,
        marginRight: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genreText: {
        marginRight: 5,
        fontSize: 14,
        color: '#555',
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
    },
});

export default TitleScreen;
