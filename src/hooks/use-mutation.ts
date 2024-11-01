import { useState, useCallback, useRef } from "react";

// Comprehensive configuration interface
interface UseMutationOptions<TData, TError, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: TError | null, variables: TVariables) => void;
  retry?: number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((failureCount: number) => number);
}

// Comprehensive mutation state and mutate function
interface MutationResult<TData, TError, TVariables> {
  data: TData | null;
  error: TError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

export function useMutation<TData = unknown, TError = Error, TVariables = any>(
  options: UseMutationOptions<TData, TError, TVariables>
): MutationResult<TData, TError, TVariables> {
  const [state, setState] = useState({
    data: null as TData | null,
    error: null as TError | null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  // Track retry attempts
  const failureCountRef = useRef(0);

  // Default retry configuration
  const shouldRetry = useCallback(
    (failureCount: number, error: TError) => {
      // By default, retry up to 3 times for non-4xx errors
      if (typeof options.retry === "function") {
        return options.retry(failureCount, error);
      }

      const maxRetries = options.retry ?? 3;
      return failureCount < maxRetries;
    },
    [options.retry]
  );

  // Default retry delay with exponential backoff
  const getRetryDelay = useCallback(
    (failureCount: number) => {
      if (typeof options.retryDelay === "function") {
        return options.retryDelay(failureCount);
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      return Math.min(1000 * Math.pow(2, failureCount), 30000);
    },
    [options.retryDelay]
  );

  const mutate = useCallback(
    async (variables: TVariables) => {
      // Reset failure count for new mutation
      failureCountRef.current = 0;

      const performMutation = async (): Promise<TData> => {
        // Reset state before mutation
        setState((prev) => ({
          ...prev,
          isLoading: true,
          isError: false,
          isSuccess: false,
          error: null,
        }));

        try {
          const data = await options.mutationFn(variables);

          setState({
            data,
            error: null,
            isLoading: false,
            isError: false,
            isSuccess: true,
          });

          // Call success callback
          if (options.onSuccess) {
            options.onSuccess(data, variables);
          }

          // Call settled callback
          if (options.onSettled) {
            options.onSettled(data, null, variables);
          }

          return data;
        } catch (error) {
          failureCountRef.current += 1;

          // Check if we should retry
          if (shouldRetry(failureCountRef.current, error as TError)) {
            const delay = getRetryDelay(failureCountRef.current);

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));

            // Recursive retry
            return performMutation();
          }

          // Final error state
          setState({
            data: null,
            error: error as TError,
            isLoading: false,
            isError: true,
            isSuccess: false,
          });

          // Call error callback
          if (options.onError) {
            options.onError(error as TError, variables);
          }

          // Call settled callback
          if (options.onSettled) {
            options.onSettled(null, error as TError, variables);
          }

          throw error;
        }
      };

      return performMutation();
    },
    [
      options.mutationFn,
      options.onSuccess,
      options.onError,
      options.onSettled,
      shouldRetry,
      getRetryDelay,
    ]
  );

  // Reset function to clear the state
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
