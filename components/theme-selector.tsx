"use client"

import { useTheme } from "@/lib/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const themes = [
  {
    id: "default" as const,
    name: "YC Orange",
    description: "Classic BuilderSync orange",
    preview: "bg-[oklch(0.65_0.19_45)]",
  },
  {
    id: "ocean" as const,
    name: "Ocean Blue",
    description: "Deep blue waters",
    preview: "bg-[oklch(0.55_0.18_240)]",
  },
  {
    id: "forest" as const,
    name: "Forest Green",
    description: "Natural and calm",
    preview: "bg-[oklch(0.55_0.15_150)]",
  },
  {
    id: "sunset" as const,
    name: "Sunset Pink",
    description: "Warm and vibrant",
    preview: "bg-[oklch(0.65_0.20_350)]",
  },
  {
    id: "midnight" as const,
    name: "Midnight Purple",
    description: "Deep and mysterious",
    preview: "bg-[oklch(0.50_0.18_280)]",
  },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalize Your Theme</CardTitle>
        <CardDescription>Choose a color theme that matches your style</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50 relative"
              style={{
                borderColor: theme === t.id ? "var(--primary)" : "var(--border)",
              }}
            >
              {theme === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className={`w-16 h-16 rounded-full ${t.preview}`} />
              <div className="text-center">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
