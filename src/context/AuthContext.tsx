import React, { createContext, useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = 'ieNJxCwbF_WJovbOuTNS5Gi9WT0UgKPj-TYMzRiWs9w';
const CLIENT_SECRET = 'y2saqG6Zl79O-GmSyNSlD3bALWpklpMpZaNFVy8D5Lw';
const REDIRECT_URI = 'myapp://auth-callback';
const TOKEN_URL = 'https://shikimori.one/oauth/token';
const WHOAMI_URL = 'https://shikimori.one/api/users/whoami';

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

interface UserResponse {
    id: number;
    nickname: string;
    image: { x160: string };
}

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userId: number | null;
    nickname: string | null;
    avatarUrl: string | null;
    isAuthenticated: boolean;
    login: (code: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userId: null,
    nickname: null,
    avatarUrl: null,
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    refreshAccessToken: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const isAuthenticated = !!accessToken;

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedAccessToken = await AsyncStorage.getItem('accessToken');
                const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
                const storedUserId = await AsyncStorage.getItem('userId');
                const storedNickname = await AsyncStorage.getItem('nickname');
                const storedAvatarUrl = await AsyncStorage.getItem('avatarUrl');
                const tokenExpiryTime = await AsyncStorage.getItem('tokenExpiryTime');

                if (storedAccessToken && storedRefreshToken && tokenExpiryTime) {
                    const expiryTime = parseInt(tokenExpiryTime, 10);
                    const currentTime = Date.now();

                    if (currentTime >= expiryTime) {
                        console.log('Токен истек. Обновляем...');
                        await refreshAccessToken();
                    } else {
                        setAccessToken(storedAccessToken);
                        setRefreshToken(storedRefreshToken);
                        if (storedUserId) setUserId(parseInt(storedUserId, 10));
                        if (storedNickname) setNickname(storedNickname);
                        if (storedAvatarUrl) setAvatarUrl(storedAvatarUrl);
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных из AsyncStorage:', error);
            }
        };

        loadStoredData();
    }, []);

    const saveAuthData = async (
        newAccessToken: string,
        newRefreshToken: string,
        newUserId: number,
        newNickname: string,
        newAvatarUrl: string,
        expiresIn: number
    ) => {
        try {
            const tokenExpiryTime = Date.now() + expiresIn * 1000;

            await AsyncStorage.setItem('accessToken', newAccessToken);
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
            await AsyncStorage.setItem('userId', newUserId.toString());
            await AsyncStorage.setItem('nickname', newNickname);
            await AsyncStorage.setItem('avatarUrl', newAvatarUrl);
            await AsyncStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
        } catch (error) {
            console.error('Ошибка при сохранении данных в AsyncStorage:', error);
        }
    };

    const fetchUserData = async (token: string, refreshToken: string) => {
        try {
            const response: AxiosResponse<UserResponse> = await axios.get(WHOAMI_URL, {
                headers: {
                    'User-Agent': 'native app',
                    Authorization: `Bearer ${token}`,
                },
            });

            const fetchedUserData = response.data;

            if (!fetchedUserData) {
                console.error('Данные пользователя не получены.');
                return;
            }

            setUserId(fetchedUserData.id);
            setNickname(fetchedUserData.nickname);
            setAvatarUrl(fetchedUserData.image.x160);

            await saveAuthData(
                token,
                refreshToken,
                fetchedUserData.id,
                fetchedUserData.nickname,
                fetchedUserData.image.x160,
                3600
            );
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    };

    const login = async (code: string) => {
        try {
            const response: AxiosResponse<TokenResponse> = await axios.post(
                TOKEN_URL,
                {
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                    redirect_uri: REDIRECT_URI,
                },
                {
                    headers: { 'User-Agent': 'native app' },
                }
            );

            const { access_token, refresh_token, expires_in } = response.data;

            setAccessToken(access_token);
            setRefreshToken(refresh_token);

            await fetchUserData(access_token, refresh_token);
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUserId(null);
        setNickname(null);
        setAvatarUrl(null);

        AsyncStorage.removeItem('accessToken');
        AsyncStorage.removeItem('refreshToken');
        AsyncStorage.removeItem('userId');
        AsyncStorage.removeItem('nickname');
        AsyncStorage.removeItem('avatarUrl');
        AsyncStorage.removeItem('tokenExpiryTime');
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) return;

        try {
            const response: AxiosResponse<TokenResponse> = await axios.post(
                TOKEN_URL,
                {
                    grant_type: 'refresh_token',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    refresh_token: refreshToken,
                },
                {
                    headers: { 'User-Agent': 'native app' },
                }
            );

            const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;

            setAccessToken(access_token);
            setRefreshToken(newRefreshToken);

            await fetchUserData(access_token, newRefreshToken);
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                userId,
                nickname,
                avatarUrl,
                isAuthenticated,
                login,
                logout,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
