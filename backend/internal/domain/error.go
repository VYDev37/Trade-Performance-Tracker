package domain

import "errors"

var (
	// general
	ErrInvalidInput        = errors.New("Invalid input.")
	ErrItemNotFound        = errors.New("Ticker not found.")
	ErrInsufficientAmount  = errors.New("Insufficient amount.")
	ErrInsufficientBalance = errors.New("Insufficient account balance to do that.")
	ErrUserNotFound        = errors.New("User not found.")
	ErrInternalServerError = errors.New("Internal server error.")

	// midtrans
	ErrInvalidSignature = errors.New("Signature is not valid.")
	ErrAlreadyPaid      = errors.New("Order has already been processed.")
	ErrMismatchedPrice  = errors.New("Price mismatches.")

	// Create User
	ErrAlreadyExist    = errors.New("Email or username has already been taken.")
	ErrWrongCredential = errors.New("Wrong username or password.")

	// Add Position
	ErrMismatchInfo = errors.New("There are some mismatch on the information of the position. (e.g. Owner, quantity, etc.)")

	// Create transaction
	ErrInvalidAction           = errors.New("Invalid action. Action can only be 'buy' or 'sell'.")
	ErrFailedWriteTransactions = errors.New("Failed to write transaction data.")
)
