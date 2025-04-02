"use client"

import { Moon, Sun, RefreshCcw, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTheme } from "./theme-provider"
import { useToast } from "./use-toast"

const colors = [
  { name: "zinc", bg: "bg-zinc-900", text: "text-zinc-900" },
  { name: "red", bg: "bg-red-500", text: "text-red-500" },
  { name: "rose", bg: "bg-rose-500", text: "text-rose-500" },
  { name: "orange", bg: "bg-orange-500", text: "text-orange-500" },
  { name: "green", bg: "bg-green-500", text: "text-green-500" },
  { name: "blue", bg: "bg-blue-500", text: "text-blue-500" },
  { name: "yellow", bg: "bg-yellow-500", text: "text-yellow-500" },
  { name: "violet", bg: "bg-violet-500", text: "text-violet-500" },
]

const radiusOptions = ["0", "0.3", "0.5", "0.75", "1.0"]

export default function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const copyTheme = () => {
    const themeConfig = {
      color: theme.color,
      radius: theme.radius,
      mode: theme.mode,
    }
    navigator.clipboard.writeText(JSON.stringify(themeConfig, null, 2))
    toast({
      title: "Theme copied!",
      description: "The theme configuration has been copied to your clipboard.",
    })
  }

  const handleColorChange = (color: string) => {
    setTheme({ ...theme, color })
    toast({
      title: "Color updated!",
      description: `Theme color has been changed to ${color}.`,
    })
  }

  return (
    <>
      <div className="h-max bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Theme Customizer</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme({ color: "zinc", radius: "0.5", mode: "light" })}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Customize your components colors.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.name)}
                        className={`h-10 rounded-md border-2 flex items-center justify-center
                          ${theme.color === color.name ? "border-primary" : "border-transparent"}
                          ${color.bg}`}
                      >
                        {theme.color === color.name && <Check className="h-4 w-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Radius</label>
                  <ToggleGroup
                    type="single"
                    value={theme.radius}
                    onValueChange={(value) => value && setTheme({ ...theme, radius: value })}
                    className="justify-start mt-2"
                  >
                    {radiusOptions.map((r) => (
                      <ToggleGroupItem key={r} value={r} className="text-xs data-[state=on]:bg-muted">
                        {r}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div>
                  <label className="text-sm font-medium">Mode</label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={theme.mode === "light" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTheme({ ...theme, mode: "light" })}
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme.mode === "dark" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTheme({ ...theme, mode: "dark" })}
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            
          </div>
        </div>
      </div>
    </>
  )
}

