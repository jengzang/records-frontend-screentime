import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { MobileOutlined, LaptopOutlined, GlobalOutlined } from '@ant-design/icons';
import { screentimeApi } from '../services/screentimeApi';
import type { Device } from '../types/screentime';

const { Option } = Select;

interface DeviceSelectorProps {
  value?: string;
  onChange?: (deviceId: string) => void;
  style?: React.CSSProperties;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ value = 'all', onChange, style }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await screentimeApi.listDevices();
        setDevices(data);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <MobileOutlined />;
      case 'computer':
        return <LaptopOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      loading={loading}
      style={{ width: 200, ...style }}
      placeholder="選擇設備"
    >
      <Option value="all">
        <GlobalOutlined /> 全部設備
      </Option>
      {devices.map((device) => (
        <Option key={device.id} value={device.id}>
          {getDeviceIcon(device.type)} {device.name}
        </Option>
      ))}
    </Select>
  );
};

export default DeviceSelector;
