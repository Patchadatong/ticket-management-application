import { TicketInterface } from "../../interfaces/ticket"
import { StatusInterface } from "../../interfaces/status";

const apiUrl = "http://localhost:8080"

async function CreateTicket(data: TicketInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/create`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
}


async function GetTicketStatusById(id: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
  
    },
  };

  const response = await fetch(`${apiUrl}/ticket_status/${id}`, requestOptions);
  const data = await response.json();

  if (response.ok) {
    return data.data as StatusInterface;
  } else {
    return null;
  }
}


async function GetTickets(statusId?: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${apiUrl}/tickets`, requestOptions);
  const data = await response.json();

  if (response.ok) {
    return data.data as TicketInterface[]; // คืนค่ารายการตั๋ว
  } else {
    return []; // คืนค่าลิสต์ว่างหากไม่สำเร็จ
  }
}

async function UpdateTicket(id: number | undefined, data: TicketInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  // ใช้ ID ที่ถูกต้องใน URL
  let res = await fetch(`${apiUrl}/ticket/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}



export {
  CreateTicket,
  GetTicketStatusById,
  GetTickets,
  UpdateTicket
};