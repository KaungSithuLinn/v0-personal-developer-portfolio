/**
 * Wraps a server action with a timeout to prevent DoS attacks
 * @param action The server action function to wrap
 * @param timeoutMs The timeout in milliseconds (default: 5000ms)
 * @returns A wrapped server action that will timeout after the specified duration
 */
export function withTimeout<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>,
  timeoutMs = 5000,
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    // Create a promise that rejects after the specified timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject(new Error(`Server action timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    // Race the action against the timeout
    return Promise.race([action(...args), timeoutPromise]) as Promise<T>
  }
}

