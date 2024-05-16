import {defineMessages} from "react-intl";

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    newProjectMessage: {
        defaultMessage: "New",
        description: "Menu bar item for creating a new project",
        id: "gui.menuBar.new"
    },
    openRecentMessage: {
        defaultMessage: "Open Recent Files",
        description: "Menu bar item for Open Recent Files",
        id: "gui.menuBar.recent"
    },
    titleMessage: {
        defaultMessage: "My Projects",
        description: "My Projects",
        id: "gui.menuBar.myProjects"
    },
    projectNameMessage: {
        defaultMessage: "Name",
        description: "Project's name",
        id: "gui.menuBar.projectName"
    },
    sizeMessage: {
        defaultMessage: "Size",
        description: "Project's size",
        id: "gui.SpriteInfo.size"
    },
    editMessage: {
        defaultMessage: "Modification date",
        description: "Modification date",
        id: "gui.menuBar.modificationDate"
    },
    operateMessage: {
        defaultMessage: "Operate",
        description: "Operate",
        id: "gui.menuBar.operate"
    }
});

export default messages;
