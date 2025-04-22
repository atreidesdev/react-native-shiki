import React from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import TitleScreen from './screens/TitleScreen';
import Icon from '@react-native-vector-icons/fontawesome';
import { Pressable } from 'react-native';
import UserListScreen from './screens/UserListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    UserList: {
        listStatus: string;
        listName: string;
        russian: string
    };
    Title: {
        id: number;
        russian?: string;
    };
};

export type UserListScreenRouteProp = RouteProp<RootStackParamList, 'UserList'>;

const SearchStack = () => {
    // @ts-ignore
    return (
        <Stack.Navigator>
            <Stack.Screen
                // @ts-ignore
                name="Search"
                component={SearchScreen}
                options={{ title: 'Поиск тайтлов' }}
            />
            <Stack.Screen
                name="Title"
                component={TitleScreen}
                options={({ route }) => ({
                    title: route.params?.russian || 'Тайтл',
                })}
            />
        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                // @ts-ignore
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Профиль' }}
            />
            <Stack.Screen
                name="UserList"
                component={UserListScreen}
                options={({ route }) => ({
                    title: route.params?.russian || 'Список',
                })}
            />
            <Stack.Screen
                name="Title"
                component={TitleScreen}
                options={({ route }) => ({
                    title: route.params?.russian || 'Тайтл',
                })}
            />
        </Stack.Navigator>
    );
};

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = '';

                        if (route.name === 'Search') {
                            iconName = focused ? 'search' : 'search';
                            color = focused ? '#c8b2ef' : 'gray';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'user' : 'user';
                            color = focused ? '#c8b2ef' : 'gray';
                        }

                        // @ts-ignore
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#c8b2ef',
                    tabBarInactiveTintColor: 'gray',
                    tabBarButton: (props) => (
                        <Pressable
                            {...props}
                            android_ripple={{ color: '#d9d4d4', radius: 50 }}
                            style={({ pressed }) => [
                                {
                                    opacity: pressed ? 0.5 : 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                },
                            ]}
                        />
                    ),
                })}
            >
                <Tab.Screen
                    name="Search"
                    component={SearchStack}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileStack}
                    options={{ title: 'Профиль', headerShown: false }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
