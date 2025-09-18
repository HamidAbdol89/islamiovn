// 🚀 Enterprise Status Panel - Showcase advanced features
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnterpriseStatusPanelProps {
  getSyncStatus: (masjidId: string) => 'idle' | 'syncing' | 'conflict' | 'offline' | 'error';
  getRecentActivity: (masjidId: string) => any[];
  analyticsTracker: {
    getMetrics: () => {
      operationLatency: number[];
      syncLatency: number[];
      conflictCount: number;
      offlineOperations: number;
      cacheHitRate: number;
      networkErrors: number;
    };
  };
  isOnline: boolean;
  selectedMasjidId?: string;
}

const EnterpriseStatusPanel: React.FC<EnterpriseStatusPanelProps> = React.memo(({
  getSyncStatus,
  getRecentActivity,
  analyticsTracker,
  isOnline,
  selectedMasjidId = 'demo-masjid'
}) => {
  const syncStatus = getSyncStatus(selectedMasjidId);
  const recentActivity = getRecentActivity(selectedMasjidId);
  const metrics = analyticsTracker.getMetrics();

  const avgLatency = metrics.operationLatency.length > 0 
    ? Math.round(metrics.operationLatency.reduce((a, b) => a + b, 0) / metrics.operationLatency.length)
    : 0;

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'syncing': return 'bg-blue-500 text-white';
      case 'offline': return 'bg-gray-500 text-white';
      case 'conflict': return 'bg-yellow-500 text-black';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing': return '🔄';
      case 'offline': return '📴';
      case 'conflict': return '⚠️';
      case 'error': return '❌';
      default: return '✅';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'syncing': return 'Đang đồng bộ';
      case 'offline': return 'Offline';
      case 'conflict': return 'Xung đột';
      case 'error': return 'Lỗi';
      default: return 'Sẵn sàng';
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">🌐 Trạng thái kết nối</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Badge className={cn(
              "text-xs",
              isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </Badge>
            <Badge className={cn("text-xs", getSyncStatusColor(syncStatus))}>
              {getSyncStatusIcon(syncStatus)} {getSyncStatusText(syncStatus)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">📊 Hiệu suất Enterprise</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-muted-foreground">Độ trễ trung bình</div>
              <div className="font-semibold text-green-600">{avgLatency}ms</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Xung đột</div>
              <div className="font-semibold text-yellow-600">{metrics.conflictCount}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Thao tác offline</div>
              <div className="font-semibold text-blue-600">{metrics.offlineOperations}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Lỗi mạng</div>
              <div className="font-semibold text-red-600">{metrics.networkErrors}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground">Tỷ lệ cache hit</div>
              <div className="font-semibold text-purple-600">
                {Math.round(metrics.cacheHitRate * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">🔔 Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">
                    {activity.type === 'favorite-added' && '❤️ Người dùng đã thích'}
                    {activity.type === 'favorite-removed' && '💔 Người dùng đã bỏ thích'}
                    {activity.type === 'user-activity' && '👥 Hoạt động người dùng'}
                  </span>
                  <span className="ml-auto text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-2">
                Chưa có hoạt động nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Features Badge */}
      <Card className="border-dashed border-2 border-primary/20">
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="text-xs font-semibold text-primary">
              🚀 ENTERPRISE FEATURES
            </div>
            <div className="text-xs text-muted-foreground">
              Real-time sync • Conflict resolution • Offline support • Analytics
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="outline" className="text-xs">Facebook-level</Badge>
              <Badge variant="outline" className="text-xs">Production-ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

EnterpriseStatusPanel.displayName = 'EnterpriseStatusPanel';

export default EnterpriseStatusPanel;
