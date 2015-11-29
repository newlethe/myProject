var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjKeyMan"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var keyManGrid, formPanel, editWin;
var DEFUALT_IMAGE_URL = BASE_PATH + "/PCBusiness/zhxx/query/default.jpg?&random=" + Math.random();;
var role_module_hide = true;
if (EDIT == 'false') {
    ModuleLVL = 4;
}
if (ModuleLVL < 3) role_module_hide = false;
var imagesId = null;
var appblob_fileid = null;
var picWin;
Ext.onReady(function () {
    /**
     * 1. 创建选择模式
     */
    //这个gird只容许单行选择，请勿修改
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    })

    /**
     * 2. 创建列模型
     */

    var fm = Ext.form;

    var fc = {
        'postname': {
            name: 'postname',
            fieldLabel: '职务',
            anchor: '95%'
        },
        'username': {
            name: 'username',
            fieldLabel: '姓名',
            align: 'center',
            anchor: '95%'
        },
        'image': {
            name: 'image',
            fieldLabel: '照片',
            align: 'center',
            anchor: '95%'
        },
        'contact': {
            name: 'contact',
            fieldLabel: '联系方式',
            align: 'center',
            anchor: '95%'
        }

    }

    var cm = new Ext.grid.ColumnModel([ // 创建列模型
    sm,
    {
        id: 'username',
        type: 'string',
        header: fc['username'].fieldLabel,
        align: 'center',
        dataIndex: fc['username'].name
    }, {
        id: 'postname',
        type: 'string',
        align: 'center',
        header: fc['postname'].fieldLabel,
        dataIndex: fc['postname'].name
    }, {
        id: 'contact',
        type: 'string',
        align: 'center',
        header: fc['contact'].fieldLabel,
        dataIndex: fc['contact'].name
    }, {
        id: 'image',
        hidden : true,
        width: 350,
        header: fc['image'].fieldLabel,
        align: 'center',
        dataIndex: fc['image'].name,
        renderer: function (v) {
            return "<a href=\"javascript:lookpic('" + v + "')\">查看</a>";
        }

    }

    ]);
    cm.defaultSortable = true; // 设置是否可排序
    // 3. 定义记录集
    var Columns = [{
        name: 'uids',
        type: 'string'
    }, {
        name: 'pid',
        type: 'string'
    }, {
        name: 'postname',
        type: 'string'
    }, {
        name: 'image',
        type: 'string'
    }, {
        name: 'userid',
        type: 'string'
    }, {
        name: 'deptid',
        type: 'string'
    }, {
        name: 'posid',
        type: 'string'
    }, {
        name: 'viewOrderNum',
        type: 'float'
    }, {
        name: 'resume',
        type: 'string'
    }, {
        name: 'username',
        type: 'string'
    }, {
        name: 'contact',
        type: 'string'
    }];
    /**
     * 创建数据源
     */
    var ds = new Ext.data.Store({
        baseParams: {
            ac: 'list',
            bean: bean,
            business: business,
            method: listMethod,
            params: "pid='" + edit_pid + "' order by viewOrderNum asc"
        },
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });


    var Plant = Ext.data.Record.create(Columns);

    var PlantInt = {
        uids: '',
        pid: '',
        postname: '',
        image: '',
        userid: '',
        deptid: '',
        posid: '',
        viewOrderNum: '',
        resume: '',
        username: ''
        ,contact: ''
    };

    keyManGrid = new Ext.grid.EditorGridTbarPanel({
        store: ds,
        cm: cm,
        sm: sm,
        tbar: [{
            id: 'add',
            text: '新增',
            iconCls: 'add',
            hidden: role_module_hide,
            handler: function () {
                showEditWindow()
            }
        }, {
            id: 'edit',
            text: '编辑',
            iconCls: 'icon-edit',
            hidden: role_module_hide,
            handler: function () {
                showEditWindow(true)
            }
        }],
        border: false,
        layout: 'fit',
        anchor: '100% 35%',
        header: false,
        autoScroll: true,
        // 自动出现滚动条
        collapsible: false,
        // 是否可折叠
        animCollapse: false,
        // 折叠时显示动画
        // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,
        // 加载时是否显示进度
        stripeRows: true,
        trackMouseOver: true,
        viewConfig: {
            forceFit: true,
            ignoreAdd: true
        },
        listeners: {
            'afterdelete': function (grid, ids, key, gridBean) {
                var sql = "delete from APP_BLOB where fileid in " + appblob_fileid;
                //						DWREngine.setAsync(false);
                baseDao.updateBySQL(sql);
                pcPrjService.sendKeymanToJTDEL(ids, imagesId, edit_pid, defaultOrgRootID, function () {
                    //				    		alert("hhhh");
                });
                //						DWREngine.setAsync(true);
                loadImg();
            }
        },
/*bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),*/
        addBtn: false,
        saveBtn: false,
        deleteHandler: deleteFn,
        plant: Plant,
        plantInt: PlantInt,
        servletUrl: MAIN_SERVLET,
        bean: bean,
        business: business,
        primaryKey: primaryKey
    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [keyManGrid]
    });
    ds.load();
    //	loadImg();

    function deleteFn() {
        var records = keyManGrid.getSelectionModel().getSelections();
        var imagesArr = [];
        var fileids = [];
        for (var i = 0; i < records.length; i++) {
            var m = records[i].get("uids") + ":" + records[i].get("image");
            fileids[fileids.length] = records[i].get("image");
            imagesArr[imagesArr.length] = m;
        }
        imagesId = imagesArr.join(",");
        appblob_fileid = "('" + fileids.join("','") + "')";
        keyManGrid.defaultDeleteHandler();

    }
});

