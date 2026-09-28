import { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';

export default function Cars() {
    return (
        <SafeAreaView>
            <Text >These are the cars:</Text>
        </SafeAreaView>
    );
}
