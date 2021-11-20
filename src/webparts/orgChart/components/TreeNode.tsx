import * as React from 'react';
import styles from './OrgChart.module.scss';
import { sp } from "@pnp/sp";

import "@pnp/sp/webs";

import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import './reactOrgStyle.css';
const TreeNode = ({ node }) => {  
    const [teamTitle,setTeamTitle]=React.useState('');
    React.useEffect(() => {
        
        const getTeam=async()=>{
            if(node.id<0 && node.prvId>0)
            {
              setTimeout(async() => {
                const team=await sp.web.lists.getByTitle('Projects').items.filter(`HeadOfTeamId eq ${node.prvId}`).get();
                console.log('ttteam',team);
                setTeamTitle(team[0]['Team']);
                }, 1000) 
            
            
           }
          }
     
             getTeam();
          }, [node]); 
  

    
   
      return ( 
        (node.id<0 && node.prvId)?
        <div className={styles.nullNode} >  
           <div className={styles.userName}>{teamTitle}</div>
           <div className={styles.department}>{node.department}</div>

        </div>:
        node.id ?
        <div className={styles.treeNode} >  
           <img src={node.photo} alt="my image"  />       
           <div className={styles.userName}>{node.title}</div>
           <div className={styles.department}>{node.jobTitle}</div>

        </div> :<></> 
        
      );      
    
  } 
  export default TreeNode;   