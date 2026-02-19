"use client";

import { useEffect, useRef } from "react";

interface KakaoGeocoderResult {
  x: string;
  y: string;
  address_name: string;
}

type KakaoLatLng = {
  new (lat: number, lng: number): KakaoLatLng;
};

type KakaoMap = {
  new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number }
  ): KakaoMap;
  setCenter(latlng: KakaoLatLng): void;
};

type KakaoMarker = {
  new (options: { map: KakaoMap; position: KakaoLatLng }): KakaoMarker;
};

type KakaoInfoWindow = {
  new (options: { content: string }): KakaoInfoWindow;
  open(map: KakaoMap, marker: KakaoMarker): void;
};

type KakaoGeocoder = {
  new (): KakaoGeocoder;
  addressSearch(
    address: string,
    callback: (result: KakaoGeocoderResult[], status: string) => void
  ): void;
};

interface KakaoMaps {
  LatLng: KakaoLatLng;
  Map: KakaoMap;
  Marker: KakaoMarker;
  InfoWindow: KakaoInfoWindow;
  services: {
    Geocoder: KakaoGeocoder;
    Status: {
      OK: string;
    };
  };
  load(callback: () => void): void;
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

interface KakaoMapProps {
  address?: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function KakaoMap({
  address = "사당동 142-38",
  width = "100%",
  height = "192px", // h-48 equivalent
  className = "",
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API is not loaded");
        return;
      }

      if (!mapContainer.current) return;

      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(37.4845, 126.9816), // 사당동 좌표
        level: 3, // 지도 확대 레벨
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainer.current, options);

      // 주소-좌표 변환 객체 생성
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 주소로 좌표를 검색
      geocoder.addressSearch(
        address,
        function (result: KakaoGeocoderResult[], status: string) {
          // 정상적으로 검색이 완료됐으면
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );

            // 결과값으로 받은 위치를 마커로 표시
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 인포윈도우로 장소에 대한 설명을 표시
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;color:#000;font-size:12px;">${address}</div>`,
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동
            map.setCenter(coords);
          } else {
            // 주소 검색 실패 시 기본 위치(사당동) 사용
            console.warn("Address search failed, using default location");
            const defaultCoords = new window.kakao.maps.LatLng(
              37.4845,
              126.9816
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: defaultCoords,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;color:#000;font-size:12px;">${address}</div>`,
            });
            infowindow.open(map, marker);
          }
        }
      );
    };

    // Kakao Maps API가 이미 로드되어 있으면 바로 실행
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      // API가 로드되지 않았으면 로드 완료 이벤트 대기
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [address]);

  return (
    <div
      ref={mapContainer}
      style={{ width, height }}
      className={`rounded-lg ${className}`}
    />
  );
}
