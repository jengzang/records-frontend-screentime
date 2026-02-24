import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Spin } from 'antd';
import { MobileOutlined, LaptopOutlined, ClockCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { screentimeApi, formatDuration } from '../services/screentimeApi';
import type { CrossDeviceComparison } from '../types/screentime';

const CrossDeviceAnalysis: React.FC = () => {
  const [comparison, setComparison] = useState<CrossDeviceComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await screentimeApi.getCrossDeviceComparison();
        setComparison(data);
      } catch (error) {
        console.error('Failed to fetch cross-device comparison:', error);
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

  if (!comparison) {
    return <div>無法加載數據</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>跨設備分析</h1>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="手機使用"
              value={formatDuration(comparison.phone.totalDuration)}
              prefix={<MobileOutlined />}
              suffix={`(${comparison.total.phonePercentage.toFixed(1)}%)`}
            />
            <div style={{ marginTop: '12px' }}>
              <div>應用數: {comparison.phone.totalApps}</div>
              <div>活躍天數: {comparison.phone.activeDays}</div>
              <div>最常用: {comparison.phone.topApp}</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="電腦使用"
              value={formatDuration(comparison.computer.totalDuration)}
              prefix={<LaptopOutlined />}
              suffix={`(${comparison.total.computerPercentage.toFixed(1)}%)`}
            />
            <div style={{ marginTop: '12px' }}>
              <div>應用數: {comparison.computer.totalApps}</div>
              <div>活躍天數: {comparison.computer.activeDays}</div>
              <div>最常用: {comparison.computer.topApp}</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="總屏幕時間"
              value={formatDuration(comparison.total.totalDuration)}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: '12px' }}>
              <div>日均: {formatDuration(comparison.total.avgDailyDuration)}</div>
              <div>總應用: {comparison.phone.totalApps + comparison.computer.totalApps}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Device Usage Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="設備使用分佈">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <MobileOutlined /> 手機: {comparison.total.phonePercentage.toFixed(1)}%
              </div>
              <Progress
                percent={comparison.total.phonePercentage}
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <LaptopOutlined /> 電腦: {comparison.total.computerPercentage.toFixed(1)}%
              </div>
              <Progress
                percent={comparison.total.computerPercentage}
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Insights */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="智能洞察">
            <List
              dataSource={comparison.insights}
              renderItem={(insight) => (
                <List.Item>
                  <List.Item.Meta description={insight} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CrossDeviceAnalysis;
