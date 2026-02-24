import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Tag, List, Statistic } from 'antd';
import { UserOutlined, TrophyOutlined, HeartOutlined, BulbOutlined } from '@ant-design/icons';
import { screentimeApi, formatDuration } from '../services/screentimeApi';
import type { UserProfile } from '../types/screentime';

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await screentimeApi.getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
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

  if (!profile) {
    return <div>無法加載數據</div>;
  }

  const getTagColor = (type: string) => {
    const colorMap: Record<string, string> = {
      '手機依賴型': 'blue',
      '電腦依賴型': 'green',
      '平衡型': 'gold',
      '遠程工作': 'purple',
      '辦公室工作': 'cyan',
      '混合模式': 'orange',
      '手機娛樂型': 'magenta',
      '電腦娛樂型': 'lime',
      '高生產力': 'green',
      '中生產力': 'gold',
      '低生產力': 'red',
      '健康': 'green',
      '警告': 'orange',
      '危險': 'red',
    };
    return colorMap[type] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>跨設備用戶畫像</h1>

      {/* Profile Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="設備使用特徵" bordered={false}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#666' }}>設備依賴度</div>
              <Tag color={getTagColor(profile.deviceDependency)} style={{ fontSize: '16px', padding: '8px 16px' }}>
                {profile.deviceDependency}
              </Tag>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#666' }}>工作模式</div>
              <Tag color={getTagColor(profile.workMode)} style={{ fontSize: '16px', padding: '8px 16px' }}>
                {profile.workMode}
              </Tag>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#666' }}>娛樂偏好</div>
              <Tag color={getTagColor(profile.entertainmentPref)} style={{ fontSize: '16px', padding: '8px 16px' }}>
                {profile.entertainmentPref}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="生產力與健康" bordered={false}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#666' }}>生產力類型</div>
              <Tag color={getTagColor(profile.productivityType)} style={{ fontSize: '16px', padding: '8px 16px' }}>
                <TrophyOutlined /> {profile.productivityType}
              </Tag>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#666' }}>健康狀況</div>
              <Tag color={getTagColor(profile.healthStatus)} style={{ fontSize: '16px', padding: '8px 16px' }}>
                <HeartOutlined /> {profile.healthStatus}
              </Tag>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Statistic
                title="總屏幕時間"
                value={formatDuration(profile.totalScreentime)}
                prefix={<UserOutlined />}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recommendations */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title={<span><BulbOutlined /> 智能建議</span>} bordered={false}>
            <List
              dataSource={profile.recommendations}
              renderItem={(recommendation, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#1890ff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>}
                    description={recommendation}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfilePage;
