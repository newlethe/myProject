// Create user extension namespace
Ext.namespace('Ext.ux');

/**
 * @class Ext.ux.SwfUploadPanel
 * @extends Ext.grid.GridPanel

 * Makes a Panel to provide the ability to upload multiple files using the SwfUpload flash script.
 *
 * @author Stephan Wentz
 * @author Michael Giddens (Original author)
 * @website http://www.brainbits.net
 * @created 2008-02-26
 * @version 0.5
 * 
 * known_issues 
 *      - Progress bar used hardcoded width. Not sure how to make 100% in bbar
 *      - Panel requires width / height to be set.  Not sure why it will not fit
 *      - when panel is nested sometimes the column model is not always shown to fit until a file is added. Render order issue.
 *      
 * @constructor
 * @param {Object} config The config object
 */
Ext.ux.SwfUploadPanel = Ext.extend(Ext.grid.GridPanel, {    
    /**
     * @cfg {Object} strings
     * All strings used by Ext.ux.SwfUploadPanel
     */
    strings: {
        text_add: '添加文件',
        text_upload: '上传文件',
        text_cancel: '取消上传',
        text_clear: '清除上传队列',
        text_progressbar: '...',
        text_remove: '移除文件',
        text_remove_sure: '您确定将文件从上传队列中移除吗？',
        text_error: '错误',
        text_uploading: '上传文件: {0} ({1} of {2})',
        header_filename: '文件名称',
        header_size: '时间',
        header_status: '状态',
        status: {
            0: '待上传',
            1: '上传中',
            2: '已上传',
            3: '上传错误',
            4: '取消上传'
        },
        error_queue_exceeded: '选择的文件(s) exceed(s) the maximum number of {0} queued files.',
        error_queue_slots_0: 'There is no slot left',
        error_queue_slots_1: 'There is only one slot left',
        error_queue_slots_2: 'There are only {0} slots left',
        error_size_exceeded: '您选择的文件大小超过了限制范围{0}.',
        error_zero_byte_file: '选择了0字节的文件.',
        error_invalid_filetype: '无效的文件类型',
        error_file_not_found: '文件未找到404.',
        error_security_error: '安全设置错误. Not allowed to post to different url.'
    },
    
    /**
     * @cfg {Boolean} single_select
     * True to allow multiple file selections, false for single file selection.
     * Please note that this doesn't affect the number of allowed files in the queue. 
     * Use the {@link #file_queue_limit} parameter to change the allowed number of files in the queue. 
     */
    single_select: false,
    /**
     * @cfg {Boolean} confirm_delete
     * Show a confirmation box on deletion of queued files.
     */ 
    confirm_delete: true,
    /**
     * @cfg {String} file_types
     * Allowed file types for the File Selection Dialog. Use semi-colon as a seperator for multiple file-types.
     */ 
    file_types: "*.*",                   // Default allow all file types
    /**
     * @cfg {String} file_types
     * A text description that is displayed to the user in the File Browser dialog.
     */ 
    file_types_description: "All Files", // 
    /**
     * @cfg {String} file_size_limit
     * The file_size_limit setting defines the maximum allowed size of a file to be uploaded. 
     * This setting accepts a value and unit. Valid units are B, KB, MB and GB. If the unit is omitted default is KB. 
     * A value of 0 (zero) is interpretted as unlimited.
     */ 
    file_size_limit: "1048576",          // Default size limit 100MB
    /**
     * @cfg {String} file_upload_limit
     * Defines the number of files allowed to be uploaded by SWFUpload. 
     * This setting also sets the upper bound of the {@link #file_queue_limit} setting. 
     * The value of 0 (zero) is interpretted as unlimited.
     */ 
    file_upload_limit: "0",              // Default no upload limit
    /**
     * @cfg {String} file_queue_limit
     * Defines the number of unprocessed files allowed to be simultaneously queued.
     * The value of 0 (zero) is interpretted as unlimited.
     */ 
    file_queue_limit: "0",               // Default no queue limit
    /**
     * @cfg {String} file_post_name
     * The file_post_name allows you to set the value name used to post the file.
     */ 
    file_post_name: "Filedata",          // Default name
    /**
     * @cfg {String} flash_url
     * The full, absolute, or relative URL to the Flash Control swf file.
     */ 
    flash_url: "swfupload.swf",       // Default url, relative to the page url
    /**
     * @cfg {Boolean} debug
     * A boolean value that defines whether the debug event handler should be fired.
     */ 
    debug: false,
    
    // standard grid parameters
    autoExpandColumn: 'name',
    enableColumnResize: false,
    enableColumnMove: false,

    // private
    upload_cancelled: false,
    
    whereStr : "1=2",
    
    state_tpl : null,
        
    // private
    initComponent: function() {
        
        this.addEvents(
            /**
             * @event swfUploadLoaded
             * Fires after the Flash object has been loaded
             * @param {Ext.grid.GridPanel} grid This grid
             */
            'swfUploadLoaded',
            /**
             * @event swfUploadLoaded
             * Fires after a file has been qeueud
             * @param {Ext.grid.GridPanel} grid This grid
             * @param {Object} file The file object that produced the error
             */
            'fileQueued',
            /**
             * @event startUpload
             * Fires before the upload starts
             * @param {Ext.grid.GridPanel} grid This grid
             */
            'startUpload',
            /**
             * @event fileUploadError
             * Fires after an upload has been stopped or cancelled
             * @param {Ext.grid.GridPanel} grid This grid
             * @param {Object} file The file object that produced the error
             * @param {String} code The error code
             * @param {String} message Supplemental error message
             */
            'fileUploadError',
            /**
             * @event fileUploadSuccess
             * Fires after an upload has been successfully uploaded
             * @param {Ext.grid.GridPanel} grid This grid
             * @param {Object} file The file object that has been uploaded
             * @param {Object} data The response data of the upload request
             */
            'fileUploadSuccess',
            /**
             * @event fileUploadComplete
             * Fires after the upload cycle for one file finished
             * @param {Ext.grid.GridPanel} grid This grid
             * @param {Object} file The file object that has been uploaded
             */
            'fileUploadComplete',
            /**
             * @event fileUploadComplete
             * Fires after the upload cycle for all files in the queue finished
             * @param {Ext.grid.GridPanel} grid This grid
             */
            'allUploadsComplete',
            /**
             * @event fileUploadComplete
             * Fires after one or more files have been removed from the queue
             * @param {Ext.grid.GridPanel} grid This grid
             */
            'removeFiles',
            /**
             * @event fileUploadComplete
             * Fires after all files have been removed from the queue
             * @param {Ext.grid.GridPanel} grid This grid
             */
            'removeAllFiles',
            'deleteFiles'
        );
        
       /* this.rec = Ext.data.Record.create([
             {name: 'name'},
             {name: 'size'},
             {name: 'id'},
             {name: 'type'},
             {name: 'creationdate', type: 'date', dateFormat: 'm/d/Y'},
             {name: 'status'}
        ]);*/
          
         this.rec = Ext.data.Record.create([
             {name: 'fileName', type: 'string'},
             {name: 'fileLsh', type: 'string'},
             {name: 'transactionType', type: 'string'},
             {name: 'transactionId', type: 'string'},
             {name: 'uploadDate', type: 'string'},
             {name: 'status', type: 'string'}
        ]);
        
        this.store = new Ext.data.Store({             
             proxy: new Ext.data.HttpProxy({
  				url: CONTEXT_PATH + "/filedownload"
  			}),
	  		baseParams : {
				method : 'getAttachList',
				whereStr: this.whereStr
			},
			reader: new Ext.data.JsonReader({root: 'topics',totalProperty: 'totalCount'}, this.rec)
        });
      	this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: this.single_select
        });
        this.columns = [this.sm,{
            id:'name', 
            header: this.strings.header_filename, 
            dataIndex: 'fileName',
            renderer: this.formatFileName.createDelegate(this)
        },{
            id:'uploadDate', 
            header: "上传时间", 
            align:"center",
            width: 150, 
            dataIndex: 'uploadDate'/*,
           renderer: function(value) {
	        	return value ? value.dateFormat('Y-m-d H:i') : '';
	       }*/
        },{
            id:'status', 
            header: this.strings.header_status, 
            width: 70, 
            dataIndex: 'status', 
        	align:"center",
            renderer: this.formatStatus.createDelegate(this)
        }];
        
        
		this.store.load({params:{start:0,limit: 8}})

        this.progress_bar = new Ext.ProgressBar({
            text: this.strings.text_progressbar
//            width: this.width - 7
        }); 
         this.tbar = [{
            text: this.strings.text_add,
            iconCls: 'SwfUploadPanel_iconAdd',
            xhandler: function() {
                if (this.single_select) {
                    this.suo.selectFile();
                }
                else {
                    this.suo.selectFiles();
                }
            },
            xscope: this
        }, {
            text: this.strings.text_remove,
            iconCls: 'SwfUploadPanel_iconClear',
            handler: this.deleteFile,
            scope: this,
            hidden: false
        }, '->', {
            text: this.strings.text_cancel,
            iconCls: 'SwfUploadPanel_iconCancel',
            handler: this.stopUpload,
            scope: this,
            hidden: true
        }, {
            text: this.strings.text_upload,
            iconCls: 'SwfUploadPanel_iconUpload',
            handler: this.startUpload,
            scope: this,
            hidden: true
        }, {
            text: this.strings.text_clear,
            iconCls: 'SwfUploadPanel_iconClear',
            handler: this.removeAllFiles,
            scope: this,
            hidden: true
        }];
     	     	
        this.bbar = [            
            this.progress_bar
            
        ];
       
        
        this.addListener({
            keypress: {
                fn: function(e) {
                    if (this.confirm_delete) {
                        if(e.getKey() == e.DELETE) {
                            Ext.MessageBox.confirm(this.strings.text_remove,this.strings.text_remove_sure, function(e) {
                                if (e == 'yes') {
                                    this.removeFiles();
                                }
                            }, this);
                        }   
                    } else {
                        this.removeFiles(this);
                    }
                },
                scope: this
            },
            
            // Prevent the default right click to show up in the grid.
            contextmenu: function(e) {
                e.stopEvent();
            },
            
            render: {
                fn: function(){
                    this.resizeProgressBar();
                    
                    this.addBtn = this.getTopToolbar().items.items[0];
                    this.delBtn = this.getTopToolbar().items.items[1];
                    this.endCharBtn = this.getTopToolbar().items.items[2];
					this.cancelBtn = this.getTopToolbar().items.items[3];
                    this.uploadBtn = this.getTopToolbar().items.items[4];
                    this.clearBtn = this.getTopToolbar().items.items[5];
        
                    this.on('resize', this.resizeProgressBar, this);
                },
                scope: this
            }
        });
        

        this.on('render', function() {
            var suoID = Ext.id();
            var em = this.addBtn.el.child('em');
            em.setStyle({
                position: 'relative',
                display: 'block'
            });
            em.createChild({
                tag: 'div',
                id: suoID
            });
            this.suo = new SWFUpload({
                button_placeholder_id: suoID,
                button_width: em.getWidth(),
                button_height: em.getHeight(),
                button_cursor: SWFUpload.CURSOR.HAND,
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                
                upload_url: this.upload_url,
                post_params: this.post_params,
                file_post_name: this.file_post_name,  
                file_size_limit: this.file_size_limit,
                file_queue_limit: this.file_queue_limit,
                file_types: this.file_types,
                file_types_description: this.file_types_description,
                file_upload_limit: this.file_upload_limit,
                flash_url: this.flash_url,   
        
                // Event Handler Settings
                swfupload_loaded_handler: this.swfUploadLoaded.createDelegate(this),
        
                file_dialog_start_handler: this.fileDialogStart.createDelegate(this),
                file_queued_handler: this.fileQueue.createDelegate(this),
                file_queue_error_handler: this.fileQueueError.createDelegate(this),
                file_dialog_complete_handler: this.fileDialogComplete.createDelegate(this),
                
                upload_start_handler: this.uploadStart.createDelegate(this),
                upload_progress_handler: this.uploadProgress.createDelegate(this),
                upload_error_handler: this.uploadError.createDelegate(this), 
                upload_success_handler: this.uploadSuccess.createDelegate(this),
                upload_complete_handler: this.uploadComplete.createDelegate(this),
        
                debug: this.debug,
                debug_handler: this.debugHandler
            });
           
            Ext.get(this.suo.movieName).setStyle({
                position: 'absolute', 
                top: 0,
                left: 0
            });
            this.getTopToolbar().setHeight(25);
        }, this);
         
        Ext.ux.SwfUploadPanel.superclass.initComponent.call(this);
        
        this.state_tpl = new Ext.Template(
	       "<div class='ext-ux-uploaddialog-state ext-ux-uploaddialog-state-{state}'>&#160;</div>"
	    ).compile();
       
        
    },
    
    

    // private
    resizeProgressBar: function() {
        this.progress_bar.setWidth(this.getBottomToolbar().el.getWidth() - 5);
        Ext.fly(this.progress_bar.el.dom.firstChild.firstChild).applyStyles("height: 16px");
    },
    
    /**
     * SWFUpload debug handler
     * @param {Object} line
     */
    debugHandler: function(line) {
        console.log(line);
    },
    
    /**
     * Formats file status
     * @param {Integer} status
     * @return {String}
     */
    formatStatus: function(status) {
        //return this.strings.status[status];
        return this.state_tpl.apply({state: status});
    },
    
    formatFileName: function(val, m, r){
    	if(r.data["fileLsh"] != "" && r.data["status"] == "2"){
    		return "<font color='blue'><u style='cursor:hand;' onclick=downloadFile('" + r.data["fileLsh"] + "')>" + val + "</u></font>";
    	} else{
    		return val;
    	}  	
    },
    
    
    
    /**
     * Formats raw bytes into kB/mB/GB/TB
     * @param {Integer} bytes
     * @return {String}
     */
    formatBytes: function(size) {
        if (!size) {
            size = 0;
        }
        var suffix = ["B", "KB", "MB", "GB"];
        var result = size;
        size = parseInt(size, 10);
        result = size + " " + suffix[0];
        var loop = 0;
        while (size / 1024 > 1) {
            size = size / 1024;
            loop++;
        }
        result = Math.round(size) + " " + suffix[loop];

        return result;

        if(isNaN(bytes)) {
            return ('');
        }

        var unit, val;

        if(bytes < 999) {
            unit = 'B';
            val = (!bytes && this.progressRequestCount >= 1) ? '~' : bytes;
        } else if(bytes < 999999) {
            unit = 'kB';
            val = Math.round(bytes/1000);
        } else if(bytes < 999999999) {
            unit = 'MB';
            val = Math.round(bytes/100000) / 10;
        } else if(bytes < 999999999999) {
            unit = 'GB';
            val = Math.round(bytes/100000000) / 10;
        } else {
            unit = 'TB';
            val = Math.round(bytes/100000000000) / 10;
        }

        return (val + ' ' + unit);
    },

    /**
     * SWFUpload swfUploadLoaded event
     */
    swfUploadLoaded: function() {
        if(this.debug) console.info('SWFUPLOAD LOADED');
        
        this.fireEvent('swfUploadLoaded', this);
    },
        
    /**
     * SWFUpload fileDialogStart event
     */
    fileDialogStart: function() {
        if(this.debug) console.info('FILE DIALOG START');
        
        this.fireEvent('fileDialogStart', this);
    },
    
    /**
     * Add file to store / grid
     * SWFUpload fileQueue event
     * @param {Object} file
     */
    fileQueue: function(file) {
        if(this.debug) console.info('FILE QUEUE');
        
        file.status = 0;
        r = new this.rec(file);
        r.id = file.id;
        r.set("fileName",file.name)
        r.set("fileLsh",file.id)

        this.store.insert(0,r);            
        this.fireEvent('fileQueued', this, file);
    },

    /**
     * Error when file queue error occurs
     * SWFUpload fileQueueError event
     * @param {Object}  file
     * @param {Integer} code
     * @param {string}  message
     */
    fileQueueError: function(file, code, message) {
        if(this.debug) console.info('FILE QUEUE ERROR');

        switch (code) {
            case -100: 
                var slots;
                switch(message) {
                    case '0':
                        slots = this.strings.error_queue_slots_0;
                        break;
                    case '1':
                        slots = this.strings.error_queue_slots_1;
                        break;
                    default:
                        slots = String.format(this.strings.error_queue_slots_2, message);
                }
                Ext.MessageBox.alert(this.strings.text_error, String.format(this.strings.error_queue_exceeded + ' ' + slots, this.file_queue_limit));
                break;
                
            case -110:
                Ext.MessageBox.alert(this.strings.text_error,  file.name + String.format(this.strings.error_size_exceeded, this.formatBytes(this.file_size_limit * 1024)));
                break;

            case -120:
                Ext.MessageBox.alert(this.strings.text_error, file.name + this.strings.error_zero_byte_file);
                break;

            case -130:
                Ext.MessageBox.alert(this.strings.text_error, this.strings.error_invalid_filetype);
                break;
        }
        
        this.fireEvent('fileQueueError', this, file, code);
    },

    /**
     * SWFUpload fileDialogComplete event
     * @param {Integer} file_count
     */
    fileDialogComplete: function(file_count) {
        if(this.debug) console.info('FILE DIALOG COMPLETE');
        
        if (file_count > 0) {
            this.uploadBtn.show();
            this.clearBtn.show();
        }
        
        this.addBtn.show();
		//this.clearBtn.show();
        
        this.fireEvent('fileDialogComplete', this, file_count);
    },

    /**
     * SWFUpload uploadStart event
     * @param {Object} file
     */
    uploadStart: function(file) {
        if(this.debug) console.info('UPLOAD START');
        
        this.fireEvent('uploadStart', this, file);
        
        return true;
    },
    
    /**
     * SWFUpload uploadProgress event
     * @param {Object}  file
     * @param {Integer} bytes_completed
     * @param {Integer} bytes_total
     */
    uploadProgress: function(file, bytes_completed, bytes_total) {
        if(this.debug) console.info('UPLOAD PROGRESS');
        
        this.store.getById(file.id).set('status', 1);       
        this.store.getById(file.id).commit();
        this.progress_bar.updateProgress(bytes_completed/bytes_total, String.format(this.strings.text_uploading, file.name, this.formatBytes(bytes_completed), this.formatBytes(bytes_total)));
        
        this.fireEvent('uploadProgress', this, file, bytes_completed, bytes_total);
    },

    /**
     * SWFUpload uploadError event
     * Show notice when error occurs
     * @param {Object} file
     * @param {Integer} error
     * @param {Integer} code
     * @return {}
     */
    uploadError: function(file, error, code) {
        if(this.debug) console.info('UPLOAD ERROR');

        switch (error) {
            case -200:  
                Ext.MessageBox.alert(this.strings.text_error, this.strings.error_file_not_found);
                break;
                
            case -230:  
                Ext.MessageBox.alert(this.strings.text_error, this.strings.error_security_error);
                break;
                
            case -290:
                this.store.getById(file.id).set('status', 4);
                this.store.getById(file.id).commit();
                break;
        }
        
        this.fireEvent('fileUploadError', this, file, error, code);
    },

    /**
     * SWFUpload uploadSuccess event
     * @param {Object} file
     * @param {Object} response
     */ 
    uploadSuccess: function(file, response) {
        if(this.debug) console.info('UPLOAD SUCCESS');
        
        var data = Ext.decode(response); 
        if (data.success) {
            //this.store.remove(this.store.getById(file.id));
             this.store.getById(file.id).set('status', 2);
             this.store.getById(file.id).set('uploadDate', data.uploadDate);
             //this.store.getById(file.id).set('id', data.fileLsh);
             this.store.getById(file.id).set('fileLsh', data.fileLsh);
             
             this.store.getById(file.id).commit();
        } else {
            this.store.getById(file.id).set('status', 3);
            this.store.getById(file.id).commit();
            if (data.msg) {
                Ext.MessageBox.alert(this.strings.text_error, data.msg);
            }
        }
        
        
        this.fireEvent('fileUploadSuccess', this, file, data);
    },

    /**
     * SWFUpload uploadComplete event
     * @param {Object} file
     */
    uploadComplete: function(file) {
        if(this.debug) console.info('UPLOAD COMPLETE');
        
        this.progress_bar.reset();
        this.progress_bar.updateText(this.strings.text_progressbar);
        
        if(this.suo.getStats().files_queued && !this.upload_cancelled) {
            this.suo.startUpload();
        } else {
            this.fireEvent('fileUploadComplete', this, file);
            
            this.allUploadsComplete();
        }
        
    },
    
    /**
     * SWFUpload allUploadsComplete method
     */
    allUploadsComplete: function() {
        this.cancelBtn.hide();
		this.addBtn.show();
		this.clearBtn.hide();        
        this.fireEvent('allUploadsComplete', this);
    },
    
    /**
     * SWFUpload setPostParams method
     * @param {String} name
     * @param {String} value
     */
    addPostParam: function(name, value) {
        if (this.suo) {
            this.suo.settings.post_params[name] = value;
            this.suo.setPostParams(this.suo.settings.post_params);
        } else {
            this.post_params[name] = value;
        }
    },
    
    
    /**
     * Start file upload
     * SWFUpload startUpload method
     */
    startUpload: function() {
        if(this.debug) console.info('START UPLOAD');
        
        //this.cancelBtn.show();
        this.uploadBtn.hide();
        this.clearBtn.hide();
		this.addBtn.hide();
        
        this.upload_cancelled = false;
        
		this.fireEvent('startUpload', this);
		this.suo.startUpload();
		
       
    },
    
    /**
     * SWFUpload stopUpload method
     * @param {Object} file
     */
    stopUpload: function(file) {
        if(this.debug) console.info('STOP UPLOAD');
        
        this.suo.stopUpload();
        
        this.upload_cancelled = true;
        
        this.getStore().each(function() {
            if (this.data.status == 1) {
                this.set('status', 0);
                this.commit();
            }
        });

        //this.cancelBtn.hide();
        if (this.suo.getStats().files_queued > 0) {
            this.uploadBtn.show();
        }
        
		this.clearBtn.show();
		this.addBtn.show();

        this.progress_bar.reset();
        this.progress_bar.updateText(this.strings.text_progressbar);

    },
    
    /**
     * Delete one or multiple rows
     * SWFUpload cancelUpload method
     */
    removeFiles: function() {
        if(this.debug) console.info('REMOVE FILES');
        
        var selRecords = this.getSelections();
        for (var i=0; i < selRecords.length; i++) {
            if (selRecords[i].data.status != 1) {
                this.suo.cancelUpload(selRecords[i].id);
                this.store.remove(selRecords[i]);
            }
        }
        
        if (this.suo.getStats().files_queued === 0) {
            this.uploadBtn.hide();
            this.clearBtn.hide();
        }
        
        this.fireEvent('removeFiles', this);
    },
    
    /**
     * Clear the Queue
     * SWFUpload cancelUpload method
     */
    removeAllFiles: function() {
        if(this.debug) console.info('REMOVE ALL');
       
        // mark all internal files as cancelled
        var files_left = this.suo.getStats().files_queued;

        while (files_left > 0) {
            this.suo.cancelUpload();
            files_left = this.suo.getStats().files_queued;
        }
        
        var index = this.store.find("status", "0")
        while (index>=0)
        {        	        	
        	this.store.remove(this.store.getAt(index))        	
        	index = this.store.find("status", "0")
        }   		
		 
        this.cancelBtn.hide();
        this.uploadBtn.hide();
        this.clearBtn.hide();
        
        this.fireEvent('removeAllFiles', this);
    } , 
    
    deleteFile: function() {
    	 var panel = this;   	
    	 var arr = this.getSelectionModel().getSelections()
    	 var attacthStore = this.store
    	 
    	 var fidArr = new Array();
    	 var fileIDs = "";
    	 var fileIDArr = new Array();
    	 var fileQueceIDArr = new Array();
		 for(var i=0;i<arr.length;i++) {
			if(arr[i].get('status') == "0"){
				fileQueceIDArr.push(arr[i]);			
			} else{
				fileIDArr.push(arr[i]);
				fidArr.push(arr[i].get('fileLsh'));
				if(fileIDs == ""){
					fileIDs = "'" +arr[i].get('fileLsh') + "'"
				} else{
					fileIDs = fileIDs  + ",'" + arr[i].get('fileLsh') + "'"
				}	
			}
		}   
	
    	 if(fileQueceIDArr.length > 0){    	 	
    	 	for(var i=0;i<fileQueceIDArr.length;i++) {
    	 		this.suo.cancelUpload(fileQueceIDArr[i].get("fileLsh"), false)
	    	 	this.store.remove(fileQueceIDArr[i])
	    	 	var files_left = this.suo.getStats().files_queued; 
	    	 	if(files_left <=0){
	    	 		this.clearBtn.hide()
	    	 		this.uploadBtn.hide()
	    	 	}
    	 	}    	 	
    	 }
   	 	if(fileIDs != ""){
   	 		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
				if (btn == "yes") {					
					fileServiceImpl.deleteAttachList(fileIDs, "",function(b){
						if(b) {
							for(var i=0;i<fileIDArr.length;i++){
								attacthStore.remove(fileIDArr[i]);
							}
							 panel.fireEvent('deleteFiles', panel, fidArr);
						} else{
							Ext.MessageBox.alert("提示","删除操作执行失败，请联系系统管理员！")
						}
					});
				}    	 		
			})
   	 		
   	 	}
    }
    
});

