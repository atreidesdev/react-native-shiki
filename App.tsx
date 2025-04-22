import React from 'react';
import {AuthProvider} from "./src/context/AuthContext.tsx";
import AppNavigator from "./src/AppNavigator.tsx";

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
