package main

import (
	"github.com/gin-gonic/gin"

	"github.com/Patchadatong/ticket_managament/controller"
	"github.com/Patchadatong/ticket_managament/entity"

	"github.com/gin-contrib/cors"
)

const PORT = "8080"

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	
	r.Use(CORSMiddleware())
	r.Use(cors.Default())

	//Ticket
	r.POST("/create", controller.CreateTicket)
    r.GET("/ticket_status/:id", controller.GetTicketStatusByID)
	r.GET("/tickets", controller.GetTickets)
	r.PATCH("/ticket/:id", controller.UpdateTicket)
	r.Run()
}


func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}