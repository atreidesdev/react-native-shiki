import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthScreen = () => {
    const { isAuthenticated, login } = useContext(AuthContext);

    const handleAuthorization = () => {
        const authUrl = `https://shikimori.one/oauth/authorize?client_id=ieNJxCwbF_WJovbOuTNS5Gi9WT0UgKPj-TYMzRiWs9w&redirect_uri=myapp://auth-callback&response_type=code&scope=`;
        Linking.openURL(authUrl);
    };

    useEffect(() => {
        const handleDeepLink = async (event: { url: string }) => {
            const url = event.url;
            if (url && url.startsWith('myapp://auth-callback')) {
                try {
                    const codeMatch = url.match(/code=([^&]+)/);
                    const code = codeMatch ? codeMatch[1] : null;

                    if (!code) {
                        console.error('Authorization Code не найден в URL.');
                        return;
                    }

                    await login(code);
                } catch (error) {
                    console.error('Ошибка при обработке глубокой ссылки:', error);
                }
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        const checkInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl && initialUrl.startsWith('myapp://auth-callback')) {
                handleDeepLink({ url: initialUrl });
            }
        };

        checkInitialUrl();

        return () => {
            subscription.remove();
        };
    }, [login]);

    if (isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text>Вы уже авторизованы!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Необходимо авторизоваться</Text>
            <Button title="Авторизоваться" onPress={handleAuthorization} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default AuthScreen;
