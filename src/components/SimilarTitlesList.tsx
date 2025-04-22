import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimilarTitle from './SimilarTitle';
import {SimilarTitleType, UserRate} from "./SimilarTitlesSection.tsx";

type SimilarTitlesListProps = {
    similarTitles: (SimilarTitleType & { userRate: UserRate | null })[];
    onPress: (id: number, title: string) => void;
};

const SimilarTitlesList = ({ similarTitles, onPress }: SimilarTitlesListProps) => {
    if (similarTitles.length === 0) {
        return <Text style={styles.noTitles}>Нет похожих тайтлов</Text>;
    }

    return (
        <View style={styles.container}>
            {similarTitles.map((item) => (
                <SimilarTitle key={item.id} item={item} onPress={onPress} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
    noTitles: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default SimilarTitlesList;
