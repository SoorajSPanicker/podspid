// const { contextBridge, ipcRenderer } = require('electron');
// const os = require('os');

// contextBridge.exposeInMainWorld('electron', {
//     homeDir: () => os.homedir(),
//     osVersion: () => os.arch(),
// });

// contextBridge.exposeInMainWorld('ipcRenderer', {
//     send: (channel, data) => ipcRenderer.send(channel, data),
//     on: (channel, func) =>
//         ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
// });

// contextBridge.exposeInMainWorld('api', {
//     send: (channel, data) => {
//         // Whitelist channels for sending messages to the main process
//         let validChannels = ['save-data', 'select-folder', 'open-project', 'fetch-data', 'save-tag-data', 'save-doc-data', 'fetch-sin-doc', 'save-ele-tag', 'fetch-sin-ele', 'save-area-data', 'update-linelist-table', 'remove-taginfo-table', 'remove-line-table', 'update-taginfo-table', 'fetch-tag-ele', 'fetch-info-tag','fetch-sin-docdetails','save-flag-ele','fetch-con-doc','fetch-condoc-path','create-new-window','fetch-sin-flag','fetch-doc-flag','update-flag-table','double-sin-flag','sin-flag-conflag','unflag-ele-flag','update-unflag-table','update-equlist-table','remove-equipement-table','fetch-flag-tag','update-flag-tag','is-element-tag','sel-tag-ele','del-ele-tag','ele-tag-type','ele-flag-sel','delete-all-project','delete-project','flag-dou-sel','import-equipment-list','import-line-list','add-comment','import-comment-details','add-commentdetails-table','remove-commentstatus-table','editCommentStatus','import-tag-list','delete-all-tags','update-comment-table','update-tag-table','update-doc-table','insert-master-table','check-master','fetch-master-doc','copy-to-master','backup-masdoc','update-masdoc','save-svg','check-file-exists','load-svg']; // Add 'fetch-data' for reading data 'save-data', 'fetch-data', 
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data);
//         }
//     },
//     receive: (channel, func) => {
//         // Whitelist channels for receiving messages from the main process
//         let validChannels = ['data-fetched', 'all-area-fetched', 'all-disc-fetched', 'all-sys-fetched', 'all-tree-tags-fetched', 'all-tags-fetched', 'all-docs-fetched', 'sin-doc-fetched', 'all-elements-fetched', 'sin-ele-fetched', 'all-line-fetched', 'all-equ-fetched', 'all-taginfo-fetched', 'tag-ele-fetched', 'info-tag-fetched','spid-docs-fetched','sin-docdetails-fetched','all-flags-fetched','con-doc-fetched','condoc-path-fetched','sin-flag-fetched','doc-flag-fetched','sin-flag-double','flag-conflag-sin','ele-flag-unflag','flag-tag-fetched','flag-tag-updated','select-folder-fetched','element-tag-is','flag-tag-is','ele-tag-sel','type-tag-ele','equ-type-details','line-type-details','sel-flag-ele','delete-project-response','delete-all-project-response','ele-flag-out','all-comments','all-comments-fetched','master-doc-fetched','master-checked','store-master-fetched'];
//         if (validChannels.includes(channel)) {
//             // Deliberately strip event as it includes sender
//             ipcRenderer.on(channel, (event, ...args) => func(...args));
//         }
//     }
// });

const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('electron', {
    homeDir: () => os.homedir(),
    osVersion: () => os.arch(),
    onLayerDetails: (callback) => ipcRenderer.on('layer-details', (event, data) => callback(data))
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels for sending messages to the main process
        let validChannels = [
            'save-data', 'select-folder', 'open-project', 'fetch-data',
            'save-tag-data', 'save-doc-data', 'fetch-sin-doc', 'save-ele-tag',
            'fetch-sin-ele', 'save-area-data', 'update-linelist-table',
            'remove-taginfo-table', 'remove-line-table', 'update-taginfo-table',
            'fetch-tag-ele', 'fetch-info-tag', 'fetch-sin-docdetails', 'save-flag-ele',
            'fetch-con-doc', 'fetch-condoc-path', 'create-new-window', 'fetch-sin-flag',
            'fetch-doc-flag', 'update-flag-table', 'double-sin-flag', 'sin-flag-conflag',
            'unflag-ele-flag', 'update-unflag-table', 'update-equlist-table', 'remove-equipement-table',
            'fetch-flag-tag', 'update-flag-tag', 'is-element-tag', 'sel-tag-ele', 'del-ele-tag',
            'ele-tag-type', 'ele-flag-sel', 'delete-all-project', 'delete-project', 'flag-dou-sel',
            'import-equipment-list', 'import-line-list', 'add-comment', 'import-comment-details',
            'add-commentdetails-table', 'remove-commentstatus-table', 'editCommentStatus', 'import-tag-list',
            'delete-all-tags', 'update-comment-table', 'update-tag-table', 'update-doc-table',
            'insert-master-table', 'check-master', 'fetch-master-doc', 'copy-to-master', 'backup-masdoc',
            'update-masdoc', 'save-svg', 'check-file-exists', 'load-svg', 'read-svg-file','import-taginfo-list','save-layer','show-doc-area','is-ele-tag','save-areatag-rel','saveUserDefinedFields','add-taginfoname-table','delete-taginfoname-row','tag-doc-con','tag-doc-det','update-check-sta','dwg-svg-converter','dxf-svg-converter','download-dwg'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        // Whitelist channels for receiving messages from the main process
        let validChannels = [
            'data-fetched', 'all-area-fetched', 'all-disc-fetched', 'all-sys-fetched',
            'all-tree-tags-fetched', 'all-tags-fetched', 'all-docs-fetched', 'sin-doc-fetched',
            'all-elements-fetched', 'sin-ele-fetched', 'all-line-fetched', 'all-equ-fetched',
            'all-taginfo-fetched', 'tag-ele-fetched', 'info-tag-fetched', 'spid-docs-fetched',
            'sin-docdetails-fetched', 'all-flags-fetched', 'con-doc-fetched', 'condoc-path-fetched',
            'sin-flag-fetched', 'doc-flag-fetched', 'sin-flag-double', 'flag-conflag-sin',
            'ele-flag-unflag', 'flag-tag-fetched', 'flag-tag-updated', 'select-folder-fetched',
            'element-tag-is', 'flag-tag-is', 'ele-tag-sel', 'type-tag-ele', 'equ-type-details',
            'line-type-details', 'sel-flag-ele', 'delete-project-response', 'delete-all-project-response',
            'ele-flag-out', 'all-comments', 'all-comments-fetched', 'master-doc-fetched', 'master-checked',
            'store-master-fetched', 'read-svg-file-response','save-data-response','all-layers-fetched','doc-area-fetched','tag-ele-is','areatag-rel','all-fields-user-defined','all-taginfoname-fetched','con-doc-tag','det-doc-tag','dwg-conversion-success','dxf-conversion-success','download-error','download-success'
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes sender
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
