"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Typography } from "@mui/material"
import { memo } from "react"
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider"
import { useTranslation } from "react-i18next"

interface MainBarChartProps{
    chartData: {month: string; time: number}[]
}

const MainBarChart: React.FC<MainBarChartProps> = ({chartData}) => {
    const {t} = useTranslation();
          const { currentTheme, darkMode } = useCustomTheme();
          const getCurrentPalette = () => {
            const palette = themePalettes[currentTheme];
            return darkMode ? palette.dark : palette.light;
          };
        
          const currentPalette = getCurrentPalette();

    const chartConfig = {
        time: {
            label: "Desktop",
            color: darkMode ? '#ededed' : '#525252',
        },
        label: {
            color: darkMode ? '#ededed' : '#525252',
        },
    } satisfies ChartConfig
    
    return (
        <Card>
            <CardHeader>
                <Typography sx={{ pb: '4px', color: currentPalette.textPrimary }}>

                    <CardTitle>{t('dashboard.watchOverview')}</CardTitle>
                </Typography>
                {/* <CardDescription>January - December 2025</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 24,
                        }}
                    >
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            dataKey="time"
                            tickLine={false}
                            tickMargin={12}
                            axisLine={false}
                            tickFormatter={(value) => value + 'hrs'}
                        />
                        {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
                        <Bar dataKey="time" fill={currentPalette.chartColors[1]} radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
        </Card>
    )
}
export default memo(MainBarChart);