function showEditWindow(edit) {
    var keyManRecord;
    var URL = "";
    if (edit === true) { //编辑人员信息
        keyManRecord = keyManGrid.getSelectionModel().getSelected();
        if (!keyManRecord) {
            Ext.example.msg('提示', '请先选择要编辑的人员！');
            return
        }
        if (keyManRecord.get('image') != undefined && keyManRecord.get('image') != "") {
            URL = BASE_PATH + "servlet/FlwServlet?ac=loadDoc&fileid=" + keyManRecord.get('image') + "&random=" + Math.random();
        }
    } else { //新增重要人员信息
        var KeyManRecord = Ext.data.Record.create([{}]);
        keyManRecord = new KeyManRecord({
            pid: edit_pid
        });
    };

    if (URL == "") URL = BASE_PATH + "/PCBusiness/zhxx/query/default.jpg";

    if (!editWin) {
        formPanel = new Ext.form.FormPanel({
            baseCls: "x-plain",
            layout: "column",
            items: [{
                columnWidth: .4,
                layout: "form",
                labelWidth: 53,
                baseCls: "x-plain",
                items: [{
                    xtype: 'hidden',
                    name: 'pid'
                }, {
                    xtype: 'hidden',
                    name: 'image'
                }, {
                    xtype: 'hidden',
                    name: 'uids'
                }, {
                    name: 'upimage',
                    fieldLabel: "照片",
                    hideLabel: true,
                    id: "photo",
                    xtype: 'field',
                    width: 160,
                    height: 170,
                    defaultAutoCreate: {
                        tag: 'img',
                        cls: 'tng-managed-image',
                        src: URL,
                        title: '提示：鼠标点击可以编辑照片',
                        value: '',
                        onclick: "uploadImg()",
                        style: 'cursor: pointer;',
                        onerror: "onerrorHandler(this)"
                    }

                }]
            }, {
                columnWidth: .05,
                xtype: 'label'
            }, {
                columnWidth: .5,
                layout: "form",
                labelWidth: 55,
                defaultType: "textfield",
                defaults: {
                    anchor: "97%"
                },
                labelAlign: 'top',
                baseCls: "x-plain",
                items: [{
                    name: 'username',
                    fieldLabel: '名称',
                    allowBlank: false,
                    anchor: '95%'
                }, {
                    name: 'postname',
                    fieldLabel: '职务',
                    anchor: '95%'
                }, {
                    name: 'contact',
                    fieldLabel: '联系方式',
                    anchor: '95%'
                }, {
                    name: 'viewOrderNum',
                    fieldLabel: '排序',
                    xtype: 'numberfield',
                    anchor: '95%',
                    allowDecimals: false,
                    //不允许输入小数
                    nanText: '请输入有效整数',
                    //无效数字提示
                    allowNegative: false //不允许输入负数
                }]
            }]
        });

        eidtWin = new Ext.Window({
            title: "主要人员",
            width: 370,
            height: 250,
            buttonAlign: "center",
            plain: true,
            //颜色匹配
            collapsible: true,
            //折叠
            modal: true,
            //变灰
            draggable: false,
            //拖动
            layout: "fit",
            resizable: false,
            //尺寸变换
            items: [formPanel],
            buttons: [{
                text: "确定",
                handler: function () {
                    //				    		pcPrjService.sendKeymanToJT(edit_pid,function(){
                    //				    			alert("hhhh");
                    //				    		});
                    var username = formPanel.getForm().findField('username').getValue();
                    if (username == null || username == "") {
                        Ext.Msg.show({
                            title: '提示',
                            msg: '姓名必须填写',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return false;
                    }
                    pcPrjService.keymanAddOrUpdate(formPanel.getForm().getValues(), function (state) {
                        if ("0" == state) {
                            Ext.Msg.show({
                                title: '提示',
                                msg: '编辑失败',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            Ext.example.msg('提示！', '操作成功!');
                            keyManGrid.store.reload();
                            //			   				loadImg();
                            formPanel.getForm().findField('uids').setValue(state);
                            eidtWin.destroy();
                        }
                    });
                }
            }, {
                text: "取消",
                handler: function () {
                    eidtWin.destroy();
                }
            }],
            listeners: {
                show: function () {
                    formPanel.getForm().loadRecord(keyManRecord);
                },
                beforedestroy: function () {
                    DWREngine.setAsync(false);
                    pcPrjService.validateImage(formPanel.getForm().getValues())
                    DWREngine.setAsync(true);
                }
            }
        });
    };
    eidtWin.show();
};

function uploadImg() {
    if (formPanel) {
        var image = formPanel.getForm().findField('image').getValue();
        if (image == "") image = getSN();
        var fileForm = new Ext.FormPanel({
            fileUpload: true,
            header: false,
            border: false,
            bodyStyle: 'padding: 10px 10px;',
            url: CONTEXT_PATH + "/servlet/FlwServlet?ac=uploadSign&userid=" + image + "&random=" + Math.random(),
            autoScroll: true,
            labelAlign: 'right',
            items: [{
                name: 'upimage1',
                fieldLabel: "照片",
                hideLabel: true,
                id: "upphoto",
                xtype: 'field',
                inputType: 'file',
                width: 270,
                defaultAutoCreate: {
                    tag: 'input',
                    style: 'padding: 3px 3px;'
                }
            }],
            buttons: [{
                text: '确定',
                handler: function () {
                    var filename = Ext.getDom('upphoto').value;
                    if (filename == "" || filename.length < 4 || (filename.substring(filename.length - 4)).toLowerCase() != ".jpg") {
                        Ext.example.msg('警告', '请上传jpg格式图片！');
                        return false;
                    }
                    fileForm.getForm().submit({
                        waitTitle: 'Please waiting...',
                        waitMsg: 'Upload data...',
                        success: function (form, action) {
                            formPanel.getForm().findField('image').setValue(image);
                            var img = Ext.get('upimage');
                            if (img) {
                                img.dom.src = BASE_PATH + "servlet/FlwServlet?ac=loadDoc&fileid=" + image + "&random=" + Math.random();
                                win1.destroy();
                            }
                        },
                        failure: function (form, action) {
                            Ext.Msg.show({
                                title: '提示',
                                msg: action.result.msg,
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK,
                                fn: function (value) {}
                            });
                        }
                    })
                }
            }]
        });

        var win1 = new Ext.Window({
            title: '上传照片',
            width: 320,
            height: 150,
            buttonAlign: "center",
            plain: true,
            //颜色匹配
            //closable :false,
            modal: true,
            //变灰
            draggable: false,
            //拖动
            resizable: false,
            //尺寸变换
            layout: 'form',
            bodyStyle: 'padding: 10px 10px;',
            items: [fileForm]
        })
        win1.show();
    }
}

function onerrorHandler(obj) {
    obj.src = DEFUALT_IMAGE_URL
}

function lookpic(v) {
    var PIC = BASE_PATH + "/PCBusiness/zhxx/query/default.jpg";
    if (v != '') {
        PIC = BASE_PATH + "servlet/FlwServlet?ac=loadDoc&fileid=" + v + "&random=" + Math.random();
    }
    var tpl = new Ext.XTemplate('<br/><table>' + '<tr>' + '<td align="center" valign="middle">' + '<img src="{IMAGE}" width="150" height="120" />' + '</td>' + '</tr>' + '</table>')
    var tabstr = tpl.apply({
        IMAGE: PIC
    });
    if (!top.picWin) {

        top.picWin = new top.Ext.Window({
            title: '查看照片',
            width: 180,
            height: 180,
            plain: true,
            modal: true,
            draggable: false,
            resizable: false,
            html: tabstr,
            listeners: {
                'hide': function (win) {
                    win.destroy();
                    top.picWin = null;
                }
            }

        })
    }
    top.picWin.show();
}

function loadImg() {
    var tpl = new Ext.XTemplate('<br/><table>' + '<tr>' + '<td align="center" valign="middle">' + '<img src="{IMAGE}" width="100" height="120" />' + '</td>' + '</tr>' + '<tr>' + '<td align="center"><p>{POS}</p></td>' + '</tr>' + '</table>')
    var tab = document.getElementById("view0");
    for (var i = 0, r = tab.rows.length; i < r; i++) {
        tab.deleteRow();
    }
    baseDao.findByWhere2("com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjKeyMan", "pid='" + edit_pid + "' order by viewOrderNum asc", function (list) {
        var obj = list.length > 0 ? list[0] : {
            username: "",
            postname: ""
        };
        var url = DEFUALT_IMAGE_URL;
        if (obj.image && obj.image != "") url = BASE_PATH + "servlet/FlwServlet?ac=loadDoc&fileid=" + obj.image + "&" + Math.random();
        var postname = obj.postname == null ? "" : obj.postname;
        var tabstr = tpl.apply({
            IMAGE: url,
            POS: (postname + " " + obj.username)
        });
        var row = tab.insertRow();
        var td = row.insertCell();
        td.setAttribute("colSpan", 4);
        td.setAttribute("align", "center");
        td.setAttribute("valign", "middle");
        td.innerHTML = tabstr

        var row = tab.insertRow();
        for (var i = 1; i <= 4; i++) {
            var url = DEFUALT_IMAGE_URL;
            var postname = "";
            if (i < list.length) {
                var obj = list[i];
                var postn = obj.postname == null ? "" : obj.postname;
                postname = postn + "  " + obj.username;
                if (obj.image && obj.image != "") {
                    url = BASE_PATH + "servlet/FlwServlet?ac=loadDoc&fileid=" + obj.image + "&" + Math.random();
                }
            }

            var tabstr = tpl.apply({
                IMAGE: url,
                POS: postname
            });
            var td = row.insertCell();
            td.setAttribute("width", "172");
            td.setAttribute("align", "center");
            td.setAttribute("valign", "top");
            td.innerHTML = tabstr
        }
    })
}