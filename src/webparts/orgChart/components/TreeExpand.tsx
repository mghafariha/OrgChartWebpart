import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { sp } from "@pnp/sp";

import "@pnp/sp/webs";

import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/profiles";


import styled from 'styled-components';
import styles from './OrgChart.module.scss';

import CustomDropdown from './CustomDropdown';
import { forEachRight } from 'lodash';
import Tree from './Tree'
import OrgChart from 'react-orgchart';
import TreeNode from './TreeNode';
import './reactOrgStyle.css';
import { SiteUsers } from '@pnp/sp/site-users/types';
var arrayToTree: any = require('array-to-tree');  


const TreeExpand=(props)=>{
   const [entities,setEntities]=React.useState([]);
   const [researches,setResearches]=React.useState([]);
   const [teams,setTeams]=React.useState([]);
   const [entity,setEntitiy]=React.useState();
   const [research,setResearch]=React.useState();
   const [team,setTeam]=React.useState();
   const [filterValue,setFilterValue]=React.useState('');
   const [loadTree,setLoadTree]=React.useState(false);
   const [root,setRoot]=React.useState();
   const [users,setUsers]=React.useState([]);
   const[ childCounts,setChildCounts]=React.useState([]);
   const [chartItems,setChartItems]=React.useState([]);
    React.useEffect(() => {
     const GetFieldsOptions =async()=>{

        
      const entityField=await sp.web.lists.getByTitle('Projects').fields.getByInternalNameOrTitle(`Entity`).get();
     
      const researchField=await sp.web.lists.getByTitle('Projects').fields.getByInternalNameOrTitle(`ResearchCentre`).get();
      const teamField=await sp.web.lists.getByTitle('Projects').fields.getByInternalNameOrTitle(`Team`).get();
     const entityChoices=entityField['Choices'];
      const researChoices=researchField['Choices'];
      const teamChoices=teamField['Choices'];
      setEntities(entityChoices.map(a=>({key:a,text:a})));
        setResearches(researChoices.map(a=>({key:a,text:a})));
        setTeams(teamChoices.map(a=>({key:a,text:a})));
        console.log(factorial(4));
        
      }
    GetFieldsOptions();
      
      }, []); 
    
    const setFieldValue=(name,value)=>{
      if(name=='entity')
      setEntitiy(value);
      else if(name=='research')
      setResearch(value);
      else if(name=='team')
      setTeam(value);
      if(name=='team' && entity && research )
      {
         
        getProjectUsersData(value);
      }
    } 
   const getProjectUsersData=async(teamValue)=>{
    setTimeout(async() => {
      setChartItems([]);
      setChildCounts([]);
      }, 1000) 
 
       const filterProjectStr=`Entity eq '${entity}' and ResearchCentre eq '${research}' and Team eq '${teamValue}'`;
       const selectedProjectFields=`Id,HeadOfTeamId,HeadOfTeam/Title`;
       const projectItems = await sp.web.lists.getByTitle('Projects').items.filter(filterProjectStr).select(selectedProjectFields).expand(`HeadOfTeam`).top(1).get();
       const headOfTeamId=projectItems[0]['HeadOfTeamId'];
     
     
       //
       const filterUsers=`ReportsToId eq ${headOfTeamId}`;
       const expandUsers=`User,ReportsTo`;
       const selectUsers=`Id,IsHead,UserId,User/Title,User/UserName,User/JobTitle,User/Name,User/Department,ReportsToId,ReportsTo/Title`;
         const headOfTeamItem = await sp.web.lists.getByTitle('ProjectUsers').items.getById(headOfTeamId).select(selectUsers).expand(expandUsers).get();
        setRoot(headOfTeamItem);
    
        const profile = await sp.profiles.getPropertiesFor(headOfTeamItem.User.Name); ;
     
         let data=[headOfTeamItem];
         //
         const childItems = await sp.web.lists.getByTitle('ProjectUsers').items.filter(`ReportsToId eq ${headOfTeamId}`).select(selectUsers).expand(expandUsers).get();
       
         data = [...data, ...childItems];
        let f;
         setTimeout(async() => { f=await CreateTree(childItems, data)},1000);
      setLoadTree(true);
      console.log('loadTree',f);
         
   } 
 

   const CreateTree = async(items: any, arr: any) => {
    
    const selectUsers=`Id,IsHead,UserId,User/Title,User/UserName,User/JobTitle,User/Name,User/Department,ReportsToId,ReportsTo/Title`;
    const expandUsers=`User,ReportsTo`;
    let pp = [...arr];
  
    items.forEach(async (p: any) => {
     
        const childItems = await sp.web.lists.getByTitle('ProjectUsers').items.filter(`ReportsToId eq ${p.Id}`).select(selectUsers).expand(`User,ReportsTo`).get();
       
        if (childItems.length > 0 && !p.IsHead) {
         arr = [...arr, ...childItems];
           setTimeout(async() => { return CreateTree(childItems, arr)},1000);
        }
        else {
        let teams=  arr.map((a)=>({id:a.Id,title:a.User.Title,isHead:a.IsHead,jobTitle:a.User.JobTitle,userName:a.User.Name,parent_id:a.ReportsToId?a.ReportsToId:undefined ,photo: a.User.UserName ? `${props.web}/_layouts/15/userphoto.aspx?size=L&username=${a.User.UserName}` : undefined}));
        const results=  teams.forEach(async(c)=>{
            let childCount=0;
          if(c.parent_id!=undefined && c.isHead )
          {
            setTimeout(async() => {
          childCount= await CountChilds(c,c.id,childCount); 
            },1000);
          }
           c.childs=childCount
        });
         setChartItems(teams);
           return arr;
           }
    });
    
};
function factorial(num, result = 1) {
  if (num === 1) {
    return result;
  }
  return factorial(num - 1, num * result);
}
const CountChilds=async (item,baseId,sum)=>{
    let ss=0;
    const filterUsers=`ReportsToId eq ${item.id}`;
    const expandUsers=`User,ReportsTo`;
    const selectUsers=`Id,IsHead,UserId,User/Title,User/UserName,User/Name,User/Department,ReportsToId,ReportsTo/Title`;
    const childItems = await sp.web.lists.getByTitle('ProjectUsers').items.filter(`ReportsToId eq ${item.id}`).select(selectUsers).expand(expandUsers).get();
    if(childItems.length>0)
     {
       sum+=childItems.length;
       childItems.forEach(element => {
        return CountChilds({...element,id:element.Id},baseId,sum)
       });
     }
     else {
     
      
      if(childCounts.length==0 ||childCounts.filter(a=>a.id).length==0)
       setChildCounts([...childCounts,{id:baseId,childs:sum}]);
       else
       {
       
            setChildCounts(childCounts.map(a=>a.id==baseId?a.childs=sum:a.childs=a.childs))
       }
       return sum;
       
    }
  }
 
      return(<div className={styles.treeExpand}>
        <div className={styles.header}>Organization Chart</div>
          <div className={styles.filterContainer}>
                 <div className={styles.filters}>
              
                  <CustomDropdown
                                label=""
                                name="entity"
                                selectedKey={entity}
                                value={entity}
                                placeholder="Select Entity"
                                options={entities}
                                onChange={(_, item: IDropdownOption) =>
                                    setFieldValue("entity", item.key)
                                }
                                
                            />
                              <CustomDropdown
                                label=""
                                name="research"
                                selectedKey={research}
                                value={research}
                                placeholder="Select Research Centre"
                                options={researches}
                                onChange={(_, item: IDropdownOption) =>
                                    setFieldValue("research", item.key)
                                }
                                
                            />
                              <CustomDropdown
                                label=""
                                name="team"
                                selectedKey={team}
                                value={team}
                                placeholder="Select Team" 
                                options={teams}
                                onChange={(_, item: IDropdownOption) =>
                                    setFieldValue("team", item.key)
                                }
                                
                            />
                         </div>
                      <div className={styles.filterValue}>{ entity && research && team && <p>{entity + " > "+ research+ " > "}<strong>{team}</strong></p>}</div>
        </div>
      {chartItems.length>0 && childCounts.length>0? <Tree chartItems={chartItems} childCounts={childCounts}/>:<div></div> }
            
            </div> )

}
export default TreeExpand;