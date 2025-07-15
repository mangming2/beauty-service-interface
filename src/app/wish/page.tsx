import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Wish() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Wish List</h1>
        <p className="text-lg text-muted-foreground mb-6">
          나의 위시리스트를 확인해보세요
        </p>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>위시리스트</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>저장한 서비스들을 한눈에 확인할 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
