import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Layout,Form, message, Button,Input} from "antd";
import { TicketInterface } from '../../interfaces/ticket'
import { CreateTicket as createTicket, GetTicketStatusById} from '../../services/http/ticket'
import './create_ticket.css'

const { Header,Content } = Layout;

const CreateTicket: React.FC = () =>  {
    
    const navigate = useNavigate();
    const handleMyTicketClick = () => {
        navigate('/myticket'); 
    };
    
    const handleCreate = async (values: TicketInterface) => {

        const ticketstatus = await GetTicketStatusById(1);

        if (ticketstatus) {
            values.StatusID = ticketstatus.ID;
            console.log("Status ID:", ticketstatus.ID);
            console.log("Received JSON:", values);
            const res = await createTicket(values);
            
            if (res.status) { 
              message.success("Ticket created successfully");
            } else {
              message.error(res.message);
            }
          } else {
            console.error("Failed to fetch TicketStatus");
          }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className='header'></Header>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 50px' }}>
                <h1>New Ticket</h1>
                <Button type="primary" onClick={handleMyTicketClick}>My Tickets</Button>
            </div>
            <Content>
                <div className='create-container'>
                    <Form onFinish={handleCreate} layout="vertical">
                        <Form.Item
                            label="Title"
                            name="Title"
                            rules={[{ required: true, message: 'Please input the title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="Description"
                            rules={[{ required: true, message: 'Please input the description!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            label="Contact"
                            name="ContactInfo"
                            rules={[{ required: true, message: 'Please input your contact information!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Ticket
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            
            </Content>
            
        </Layout>
    )
}

export default CreateTicket