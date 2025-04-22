import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "@react-native-vector-icons/fontawesome";

export const EpisodesInput = ({
                           localEpisodes,
                           setLocalEpisodes,
                           totalEpisodes,
                       }: {
    localEpisodes: number;
    setLocalEpisodes: (episodes: number) => void;
    totalEpisodes: number | string;
}) => {
    return (
        <View style={styles.episodesContainer}>
            <Text style={styles.episodesLabel}>Серий:</Text>
            <TouchableOpacity onPress={() => setLocalEpisodes(Math.max(0, localEpisodes - 1))}>
                <Icon name="minus" size={20} color="#c8b2ef" />
            </TouchableOpacity>
            <TextInput
                value={localEpisodes.toString()}
                onChangeText={(value) => {
                    const parsedValue = parseInt(value, 10);
                    if (!isNaN(parsedValue) && parsedValue >= 0) {
                        setLocalEpisodes(parsedValue);
                    }
                }}
                keyboardType="numeric"
                style={styles.episodesInput}
            />
            <TouchableOpacity onPress={() => setLocalEpisodes(localEpisodes + 1)}>
                <Icon name="plus" size={20} color="#c8b2ef" />
            </TouchableOpacity>
            <Text style={styles.ofTotalEpisodes}>из {totalEpisodes}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    episodesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    episodesLabel: {
        fontSize: 14,
        marginRight: 8,
    },
    episodesInput: {
        width: 50,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 4,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    ofTotalEpisodes: {
        fontSize: 14,
        marginLeft: 4,
    },
});
