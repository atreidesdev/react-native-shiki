import React, { useState, useEffect, useContext } from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import { StatusAndDeleteContainer } from './StatusAndDeleteContainer';
import { StatusModal } from './StatusModal';
import { DeleteDialog } from './DeleteDialog';
import { StarRating } from './StarRating';
import { EpisodesInput } from './EpisodesInput';
import { useApi } from '../hooks/useApi';
import { AuthContext } from "../context/AuthContext.tsx";
import {debounce} from "../utils/debounce.ts";

type Props = {
    userRate: any;
    totalEpisodes: number;
    titleId: number;
};


const UserRateSection = ({ userRate, totalEpisodes, titleId }: Props) => {
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const [localStatus, setLocalStatus] = useState(userRate?.status || 'не добавлен');
    const [localEpisodes, setLocalEpisodes] = useState(userRate?.episodes || 0);
    const [localScore, setLocalScore] = useState(userRate?.score || 0);
    const [userRateId, setUserRateId] = useState<number | undefined>(userRate?.id);

    const [isInitialized, setIsInitialized] = useState(false);

    const { userId } = useContext(AuthContext);

    const { fetchWithAuthPut, fetchWithAuthPost, fetchWithAuthDelete } = useApi();

    const toggleStatusModal = () => setIsStatusModalVisible(!isStatusModalVisible);
    const toggleDeleteDialog = () => setIsDeleteDialogVisible(!isDeleteDialogVisible);

    const handleDelete = async () => {
        try {
            if (!userRateId) {
                console.error('Ошибка: ID тайтла отсутствует.');
                return;
            }
            await fetchWithAuthDelete(`https://shikimori.one/api/v2/user_rates/${userRateId}`);

            console.log('Тайтл успешно удален:', userRateId);
            setLocalStatus('не добавлен');
            setLocalEpisodes(0);
            setLocalScore(0);
            setUserRateId(undefined);
        } catch (error) {
            console.error('Ошибка при удалении тайтла:', error);
            Alert.alert('Ошибка', 'Не удалось удалить тайтл. Попробуйте позже.');
        } finally {
            toggleDeleteDialog();
        }
    };

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        if (localStatus === 'не добавлен') return;

        if (userRateId) {
            const hasChanges =
                localStatus !== (userRate?.status || 'не добавлен') ||
                localEpisodes !== (userRate?.episodes || 0) ||
                localScore !== (userRate?.score || 0);

            if (hasChanges) {
                console.log('Обнаружены изменения для обновления:', {
                    score: localScore,
                    episodes: localEpisodes,
                    status: localStatus,
                });
                debouncedSaveChanges();
            }
        } else {
            console.log('Добавление нового тайтла:', {
                status: localStatus,
            });

            debouncedSaveChanges();
        }
    }, [localStatus, localScore, localEpisodes]);

    const saveChangesToServer = async () => {
        const requestData = {
            user_rate: {
                score: localScore,
                status: localStatus,
                episodes: localEpisodes,
                target_id: titleId,
                target_type: 'Anime',
                user_id: userId,
            },
        };

        try {
            let response;

            if (userRateId) {
                response = await fetchWithAuthPut(
                    `https://shikimori.one/api/v2/user_rates/${userRateId}`,
                    requestData
                );
            } else {
                response = await fetchWithAuthPost(
                    'https://shikimori.one/api/v2/user_rates',
                    requestData
                );

                if (response && response.id) {
                    setUserRateId(response.id);
                    console.log('Новый ID тайтла:', response.id);
                }
            }

            console.log('Response from server:', response);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const debouncedSaveChanges = debounce(saveChangesToServer, 500);

    if (!userId){
        return
    }
        return (
        <View style={styles.container}>
            {localStatus !== 'не добавлен' && (
                <StarRating
                    localScore={localScore}
                    setLocalScore={setLocalScore}
                    size={35}
                />
            )}
            <StatusAndDeleteContainer
                localStatus={localStatus}
                toggleStatusModal={toggleStatusModal}
                toggleDeleteDialog={toggleDeleteDialog}
                type={'flex-start'}
                gap={20}
            />
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
            {localStatus !== 'не добавлен' && (
                <EpisodesInput
                    localEpisodes={localEpisodes}
                    setLocalEpisodes={setLocalEpisodes}
                    totalEpisodes={totalEpisodes}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
});

export default UserRateSection;
