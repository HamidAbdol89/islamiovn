import React, { useMemo } from 'react';
import { BarChart3, BookOpen, Heart, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DuaStatsProps {
  tongSoDuaDaDoc?: number;
  tongSoDua?: number;
  soLuongYeuThich?: number;
  thoiGianDocTrungBinh?: number; // phút
  streakHienTai?: number; // số ngày liên tiếp
}

const DuaStats = React.memo<DuaStatsProps>(({
  tongSoDuaDaDoc = 0,
  tongSoDua = 100,
  soLuongYeuThich = 0,
  thoiGianDocTrungBinh = 0,
  streakHienTai = 0
}) => {
  // Tính phần trăm hoàn thành
  const phanTramHoanThanh = useMemo(() => 
    tongSoDua > 0 ? Math.round((tongSoDuaDaDoc / tongSoDua) * 100) : 0,
    [tongSoDuaDaDoc, tongSoDua]
  );

  // Tính level dựa trên số dua đã đọc
  const level = useMemo(() => 
    Math.floor(tongSoDuaDaDoc / 10) + 1,
    [tongSoDuaDaDoc]
  );

  const duaCanThietChoLevelTiep = useMemo(() => 
    (level * 10) - tongSoDuaDaDoc,
    [level, tongSoDuaDaDoc]
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{tongSoDuaDaDoc}</div>
            <div className="text-sm text-muted-foreground">Dua đã đọc</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{soLuongYeuThich}</div>
            <div className="text-sm text-muted-foreground">Yêu thích</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{thoiGianDocTrungBinh}</div>
            <div className="text-sm text-muted-foreground">Phút/ngày</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{streakHienTai}</div>
            <div className="text-sm text-muted-foreground">Ngày liên tiếp</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tiến độ đọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Hoàn thành</span>
              <span>{phanTramHoanThanh}%</span>
            </div>
            <Progress value={phanTramHoanThanh} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {tongSoDuaDaDoc} / {tongSoDua} dua
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Level {level}</div>
                <div className="text-sm text-muted-foreground">
                  Còn {duaCanThietChoLevelTiep} dua để lên level {level + 1}
                </div>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Thành tựu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-lg ${tongSoDuaDaDoc >= 10 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xs">Người đọc</div>
              <div className="text-xs">(10 dua)</div>
            </div>
            
            <div className={`p-3 rounded-lg ${tongSoDuaDaDoc >= 50 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xs">Tận tâm</div>
              <div className="text-xs">(50 dua)</div>
            </div>
            
            <div className={`p-3 rounded-lg ${streakHienTai >= 7 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs">Kiên trì</div>
              <div className="text-xs">(7 ngày)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

DuaStats.displayName = 'DuaStats';

export default DuaStats;
