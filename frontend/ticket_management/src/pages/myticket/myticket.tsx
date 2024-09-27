import React, { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import { Layout ,Card ,Button,Modal,Form,Input,Menu,theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SolutionOutlined,
  EditOutlined 
} from '@ant-design/icons';
import logos from '../../assets/logos.png'
import '../create_ticket/create_ticket.css'
import './myticket.css'
import { TicketInterface } from '../../interfaces/ticket'
import { GetTickets , UpdateTicket} from '../../services/http/ticket'

const { Header, Sider, Content } = Layout;

const Myticket: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInterface | null>(null);
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState('1');

  const handleAddTicketClick = () => {
    navigate('/create'); 
  };


  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showModal = (ticket: TicketInterface) => {
    setCurrentTicket(ticket);
    form.setFieldsValue(ticket); 
    setIsModalOpen(true);
  };

  const showDetailModal = (ticket: TicketInterface) => {
    setCurrentTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await UpdateTicket(currentTicket?.ID, values); 
      setIsModalOpen(false);
      const updatedTickets = await GetTickets();
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };
  

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const [tickets, setTickets] = useState<TicketInterface[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await GetTickets();
        setTickets(data);
    };
  
    fetchTickets();
  }, []);

  useEffect(() => {
      
    if (location.pathname === '/') {
      setSelectedKey('1');
    } else if (location.pathname === '/myticket') {
      setSelectedKey('2');
    }
  }, [location]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // ใช้สำหรับแสดง AM/PM
      };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };
  
  const statusOrder = ['pending', 'accepted', 'resolved', 'rejected'];
  // แยก Ticket ตามสถานะ
  const groupedTickets = tickets.reduce((acc: { [key: string]: TicketInterface[] }, ticket) => {
    const statusName = ticket.Status?.Status || 'Unknown'; 
    (acc[statusName] = acc[statusName] || []).push(ticket);
    return acc;
  }, {});

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div /><img className='logo' src={logos} alt="logos" />
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
              {
                key: '1',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
                onClick: () => navigate('/')
              },
              {
                key: '2',
                icon: <SolutionOutlined />,
                label: 'Tickets',
                onClick: () => navigate('/myticket')
              },
            ]}
          />
      </Sider>
      <Layout>
        <Header className='header'>
          <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className='menu-button'
            />
        </Header>
        <Content style={{ padding: '0 50px', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 50px' }}>
            <h1>My Tickets</h1>
            <Button type="primary" onClick={handleAddTicketClick}>Add Ticket</Button>
          </div>
          <div style={{ margin: '0 50px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {statusOrder.map((status) => (
                <div key={status} style={{ width: '30%', padding: '1.5%'}}>
                  <div>
                    <h3 style={{ marginBottom: '10%' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                  </div>
                  <div className={`ticket-container status-${status}`}>
                      {groupedTickets[status]?.map((ticket) => (
                        <Card key={ticket.ID} className="custom-card" style={{ marginBottom: '10%' }}>
                          <h4>{ticket.Title}</h4>
                          <p style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            Contact: {ticket.ContactInfo}
                          </p>
                          <Button type="link" onClick={() => showDetailModal(ticket)}>
                            More Detail
                          </Button>
                          <a style={{ border: '1px solid #1890ff', padding: '5px', borderRadius: '4px' ,fontSize: '14px'}}  type="primary" onClick={() => showModal(ticket)}>
                            <EditOutlined />
                          </a>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Content>
      </Layout>

    <Modal title="Edit Ticket" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
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
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Contact Info"
            name="ContactInfo"
            rules={[{ required: true, message: 'Please input the contact info!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="StatusID" 
          >
            <Input disabled value={currentTicket?.Status?.Status} /> 
          </Form.Item>
        </Form>
      </Modal>

       <Modal 
                title="Ticket Details" 
                open={isDetailModalOpen} 
                onCancel={handleCancel} 
                footer={null} 
            >
                {currentTicket && (
                    <div>
                        <h4>{currentTicket.Title}</h4>
                        <p>Description: {currentTicket.Description}</p>
                        <p>Contact: {currentTicket.ContactInfo}</p>
                        <p>Created At: {formatDate(currentTicket.CreatedAt)}</p>
                        <p>Updated At: {formatDate(currentTicket.UpdatedAt)}</p>
                        <p>Status: {currentTicket.Status?.Status || 'Unknown'}</p>
                    </div>
                )}
            </Modal>
    </Layout>
  )
}

export default Myticket