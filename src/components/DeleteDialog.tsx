import Modal from "react-native-modal";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export const DeleteDialog = ({
                          isVisible,
                          onBackdropPress,
                          onDelete,
                      }: {
    isVisible: boolean;
    onBackdropPress: () => void;
    onDelete: () => void;
}) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Удалить запись?</Text>
                <Text style={styles.modalMessage}>Вы уверены, что хотите удалить эту запись?</Text>
                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={onBackdropPress} style={styles.modalCancel}>
                        <Text style={styles.modalCancelText}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Text style={styles.modalConfirmText}>Удалить</Text>
                    </TouchableOpacity>
                </View>
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
    modalCancel: {
        marginTop: 10,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#333',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalConfirmText: {
        color: '#ff4d4d',
        fontWeight: 'bold',
    },
    modalMessage: {
        fontSize: 14,
        marginBottom: 10,
    },
});
