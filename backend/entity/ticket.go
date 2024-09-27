package entity

import (
	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	Title          string
	Description    string
	ContactInfo    string


	//fk
	StatusID *uint
	Status Status
}