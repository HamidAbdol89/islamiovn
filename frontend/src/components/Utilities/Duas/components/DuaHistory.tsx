import React, { useMemo } from 'react';
import { Clock, Calendar, BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DuaHistoryItem {
  id: string;
  tenDua: string;
  danhMuc: string;
  thoiGianDoc: Date;
  soLanDoc: number;
}

interface DuaHistoryProps {
  lichSuDoc?: DuaHistoryItem[];
  onChonDua?: (duaId: string) => void;
}

const DuaHistory = React.memo<DuaHistoryProps>(({
  lichSuDoc = [],
  onChonDua
}) => {
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = React.useState('');

  // Filter history based on search
  const lichSuDaLoc = useMemo(() => {
    if (!tuKhoaTimKiem.trim()) return lichSuDoc;
    
    return lichSuDoc.filter(item => 
      item.tenDua.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      item.danhMuc.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
    );
  }, [lichSuDoc, tuKhoaTimKiem]);

  // Group by date
  const lichSuTheoNgay = useMemo(() => {
    const grouped = lichSuDaLoc.reduce((acc, item) => {
      const ngay = item.thoiGianDoc.toDateString();
      if (!acc[ngay]) {
        acc[ngay] = [];
      }
      acc[ngay].push(item);
      return acc;
    }, {} as Record<string, DuaHistoryItem[]>);

    // Sort by date (newest first)
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  }, [lichSuDaLoc]);

  const formatNgay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const formatThoiGian = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sample data if empty
  const sampleData: DuaHistoryItem[] = [
    {
      id: '1',
      tenDua: 'Dua trước khi ăn',
      danhMuc: 'Dua hàng ngày',
      thoiGianDoc: new Date(),
      soLanDoc: 3
    },
    {
      id: '2', 
      tenDua: 'Dua trước khi ngủ',
      danhMuc: 'Dua hàng ngày',
      thoiGianDoc: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      soLanDoc: 1
    },
    {
      id: '3',
      tenDua: 'Dua khi gặp khó khăn',
      danhMuc: 'Dua đặc biệt',
      thoiGianDoc: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      soLanDoc: 2
    }
  ];

  const dataHienThi = lichSuDoc.length > 0 ? lichSuTheoNgay : 
    Object.entries(sampleData.reduce((acc, item) => {
      const ngay = item.thoiGianDoc.toDateString();
      if (!acc[ngay]) acc[ngay] = [];
      acc[ngay].push(item);
      return acc;
    }, {} as Record<string, DuaHistoryItem[]>));

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm trong lịch sử..."
          value={tuKhoaTimKiem}
          onChange={(e) => setTuKhoaTimKiem(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold">{lichSuDoc.length || sampleData.length}</div>
            <div className="text-xs text-muted-foreground">Tổng lượt đọc</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold">{dataHienThi.length}</div>
            <div className="text-xs text-muted-foreground">Ngày có đọc</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">
              {Math.round((lichSuDoc.length || sampleData.length) / Math.max(dataHienThi.length, 1))}
            </div>
            <div className="text-xs text-muted-foreground">Trung bình/ngày</div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Lịch sử đọc
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {dataHienThi.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có lịch sử đọc</p>
                <p className="text-sm">Bắt đầu đọc dua để xem lịch sử tại đây</p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {dataHienThi.map(([ngay, items]) => (
                  <div key={ngay}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium text-sm">{formatNgay(ngay)}</h3>
                      <div className="flex-1 h-px bg-border"></div>
                      <Badge variant="secondary" className="text-xs">
                        {items.length} lượt
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.thoiGianDoc.getTime()}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => onChonDua?.(item.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.tenDua}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.danhMuc}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatThoiGian(item.thoiGianDoc)}
                            {item.soLanDoc > 1 && (
                              <Badge variant="outline" className="text-xs">
                                {item.soLanDoc}x
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
});

DuaHistory.displayName = 'DuaHistory';

export default DuaHistory;
