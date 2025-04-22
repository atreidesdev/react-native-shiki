import { useState, useEffect, useContext } from "react";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useApi } from "../hooks/useApi";
import { StatusAndDeleteContainer } from "./StatusAndDeleteContainer";
import { StarRating } from "./StarRating";
import { StatusModal } from "./StatusModal";
import { DeleteDialog } from "./DeleteDialog";
import { EpisodesInput } from "./EpisodesInput";
import { Title } from "../screens/UserListScreen";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext.tsx";

function debounce(func: () => void, delay: number): { (): void; cancel: () => void } {
    let timer: NodeJS.Timeout | null = null;

    const debouncedFunction = function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };

    debouncedFunction.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debouncedFunction;
}

export const ListItem = ({ item }: { item: Title }) => {
    const [localScore, setLocalScore] = useState<number>(item.score || 0);
    const [localEpisodes, setLocalEpisodes] = useState<number>(item.watchedEpisodes || 0);
    const [localStatus, setLocalStatus] = useState<string>(item.status || 'не добавлен');
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);
    const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const navigation = useNavigation();
    const { fetchWithAuthPost, fetchWithAuthPut, fetchWithAuthDelete } = useApi();
    const { userId } = useContext(AuthContext);

    const toggleStatusModal = () => setStatusModalVisible(!isStatusModalVisible);
    const toggleDeleteDialog = () => setDeleteDialogVisible(!isDeleteDialogVisible);

    const handleDelete = async () => {
        try {
            if (!item.rateId) {
                console.error('Ошибка: ID тайтла отсутствует.');
                return;
            }
            await fetchWithAuthDelete(`https://shikimori.one/api/v2/user_rates/${item.rateId}`);

            console.log('Тайтл успешно удален:', item.rateId);
            setLocalStatus('не добавлен');
            setLocalEpisodes(0);
            setLocalScore(0);
        } catch (error) {
            console.error('Ошибка при удалении тайтла:', error);
            Alert.alert('Ошибка', 'Не удалось удалить тайтл. Попробуйте позже.');
        } finally {
            toggleDeleteDialog();
        }
    };

    const handlePress = (id: number, title: string) => {
        // @ts-ignore
        navigation.navigate("Title", { id, russian: title });
    };

    const saveChangesToServer = async () => {
        const requestData = {
            user_rate: {
                score: localScore || undefined,
                status: localStatus,
                episodes: localEpisodes || undefined,
                target_id: item.id,
                target_type: 'Anime',
                user_id: userId,
            },
        };

        try {
            if (item.rateId) {
                await fetchWithAuthPut(
                    `https://shikimori.one/api/v2/user_rates/${item.rateId}`,
                    requestData
                );
            } else {
                await fetchWithAuthPost(
                    'https://shikimori.one/api/v2/user_rates',
                    { user_rate: { status: localStatus } }
                );
            }
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const debouncedSaveChanges = debounce(saveChangesToServer, 500);

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        if (
            localScore !== item.score ||
            localEpisodes !== item.watchedEpisodes ||
            localStatus !== item.status
        ) {
            console.log('Обнаружены изменения:', {
                score: localScore,
                episodes: localEpisodes,
                status: localStatus,
            });

            if (localStatus === 'не добавлен') {
                console.log('Тайтл удален — запрос не отправляется.');
                return;
            }

            debouncedSaveChanges();
        }
    }, [localScore, localEpisodes, localStatus]);

    useEffect(() => {
        return () => {
            debouncedSaveChanges.cancel();
        };
    }, []);

    if (localStatus === 'не добавлен') {
        return null;
    }

    return (
        <View style={styles.listItemContainer}>
            <TouchableOpacity onPress={() => handlePress(item.id, item.russian)}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => handlePress(item.id, item.russian)}>
                    <Text style={styles.titleText}>{item.russian || item.name}</Text>
                </TouchableOpacity>
                <StatusAndDeleteContainer
                    localStatus={localStatus}
                    toggleStatusModal={toggleStatusModal}
                    toggleDeleteDialog={toggleDeleteDialog}
                />
                <StarRating localScore={localScore} setLocalScore={setLocalScore} size={20} />
                <EpisodesInput
                    localEpisodes={localEpisodes}
                    setLocalEpisodes={setLocalEpisodes}
                    totalEpisodes={item.episodes || '??'}
                />
            </View>

            <StatusModal
                isVisible={isStatusModalVisible}
                onBackdropPress={toggleStatusModal}
                onSelectStatus={setLocalStatus}
            />
            <DeleteDialog
                isVisible={isDeleteDialogVisible}
                onBackdropPress={toggleDeleteDialog}
                onDelete={handleDelete}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'white',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
});
