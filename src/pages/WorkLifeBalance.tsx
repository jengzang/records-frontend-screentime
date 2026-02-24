import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Spin, Tag } from 'antd';
import { TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { screentimeApi, formatDuration } from '../services/screentimeApi';
import type { WorkLifeBalance } from '../types/screentime';

const WorkLifeBalancePage: React.FC = () => {
  const [balance, setBalance] = useState<WorkLifeBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await screentimeApi.getWorkLifeBalance();
        setBalance(data);
      } catch (error) {
        console.error('Failed to fetch work-life balance:', error);
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

  if (!balance) {
    return <div>無法加載數據</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return '優秀';
    if (score >= 60) return '良好';
    return '需改善';
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>工作生活平衡</h1>

      {/* Balance Score */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '72px', color: getScoreColor(balance.balanceScore) }}>
                {balance.balanceScore}
              </div>
              <div style={{ fontSize: '24px', marginTop: '8px' }}>
                <Tag color={getScoreColor(balance.balanceScore)}>
                  {getScoreStatus(balance.balanceScore)}
                </Tag>
              </div>
              <div style={{ marginTop: '16px', color: '#666' }}>
                工作生活平衡評分
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="時長分佈">
            <Statistic
              title="工作時長"
              value={formatDuration(balance.workDuration)}
              prefix={<ClockCircleOutlined />}
              suffix={`(${balance.workPercentage.toFixed(1)}%)`}
              style={{ marginBottom: '16px' }}
            />
            <Progress
              percent={balance.workPercentage}
              strokeColor="#1890ff"
              showInfo={false}
              style={{ marginBottom: '24px' }}
            />

            <Statistic
              title="生活時長"
              value={formatDuration(balance.lifeDuration)}
              prefix={<ClockCircleOutlined />}
              suffix={`(${balance.lifePercentage.toFixed(1)}%)`}
              style={{ marginBottom: '16px' }}
            />
            <Progress
              percent={balance.lifePercentage}
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Recommendation */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="建議">
            <div style={{ fontSize: '16px', padding: '12px', background: '#f0f2f5', borderRadius: '4px' }}>
              {balance.recommendation}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Insights */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="智能洞察">
            <List
              dataSource={balance.insights}
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

export default WorkLifeBalancePage;
