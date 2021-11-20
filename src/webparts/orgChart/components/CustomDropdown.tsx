import * as React from 'react';
import styles from './OrgChart.module.scss';
import { Dropdown, IDropdownStyles } from "office-ui-fabric-react";
const dropdownStyles: Partial<IDropdownStyles> = {};
const CustomDropdown = ({
   
    options,
    ...props
}) => {
    return (
        <>
            <Dropdown className={styles.item}
                placeholder={props.placeholder}
                label={props.label}
                options={options}
               
                styles={dropdownStyles}
               
                {...props}
            />
        </>
    );
};

export default CustomDropdown;