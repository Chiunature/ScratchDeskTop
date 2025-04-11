import React from "react";
import { FormattedMessage } from "react-intl";
import keyMirror from "keymirror";

import successImage from "../assets/icon--success.svg";

const AlertTypes = keyMirror({
    STANDARD: null,
    EXTENSION: null,
    INLINE: null,
});

const AlertLevels = {
    SUCCESS: "success",
    INFO: "info",
    WARN: "warn",
};

const alerts = [
    {
        alertId: "createSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="New project created."
                description="Message indicating that project was successfully created"
                id="gui.alerts.createsuccess"
            />
        ),
        iconURL: successImage,
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 5,
    },
    {
        alertId: "createCopySuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Project saved as a copy."
                description="Message indicating that project was successfully created"
                id="gui.alerts.createcopysuccess"
            />
        ),
        iconURL: successImage,
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 5,
    },
    {
        alertId: "createRemixSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Project saved as a remix."
                description="Message indicating that project was successfully created"
                id="gui.alerts.createremixsuccess"
            />
        ),
        iconURL: successImage,
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 5,
    },
    {
        alertId: "creating",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Creating new…"
                description="Message indicating that project is in process of creating"
                id="gui.alerts.creating"
            />
        ),
        iconSpinner: true,
        level: AlertLevels.SUCCESS,
    },
    {
        alertId: "creatingCopy",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Copying project…"
                description="Message indicating that project is in process of copying"
                id="gui.alerts.creatingCopy"
            />
        ),
        iconSpinner: true,
        level: AlertLevels.SUCCESS,
    },
    {
        alertId: "creatingRemix",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Remixing project…"
                description="Message indicating that project is in process of remixing"
                id="gui.alerts.creatingRemix"
            />
        ),
        iconSpinner: true,
        level: AlertLevels.SUCCESS,
    },
    {
        alertId: "creatingError",
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        closeButton: true,
        content: (
            <FormattedMessage
                defaultMessage="Could not create the project. Please try again!"
                description="Message indicating that project could not be created"
                id="gui.alerts.creatingError"
            />
        ),
        level: AlertLevels.WARN,
    },
    {
        alertId: "savingError",
        clearList: [
            "createSuccess",
            "creating",
            "createCopySuccess",
            "creatingCopy",
            "createRemixSuccess",
            "creatingRemix",
            "saveSuccess",
            "saving",
            "calibration"
        ],
        showDownload: true,
        showSaveNow: true,
        closeButton: false,
        content: (
            <FormattedMessage
                defaultMessage="Project could not save."
                description="Message indicating that project could not be saved"
                id="gui.alerts.savingError"
            />
        ),
        level: AlertLevels.WARN,
    },
    {
        alertId: "saveSuccess",
        alertType: AlertTypes.INLINE,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Project saved."
                description="Message indicating that project was successfully saved"
                id="gui.alerts.savesuccess"
            />
        ),
        iconURL: successImage,
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 3,
    },
    {
        alertId: "saving",
        alertType: AlertTypes.INLINE,
        clearList: ["saveSuccess", "saving", "savingError", "calibration"],
        content: (
            <FormattedMessage
                defaultMessage="Saving project…"
                description="Message indicating that project is in process of saving"
                id="gui.alerts.saving"
            />
        ),
        iconSpinner: true,
        level: AlertLevels.INFO,
    },
    {
        alertId: "cloudInfo",
        alertType: AlertTypes.STANDARD,
        clearList: ["cloudInfo"],
        content: (
            <FormattedMessage
                defaultMessage="Please note, cloud variables only support numbers, not letters or symbols. {learnMoreLink}" // eslint-disable-line max-len
                description="Info about cloud variable limitations"
                id="gui.alerts.cloudInfo"
                values={{
                    learnMoreLink: (
                        <a
                            href="https://scratch.mit.edu/info/faq/#clouddata"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <FormattedMessage
                                defaultMessage="Learn more."
                                description="Link text to cloud var faq"
                                id="gui.alerts.cloudInfoLearnMore"
                            />
                        </a>
                    ),
                }}
            />
        ),
        closeButton: true,
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 15,
    },
    {
        alertId: "importingAsset",
        alertType: AlertTypes.STANDARD,
        clearList: [],
        content: (
            <FormattedMessage
                defaultMessage="Importing…"
                description="Message indicating that project is in process of importing"
                id="gui.alerts.importing"
            />
        ),
        iconSpinner: true,
        level: AlertLevels.SUCCESS,
    },
    {
        alertId: "selectADeviceFirst",
        alertType: AlertTypes.STANDARD,
        clearList: ["selectADeviceFirst", "calibration"],
        closeButton: true,
        content: (
            <FormattedMessage
                defaultMessage="Plese select a device first"
                description="Message indicating that device is not selected"
                id="gui.alerts.selectADeviceFirst"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 1,
    },
    {
        alertId: "successfullyConnected",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Successfully connected"
                description="Successfully connected"
                id="gui.alerts.successfullyConnected"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 1,
    },
    {
        alertId: "failedConnected",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Failed connected"
                description="Failed connected"
                id="gui.alerts.failedConnected"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 1,
    },
    {
        alertId: "disconnect",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Disconnect"
                description="Disconnect"
                id="gui.connection.disconnect"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 1,
    },
    {
        alertId: "uploadError",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Upload error"
                description="Message indicating that upload progress is error"
                id="gui.alerts.uploadError"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 1,
    },
    {
        alertId: "uploading",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Uploading..."
                description="Message indicating that upload progress is uploading"
                id="gui.alerts.uploading"
            />
        ),
        level: AlertLevels.SUCCESS,
        iconSpinner: true,
    },
    {
        alertId: "uploadSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Upload success"
                description="Message indicating that upload progress is success"
                id="gui.alerts.uploadSuccess"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 3,
    },
    {
        alertId: "uploadTimeout",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "uploadTimeout",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Upload Timeout"
                description="Message indicating that upload progress is timeout"
                id="gui.alerts.uploadTimeout"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 1,
    },
    {
        alertId: "workspaceEmpty",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "uploadTimeout",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Workspace is Empty or No starting event header"
                description="Workspace is Emptyor No starting event header"
                id="gui.alerts.workspaceEmpty"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 3,
    },
    {
        alertId: "noExtensions",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "uploadTimeout",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="No additional extensions available"
                description="No additional extensions currently available"
                id="gui.alerts.noExtensions"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 3,
    },
    {
        alertId: "delExeSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Deleting successfully"
                description="Deleting successfully"
                id="gui.alerts.delExeSuccess"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 1,
    },
    {
        alertId: "delExeFail",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Deleting failed"
                description="Deleting failed"
                id="gui.alerts.delExeFailed"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 3,
    },
    {
        alertId: "saveNowSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Save success"
                description="Save success"
                id="gui.alerts.saveSuccess"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 1,
    },
    {
        alertId: "calibration",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibrationSuccess"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Calibration in progress, please wait a moment..."
                description="Calibration in progress"
                id="gui.alerts.calibration"
            />
        ),
        level: AlertLevels.SUCCESS,
        iconSpinner: true,
        progress: true,
    },
    {
        alertId: "calibrationSuccess",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Calibration completed"
                description="Calibration completed"
                id="gui.alerts.calibrationSuccess"
            />
        ),
        level: AlertLevels.SUCCESS,
        maxDisplaySecs: 2,
    },
    {
        alertId: "bleISNotSupported",
        alertType: AlertTypes.STANDARD,
        clearList: [
            "disconnect",
            "failedConnected",
            "successfullyConnected",
            "uploadSuccess",
            "uploadError",
            "uploading",
            "calibration"
        ],
        content: (
            <FormattedMessage
                defaultMessage="Bluetooth not turned on or not supported"
                description="Bluetooth not turned on or not supported"
                id="gui.alerts.bleISNotSupported"
            />
        ),
        level: AlertLevels.WARN,
        maxDisplaySecs: 5,
    },
];

export { alerts as default, AlertLevels, AlertTypes };
