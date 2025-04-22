import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GenreListProps {
    genres: { id: number; name: string; russian: string }[];
    selectedGenres: string[];
    toggleGenre: (genreId: string) => void;
}

const shuffle = <T,>(array: T[]): T[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const distributeGenresByLength = (
    genres: { id: number; name: string; russian: string }[],
    parts: number
) => {
    const columns = Array.from({ length: parts }, () => ({ genres: [] as typeof genres, totalLength: 0 }));

    const sortedGenres = [...genres].sort((a, b) => {
        const lengthA = (a.russian || a.name).length;
        const lengthB = (b.russian || b.name).length;
        return lengthB - lengthA;
    });

    for (const genre of sortedGenres) {
        const genreLength = (genre.russian || genre.name).length;

        const minColumn = columns.reduce((min, column) =>
            column.totalLength < min.totalLength ? column : min
        );

        minColumn.genres.push(genre);
        minColumn.totalLength += genreLength;
    }

    return columns.map((column) => shuffle(column.genres));
};

export const GenreList = ({ genres, selectedGenres, toggleGenre }: GenreListProps) => {
    const excludedGenres = ['яой', 'юри', 'эротика', 'хентай'];

    const filteredGenres = useMemo(() => {
        return genres.filter(
            (genre) => !excludedGenres.includes(genre.russian?.toLowerCase())
        );
    }, [genres]);

    const [distributedGenres, setDistributedGenres] = useState<{
        firstRow: any[];
        secondRow: any[];
        thirdRow: any[];
    } | null>(null);

    useEffect(() => {
        const [firstRow, secondRow, thirdRow] = distributeGenresByLength(filteredGenres, 3);
        setDistributedGenres({ firstRow, secondRow, thirdRow });
    }, [filteredGenres]);

    if (!distributedGenres) {
        return null;
    }

    const { firstRow, secondRow, thirdRow } = distributedGenres;

    const sortGenres = (row: typeof firstRow): typeof firstRow => {
        const selected = row.filter((genre) => selectedGenres.includes(genre.id.toString()));
        const unselected = row.filter((genre) => !selectedGenres.includes(genre.id.toString()));
        return [...selected, ...unselected];
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreContainer}>
            <View style={styles.genreColumn}>
                {[firstRow, secondRow, thirdRow].map((row, index) => (
                    <View key={index} style={styles.genreRow}>
                        {sortGenres(row).map((genre) => (
                            <TouchableOpacity
                                key={genre.id}
                                onPress={() => toggleGenre(genre.id.toString())}
                                style={[
                                    styles.genreButton,
                                    selectedGenres.includes(genre.id.toString()) && styles.selectedGenreButton,
                                ]}
                            >
                                <Text style={styles.genreText}>{genre.russian || genre.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    genreContainer: {
        marginBottom: 16,
    },
    genreColumn: {
        flexDirection: 'column',
    },
    genreRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genreButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedGenreButton: {
        backgroundColor: '#c8b2ef',
    },
    genreText: {
        fontSize: 14,
        color: '#000',
    },
});
