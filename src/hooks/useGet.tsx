import {
    keepPreviousData,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
  } from "@tanstack/react-query";
  import { useState } from "react";
  import { AxiosProgressEvent } from "axios";
  import { http } from "../lib/http";
  
  type UseGetOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;
  
  export const useGet = <T = unknown>(
    url: string,
    params?: Record<string, any>,
    options?: UseGetOptions<T>
  ): UseQueryResult<T, Error> & { downloadProgress: number } => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const token = localStorage.getItem("token");
  
    const query = useQuery<T, Error>({
      queryKey: params ? [url, params] : [url],
      queryFn: async () => {
        const response = await http.get(url, {
          params: params?.queryParams, // Ensure only valid query parameters are passed here.
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            ...params?.headers, // Allow additional headers if provided.
          },
          onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setDownloadProgress(percentCompleted);
            }
          },
        });
        return response.data as T;
      },
      ...options,
      retryDelay: 5000,
      retry: 1,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  
    return {
      ...query,
      downloadProgress,
    };
  };
  