"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
} from "@/components/ui/chart"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { memo } from "react"
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider"
import { useTranslation } from "react-i18next"

interface RatingPieChartProps {
  chartData: Array<{
    rating: string;
    count: number;
  }>;
  ratingLabel?: string;
}

const RatingPieChart: React.FC<RatingPieChartProps> = ({
  chartData,
  ratingLabel = "Visitors"
}) => {
  const id = "pie-interactive"
  const {t} = useTranslation();
  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  // Map for translating rating values
  const ratingTranslationMap: Record<string, string> = {
    'Love': t('dashboard.love'),
    'Like': t('dashboard.like'),
    'Dislike': t('dashboard.dislike')
  };

  const colorConfig = {
    Love: { color: currentPalette.chartColors[4] },
    Like: { color: currentPalette.chartColors[2] },
    Dislike: { color: currentPalette.chartColors[1] },
  }

  // Generate chart config dynamically based on data and color config
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      [ratingLabel.toLowerCase()]: {
        label: ratingLabel
      }
    }

    return config
  }, [chartData, colorConfig, ratingLabel])

  const [activeRating, setActiveRating] = React.useState(chartData[0]?.rating || '')

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.rating === activeRating),
    [activeRating, chartData]
  )

  // Calculate total counts for percentage
  const totalCount = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0)
  }, [chartData])

  // Process data to include fill colors
  const processedData = React.useMemo(() => {
    return chartData.map(item => {
      // Safe access to color config using type guard
      const colorKey = item.rating;
      const defaultColor = `var(--chart-color-${item.rating}, #ccc)`;

      // Type guard to ensure proper access to colorConfig
      const color = typeof colorConfig === 'object' && colorConfig !== null &&
        colorKey in colorConfig ?
        (colorConfig as Record<string, { color: string }>)[colorKey]?.color :
        defaultColor;

      return {
        ...item,
        fill: color
      };
    });
  }, [chartData, colorConfig])

  // Handle click on pie sectors
  const handlePieClick = (data: any, _index: number) => {
    if (data && data.name) {
      setActiveRating(data.name);
    }
  };

  // Calculate percentage for active rating
  const activePercentage = React.useMemo(() => {
    const activeItem = chartData[activeIndex];
    return totalCount > 0 && activeItem ? +(((activeItem.count / totalCount) * 100).toFixed(2)) : 0;
  }, [chartData, activeIndex, totalCount]);

  // Get translated rating for display
  const getTranslatedRating = (rating: string): string => {
    return ratingTranslationMap[rating] || rating;
  };

  return (
    <Card
      data-chart={id}
      className="flex flex-col h-full"
      style={{ height: '100%', flexGrow: 1, overflow: 'auto'}}
    >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center w-full" style={{color: currentPalette.textPrimary}}>
          <CardTitle>{t('dashboard.contentRatings')}</CardTitle>
        </div>
      </CardHeader>
      {(chartData.every(item => item.count === 0)) ? (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          translate: '-50% -50%'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.noDataAvailable')}</Typography>
            <Typography sx={{color: darkMode ? '#ededed' : '#525252'}}>{t('dashboard.goTo')}
              <Link
                to={'/home'}
                style={{
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'rgb(5, 205, 5)'
                }}
              >
                <span> </span>{t('dashboard.home')}
              </Link>
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <CardContent className="flex flex-1 justify-center items-center pt-2 pb-0">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[260px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                />
                <Pie
                  data={processedData}
                  dataKey="count"
                  nameKey="rating"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                  onClick={handlePieClick}
                  isAnimationActive={true}
                  className="cursor-pointer"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                              fill={darkMode ? '#ededed' : '#525252'}
                            >
                              {activePercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                              fill={darkMode ? '#ededed' : '#525252'}
                            >
                              {getTranslatedRating(chartData[activeIndex]?.rating || '')}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: '8px' }}>
            {chartData.map((item) => {
              // Safe access to color config
              const colorKey = item.rating;
              const defaultColor = '#ccc';

              // Type guard to ensure proper access to colorConfig
              const color = typeof colorConfig === 'object' && colorConfig !== null &&
                colorKey in colorConfig ?
                (colorConfig as Record<string, { color: string }>)[colorKey]?.color :
                defaultColor;

              return (
                <Box
                  key={item.rating}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveRating(item.rating)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: color
                      }}
                    />
                    <Typography sx={{color: darkMode ? '#ededed' : '#525252', fontSize: '0.8rem'}}>
                      {getTranslatedRating(item.rating)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{color: darkMode ? '#ededed' : '#525252'}}>{item.count}</Typography>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Card>
  )
}

export default memo(RatingPieChart);