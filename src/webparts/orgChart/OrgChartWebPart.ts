import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OrgChartWebPartStrings';
import OrgChart from './components/OrgChart';
import { IOrgChartProps } from './components/IOrgChartProps';
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph";


export interface IOrgChartWebPartProps {
  description: string;
  web:string;
}

export default class OrgChartWebPart extends BaseClientSideWebPart<IOrgChartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IOrgChartProps> = React.createElement(
      OrgChart,
      {
        description: this.properties.description,
        web:this.context.pageContext.site.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected async onInit(): Promise<void>{
    // this.properties.cssUrl ? SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + this.properties.cssUrl) : SPComponentLoader.loadCss(customStyleUrl);
 
 
     return super.onInit().then(_ => {
       sp.setup({
         spfxContext: this.context
       });
       graph.setup(
        this.context as any
      );
   //   _spPageContextInfo.crossDomainPhotosEnabled = true;
     });
   }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
