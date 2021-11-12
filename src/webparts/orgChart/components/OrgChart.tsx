import * as React from 'react';
import styles from './OrgChart.module.scss';
import { IOrgChartProps } from './IOrgChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TreeExpand from './TreeExpand';

export default class OrgChart extends React.Component<IOrgChartProps, {}> {
  public render(): React.ReactElement<IOrgChartProps> {
    return (
      <div className={ styles.orgChart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <TreeExpand />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
