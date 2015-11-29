var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjPartner"
//bean=""
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var array_unitTypeId = new Array();
var dsCombo_unitTypeId = new Ext.data.SimpleStore({
    fields: ['k', 'v'],
    data: [
        ['', '']
    ]
});
var editAble = true;
if (EDIT == 'false') {
    dydaView = true;
}
if (dydaView) editAble = false;
Ext.onReady(function () {
    DWREngine.setAsync(false);
    DWREngine.beginBatch();
    appMgm.getCodeValue('单位类型', function (list) {
        for (i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode);
            temp.push(list[i].propertyName);
            array_unitTypeId.push(temp);
        }
    });
    DWREngine.endBatch();
    DWREngine.setAsync(true);
    dsCombo_unitTypeId.loadData(array_unitTypeId);

    /**
     * 1. 创建选择模式
     */
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    })

    /**
     * 2. 创建列模型
     */

    var fm = Ext.form;

    var fc = {
        'uids': {
            name: 'uids',
            fieldLabel: '主键',
            anchor: '95%'
        },
        'pid': {
            name: 'pid',
            fieldLabel: '项目编号',
            anchor: '95%',
            value: edit_pid
        },
        'unitTypeId': {
            name: 'unitTypeId',
            fieldLabel: '单位类型',
            anchor: '95%',
            store: dsCombo_unitTypeId,
            displayField: 'v',
            valueField: 'k',
            typeAhead: true,
            hiddenName: 'unitTypeId',
            mode: 'local',
            lazyRender: true,
            triggerAction: 'all',
            emptyText: "",
            selectOnFocus: true
        },
        'unitid': {
            name: 'unitid',
            fieldLabel: '合作单位ID',
            anchor: '95%'
        },
        'unitname': {
            name: 'unitname',
            fieldLabel: '单位名称',
            anchor: '95%',
            allowBlank:false
        },
        'address': {
            name: 'address',
            fieldLabel: '单位地址',
            anchor: '95%'
        },
        'corporate': {
            name: 'corporate',
            fieldLabel: '法人代表',
            anchor: '95%'
        },
        'phone': {
            name: 'phone',
            fieldLabel: '电话',
            anchor: '95%'
        },
        'email': {
            name: 'email',
            fieldLabel: '邮箱',
            anchor: '95%'
        },
        'fax': {
            name: 'fax',
            fieldLabel: '传真',
            anchor: '95%'
        }

    }

    var cm = new Ext.grid.ColumnModel([ // 创建列模型
    sm,
    {
        id: 'unitTypeId',
        type: 'string',
        header: fc['unitTypeId'].fieldLabel,
        align :'center',
        width : 120,
        editor: editAble == false ? null : new Ext.form.ComboBox(fc['unitTypeId']),
        dataIndex: fc['unitTypeId'].name,
        renderer: function (k) {
            for (var i = 0; i < array_unitTypeId.length; i++) {
                if (k == array_unitTypeId[i][0]) {
                    return array_unitTypeId[i][1];
                }
            }
        }
    }, {
        id: 'unitname',
        type: 'string',
        align :'left',
        header: fc['unitname'].fieldLabel,
        width : 200,
        editor: editAble == false ? null : new fm.TextField(fc['unitname']),
        renderer :function(value) {
			var qtip = "qtip=" + value;
			return'<span ' + qtip + '>' + value + '</span>';
		},
        dataIndex: fc['unitname'].name

    }, {
        id: 'address',
        type: 'string',
        align :'left',
        header: fc['address'].fieldLabel,
        width : 190,
        editor: editAble == false ? null : new fm.TextField(fc['address']),
        renderer :function(value) {
			var qtip = "qtip=" + value;
			return'<span ' + qtip + '>' + value + '</span>';
		},
        dataIndex: fc['address'].name
    }, {
        id: 'corporate',
        type: 'string',
        align :'center',
        header: fc['corporate'].fieldLabel,
        width : 100,
        editor: editAble == false ? null : new fm.TextField(fc['corporate']),
        dataIndex: fc['corporate'].name
    }, {
        id: 'phone',
        type: 'string',
        align :'center',
        header: fc['phone'].fieldLabel,
        width : 120,
        editor: editAble == false ? null : new fm.TextField(fc['phone']),
        dataIndex: fc['phone'].name
    }, {
        id: 'email',
        type: 'string',
        align :'center',
        header: fc['email'].fieldLabel,
        width : 190,
        editor: editAble == false ? null : new fm.TextField(fc['email']),
        renderer :function(value) {
			var qtip = "qtip=" + value;
			return'<span ' + qtip + '>' + value + '</span>';
		},
        dataIndex: fc['email'].name
    }, {
        id: 'fax',
        type: 'string',
        align :'center',
        header: fc['fax'].fieldLabel,
        width : 120,
        editor: editAble == false ? null : new fm.TextField(fc['fax']),
        dataIndex: fc['fax'].name
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
        name: 'unitTypeId',
        type: 'string'
    }, {
        name: 'unitid',
        type: 'string'
    }, {
        name: 'unitname',
        type: 'string'
    }, {
        name: 'address',
        type: 'string'
    }, {
        name: 'corporate',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'fax',
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
            params: "pid='" + edit_pid + "'",
            outFilter: outFilter
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

    ds.load();


    var Plant = Ext.data.Record.create(Columns);

    var PlantInt = {
        uids: '',
        pid: edit_pid,
        unitTypeId: '',
        unitid: '',
        unitname: '',
        address: '',
        corporate: '',
        phone: '',
        email: '',
        fax: ''
    }

    var grid = new Ext.grid.EditorGridTbarPanel({
        store: ds,
        cm: cm,
        sm: sm,
        tbar: (dydaView == true &&!EDIT=='false')? ["->",
        {
            text: '返回',
            iconCls: 'returnTo',
            handler: function () {
                history.back();
            }
        }] : [],
        border: false,
        layout: 'fit',
        region: 'center',
        header: false,
        autoScroll: true,
        // 自动出现滚动条
        collapsible: false,
        // 是否可折叠
        animCollapse: false,
        // 折叠时显示动画
//        autoExpandColumn: 2,
        // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,
        // 加载时是否显示进度
        stripeRows: true,
        trackMouseOver: true,
        viewConfig: {
            forceFit: false,
            ignoreAdd: true
        },
        bbar: new Ext.PagingToolbar({ // 在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners: {
            'aftersave': function (grid, idsOfInsert, idsOfUpdate, primaryKey, gridBean) {
                pcPrjService.sendCoUnitToJT(idsOfInsert, idsOfUpdate, edit_pid, defaultOrgRootID, function () {
                    //							alert("hhh");
                })
            },
            'afterdelete': function (grid, ids, primaryKey, gridBean) {
                pcPrjService.sendCoUnitToJTDEL(ids, edit_pid, defaultOrgRootID, function () {
                    //							alert("delete");
                })
            }
        },
        // expend properties
//        saveHandler:function(){
//        	grid.
//        },
        plant: Plant,
        plantInt: PlantInt,
        servletUrl: MAIN_SERVLET,
        bean: bean,
        business: business,
        primaryKey: primaryKey
    });
    if (!editAble) {
        grid.addBtn = false;
        grid.saveBtn = false;
        grid.delBtn = false;
    }
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid]
    });


});