import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

interface PaginationProps {
    page: number;
    onPageChange: (newPage: number) => void;
    loading: boolean;
}

export const Pagination = ({ page, onPageChange, loading }: PaginationProps) => {
    return (
        <View style={styles.paginationContainer}>
            <TouchableOpacity
                onPress={() => onPageChange(page - 1)}
                disabled={page === 1 || loading}
                style={styles.paginationButton}
            >
                <Icon name="backward" size={24} color={page === 1  ? '#ccc' : '#c8b2ef'} />
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>{page}</Text>

            <TouchableOpacity
                onPress={() => onPageChange(page + 1)}
                disabled={loading}
                style={styles.paginationButton}
            >
                <Icon name="forward" size={24} color={'#c8b2ef'} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    paginationButton: {
        padding: 8,
    },
    pageIndicator: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