//文件下载
function downloadFile(val){
    //根据文件流水号，查询文件类型，只有office类型文件才能在线打开
    var fileLsh = val;
    var filename;
    var suffix;
    var _office = false;
    var sql="select file_lsh,file_name from Sgcc_Attach_List where file_lsh='"+fileLsh+"'";
    DWREngine.setAsync(false);
    db2Json.selectData(sql, function(jsonData) {
        var list = eval(jsonData);
        if (list != null && list && list[0]) {
            filename = list[0].file_name;
        }
    });
    DWREngine.setAsync(true);
    if(filename){
        suffix=filename.substring(filename.lastIndexOf(".")+1,filename.length);  
        if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="docx"||suffix=="xlsx"||suffix=="pptx"){
            _office = true;
        }
    }
    if((NTKOWAY!=null&&NTKOWAY==1)&&(_office)){
        var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                "?fileid="+fileLsh+"" +
                "&filetype=sgccfile" +
                    "&ModuleLVL="+ModuleLVL;
            window.showModalDialog(docUrl,"","dialogWidth:"
                + screen.availWidth + "px;dialogHeight:"
                + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
    }else{
        //文件管理的发布直接打开文件，因为文件管理发布的只有一个附件
        var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet" +
                "?ac=sgccfile" +
                "&fileid="+fileLsh+"" +
                "&pid="+CURRENTAPPID;
        document.all.formAc.action = openUrl;
        document.all.formAc.submit();
    }
}

