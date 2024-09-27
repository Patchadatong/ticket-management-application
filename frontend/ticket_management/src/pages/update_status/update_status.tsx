import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Form, Select, Layout,Menu,theme,Table, Tag  } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import { TicketInterface } from '../../interfaces/ticket'
import { GetTickets, UpdateTicket} from '../../services/http/ticket'
import logos from '../../assets/logos.png'
import '../create_ticket/create_ticket.css'
import './update_status.css'
import { Key } from 'antd/es/table/interface';

const { Header, Sider, Content } = Layout;

const Update_status: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState<TicketInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInterface | null>(null);
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState('1');
  
  const statusOptions = [
    { id: 2, name: 'Accepted' },
    { id: 3, name: 'Resolved' },
    { id: 4, name: 'Rejected' },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

 
  const [statusCounts, setStatusCounts] = useState({ pending: 0,accepted: 0, resolved: 0, rejected: 0 });

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await GetTickets(); 
      setTickets(data);
      
      
      const counts = {
        pending: data.filter(ticket => ticket.Status?.ID === 1).length,
        accepted: data.filter(ticket => ticket.Status?.ID === 2).length,
        resolved: data.filter(ticket => ticket.Status?.ID === 3).length,
        rejected: data.filter(ticket => ticket.Status?.ID === 4).length,
      };
      setStatusCounts(counts); 
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Update selected key based on current path
    if (location.pathname === '/') {
      setSelectedKey('1');
    } else if (location.pathname === '/myticket') {
      setSelectedKey('2');
    }
  }, [location]);

  const showModal = (ticket: TicketInterface) => {
    setCurrentTicket(ticket);
    form.setFieldsValue({
      StatusID: ticket.Status?.ID, 
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentTicket) {
        await UpdateTicket(currentTicket.ID, { 
          ...currentTicket, 
          StatusID: Number(values.StatusID)
        });
        const updatedTickets = await GetTickets();
        setTickets(updatedTickets);
        
        const counts = {
          pending: updatedTickets.filter(ticket => ticket.Status?.ID === 1).length,
          accepted: updatedTickets.filter(ticket => ticket.Status?.ID === 2).length,
          resolved: updatedTickets.filter(ticket => ticket.Status?.ID === 3).length,
          rejected: updatedTickets.filter(ticket => ticket.Status?.ID === 4).length,
        };
        setStatusCounts(counts); 
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  const columns = [
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'title',
    },
   
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'status',
      render: (status: { Status: string; ID?: number } | undefined) => {
        let color = '';
        switch (status?.ID) {
          case 1:
            color = 'blue'; // Pending
            break;
          case 2:
            color = 'orange'; // Accepted
            break;
          case 3:
            color = 'green'; // Resolved
            break;
          case 4:
            color = 'red'; // Rejected
            break;
        }
        return <Tag color={color}>{status?.Status || 'Unknown'}</Tag>;
      },
      filters: [
        { text: 'Pending', value: '1' },
        { text: 'Accepted', value: '2' },
        { text: 'Resolved', value: '3' },
        { text: 'Rejected', value: '4' },
      ],

      onFilter: (value: string | number | boolean | Key, record: TicketInterface) => {
        return record.Status?.ID?.toString() === value.toString();
      },
      
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      key: 'createdAt',
      render: (dateString: string) => formatDate(dateString),
    },
    {
      title: 'UpdatedAt',
      dataIndex: 'UpdatedAt',
      key: 'updatedAt',
      render: (dateString: string) => formatDate(dateString),
    },
    {
      title: 'Action',
      key: 'action',
      render: (ticket: TicketInterface) => (
        <a type="primary" onClick={() => showModal(ticket)}>Update Status</a>
      ),
    },
  ];
  
  
  return (
    <>
      <Layout  style={{ minHeight: '100vh' }}>
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
          <h1>Dashboard</h1>
          <Content>
            <div className="card-container">
            <div className="card card1">
                <h3>Pending</h3>
                <p>{statusCounts.pending}</p>
              </div>
              <div className="card card2">
                <h3>Accepted</h3>
                <p>{statusCounts.accepted}</p>
              </div>
              <div className="card card3">
                <h3>Resolved</h3>
                <p>{statusCounts.resolved}</p>
              </div>
              <div className="card card4">
                <h3>Rejected</h3>
                <p>{statusCounts.rejected}</p>
              </div>
            </div>
            <Table
              bordered
              dataSource={tickets}
              columns={columns}
              rowKey="ID" 
              className='table'
              pagination={{
              pageSize: 5, 
              showSizeChanger: false, 
              }}
            />
          </Content>
        </Layout>
      </Layout>  
      <Modal title="Update Ticket Status" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Status"
            name="StatusID"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              {statusOptions.map(status => (
                <Select.Option key={status.id} value={status.id}>
                  {status.name}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        </Form>
      </Modal>
    </>
   
  )
}

export default Update_status