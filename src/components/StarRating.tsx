import {StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "@react-native-vector-icons/fontawesome";

export const StarRating = ({
                                localScore,
                                setLocalScore,
                                size,
                            }: {
    localScore: number;
    setLocalScore: (score: number) => void;
    size: number;
}) => {
    const MAX_RATING = 10;

    return (
        <View style={styles.starContainer}>
            {[...Array(MAX_RATING)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= localScore;
                return (
                    <TouchableOpacity
                        key={starValue}
                        onPress={() => setLocalScore(starValue)}
                    >
                        <Icon
                            name={isFilled ? 'star' : 'star-o'}
                            size={size}
                            color={isFilled ? '#c8b2ef' : '#ccc'}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 3,
    },
});
