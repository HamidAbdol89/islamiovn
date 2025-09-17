import React, { useEffect } from "react";
import { Map as MapIcon, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MasjidMapProps } from "../types";
import { VIETNAMESE_TEXT } from "../constants";
import { useMapManager } from "../hooks";

/**
 * Map component cho Masjid với Vietnamese UI và shadcn components
 * Mobile-friendly UI
 */
const MasjidMap = React.memo<MasjidMapProps>(
  ({ hienThi, onToggle, masjids, masjidDuocChon, viTriNguoiDung }) => {
    const {
      mapRef,
      mapContainerRef,
      leafletDaTai,
      khoiTaoBanDo,
      capNhatMarkers,
    } = useMapManager();

    // Khởi tạo bản đồ khi có vị trí người dùng
    useEffect(() => {
      if (leafletDaTai && viTriNguoiDung && hienThi && !mapRef.current) {
        khoiTaoBanDo(viTriNguoiDung);
      }
    }, [leafletDaTai, viTriNguoiDung, hienThi, khoiTaoBanDo]);

    // Cập nhật markers khi masjids thay đổi
    useEffect(() => {
      if (mapRef.current && masjids.length > 0) {
        capNhatMarkers(masjids, masjidDuocChon, viTriNguoiDung);
      }
    }, [masjids, masjidDuocChon, viTriNguoiDung, capNhatMarkers]);

    if (!viTriNguoiDung || masjids.length === 0) {
      return null;
    }

    return (
      <>
        {hienThi && (
          <Card className="mb-6 shadow-lg overflow-hidden relative">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="font-semibold">
                  {VIETNAMESE_TEXT.tieuDeBanDo}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>🔵 {VIETNAMESE_TEXT.viTriCuaBan}</span>
                  {masjidDuocChon && <span>🔴 Đã chọn</span>}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div
                ref={mapContainerRef}
                className="w-full h-[65vh] rounded-t-xl border-t border-border relative"
              />

              {!leafletDaTai && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {VIETNAMESE_TEXT.dangTaiBanDo}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Floating Toggle Button */}
        <Button
          onClick={onToggle}
          size="sm"
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-md bg-primary text-white flex items-center gap-2"
        >
          <MapIcon className="h-4 w-4" />
          <span>
            {hienThi ? VIETNAMESE_TEXT.anBanDo : VIETNAMESE_TEXT.hienThiBanDo}
          </span>
        </Button>
      </>
    );
  }
);

MasjidMap.displayName = "MasjidMap";

export default MasjidMap;
