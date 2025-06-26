import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Beauty Service Interface</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to our beauty service platform
        </p>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Beauty Service Interface</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
