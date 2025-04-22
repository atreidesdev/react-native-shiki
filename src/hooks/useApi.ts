import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useApi = () => {
    const { accessToken, refreshAccessToken } = useContext(AuthContext);

    const fetchWithAuth = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response: AxiosResponse<T> = await axios.get(url, {
                ...config,
                headers: {
                    ...config?.headers,
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'native app',
                },
            });
            return response.data;
        } catch (error: unknown) {
            if ((error as any)?.response?.status === 401) {
                await refreshAccessToken();
                return fetchWithAuth<T>(url, config);
            }
            throw error;
        }
    };

    const fetchWithoutAuth = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await axios.get(url, {
            ...config,
            headers: {
                ...config?.headers,
                'User-Agent': 'native app',
            },
        });
        return response.data;
    };

    const fetchWithAuthPost = async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        try {
            const response: AxiosResponse<T> = await axios.post(url, data, {
                ...config,
                headers: {
                    ...config?.headers,
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'native app',
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error Response:', error.response?.data);
            } else {
                console.error('Unknown Error:', error);
            }
            if ((error as any)?.response?.status === 401) {
                await refreshAccessToken();
                return fetchWithAuthPost<T>(url, data, config);
            }
            throw error;
        }
    };

    const fetchWithAuthPut = async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        try {
            console.log(url, data, config);
            const response: AxiosResponse<T> = await axios.put(url, data, {
                ...config,
                headers: {
                    ...config?.headers,
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'native app',
                },
            });
            console.log(response);

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error Response:', error.response?.data);
            } else {
                console.error('Unknown Error:', error);
            }
            if ((error as any)?.response?.status === 401) {
                await refreshAccessToken();
                return fetchWithAuthPut<T>(url, data, config);
            }
            throw error;
        }
    };

    const fetchWithAuthDelete = async <T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        try {
            const response: AxiosResponse<T> = await axios.delete(url, {
                ...config,
                headers: {
                    ...config?.headers,
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'native app',
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error Response:', error.response?.data);
            } else {
                console.error('Unknown Error:', error);
            }
            if ((error as any)?.response?.status === 401) {
                await refreshAccessToken();
                return fetchWithAuthDelete<T>(url, config);
            }
            throw error;
        }
    };

    const fetchGraphQL = async <T>(
        url: string,
        query: string,
        variables?: Record<string, any>,
        headers?: Record<string, string>
    ): Promise<T> => {
        try {
            const response = await axios.post<T>(
                url,
                { query, variables },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Ошибка при выполнении GraphQL-запроса:', error);
            throw error;
        }
    };

    return { fetchWithAuth, fetchWithoutAuth, fetchGraphQL, fetchWithAuthPut, fetchWithAuthPost, fetchWithAuthDelete };
};
