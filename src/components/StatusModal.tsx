import Modal from "react-native-modal";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {translateStatusToRussian} from "../utils/translateStatusToRussian.ts";

export const StatusModal = ({
                         isVisible,
                         onBackdropPress,
                         onSelectStatus,
                     }: {
    isVisible: boolean;
    onBackdropPress: () => void;
    onSelectStatus: (status: string) => void;
}) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Выберите статус</Text>
                {['watching', 'completed', 'on_hold', 'dropped', 'planned'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        onPress={() => {
                            onSelectStatus(status);
                            onBackdropPress();
                        }}
                        style={styles.modalOption}
                    >
                        <Text>{translateStatusToRussian(status)}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={onBackdropPress} style={styles.modalCancel}>
                    <Text style={styles.modalCancelText}>Отмена</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalCancel: {
        marginTop: 10,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#333',
    },
});
