package entity

import (
	"gorm.io/driver/sqlite"

	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("Ticket.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	database.AutoMigrate(
		&Ticket{},
		&Status{},
	)

	db = database
	//TicketStatus
	status := []Status{
		{Status: "pending"},
		{Status: "accepted"},
		{Status: "resolved"},
		{Status: "rejected"},
	}

	for _, status := range status {
		db.Where(Status{Status: status.Status}).FirstOrCreate(&status)
	}
}
