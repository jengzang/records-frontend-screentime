import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { screentimeApi, formatDuration } from '../services/screentimeApi';
import type { HourlyAllocation } from '../types/screentime';

const TimeAllocation: React.FC = () => {
  const [allocation, setAllocation] = useState<HourlyAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await screentimeApi.getTimeAllocation();
        setAllocation(data);
      } catch (error) {
        console.error('Failed to fetch time allocation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!allocation || allocation.length === 0) {
    return <div>無法加載數據</div>;
  }

  // Prepare chart data
  const chartData = allocation.map((item) => ({
    hour: `${item.hour}:00`,
    手機: Math.round(item.phoneDuration / 60000), // Convert to minutes
    電腦: Math.round(item.computerDuration / 60000),
  }));

  // Prepare table data
  const tableData = allocation.map((item, index) => ({
    key: index,
    hour: `${item.hour}:00 - ${item.hour + 1}:00`,
    phoneDuration: formatDuration(item.phoneDuration),
    computerDuration: formatDuration(item.computerDuration),
    totalDuration: formatDuration(item.totalDuration),
    phonePercentage: `${item.phonePercentage.toFixed(1)}%`,
    computerPercentage: `${item.computerPercentage.toFixed(1)}%`,
  }));

  const columns = [
    {
      title: '時段',
      dataIndex: 'hour',
      key: 'hour',
      width: 150,
    },
    {
      title: '手機使用',
      dataIndex: 'phoneDuration',
      key: 'phoneDuration',
    },
    {
      title: '電腦使用',
      dataIndex: 'computerDuration',
      key: 'computerDuration',
    },
    {
      title: '總時長',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
    },
    {
      title: '手機占比',
      dataIndex: 'phonePercentage',
      key: 'phonePercentage',
    },
    {
      title: '電腦占比',
      dataIndex: 'computerPercentage',
      key: 'computerPercentage',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>時間分配分析</h1>

      {/* 24-hour stacked bar chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="24小時設備使用分佈">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: '使用時長（分鐘）', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="手機" stackId="a" fill="#1890ff" />
                <Bar dataKey="電腦" stackId="a" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Detailed table */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="詳細數據">
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={false}
              scroll={{ y: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TimeAllocation;
