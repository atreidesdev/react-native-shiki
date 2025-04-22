import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useApi } from '../hooks/useApi';
import { SearchBar } from "../components/SearchBar";
import { GenreList } from "../components/GenreList";
import { AnimeList } from "../components/AnimeList";
import { Pagination } from "../components/Pagination";

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [genres, setGenres] = useState<{ id: number; name: string; russian: string }[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { fetchGraphQL, fetchWithoutAuth } = useApi();

    const scrollViewRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchWithoutAuth('https://shikimori.one/api/genres');
                setGenres(data.filter((genre: any) => genre.entry_type === 'Anime'));
            } catch (error) {
                console.error('Ошибка при загрузке жанров:', error);
            }
        };
        loadGenres();
    }, []);

    useEffect(() => {
        handleSearch(1);
    }, []);

    const handleSearch = async (newPage: number = 1) => {
        try {
            setLoading(true);
            const graphqlQuery = `
                query ($search: String, $page: Int, $limit: Int, $genres: String) {
                    animes(
                        search: $search,
                        page: $page,
                        limit: $limit,
                        genre: $genres
                    ) {
                        id
                        name
                        russian
                        genres{
                            russian
                        }
                        score
                        poster {
                            id
                            originalUrl
                        }
                    }
                }
            `;
            const data = await fetchGraphQL('https://shikimori.one/api/graphql', graphqlQuery, {
                search: query || '',
                page: newPage,
                limit: 20,
                genres: selectedGenres.join(','),
            });
            setResults(data.data.animes);
            setPage(newPage);

            setTimeout(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
            }, 100);
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleGenre = (genreId: string) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.includes(genreId)
                ? prevGenres.filter((id) => id !== genreId)
                : [...prevGenres, genreId]
        );
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            decelerationRate={0.75}
        >
            <SearchBar query={query} setQuery={setQuery} onSearch={() => handleSearch(1)} loading={loading} />

            <GenreList genres={genres} selectedGenres={selectedGenres} toggleGenre={toggleGenre} />

            <AnimeList results={results} />

            <Pagination page={page} onPageChange={handleSearch} loading={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
});

export default SearchScreen;
