import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useState } from "react";
import { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import { http } from "../lib/http";

type RequestType = "post" | "put" | "delete" | "patch";
type ContentType = "application/json" | "multipart/form-data" | "blob";

interface Error {
    response: {
        data: { [key: string]: string };
    };
}
interface MutationVariables {
    method: RequestType;
    url: string;
    data: any;
    customContentType?: ContentType;
}

type UseRequestOptions<T> = Omit<
    UseMutationOptions<T, Error, MutationVariables, unknown>,
    "mutationFn"
>;

interface UseRequestConfig {
    contentType?: ContentType;
}

export const useRequest = <T = any>(
    options?: UseRequestOptions<T>,
    config: UseRequestConfig = {}
) => {
    const { contentType = "application/json" } = config;
    const [uploadProgress, setUploadProgress] = useState(0);

    const mutationFn = async ({
        method,
        url,
        data,
        customContentType,
    }: MutationVariables & { customContentType?: ContentType }): Promise<T> => {
        const token = localStorage.getItem("token"); // Get the token

        const axiosConfig: AxiosRequestConfig = {
            url,
            method,
            data: data || {},
            headers: {
                "Content-Type": customContentType || contentType,
                Authorization: token ? `Bearer ${token}` : "", // Include the token in the request headers
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            },
        };

        const response = await http(axiosConfig);
        return response.data as T;
    };

    const mutation = useMutation<T, Error, MutationVariables>({
        mutationFn,
        mutationKey: options?.mutationKey,
        ...options,
        onSettled(_, error) {
            if (error) {
                console.error("Error during mutation:", error);
            }
        },
    });

    const handleRequest = async (
        method: RequestType,
        url: string,
        data?: any,
        requestOptions?: { contentType?: ContentType; isConfirmed?: boolean }
    ) => {
        if (
            typeof requestOptions?.isConfirmed === "undefined" ||
            !!requestOptions?.isConfirmed
        ) {
            return mutation.mutateAsync({
                method,
                url,
                data,
                customContentType: requestOptions?.contentType,
            });
        }
    };

    const post = (
        url: string,
        data?: any,
        options?: { contentType?: ContentType; isConfirmed?: boolean }
    ) => handleRequest("post", url, data, options);

    const put = (
        url: string,
        data?: any,
        options?: { contentType?: ContentType; isConfirmed?: boolean }
    ) => handleRequest("put", url, data, options);

    const patch = (
        url: string,
        data?: any,
        options?: { contentType?: ContentType; isConfirmed?: boolean }
    ) => handleRequest("patch", url, data, options);

    const remove = (
        url: string,
        data?: any,
        options?: { contentType?: ContentType; isConfirmed?: boolean }
    ) => handleRequest("delete", url, data, options);

    return {
        ...mutation,
        post,
        put,
        patch,
        remove,
        uploadProgress,
    };
};
