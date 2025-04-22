import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Stat = {
    name: string;
    value: number;
};

type Props = {
    scoreStats?: Stat[];
    ratesStatusesStats?: Stat[];
    maxScoreValue: number;
    maxRatesValue: number;
    scaleFactor?: number;
    displayMode?: 'lists' | 'scores' | 'all';
};

const StatRow = ({
                     stat,
                     maxValue,
                     scaleFactor = 1,
                 }: {
    stat: Stat;
    maxValue: number;
    scaleFactor?: number;
}) => {
    const MAX_BAR_WIDTH = 40 * scaleFactor;

    return (
        <View style={styles.row}>
            <Text
                style={[
                    styles.label,
                    { width: 80 * scaleFactor, fontSize: 10 * scaleFactor },
                ]}
            >
                {stat.name}
            </Text>
            <View
                style={[
                    styles.bar,
                    {
                        height: 8 * scaleFactor,
                        width: (stat.value / maxValue) * MAX_BAR_WIDTH,
                        borderRadius: 5 * scaleFactor,
                        marginRight: 5 * scaleFactor,
                    },
                ]}
            />
            <Text style={[styles.value, { fontSize: 10 * scaleFactor }]}>
                {stat.value}
            </Text>
        </View>
    );
};

const StatsSection = ({
                          scoreStats,
                          ratesStatusesStats,
                          maxScoreValue,
                          maxRatesValue,
                          scaleFactor = 1,
                          displayMode = 'all',
                      }: Props) => {
    return (
        <View style={styles.statsContainer}>
            {(displayMode === 'lists' || displayMode === 'all') && (
                <View style={[styles.section, { marginBottom: 10 * scaleFactor }]}>
                    <Text style={[styles.title, { fontSize: 11 * scaleFactor }]}>Списки:</Text>
                    {ratesStatusesStats &&
                        ratesStatusesStats.map((stat) => (
                            <StatRow
                                key={stat.name}
                                stat={stat}
                                maxValue={maxRatesValue}
                                scaleFactor={scaleFactor}
                            />
                        ))}
                </View>
            )}

            {(displayMode === 'scores' || displayMode === 'all') && (
                <View style={[styles.section, { marginBottom: 10 * scaleFactor }]}>
                    <Text style={[styles.title, { fontSize: 11 * scaleFactor }]}>Оценки:</Text>
                    {scoreStats &&
                        scoreStats.map((stat) => (
                            <StatRow
                                key={stat.name}
                                stat={stat}
                                maxValue={maxScoreValue}
                                scaleFactor={scaleFactor}
                            />
                        ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {},
    section: {
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    label: {
        color: '#333',
    },
    bar: {
        backgroundColor: '#c8b2ef',
    },
    value: {},
});

export default StatsSection;
