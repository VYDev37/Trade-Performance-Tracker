package slice

func Filter[T any](slice []T, test func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if test(v) {
			result = append(result, v)
		}
	}
	return result
}
