import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export type UserList = {
    id: number;
    name: string;
    russian: string;
    size: number;
};

type Props = {
    lists: UserList[];
};

const UserListsSection = ({ lists }: Props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Списки:</Text>
            {lists.length > 0 ? (
                lists.map((list) => (
                    <TouchableOpacity
                        key={list.id}
                        onPress={() =>
                            // @ts-ignore
                            navigation.navigate('UserList', {
                                listId: list.id,
                                listName: list.name,
                                russian: list.russian
                            })
                        }
                        style={styles.listItem}
                    >
                        <Text style={styles.listName}>{list.russian || list.name}</Text>
                        <Text style={styles.listSize}>{list.size} тайтл(ов)</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noLists}>Нет доступных списков</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    listName: {
        fontSize: 14,
        color: '#333',
    },
    listSize: {
        fontSize: 14,
        color: '#777',
    },
    noLists: {
        textAlign: 'center',
        color: '#777',
        marginTop: 8,
    },
});

export default UserListsSection;
