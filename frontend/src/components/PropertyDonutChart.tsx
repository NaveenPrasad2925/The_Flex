import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import chartData from '../data/propertyChartData.json';

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

// Convert hex color to rgba with opacity
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Prepare Tab 1 data (Property Type & Revenue Share)
// Inner Ring: Property Type percentage (count_percentage)
// Outer Ring: Revenue Share percentage (revenue_percentage)
const tab1InnerData: ChartDatum[] = chartData.tab1.data.map((item) => ({
  id: item.category,
  label: item.category,
  value: item.count_percentage,
  percentage: item.count_percentage,
  color: item.color,
}));

const tab1OuterData: ChartDatum[] = chartData.tab1.data.map((item) => ({
  id: `${item.category}-revenue`,
  label: item.category,
  value: item.revenue_percentage,
  percentage: item.revenue_percentage,
  color: hexToRgba(item.color, 0.6), // Slightly transparent for outer ring
}));

// Prepare Tab 2 data (Property Status & Booking Share)
// Inner Ring: Status Category percentage (count_percentage)
// Outer Ring: Booking Share percentage (booking_percentage)
const tab2InnerData: ChartDatum[] = chartData.tab2.data.map((item) => ({
  id: item.category,
  label: item.category,
  value: item.count_percentage,
  percentage: item.count_percentage,
  color: item.color,
}));

const tab2OuterData: ChartDatum[] = chartData.tab2.data.map((item) => ({
  id: `${item.category}-booking`,
  label: item.category,
  value: item.booking_percentage,
  percentage: item.booking_percentage,
  color: hexToRgba(item.color, 0.6), // Slightly transparent for outer ring
}));

const StyledText = styled('text')(({ theme }: { theme: Theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
  fontWeight: 600,
}));

interface PieCenterLabelProps {
  children: React.ReactNode;
}

function PieCenterLabel({ children }: PieCenterLabelProps): React.ReactElement {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

type ViewType = 'type' | 'status';

export default function PropertyDonutChart(): React.ReactElement {
  const navigate = useNavigate();
  const [view, setView] = React.useState<ViewType>('type');
  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const innerRadius = 80;
  const middleRadius = 160;

  const currentTab = view === 'type' ? chartData.tab1 : chartData.tab2;
  const innerData = view === 'type' ? tab1InnerData : tab2InnerData;
  const outerData = view === 'type' ? tab1OuterData : tab2OuterData;
  const centerLabel = view === 'type' ? currentTab.innerRingFocus : currentTab.innerRingFocus;

  // Map category names to filter values
  const mapCategoryToFilter = (category: string, viewType: ViewType): { filterType: string; filterValue: string } | null => {
    if (viewType === 'type') {
      // Map property types to category filters
      if (category.includes('Entire Home') || category.includes('Villa')) {
        return { filterType: 'category', filterValue: 'entire_home' };
      }
      if (category.includes('Studio') || category.includes('Apartment')) {
        return { filterType: 'category', filterValue: 'entire_home' }; // Studio/Apartment is typically entire home
      }
      if (category.includes('Private Room')) {
        return { filterType: 'category', filterValue: 'private_room' };
      }
      if (category.includes('Shared Room') || category.includes('Hostel')) {
        return { filterType: 'category', filterValue: 'shared_room' };
      }
      if (category.includes('Boutique') || category.includes('Unique Stay')) {
        return { filterType: 'category', filterValue: 'entire_home' }; // Default to entire home
      }
    } else if (viewType === 'status') {
      // Map status categories to rating filters
      if (category.includes('High Performing') || category.includes('>4.5')) {
        return { filterType: 'rating', filterValue: '8' }; // 4.5 * 2 = 9, so 8+ covers it
      }
      if (category.includes('Solid') || category.includes('4.3-4.5')) {
        return { filterType: 'rating', filterValue: '7' }; // 4.3 * 2 = 8.6, so 7+ covers it
      }
      if (category.includes('Average') || category.includes('4.0-4.3')) {
        return { filterType: 'rating', filterValue: '6' }; // 4.0 * 2 = 8, so 6+ covers it
      }
      if (category.includes('Needs Attention') || category.includes('<4.0')) {
        return { filterType: 'rating', filterValue: '5' }; // Less than 4.0 * 2 = 8, so 5+ covers lower ratings
      }
      if (category.includes('New/Unrated')) {
        return null; // No filter for unrated
      }
    }
    return null;
  };

  const handleItemClick = (
    _event: React.MouseEvent,
    _itemIdentifier: { type: string; seriesId: string | number; dataIndex: number },
    item: any
  ) => {
    const clickedId = (item?.id || item?.label) as string;
    const categoryId = clickedId.split('-')[0]; // Remove suffix like '-revenue' or '-booking'
    
    // Find the category name from the data
    const categoryItem = currentTab.data.find((d) => d.category === categoryId);
    if (!categoryItem) return;

    const filterMapping = mapCategoryToFilter(categoryItem.category, view);
    if (!filterMapping) return;

    // Navigate to listings page with filter parameters
    const params = new URLSearchParams();
    params.set('filter', filterMapping.filterType);
    params.set('value', filterMapping.filterValue);
    
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center', pt: 0, pb: 8, minHeight: 'auto', overflow: 'visible' }}>
      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center', zIndex: 10, position: 'relative' }}>
        <ToggleButtonGroup
          color="primary"
          size="large"
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '4px'
          }}
        >
          <ToggleButton value="type" sx={{ px: 3, py: 1 }}>View by Type</ToggleButton>
          <ToggleButton value="status" sx={{ px: 3, py: 1 }}>View by Status</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minHeight: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'visible', position: 'relative' }}>
          <PieChart
            width={540}
            height={450}
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: innerData,
                arcLabel: (item) => {
                  const datum = item as unknown as ChartDatum;
                  return `${datum.percentage.toFixed(0)}%`;
                },
                arcLabelMinAngle: 15,
                valueFormatter: ({ value, id }) => {
                  const currentTab = view === 'type' ? chartData.tab1 : chartData.tab2;
                  const item = currentTab.data.find((d) => d.category === id);
                  if (view === 'type') {
                    return `${item?.category}: ${value}% of properties`;
                  } else {
                    return `${item?.category}: ${value}% of properties`;
                  }
                },
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 3 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 30,
                data: outerData,
                arcLabel: (item) => {
                  const datum = item as unknown as ChartDatum;
                  return `${datum.percentage.toFixed(0)}%`;
                },
                arcLabelMinAngle: 15,
                arcLabelRadius: 200,
                valueFormatter: ({ value, id }) => {
                  const currentTab = view === 'type' ? chartData.tab1 : chartData.tab2;
                  const categoryId = (id as string).split('-')[0];
                  const item = currentTab.data.find((d) => d.category === categoryId);
                  if (view === 'type') {
                    return `${item?.category}: ${value}% revenue share`;
                  } else {
                    return `${item?.category}: ${value}% booking share`;
                  }
                },
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 3 },
                cornerRadius: 3,
              },
            ]}
            onItemClick={handleItemClick}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: '13px',
                fontWeight: 600,
              },
              cursor: 'pointer',
            }}
            hideLegend
          >
            <PieCenterLabel>{centerLabel}</PieCenterLabel>
          </PieChart>
        </Box>
      </Box>
    </Box>
  );
}
