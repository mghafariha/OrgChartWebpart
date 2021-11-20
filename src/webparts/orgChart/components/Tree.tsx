import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { sp } from "@pnp/sp";

import "@pnp/sp/webs";

import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

import styled from 'styled-components';
import styles from './OrgChart.module.scss';

import CustomDropdown from './CustomDropdown';
import { forEachRight } from 'lodash';
import OrgChart from 'react-orgchart';
import TreeNode from './TreeNode';
import '../../../../node_modules/react-orgchart/index.css';
var arrayToTree: any = require('array-to-tree');  


const Tree=(props)=>{
    const [orgItems,setOrgItems]=React.useState([]);
    React.useEffect(() => { 
    if(props.chartItems.length>0 )
    {
      
          const tt=   props.chartItems.map(a=>({...a,childs:props.childCounts.find(b=>b.id==a.id)?props.childCounts.find(b=>b.id==a.id).childs:0}))
      
      if(props.childCounts && props.childCounts.length>0)  {
        const results=props.childCounts.forEach(async(element,ind) => {
        
        if(!(tt.find(a=>a.prvId==element.id)))
          {
          // const title=await getTeam(element.id);
            tt.push({id:-(ind+1),title:'test' ,department:`${element.childs} members`,parent_id:element.id, prvId:element.id})
          }
        });
    
    }
    
     var orgChartHierarchyNodes: any = arrayToTree(tt); 
    
      
      var output: any = JSON.stringify(orgChartHierarchyNodes[0]);  
    
     
      
      setOrgItems (JSON.parse(output));
}
        }, [props]); 

       
      return(<div>
         
      {<OrgChart tree={orgItems} NodeComponent={TreeNode}/>}
            
            </div> )

}
export default Tree;