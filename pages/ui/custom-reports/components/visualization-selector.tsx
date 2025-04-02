"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Table } from "lucide-react"
import type { VisualizationType } from "./index"

interface VisualizationSelectorProps {
  visualizationType: VisualizationType
  onVisualizationChange: (type: VisualizationType) => void
}

export default function VisualizationSelector({ visualizationType, onVisualizationChange }: VisualizationSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Visualization</CardTitle>
        <CardDescription>Select how to display your report data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={visualizationType}
          onValueChange={(value) => onVisualizationChange(value as VisualizationType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full h-full">
            <TabsTrigger value="table" className="flex flex-col items-center py-4">
              <Table className="h-8 w-8 mb-1" />
              <span>Table</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex flex-col items-center py-4">
              <BarChart className="h-8 w-8 mb-1" />
              <span>Bar</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex flex-col items-center py-4">
              <LineChart className="h-8 w-8 mb-1" />
              <span>Line</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex flex-col items-center py-4">
              <PieChart className="h-8 w-8 mb-1" />
              <span>Pie</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Tables are best for displaying detailed data with multiple columns and rows. Good for comparing specific
                values across many items.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="mt-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Bar charts are ideal for comparing quantities across categories. Good for showing rankings or
                distributions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Line charts are perfect for showing trends over time. Good for visualizing continuous data and
                identifying patterns.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Pie charts show proportions of a whole. Best when you have a small number of categories that add up to
                100%.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

