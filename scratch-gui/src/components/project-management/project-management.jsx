import React from "react";
import styles from './project-management.css';
import Box from "../box/box.jsx";
import ProjectHeader from "./project-header.jsx";
import ProjectFilesList from "./project-files-list.jsx";





const ProjectManagement = (props) => {

    return (
        <Box className={styles.projectContent}>
            <ProjectHeader {...props}/>
            <ProjectFilesList {...props}/>
        </Box>
    )
}


export default ProjectManagement;
