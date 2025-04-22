import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthScreen from "./AuthScreen.tsx";
import StatsSection from "../components/StatsSection.tsx";
import UserListsSection, {UserList} from "../components/UserListsSection.tsx";
import {translateStatusToRussian} from "../utils/translateStatusToRussian.ts";



const ProfileScreen = () => {
    const {  nickname, avatarUrl, isAuthenticated, logout } = useContext(AuthContext);
    const [userStats, setUserStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async (nickname: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://shikimori.one/api/users/${nickname}`);
            setUserStats(response.data);
            setError(null);
        } catch (err) {
            console.error('Ошибка при получении данных пользователя:', err);
            setError('Не удалось загрузить данные пользователя.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (nickname) {
            fetchUserData(nickname);
        }
    }, [nickname]);

    if (!isAuthenticated) {
        return <AuthScreen />;
    }

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

    const prepareStatsData = () => {
        if (!userStats?.stats) return { scoreStats: [], ratesStatusesStats: [], maxScoreValue: 0, maxRatesValue: 0 };

        const scoreStats = userStats.stats.scores.anime.map((item: any) => ({
            name: item.name,
            value: item.value,
        }));

        const ratesStatusesStats = userStats.stats.statuses.anime.map((item: any) => ({
            name: translateStatusToRussian(item.name),
            value: item.size,
        }));

        const maxScoreValue = Math.max(...scoreStats.map((stat: any) => stat.value), 1);
        const maxRatesValue = Math.max(...ratesStatusesStats.map((stat: any) => stat.value), 1);

        return { scoreStats, ratesStatusesStats, maxScoreValue, maxRatesValue };
    };

    const prepareUserLists = (): UserList[] => {
        if (!userStats?.stats?.statuses?.anime) return [];

        return userStats.stats.statuses.anime.map((status: any) => ({
            id: status.grouped_id,
            name: status.name,
            russian: translateStatusToRussian(status.name),
            size: status.size,
        }));
    };

    const { scoreStats, maxScoreValue, maxRatesValue } = prepareStatsData();
    const userLists = prepareUserLists();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{nickname}</Text>
            {avatarUrl && (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            )}

            <StatsSection
                scoreStats={scoreStats}
                maxScoreValue={maxScoreValue}
                maxRatesValue={maxRatesValue}
                scaleFactor={1.5}
                displayMode={'scores'}
            />

            <UserListsSection
                lists={userLists}
            />

            <Button title={'Выйти'} onPress={logout} />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 40,
        marginTop: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ProfileScreen;
