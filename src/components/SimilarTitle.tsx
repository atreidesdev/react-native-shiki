import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { translateKindToRussian } from "../utils/translateKindToRussian";
import { formatReleaseDate } from "../utils/formatReleaseDate";
import { translateStatusToRussian } from "../utils/translateStatusToRussian";
import {SimilarTitleType, UserRate} from "./SimilarTitlesSection.tsx";

type SimilarTitleProps = {
    item: SimilarTitleType & { userRate: UserRate | null };
    onPress: (id: number, title: string) => void;
};

const SimilarTitle = ({ item, onPress }: SimilarTitleProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'watching':
                return '#d0e4f5';
            case 'completed':
                return '#d2f1d4';
            case 'on_hold':
                return '#faecd6';
            case 'dropped':
                return '#f8dee2';
            case 'planned':
                return '#e4daf3';
            default:
                return '#fff';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'watching':
                return 'play-circle-outline';
            case 'completed':
                return 'check-circle-outline';
            case 'on_hold':
                return 'pause-circle-outline';
            case 'dropped':
                return 'cancel';
            case 'planned':
                return 'calendar-month';
            default:
                return 'help-outline';
        }
    };

    const userRate = item.userRate;

    return (
        <TouchableOpacity
            onPress={() => onPress(item.id, item.russian || item.name)}
            style={[styles.card, userRate && { backgroundColor: getStatusColor(userRate.status) }]}
        >
            {userRate && (
                <View style={styles.statusIconContainer}>
                    <Icon
                        name={getStatusIcon(userRate.status)}
                        size={20}
                        color="#000"
                    />
                </View>
            )}

            <View style={styles.cardContent}>
                {item.image?.original && (
                    <Image
                        source={{ uri: `https://shikimori.one${item.image.original}` }}
                        style={styles.image}
                    />
                )}
                <View style={styles.details}>
                    <Text numberOfLines={1} style={styles.title}>
                        {item.russian || item.name}
                    </Text>
                    <Text style={styles.info}>Рейтинг: {item.score || 'Неизвестно'}</Text>
                    <Text style={styles.info}>Сезон выхода: {formatReleaseDate(item.aired_on)}</Text>
                    <Text style={styles.info}>Тип: {translateKindToRussian(item.kind)}</Text>
                    {['tv', 'ova', 'ona'].includes(item.kind) && (
                        <Text style={styles.info}>Серий: {item.episodes || 'Неизвестно'}</Text>
                    )}
                    {userRate ? (
                        <>
                            <Text style={styles.info}>
                                Статус: {translateStatusToRussian(userRate.status)}
                            </Text>
                            {item.kind !== 'movie' && (
                                <Text style={styles.info}>
                                    Просмотрено серий: {userRate.episodes || '0'}
                                </Text>
                            )}
                            <Text style={styles.info}>
                                Оценка: {userRate.score || 'Не указана'}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.info}>Не добавлен</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
        backgroundColor: 'white',
        position: 'relative',
    },
    statusIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 90,
        height: 135,
        borderRadius: 4,
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 11,
        marginBottom: 3,
    },
});

export default SimilarTitle;
