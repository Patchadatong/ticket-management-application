package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Patchadatong/ticket_managament/entity"

)

func CreateTicket(c *gin.Context){
	var ticket entity.Ticket

    if err := c.ShouldBindJSON(&ticket); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var ticketstatus entity.Status
    if err := entity.DB().First(&ticketstatus, ticket.StatusID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid TicketStatus ID"})
        return
    }
    
   
    // สร้าง Ticket
    u := entity.Ticket{
        Title:                ticket.Title,
        Description:          ticket.Description,
        ContactInfo :         ticket.ContactInfo,
        Status:               ticketstatus, 
    }
    
    // บันทึก
    if err := entity.DB().Create(&u).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": u})
}


func GetTicketStatusByID(c *gin.Context) {
    statusID := c.Param("id")
    var status entity.Status
    result := entity.DB().Where("id = ?", statusID).First(&status)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "TicketStatus not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": status})

}


func GetTickets(c *gin.Context) {
	var tickets []entity.Ticket
	statusFilter := c.Query("status") // ใช้กรองตามสถานะ

	// กรองและจัดเรียงตั๋ว
	query := entity.DB().Preload("Status").Model(&tickets) 
	if statusFilter != "" {
		query = query.Where("status_id = ?", statusFilter)
	}
	query = query.Order("updated_at desc") // จัดเรียงตามการอัปเดตล่าสุด

	if err := query.Find(&tickets).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tickets})
}

func UpdateTicket(c *gin.Context) {
    var ticket entity.Ticket
    var result entity.Ticket

    id := c.Param("id")

    if err := c.ShouldBindJSON(&ticket); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    if tx := entity.DB().Where("id = ?", id).First(&result); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Ticket not found"})
        return
    }

    // อัปเดตฟิลด์ใน result ด้วยค่าจาก ticket
    result.Title = ticket.Title
    result.Description = ticket.Description
    result.ContactInfo = ticket.ContactInfo

    // อัปเดต StatusID ถ้า StatusID ไม่ใช่ nil
    if ticket.StatusID != nil { 
        result.StatusID = ticket.StatusID 
    }

    // บันทึก
    if err := entity.DB().Save(&result).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": result})
}

