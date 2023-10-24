const blockColors = {
    // SVG colours: these must be specificed in #RRGGBB style
    // To add an opacity, this must be specified as a separate property (for SVG fill-opacity)
    motion: {
        "primary": "#64c7f0",
        "secondary": "#4280D7",
        "tertiary": "#00b0f9",
        "quaternary": "#00b0f9"
    },
    motor: {
        "primary": "#64c7f0",
        "secondary": "#4280D7",
        "tertiary": "#00b0f9",
        "quaternary": "#00b0f9"
    },
    combined_motor: {
        "primary": "#2388ca",
        "secondary": "#3373CC",
        "tertiary": "#3373CC",
        "quaternary": "#3373CC"
    },
    matrix: {
        "primary": "#7986b8",
        "secondary": "#000000",
        "tertiary": "#6877b3",
        "quaternary": "#6877b3"
    },
    looks: {
        "primary": "#9966FF",
        "secondary": "#855CD6",
        "tertiary": "#774DCB",
        "quaternary": "#774DCB"
    },
    sounds: {
        "primary": "#a981a4",
        "secondary": "#8f6e8a",
        "tertiary": "#8f6e8a",
        "quaternary": "#8f6e8a"
    },
    control: {
        "primary": "#e76564",
        "secondary": "#EC9C13",
        "tertiary": "#cf5959",
        "quaternary": "#cf5959"
    },
    event: {
        "primary": "#cd758f",
        "secondary": "#be637f",
        "tertiary": "#be637f",
        "quaternary": "#be637f"
    },
    sensing: {
        "primary": "#ecc0ab",
        "secondary": "#eca888",
        "tertiary": "#eca888",
        "quaternary": "#eca888"
    },
    pen: {
        "primary": "#0fBD8C",
        "secondary": "#0DA57A",
        "tertiary": "#0B8E69",
        "quaternary": "#0B8E69"
    },
    operators: {
        "primary": "#f5b44a",
        "secondary": "#46B946",
        "tertiary": "#e49e2f",
        "quaternary": "#e49e2f"
    },
    data: {
        "primary": "#a5c9e9",
        "secondary": "#84ace9",
        "tertiary": "#84ace9",
        "quaternary": "#84ace9"
    },
    // This is not a new category, but rather for differentiation
    // between lists and scalar variables.
    data_lists: {
        "primary": "#a5c9e9",
        "secondary": "#84ace9",
        "tertiary": "#84ace9",
        "quaternary": "#84ace9"
    },
    more: {
        "primary": "#82be97",
        "secondary": "#379f5a",
        "tertiary": "#379f5a",
        "quaternary": "#82be97"
    },
    text: "#575E75",
    workspace: "#F9F9F9",
    toolboxHover: "#4C97FF",
    toolboxSelected: "#e9eef2",
    toolboxText: "#575E75",
    toolbox: "#FFFFFF",
    flyout: "#F9F9F9",
    scrollbar: "#CECDCE",
    scrollbarHover: '#CECDCE',
    textField: "#FFFFFF",
    insertionMarker: "#000000",
    insertionMarkerOpacity: 0.2,
    dragShadowOpacity: 0.3,
    stackGlow: "#FFF200",
    stackGlowSize: 4,
    stackGlowOpacity: 1,
    replacementGlow: "#FFFFFF",
    replacementGlowSize: 2,
    replacementGlowOpacity: 1,
    colourPickerStroke: "#FFFFFF",
    // CSS colours: support RGBA
    fieldShadow: "rgba(0,0,0,0.1)",
    dropDownShadow: "rgba(0, 0, 0, .3)",
    numPadBackground: "#547AB2",
    numPadBorder: "#435F91",
    numPadActiveBackground: "#435F91",
    numPadText: "white", // Do not use hex here, it cannot be inlined with data-uri SVG
    valueReportBackground: "#FFFFFF",
    valueReportBorder: "#AAAAAA",
    menuHover: "rgba(0, 0, 0, 0.2)",
    themeColor: "#7986b8",
    modalColor: "hsla(227.62, 29.73%, 59.8%, .7)"
};


export {
    blockColors
};
