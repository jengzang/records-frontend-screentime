import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Tag, List, Statistic } from 'antd';
import { MobileOutlined, LaptopOutlined, AppstoreOutlined, SwapOutlined } from '@ant-design/icons';
import { screentimeApi } from '../services/screentimeApi';
import type { AppEcosystem } from '../types/screentime';

const AppEcosystemPage: React.FC = () => {
  const [ecosystem, setEcosystem] = useState<AppEcosystem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await screentimeApi.getAppEcosystem();
        setEcosystem(data);
      } catch (error) {
        console.error('Failed to fetch app ecosystem:', error);
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

  if (!ecosystem) {
    return <div>無法加載數據</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>應用生態分析</h1>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="跨平台應用"
              value={ecosystem.crossPlatformCount}
              prefix={<SwapOutlined />}
              suffix={`/ ${ecosystem.totalApps}`}
            />
            <div style={{ marginTop: '8px', color: '#666' }}>
              同時在手機和電腦使用
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="手機專屬應用"
              value={ecosystem.phoneOnlyApps.length}
              prefix={<MobileOutlined />}
            />
            <div style={{ marginTop: '8px', color: '#666' }}>
              僅在手機使用
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="電腦專屬應用"
              value={ecosystem.computerOnlyApps.length}
              prefix={<LaptopOutlined />}
            />
            <div style={{ marginTop: '8px', color: '#666' }}>
              僅在電腦使用
            </div>
          </Card>
        </Col>
      </Row>

      {/* Venn Diagram Visualization */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="應用分佈">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ position: 'relative', width: '600px', height: '300px' }}>
                {/* Phone circle */}
                <div style={{
                  position: 'absolute',
                  left: '50px',
                  top: '50px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(24, 144, 255, 0.3)',
                  border: '3px solid #1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <MobileOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                  <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#1890ff' }}>手機</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {ecosystem.phoneOnlyApps.length}
                  </div>
                </div>

                {/* Computer circle */}
                <div style={{
                  position: 'absolute',
                  right: '50px',
                  top: '50px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(82, 196, 26, 0.3)',
                  border: '3px solid #52c41a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <LaptopOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                  <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#52c41a' }}>電腦</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {ecosystem.computerOnlyApps.length}
                  </div>
                </div>

                {/* Intersection */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(250, 173, 20, 0.5)',
                  border: '3px solid #faad14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  zIndex: 10,
                }}>
                  <SwapOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                    {ecosystem.crossPlatformCount}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* App Lists */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card title={<span><SwapOutlined /> 跨平台應用</span>} bordered={false}>
            <List
              dataSource={ecosystem.crossPlatformApps}
              renderItem={(app) => (
                <List.Item>
                  <Tag color="gold">{app}</Tag>
                </List.Item>
              )}
              style={{ maxHeight: '400px', overflow: 'auto' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<span><MobileOutlined /> 手機專屬應用</span>} bordered={false}>
            <List
              dataSource={ecosystem.phoneOnlyApps.slice(0, 20)}
              renderItem={(app) => (
                <List.Item>
                  <Tag color="blue">{app}</Tag>
                </List.Item>
              )}
              style={{ maxHeight: '400px', overflow: 'auto' }}
            />
            {ecosystem.phoneOnlyApps.length > 20 && (
              <div style={{ marginTop: '8px', color: '#666', textAlign: 'center' }}>
                還有 {ecosystem.phoneOnlyApps.length - 20} 個應用...
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<span><LaptopOutlined /> 電腦專屬應用</span>} bordered={false}>
            <List
              dataSource={ecosystem.computerOnlyApps.slice(0, 20)}
              renderItem={(app) => (
                <List.Item>
                  <Tag color="green">{app}</Tag>
                </List.Item>
              )}
              style={{ maxHeight: '400px', overflow: 'auto' }}
            />
            {ecosystem.computerOnlyApps.length > 20 && (
              <div style={{ marginTop: '8px', color: '#666', textAlign: 'center' }}>
                還有 {ecosystem.computerOnlyApps.length - 20} 個應用...
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Insights */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="智能洞察" bordered={false}>
            <List
              dataSource={ecosystem.insights}
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

export default AppEcosystemPage;
