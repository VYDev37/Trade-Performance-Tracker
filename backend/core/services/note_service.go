package services

import (
	"trade-tracker/core/domain"
	repository "trade-tracker/core/repositories"
)

type NoteService interface {
	AddNote(note *domain.Note) error
	RemoveNote(id uint, userID uint64) error
	UpdateNote(note *domain.Note) error

	GetNotes(userID uint64) ([]domain.NoteResponse, error)
}

type noteService struct {
	repo repository.NoteRepository
}

func NewNoteService(repo repository.NoteRepository) NoteService {
	return &noteService{repo: repo}
}

func (s *noteService) AddNote(note *domain.Note) error {
	return s.repo.AddNote(note, nil)
}

func (s *noteService) RemoveNote(id uint, userID uint64) error {
	if note, err := s.repo.GetNote(id); err != nil || note.UserID != userID {
		return domain.ErrMismatchInfo
	}

	return s.repo.RemoveNote(id, nil)
}

func (s *noteService) UpdateNote(note *domain.Note) error {
	if note2, err := s.repo.GetNote(note.ID); err != nil || note2.UserID != note.UserID {
		return domain.ErrMismatchInfo
	}
	return s.repo.UpdateNote(note, nil)
}

func (s *noteService) GetNotes(userID uint64) ([]domain.NoteResponse, error) {
	var myNotes []domain.NoteResponse

	notes, err := s.repo.GetNotes(userID)
	if err != nil {
		return nil, err
	}

	for _, note := range notes {
		myNotes = append(myNotes, domain.NoteResponse{
			ID:          note.ID,
			UpdatedAt:   note.UpdatedAt,
			Title:       note.Title,
			Description: note.Description,
			Category:    note.Category,
			ImageURL:    note.ImageURL,
		})
	}

	return myNotes, nil
}
