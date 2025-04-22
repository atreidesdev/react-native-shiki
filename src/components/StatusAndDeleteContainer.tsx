import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { translateStatusToRussian } from "../utils/translateStatusToRussian.ts";
import Icon from "@react-native-vector-icons/fontawesome";
import {EpisodesInput} from "./EpisodesInput.tsx";
import React from "react";

export const StatusAndDeleteContainer = ({
                                             localStatus,
                                             toggleStatusModal,
                                             toggleDeleteDialog,
                                             type = 'space-between',
                                             gap = 0,
                                         }: {
    localStatus: string;
    toggleStatusModal: () => void;
    toggleDeleteDialog: () => void;
    type?: "space-between" | "center" | "flex-start" | "flex-end" | "space-around" | "space-evenly";
    gap?: number;
}) => {
    return (
        <View style={[styles.statusAndDeleteContainer, { justifyContent: type, gap: gap }]}>
            <TouchableOpacity onPress={toggleStatusModal}>
                <Text style={styles.statusButton}>Статус: {translateStatusToRussian(localStatus)}</Text>
            </TouchableOpacity>


            {localStatus !== 'не добавлен' && (
                <TouchableOpacity onPress={toggleDeleteDialog}>
                    <Icon name="trash" size={24} color="#ff4d4d" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statusAndDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusButton: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 4,
    },
});
