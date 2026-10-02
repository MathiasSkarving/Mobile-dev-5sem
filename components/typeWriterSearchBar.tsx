import { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";

const WORDS = [
    'a make...',
    'a model...',
    'a trusty Toyota...',
    'a sensible Golf...',
    'a Porsche you can’t afford...',
    'a BMW (turn signals optional)...',
    'literally any Volvo...',
    'a car with 4 wheels...',
    'a Tesla to look techy...',
    'a Batmobile (we wish)...',
];

function getRandomWordIndex(currentIndex: number): number {
    if (WORDS.length <= 1) return 0;
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * WORDS.length);
    }
    return nextIndex;
}

const TYPEWRITER_CONFIG = {
    TYPING_SPEED_MS: 60,
    DELETING_SPEED_MS: 30,
    PAUSE_AT_END_MS: 2000,
    PAUSE_BEFORE_NEXT_WORD_MS: 200,
    TYPING_STEP_SIZE: 1,
    DELETING_STEP_SIZE: 2,
};

export default function TypewriterSearchbar({value, onChangeText}: { value: string; onChangeText: (t: string) => void }) {
    const [displayedText, setDisplayedText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (value.length > 0) return;

        const currentWord = WORDS[wordIndex];

        let delay = isDeleting ? TYPEWRITER_CONFIG.DELETING_SPEED_MS : TYPEWRITER_CONFIG.TYPING_SPEED_MS;
        const step = isDeleting ? TYPEWRITER_CONFIG.DELETING_STEP_SIZE : TYPEWRITER_CONFIG.TYPING_STEP_SIZE;

        if (!isDeleting && displayedText === currentWord) {
            delay = TYPEWRITER_CONFIG.PAUSE_AT_END_MS;
        } else if (isDeleting && displayedText === '') {
            const timer = setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((prev) => getRandomWordIndex(prev));
            }, TYPEWRITER_CONFIG.PAUSE_BEFORE_NEXT_WORD_MS);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            if (!isDeleting) {
                if (displayedText.length < currentWord.length) {
                    setDisplayedText(currentWord.slice(0, displayedText.length + step));
                } else {
                    setIsDeleting(true);
                }
            } else {
                setDisplayedText(currentWord.slice(0, Math.max(0, displayedText.length - step)));
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, wordIndex, value]);

    return (
        <Searchbar
            value={value}
            onChangeText={onChangeText}
            placeholder={`Search for ${displayedText}`}
        />
    );
}