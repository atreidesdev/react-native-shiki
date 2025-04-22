import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface AnimeListProps {
    results: any[];
}

export const AnimeList = ({ results }: AnimeListProps) => {
    const navigation = useNavigation();

    const handlePress = (id: number, title: string) => {
        // @ts-ignore
        navigation.navigate("Title", { id, russian: title } );
    };

    return (
        <View>
            {results.length > 0 ? (
                results.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => handlePress(item.id, item.russian)}>
                        <View style={styles.itemContainer}>
                            <View style={styles.posterColumn}>
                                {item.poster?.originalUrl && (
                                    <Image source={{ uri: item.poster.originalUrl }} style={styles.poster} />
                                )}
                            </View>

                            <View style={styles.infoColumn}>
                                <Text style={styles.title}>{item.russian || item.name || 'Нет названия'}</Text>
                                <Text style={styles.rating}>Рейтинг: {item.score || 'Нет данных'}</Text>
                                {item.genres && item.genres.length > 0 ? (
                                    <Text style={styles.genres}>
                                        {item.genres
                                            .map((genre: any) => genre.russian || genre)
                                            .join(', ')}
                                    </Text>
                                ) : (
                                    <Text style={styles.noGenres}>Жанры: Нет данных</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noResults}>Ничего не найдено</Text>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    posterColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 8,
    },
    infoColumn: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        color: '#666',
    },
    genresColumn: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 8,
    },
    genres: {
        fontSize: 14,
        color: '#333',
    },
    noGenres: {
        fontSize: 14,
        color: '#999',
    },
    noResults: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
    },
});
