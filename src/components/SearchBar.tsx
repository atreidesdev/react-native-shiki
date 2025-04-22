import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

interface SearchBarProps {
    query: string;
    setQuery: (text: string) => void;
    onSearch?: () => void;
    loading?: boolean;
}

export const SearchBar = ({ query, setQuery, onSearch, loading }: SearchBarProps) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                placeholder="Введите название"
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />
            <TouchableOpacity onPress={onSearch} disabled={loading} style={styles.searchButton}>
                <Icon name="search" size={24} color="#c8b2ef" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchButton: {
        padding: 8,
        marginLeft: 8,
    },
});

