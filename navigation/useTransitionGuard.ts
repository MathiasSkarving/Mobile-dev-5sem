import { useCallback, useEffect, useRef } from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigating while a native-stack animation is still running can leave a blank screen,
// so wrapped actions are ignored until the current screen's transition has finished
export function useTransitionGuard() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const transitioning = useRef(false);

    useEffect(() => {
        const unsubscribeStart = navigation.addListener('transitionStart', () => {
            transitioning.current = true;
        });
        const unsubscribeEnd = navigation.addListener('transitionEnd', () => {
            transitioning.current = false;
        });
        return () => {
            unsubscribeStart();
            unsubscribeEnd();
        };
    }, [navigation]);

    return useCallback((action: () => void) => () => {
        if (!transitioning.current) action();
    }, []);
}
