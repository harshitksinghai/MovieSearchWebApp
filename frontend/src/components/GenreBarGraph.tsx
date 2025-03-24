"use client"

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"
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
import { Box, Typography } from "@mui/material"
import { GenreChartItem } from "@/types/chartDataTypes"
import { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider"
import { useTranslation } from "react-i18next"

interface GenreBarGraphProps {
  chartData: GenreChartItem[];
  chartConfig: ChartConfig;
}

const GenreBarGraph: React.FC<GenreBarGraphProps> = ({ chartData, chartConfig }) => {
  const {t} = useTranslation();
              const { currentTheme, darkMode } = useCustomTheme();
              const getCurrentPalette = () => {
                const palette = themePalettes[currentTheme];
                return darkMode ? palette.dark : palette.light;
              };
            
              const currentPalette = getCurrentPalette();

  const enhancedChartData = useMemo(() => {
    return chartData.map((item, index) => {
      let fill;

      switch (index % 5) {
        case 0:
          fill = currentPalette.chartColors[5];
          break;
        case 1:
          fill = currentPalette.chartColors[4];
          break;
        case 2:
          fill = currentPalette.chartColors[3];
          break;
        case 3:
          fill = currentPalette.chartColors[2];
          break;
        default:
          fill = currentPalette.chartColors[1];
      }

      return {
        ...item,
        fill
      };
    });
  }, [chartData, currentPalette]);

  const formatTick = (value: any): string => {
    const config = chartConfig[value as keyof typeof chartConfig];
    return config?.label?.toString() || value.toString();
  };

  return (
    <Card style={{ height: '100%'}}>
      <CardHeader>
        <Typography sx={{ pb: '4px', color: currentPalette.textPrimary }}>
          <CardTitle>{t('dashboard.favouriteGenres')}</CardTitle>
        </Typography>
      </CardHeader>
      {chartData.length > 0 ? (
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={enhancedChartData}
              layout="vertical"
              margin={{
                left: 10,
                right: 30,
              }}
            >
              <YAxis
                dataKey="genre"
                type="category"
                tickLine={false}
                tickMargin={0}
                axisLine={false}
                tickFormatter={formatTick}
              />
              <XAxis
                dataKey="count"
                type="number"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Bar
                dataKey="count"
                layout="vertical"
                radius={8}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
                {enhancedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      ) : (
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
      )}
    </Card>
  )
}

export default memo(GenreBarGraph);