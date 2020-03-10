import { PublicationSubjectMeta } from '@common/modules/table-tool/services/tableBuilderService';
import {
  BoundaryLevel,
  DataBlockData,
  DataBlockLocationMetadata,
  LabelValueMetadata,
  LabelValueUnitMetadata,
} from '@common/services/dataBlockService';
import {
  AxesConfiguration,
  AxisGroupBy,
  AxisType,
  ChartType,
  DataSetConfiguration,
} from '@common/services/publicationService';
import { Dictionary } from '@common/types';
import { ReactNode } from 'react';

export interface ChartMetaData {
  filters: PublicationSubjectMeta['filters'];
  indicators: Dictionary<LabelValueUnitMetadata>;
  locations: Dictionary<DataBlockLocationMetadata>;
  boundaryLevels?: BoundaryLevel[];
  timePeriod: Dictionary<LabelValueMetadata>;
}

export interface AbstractChartProps {
  data: DataBlockData;
  meta: ChartMetaData;
  title?: string;
  height?: number;
  width?: number;
  children?: ReactNode[];
}

export interface ChartProps extends AbstractChartProps {
  labels: Dictionary<DataSetConfiguration>;
  axes: AxesConfiguration;
  legend?: 'none' | 'top' | 'bottom';
  legendHeight?: string;
}

export interface StackedBarProps extends ChartProps {
  stacked?: boolean;
}

export interface ChartCapabilities {
  hasAxes: boolean;
  dataSymbols: boolean;
  stackable: boolean;
  lineStyle: boolean;
  gridLines: boolean;
  canSize: boolean;
  fixedAxisGroupBy: boolean;
  hasReferenceLines: boolean;
  hasLegend: boolean;
}

export interface ChartDefinition {
  type: ChartType;
  name: string;

  height?: number;

  capabilities: ChartCapabilities;

  data: {
    type: string;
    title: string;
    entryCount: number | 'multiple';
    targetAxis: string;
  }[];

  axes: {
    id: string;
    title: string;
    type: AxisType;
    defaultDataType?: AxisGroupBy;
    forcedDataType?: AxisGroupBy;
  }[];

  requiresGeoJson: boolean;
}