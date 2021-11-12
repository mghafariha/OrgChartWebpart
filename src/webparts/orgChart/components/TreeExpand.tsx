
import * as React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';

const StyledNode= styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
  background-image: url(${props => props.background ? props.background : '../images/root.jpg'});
`;
const logo: any = require('../images/root.jpg');
const TreeExpand = () => (
    <Tree
    lineWidth={'2px'}
    lineColor={'green'}
    lineBorderRadius={'10px'}
    label={<StyledNode background={logo}>Root</StyledNode>}
  >
    <TreeNode label={<StyledNode background={logo}>Child 1</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
    </TreeNode>
    <TreeNode label={<StyledNode>Child 2</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
        <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
        <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
      </TreeNode>
    </TreeNode>
    <TreeNode label={<StyledNode>Child 3</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
      <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
      <TreeNode label={<StyledNode>Grand Child 3</StyledNode>} />
    </TreeNode>
    <TreeNode label={<StyledNode>Child 4</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
      <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
      <TreeNode label={<StyledNode>Grand Child 3</StyledNode>} />
    </TreeNode>
  </Tree>
);
export default TreeExpand;