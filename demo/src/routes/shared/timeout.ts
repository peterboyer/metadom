export function Timeout<T>(timeoutMs: number, callback: () => T): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(undefined), timeoutMs);
	}).then(callback);
}
