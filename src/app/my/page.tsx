import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function My() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">My Page</h1>
        <p className="text-lg text-muted-foreground mb-6">
          나의 정보와 설정을 관리하세요
        </p>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>내 정보</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>프로필 정보, 예약 내역, 설정 등을 확인할 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
