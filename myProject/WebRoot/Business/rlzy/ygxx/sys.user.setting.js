

Ext.apply(Ext.form.VTypes, {
  daterange: function(val, field) {
    var date = field.parseDate(val);
    
    // We need to force the picker to update values to recaluate the disabled dates display
    var dispUpd = function(picker) {
      var ad = picker.activeDate;
      picker.activeDate = null;
      picker.update(ad);
    };
    
    if (field.startDateField) {
      var sd = Ext.getCmp(field.startDateField);
      sd.maxValue = date;
      if (sd.menu && sd.menu.picker) {
        sd.menu.picker.maxDate = date;
        dispUpd(sd.menu.picker);
      }
    } else if (field.endDateField) {
      var ed = Ext.getCmp(field.endDateField);
      ed.minValue = date;
      if (ed.menu && ed.menu.picker) {
        ed.menu.picker.minDate = date;
        dispUpd(ed.menu.picker);
      }
    }
    /* Always return true since we're only using this vtype
     * to set the min/max allowed values (these are tested
     * for after the vtype test)
     */
    return true;
  }
});



var treePanel, gridPanel, userGridPanel, userInfoPanel, userInfoTabPanel, userSelectPanel;
var gridResumePanel,gridJndjPanel,gridArtPanel,gridJfPanel,gridFamilyPanel,gridAbilityPanel,gridEducationPanel,gridWorkexepPanel
var PlantInt,PlantIntResume,PlantIntJndj,PlantIntArt,PlantIntJf,PlantIntFamily,PlantIntAbility,PlantIntEducation,PlantIntWorkexep
var ds,dsResume,dsJndj,dsArt,dsJf,dsUser,dsFamily,dsAbility,dsEducation,dsWorkexep
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.pmis.rlzj.hbm.HrManInfo";
var beanUser = "com.sgepit.frame.sysman.hbm.RockUser";
var beanFamily = "com.sgepit.pmis.rlzj.hbm.HrManFamily";
var beanAbility = "com.sgepit.pmis.rlzj.hbm.HrManAbility";
var beanEducation = "com.sgepit.pmis.rlzj.hbm.HrManEducation";
var beanWorkexep = "com.sgepit.pmis.rlzj.hbm.HrManWorkexep";
var beanContract="com.sgepit.pmis.rlzj.hbm.HrManContract";
var business = "rlzyMgm";
var listMethod = "findUserInfoByOrg";
var listUserMethod = "findUserByOrg";
var listFamilyMethod = "findByProperty";
var listAbilityMethod = "findByProperty";
var listEducationMethod = "findByProperty";
var listWorkexepMethod = "findByProperty";
var listContractMethod="findByProperty";
var primaryKey = "userid";
var primaryFamilyKey = "seqnum";
var primaryAbilityKey = "seqnum";
var primaryEducationKey = "seqnum";
var primaryWorkexepKey = "seqnum";
var primaryContractKey="seqnum";
var orderColumn = "realname";
var gridPanelTitle = "用户列表，请选择部门";
var gridFamilyPanelTitle = "家庭成员信息";
var gridAbilityPanelTitle = "主要技能信息";
var gridEducationPanelTitle = "教育及培训情况";
var gridWorkexepPanelTitle = "工作经历";
var gridContractPanelTitle="员工合同信息";
var formPanelTitle = "编辑记录（查看详细信息）";
var paramStr = "unitid" + SPLITB +USERBELONGUNITID;
var paramStrCur = paramStr;
var SPLITB = "`";
var root;
var selectedUserId = "-1";
var selectedOrgId = USERBELONGUNITID;
var selectedOrgIdWin = USERBELONGUNITID;
var COMPANY = defaultOrgRootName
var selectedOrgName = COMPANY;
var orgs = new Array();
var poss = new Array();
var roles = new Array();
var jllxs = new Array();//经历类型
var ghs = new Array();//技能职业类型
var zyjszgs = new Array();//专业技术资格
var yght=new Array();//员工合同
var zhiwu=new Array();//职务
var nds = new Array();//预算年度
var selectedTypeName="-1";
//（0 禁用；1激活；2锁定）
var statusList = [['1', '激活'],['2', '锁定'],['0', '禁用']];
var defaultPwd = MD5("123456");
var defaultStatus = "1";
var cutUserBtn, pasteUserBtn,setPasswordBtn;
var orgIdWhenCopied, usersToMove, moveAction;
var uploadWindow;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree&unitType=7`9";
var formWindow,formPanelinsert
var selectRecords;
if(ROLETYPE=="0")
{	
	if(USERBELONGUNITID == USERBELONGUNITID)
	{
		paramStr = ""
	}	
}
/*
if((ROLETYPE != '0') )
{
	treeNodeUrl = treeNodeUrl +"&attachUnit=" + UNITID
}
*/
Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);
	systemMgm.getUnitListByWhere("unit_type_id is not null",function(list){// = '5'",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			orgs.push(temp);
		}
    });
	systemMgm.getUnitListByWhere("unit_type_id = '0'",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			poss.push(temp);
		}
    });
    
       //获取用工形式
       appMgm.getCodeValue('用工形式',function(list){ 
		for(i = 0; i < list.length; i++) {
		var temp=new Array();
		   temp.push(list[i].propertyCode);
		   temp.push(list[i].propertyName);
		   yght.push(temp);
		}
    });  
     //获取职务
       appMgm.getCodeValue('员工职务',function(list){ 
		for(i = 0; i < list.length; i++) {
		var temp=new Array();
		   temp.push(list[i].propertyCode);
		   temp.push(list[i].propertyName);
		   zhiwu.push(temp);
		}
    });  
    
    
    
    
    
    DWREngine.setAsync(true);
    orgSt = new Ext.data.SimpleStore({
		fields: ['unitid','unitname'],   
		data: orgs
	});
    posSt = new Ext.data.SimpleStore({
		fields: ['unitid','unitname'],   
		data: poss
	});
	
	conSt=new Ext.data.SimpleStore({
	  fields:['k','v'],
	  data:yght
	});
	//职务获取zwSt
	zwSt=new Ext.data.SimpleStore({
	  fields:['k','v'],
	  data:zhiwu
	});
	
	
	root = new Ext.tree.AsyncTreeNode({
       text: USERBELONGUNITNAME,
       id: USERBELONGUNITID,
       expanded:true
    });
    treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + USERBELONGUNITID + "&treeName=HrManOrgTree",
		requestMethod: "GET"
	})

	var 组织结构树
	treePanel = new Ext.tree.TreePanel({
        id:'orgs-tree',
        region:'west',
        split:true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        layout: 'accordion',
        margins:'5 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible: true,
        lines:false,
        autoScroll:true,
        collapsible: true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
        loader: treeLoader,
        root: root,
        collapseFirst:false
	});
	
	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=HrManOrgTree"; 
	});
	
    treePanel.on('click', function(node, e){
		e.stopEvent();
		PlantInt.posid = node.id;
		var titles = [node.text];
		var obj = node.parentNode;
		while(obj!=null){
			titles.push(obj.text);
			obj = obj.parentNode;
		}
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);
		selectedOrgId = node.id
		selectedOrgName = node.text
		
		//var paramStrCur = "unitType = '"+selectedType+"' and posid = '"+node.id+"'"; 
		var  strTree = ''
		DWREngine.setAsync(false);
			baseMgm.getData("select t.unitid from sgcc_ini_unit t start with t.unitid = '"+node.id+"' connect by prior t.unitid = t.upunit",function(list){
				if(list !=null){
					for(var i = 0;i<list.length;i++){
						if(list.length == 1){
							strTree="'"+list[i]+"'";
						}else{
							if(i>=0 && i< list.length-1){
								strTree +="'"+list[i]+"',";
							}else{
								strTree +="'"+list[i]+"'";
							}	
						}
					}
				}
			});
		DWREngine.setAsync(true);  
		var selectedType = node.attributes.nodeType
		var paramStrCur = "unitType"+SPLITB+selectedType + SPLITA 
		                + "posid" + SPLITB +strTree      
		fixedFilterPart = " posid = '"+strTree+"'";
		if (selectedOrgId==USERBELONGUNITID)
		{
			paramStrCur ="";
			fixedFilterPart = "1=1";
		}
		ds.baseParams.business = business;
	   	ds.baseParams.method = listMethod;
		ds.baseParams.params = paramStrCur;
		ds.load({
			params:{
			 	start: 0,
			 	limit: 20
			}
		});
    });
    
var 用户信息
//gridPanel--------------------------------------------------------------------------------------------------	
    var fc = {		// 创建编辑域配置
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'realname': {
			name: 'realname',
			fieldLabel: '用户姓名',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}, 'sex': {
			name: 'sex',
			hiddenName: 'sex',
			fieldLabel: '性别',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '男'],['1', '女']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
        }, 'phone': {
			name: 'phone',
			fieldLabel: '座机',
			anchor:'95%'
		}, 'mobile': {
			name: 'mobile',
			fieldLabel: '手机',
			anchor:'95%'
		}, 'email': {
			name: 'email',
			fieldLabel: '电子邮件',
			anchor:'95%'
		}, 'im': {
			name: 'im',
			fieldLabel: 'IM',
			anchor:'95%'
		}, 'status': {
			name: 'status',
			hiddenName: 'status',
			fieldLabel: '状态',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: statusList
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'birthday': {
			name: 'birthday',
			fieldLabel: '生日（阴历）',
            format: 'Y-m-d',
 			anchor:'95%'
        }, 'workingtime': {
			name: 'workingtime',
			fieldLabel: '工作时间',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'orgid': {
			name: 'orgid',
			fieldLabel: '单位名称',
			hiddenName: 'orgid',
			valueField: 'unitid', 
			displayField: 'unitname',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
			readOnly:true,
            store: orgSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 
		 'posname': {
			name: 'posname',
			fieldLabel: '部门/岗位',
			readOnly:true,
			anchor:'95%'
		},'orgname': {
			name: 'orgname',
			fieldLabel: '岗位',
			readOnly:true,
			anchor:'95%'
		}, 'posid': {
			name: 'posid',
			fieldLabel: '组织结构名称',
			hiddenName: 'posid',
			valueField: 'unitid', 
			displayField: 'unitname',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: posSt,
			readOnly:true,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'onthejob': {
			name: 'onthejob',
			hiddenName: 'onthejob',
			fieldLabel: '在职',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '离职'],['1', '在职']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'nativeplace': {
			name: 'nativeplace',
			fieldLabel: '祖籍',
			anchor:'95%'
		}, 'race': {
			name: 'race',
			fieldLabel: '民族',
			anchor:'95%'
		}, 'edurecord': {
			name: 'edurecord',
			fieldLabel: '学历',
			anchor:'95%'
		}, 'height': {
			name: 'height',
			fieldLabel: '身高（cm）',
			anchor:'95%'
		}, 'weight': {
			name: 'weight',
			fieldLabel: '体重（kg）',
			anchor:'95%'
		}, 'politicalfeatures': {
			name: 'politicalfeatures',
			hiddenName: 'politicalfeatures',
			fieldLabel: '政治面貌',
			anchor:'95%'
		}, 'paperstype': {
			name: 'paperstype',
			hiddenName: 'paperstype',
			fieldLabel: '证件类型',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['1', '身份证'],['2', '护照']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'papersno': {
			name: 'papersno',
			fieldLabel: '证件编号',
			anchor:'95%'
		}, 'maritalstatus': {
			name: 'maritalstatus',
			hiddenName: 'maritalstatus',
			fieldLabel: '婚姻状况',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '未婚'],['1', '已婚']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'professionalpost': {
			name: 'professionalpost',
			fieldLabel: '职称',
			anchor:'95%'
		}, 'homeaddress': {
			name: 'homeaddress',
			fieldLabel: '家庭住址',
			anchor:'95%'
		}, 'memoc1': {
			name: 'memoc1',
			hiddenName: 'memoc1',
			fieldLabel: '工作区域',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['010', '北京'],['0371', '郑州'],['0512', '张家港']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'memoc2': {
			name: 'memoc2',
			fieldLabel: '岗级',
			anchor:'95%'
		}, 'memoc3': {
			name: 'memoc3',
			hiddenName: 'memoc3',
			fieldLabel: '职务',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store:zwSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		},'userNum':
		{   name:'userNum',
		    fieldLabel: '员工编号',
			anchor:'95%'    
		},'userEmpType':{
		   name:'userEmpType',
		    fieldLabel: '用工形式',
			hiddenName: 'userEmpType',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
			readOnly:true,
            store: orgSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'userid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'realname', type: 'string'},
    	{name: 'sex', type: 'string'},
    	{name: 'phone', type: 'string'},
    	{name: 'mobile', type: 'string'},
		{name: 'email', type: 'string'},
    	{name: 'im', type: 'string'},
		{name: 'orgid', type: 'string'},
		{name: 'orgname', type: 'string'},
		{name: 'posid', type: 'string'},
		{name: 'posname', type: 'string'},
		{name: 'onthejob', type: 'string'},
		{name: 'nativeplace', type: 'string'},
		{name: 'race', type: 'string'},
    	{name: 'birthday', type: 'date', dateFormat: 'Y-m-d H:i:s'},// type: 'string'},//
		{name: 'edurecord', type: 'string'},
		{name: 'height', type: 'string'},
		{name: 'weight', type: 'string'},
		{name: 'politicalfeatures', type: 'string'},    	
		{name: 'paperstype', type: 'string'},
		{name: 'papersno', type: 'string'},
		{name: 'maritalstatus', type: 'string'},
		{name: 'professionalpost', type: 'string'},    	
		{name: 'homeaddress', type: 'string'},    	
    	{name: 'workingtime', type: 'date', dateFormat: 'Y-m-d H:i:s'},// type: 'string'},//
		{name: 'memoc1', type: 'string'},    	
		{name: 'memoc2', type: 'string'},    	
		{name: 'memoc3', type: 'string'},    	
		{name: 'status', type: 'string'},
		{name:'userNum', type:'string'},
		{name:'userEmpType',type:'string'}
		];
		
	var Fields = Columns.concat([ // 表单增加的列
	      
		]);
	
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    PlantInt = {
		userid: '',
		realname: '',
		sex: '',
		phone: '',
		mobile: '',
		email: '',
		im: '',
		orgid: '',
		orgname: '',
		posid: '',
		posname: '',
		onthejob: '1',
		nativeplace: '',
		race: '',
		birthday: '',
		edurecord: '',
		height: '',
		weight: '',
		politicalfeatures: '',
		paperstype: '',
		papersno: '',
		maritalstatus: '',
		professionalpost: '',
		homeaddress: '',
		workingtime: '',
		memoc1: '',
		memoc2: '',
		memoc3: '',
		status: defaultStatus,
		userNum:'',
		userEmpType:''
    };
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
	});
    
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true,
    header : ''});
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:fc['userid'].name,
           header: fc['userid'].fieldLabel,
           dataIndex: fc['userid'].name,
           hidden:true,
           width: 200
        }, {
           id:fc['realname'].name,
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           type: 'string',
           width: 80
//           ,editor: new fm.TextField(fc['realname'])
        },{
           id:fc['userNum'].name,
           header:fc['userNum'].fieldLabel,
           dataIndex:fc['userNum'].name,
           type: 'string',
           width:120
        }, {
           id:fc['sex'].name,
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           type: 'combo',
           width: 40,
           store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '男'],['1', '女']]
			}),
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '男':'女';
           	  else
           	  	return value;
           }
        }, {
           id:fc['orgid'].name,
           header: fc['orgid'].fieldLabel,
           dataIndex: fc['orgid'].name,
           hidden:true,
           width: 100
           ,renderer: function(value){
           	  for(var i=0; i<orgSt.getCount(); i++){
           	  	if (value == orgSt.getAt(i).get('unitid'))
           	  		return orgSt.getAt(i).get('unitname')
           	  }
           }
        },  {
           id:fc['posname'].name,
           header: fc['posname'].fieldLabel,
           dataIndex: fc['posname'].name,
           hidden:false,
           type: 'string',
           renderer: function(value,x,ds){
           		return ds.data.orgname=="" ? value : value+'/'+ds.data.orgname; 
           },
           width: 110
        },{
           id:fc['orgname'].name,
           header: fc['orgname'].fieldLabel,
           dataIndex: fc['orgname'].name,
           hidden:true,
           width: 130
        }, {
           id:fc['posid'].name,
           header: fc['posid'].fieldLabel,
           dataIndex: fc['posid'].name,
           hidden:true,
           width: 80
           ,renderer: function(value){
           	  for(var i=0; i<posSt.getCount(); i++){
           	  	if (value == posSt.getAt(i).get('unitid'))
           	  		return posSt.getAt(i).get('unitname')
           	  }
           }
        },{
           id:fc['userEmpType'].name,
           header: fc['userEmpType'].fieldLabel,
           dataIndex: fc['userEmpType'].name,
           hidden:false,
           type: 'combo',
           store: conSt,
           renderer:function(value){
            for(var i=0;i<conSt.getCount();i++){
             if(value==conSt.getAt(i).get('k'))
             return conSt.getAt(i).get('v')
            }
           },
           width: 80
           } ,
            {
           id:fc['professionalpost'].name,
           header: fc['professionalpost'].fieldLabel,
           dataIndex: fc['professionalpost'].name,
           type: 'string',
           width: 80,
           editor: new fm.TextField(fc['professionalpost'])
        },  
          {
           id:fc['edurecord'].name,
           header: fc['edurecord'].fieldLabel,
           dataIndex: fc['edurecord'].name,
           type: 'string',
           width: 80,
           editor: new fm.TextField(fc['edurecord'])
        },
        {
           id:fc['politicalfeatures'].name,
           header: fc['politicalfeatures'].fieldLabel,
           dataIndex: fc['politicalfeatures'].name,
           type: 'string',
           width: 80,
           editor: new fm.TextField(fc['politicalfeatures'])
        }, 
        {
           id:fc['maritalstatus'].name,
           header: fc['maritalstatus'].fieldLabel,
           dataIndex: fc['maritalstatus'].name,
           type: 'combo',
           store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '未婚'],['1', '已婚']]
			}),
           width: 80,
           //editor: new fm.TextField(fc['maritalstatus'])
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '未婚':'已婚';
           	  else
           	  	return value;
           }
           ,editor: new fm.ComboBox(fc['maritalstatus'])
        },
        {
           id:fc['onthejob'].name,
           header: fc['onthejob'].fieldLabel,
           dataIndex: fc['onthejob'].name,
           width: 80,
           hidden:true,
           //editor: new fm.TextField(fc['onthejob'])
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '离职':'在职';
           	  else
           	  	return value;
           }
           ,editor: new fm.ComboBox(fc['onthejob'])
        }, {
           id:fc['nativeplace'].name,
           header: fc['nativeplace'].fieldLabel,
           dataIndex: fc['nativeplace'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['nativeplace'])
        }, {
           id:fc['race'].name,
           header: fc['race'].fieldLabel,
           dataIndex: fc['race'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['race'])
        },  {
           id:fc['height'].name,
           header: fc['height'].fieldLabel,
           dataIndex: fc['height'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['height'])
        }, {
           id:fc['weight'].name,
           header: fc['weight'].fieldLabel,
           dataIndex: fc['weight'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['weight'])
        }, {
           id:fc['paperstype'].name,
           header: fc['paperstype'].fieldLabel,
           dataIndex: fc['paperstype'].name,
           hidden:true,
           width: 80,
           renderer: function(value){
           	  if (value!="")
           	  	return value=='1' ? '身份证':'护照';
           	  else
           	  	return value;
           }
           ,editor: new fm.ComboBox(fc['paperstype'])
        }, {
           id:fc['papersno'].name,
           header: fc['papersno'].fieldLabel,
           dataIndex: fc['papersno'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['papersno'])
        },  {
           id:fc['homeaddress'].name,
           header: fc['homeaddress'].fieldLabel,
           dataIndex: fc['homeaddress'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['homeaddress'])
        }, {
           id:fc['memoc1'].name,
           header: fc['memoc1'].fieldLabel,
           dataIndex: fc['memoc1'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['memoc1'])
        }, {
           id:fc['memoc2'].name,
           header: fc['memoc2'].fieldLabel,
           dataIndex: fc['memoc2'].name,
           hidden:true,
           width: 80,
           editor: new fm.TextField(fc['memoc2'])
        }, {
           id:fc['memoc3'].name,
           header: fc['memoc3'].fieldLabel,
           dataIndex: fc['memoc3'].name,
           hidden:true,
           render:function(value){
            var str='';
             for(var i=0;i<zwSt.getCount();i++){
             if(value==zwSt.getAt(i).get('k')){
             str=zwSt.getAt(i).get('v');
             }
             
             }
             return str;
           },
           width: 80,
           editor: new fm.TextField(fc['memoc3'])
        }
        
	]);
    cm.defaultSortable = true;						//设置是否可排序

    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
	cutUserBtn = new Ext.Button({
		text: '剪切',
		tooltip: '剪切用户，表示将用户调整到其他部门',
		iconCls: 'cutUser',
		handler: cutUser,
		disabled: false
	});
	
	pasteUserBtn = new Ext.Button({
		text: '粘贴',
		tooltip: '粘贴用户，只能移动到其他部门',
		iconCls: 'pasteUser',
		handler: pasteUser,
		disabled: true
	});

	if(ModuleLVL=='3'){
		cutUserBtn.setVisible(false);
	}
	
	var insertBtn = new Ext.Button({
		id: 'add',
		text: '新增',
		iconCls: 'add',
		handler : insertFun
	})
	var deleteBtn = new Ext.Button({
		id: 'del',
		text: '删除',
		iconCls: 'remove',
		handler : deleteFun
	})
	var editBtn = new Ext.Button({
		id: 'edit',
		text: '编辑',
		iconCls: 'btn',
		handler : showFormWin
	})
	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		hidden:true,
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: exportDataFile
	});
	function exportDataFile(){	
		var exportQueryStr = fixedFilterPart  + " and " + queStr;
		var openUrl = CONTEXT_PATH + "/servlet/RlzyServlet?ac=exportData&businessType=userSetting&params=" + encodeURI(exportQueryStr);
		document.all.formAc.action = openUrl
		document.all.formAc.submit();
	}
  
	gridPanel = new Ext.grid.QueryExcelGridPanel({
    	id: 'user-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [insertBtn,'-',deleteBtn,'-',editBtn,'-'],
        title: gridPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
        saveBtn:false,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	deleteHandler: deleteFun,
		//insertMethod: 'insertUser',
		saveMethod: 'updateUserInfo',
		deleteMethod: 'deleteUserInfo',
		formBtn:true,
		formHandler: function(){
		   showFormWin();
      	},
		crudText: {
      	 form: '编辑'
      	}
	});
	//gridPanel.on('dblclick',showFormWin)
	//sm.on('selectionchange', orgGridRowSelected);
	sm.on('selectionchange', orgGridRowSelected);	
	
	
//gridPanel--------------------------------------------------------------------------------------------------	
	var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		//bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
		//listeners: {beforeshow: handleActivate},
		items: [
    			new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                autoHeight : true,
                collapsible : true,
                collapsed : false,
                items:[
					new fm.Hidden(fc['userid']),
                	{
	   					layout: 'form', columnWidth: .33,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['realname']),
							new fm.TextField(fc['height']),
							new fm.TextField(fc['nativeplace']),
		                	new fm.ComboBox(fc['paperstype']),
		                	new fm.TextField(fc['userNum'])
						]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
	   						new fm.ComboBox(fc['sex']),
							new fm.TextField(fc['weight']),
							new fm.TextField(fc['race']),
 							new fm.TextField(fc['papersno'])
    					]
    				} ,
    				{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
							new fm.DateField(fc['birthday']),
							new fm.ComboBox(fc['maritalstatus']),
							new fm.TextField(fc['politicalfeatures']),
							new fm.TextField(fc['edurecord'])
    					]
    				}   	
    			]
    		}),
    		new Ext.form.FieldSet({
                title:'联系方式',
                border: true,
                layout: 'column',
                autoHeight : true,
                collapsible : true,
                collapsed : false,
                items: [{
	   					layout: 'form', columnWidth: .33,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['mobile']),
	   						new fm.TextField(fc['email'])
	   					]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
	   						new fm.TextField(fc['phone']),
	   						new fm.TextField(fc['im'])
    					]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
	   						new fm.TextField(fc['homeaddress'])
    					]
    				}
				]
    		}),
    		new Ext.form.FieldSet({
    			title: '其他信息',
                border: true,
                layout: 'column',
                autoHeight : true,
                collapsible : true,
                collapsed : false,
                items:[
                	new fm.Hidden(fc['orgid']),
                	new fm.Hidden(fc['orgname']),
					new fm.Hidden(fc['posid']),
                	{
	   					layout: 'form', columnWidth: .5,
	   					bodyStyle: 'border: 0px;',
	   					items:[
							 new fm.TextField(fc['posname']),
                			 new fm.TextField(fc['professionalpost'])
							,new fm.ComboBox(fc['memoc1'])
	   						,new fm.ComboBox(fc['memoc3'])
	   					]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
							new fm.ComboBox(fc['onthejob']),
							new fm.DateField(fc['workingtime'])
                			,new fm.TextField(fc['memoc2'])
    					]
    				}      				
    			]
    		})
    		]
    	,buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
//            	history.back();
            	formWindow.hide();
            }
        }]
	});
	function formSave() {
		var form = formPanelinsert.getForm()
		var memoc1= form.findField('memoc1').getValue();
		var memoc3=form.findField('memoc3').getValue();
		//验证地区填写不能为null
		  if(memoc1=='null')
		   form.findField('memoc1').setValue('');
		   //验证职务不能为null
		  if(memoc3=='null')
		  form.findField('memoc3').setValue('');
		  
		  //验证选择了类型必须输入号码
		 var paperstype=form.findField('paperstype').getValue();
		 var papersno =form.findField('papersno').getValue().trim();
		   if(paperstype!=null&&papersno==''){
		   Ext.Msg.alert('提示信息','选择证件类型时证件编号必须填写');
		    return ;
		   }
		   
		if (form.isValid()) {
			doFormSave()	
		}
		var ids = form.findField(primaryKey).getValue();
	}
	function doFormSave(dataArr){
    	var form = formPanelinsert.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			if(n=='paperstype'||n=='sex'||n=='maritalstatus'||n=='onthejob'||n=='birthday'||n=='workingtime'){
    				obj[n] = field.getValue()
    				
    			}
    		}
    	}
    	if (!(obj.userid == '' || obj.userid == null)){
	    	DWREngine.setAsync(false);
			rlzyMgm.saveUserInfo(obj, function(rtn){
				if(rtn){
	   				Ext.example.msg('保存成功！', '您成功保存了一条信息！');
					ds.baseParams.params = paramStrCur;
				    ds.load({
				    	params:{
					    	start: 0,
					    	limit: 20
				    	}
				    });
	            	formWindow.hide();
	   			}else{
	   				Ext.example.msg('保存失败！', '您没有保存成功这条信息！');
	   			}
	   		});
	   		DWREngine.setAsync(true);
   		}
    }

	function loadForm(){
		//////////
		var form = formPanelinsert.getForm();
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    			form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanelinsert.buttons[0].enable()
    	
    			formPanelinsert.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		formPanelinsert.buttons[0].enable()
			    		formPanelinsert.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		formPanel.buttons[0].disable()
    	}
	}
    function showFormWin(){
   		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:800,
                height:500,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	operate="1";
       	formWindow.show();
       	loadForm();
	}


//gridEducationPanel--------------------------------------------------------------------------------------------------	
var 教育及培训情况
//教育及培训情况
    var fcEducation = {		// 创建编辑域配置
    	'seqnum': {
			name: 'seqnum',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'personnum': {
			name: 'personnum',
			fieldLabel: '用户id',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
		}, 'starttime': {
			name: 'starttime',
			fieldLabel: '开始时间',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'endtime': {
			name: 'endtime',
			fieldLabel: '结束时间',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'organname': {
			name: 'organname',
			fieldLabel: '院校名称',
			anchor:'95%'
		}, 'major': {
			name: 'major',
			fieldLabel: '主修专业',
			anchor:'95%'
		}, 'achievement': {
			name: 'achievement',
			fieldLabel: '取得成果',
 			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
 			anchor:'95%'
		}
	};
	
    var ColumnsEducation = [
    	{name: 'seqnum', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'personnum', type: 'string'},
    	{name: 'starttime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'endtime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'organname', type: 'string'},
    	{name: 'major', type: 'string'},
		{name: 'achievement', type: 'string'},
		{name: 'memo', type: 'string'}
		];
		
    var PlantEducation = Ext.data.Record.create(Columns);			//定义记录集
    PlantIntEducation = {
    	seqnum: '',
    	personnum: selectedUserId, 
    	starttime: '',
    	endtime: '',
    	organname: '',
    	major: '',
    	achievement: '',
    	memo: ''
    };
    
    var smEducation =  new Ext.grid.CheckboxSelectionModel();
    var cmEducation = new Ext.grid.ColumnModel([		// 创建列模型
    	smEducation, {
           id:fcEducation['seqnum'].name,
           header: fcEducation['seqnum'].fieldLabel,
           dataIndex: fcEducation['seqnum'].name,
           hidden:true,
           width: 200
        },  {id:fcEducation['personnum'].name,
           header: fcEducation['personnum'].fieldLabel,
           dataIndex: fcEducation['personnum'].name,
           hidden:true,
           //value:'10000000000000',
           width: 200
        }, {
           id:fcEducation['organname'].name,
           header: fcEducation['organname'].fieldLabel,
           dataIndex: fcEducation['organname'].name,
           width: 100
           //,hidden:true
           ,editor: new fm.TextField(fcEducation['organname'])
        }, {
           id:fcEducation['starttime'].name,
           align: 'center',
           header: fcEducation['starttime'].fieldLabel,
           dataIndex: fcEducation['starttime'].name,
           //hidden:true,
           renderer:formatDateTime,
           width: 120
           ,editor: new fm.DateField(fcEducation['starttime'])
        }, {
           id:fcEducation['endtime'].name,
           align: 'center',
           header: fcEducation['endtime'].fieldLabel,
           dataIndex: fcEducation['endtime'].name,
           //hidden:true,
           renderer:formatDateTime,
           width: 120
           ,editor: new fm.DateField(fcEducation['endtime'])
        }, {
           id:fcEducation['major'].name,
           header: fcEducation['major'].fieldLabel,
           dataIndex: fcEducation['major'].name,
           width: 80
           ,editor: new fm.TextField(fcEducation['major'])
        }, {
           id:fcEducation['achievement'].name,
           header: fcEducation['achievement'].fieldLabel,
           dataIndex: fcEducation['achievement'].name,
           width: 120
           ,editor: new fm.TextField(fcEducation['achievement'])
        }, {
           id:fcEducation['memo'].name,
           header: fcEducation['memo'].fieldLabel,
           dataIndex: fcEducation['memo'].name,
//           hidden: true,
           width: 80
           ,editor: new fm.TextField(fcEducation['memo'])
        }
	]);
    cmEducation.defaultSortable = true;						//设置是否可排序

    dsEducation = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanEducation,				
	    	business: business,
	    	method: listEducationMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsEducation),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsEducation.setDefaultSort('starttime', 'desc');	//设置默认排序列
    
	gridEducationPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'Education-grid-panel',
        ds: dsEducation,
        cm: cmEducation,
        sm: smEducation,
        tbar: [],
        title: gridEducationPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: dsEducation,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantEducation,				
      	plantInt: PlantIntEducation,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanEducation,					
      	business: business,	
      	primaryKey: primaryEducationKey,		
      	insertHandler: insertEducationFun,
      	deleteHandler: deleteEducationFun,
		insertMethod: 'insertUserEducation',
		saveMethod: 'updateUserEducation',
		deleteMethod: 'deleteUserEducation'
	});
	//smEducation.on('selectionchange', orgGridRowSelected);
	gridEducationPanel.on('activate',orgGridRowSelected)
//gridEducationPanel--------------------------------------------------------------------------------------------------	
//gridAbilityPanel--------------------------------------------------------------------------------------------------	
var 主要技能信息
    var fcAbility = {		// 创建编辑域配置
    	'seqnum': {
			name: 'seqnum',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'personnum': {
			name: 'personnum',
			fieldLabel: '用户id',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'type': {
			name: 'type',
			fieldLabel: '类型',
			anchor:'95%'
		}, 'fzwh': {
			name: 'fzwh',
			fieldLabel: '证书编号',
			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '其他说明',//'工种',
 			anchor:'95%'
		}, 'fzsj': {
			name: 'fzsj',
			fieldLabel: '鉴定（复审/认定）时间',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'grade': {
			name: 'grade',
			fieldLabel: '技能等级',
 			anchor:'95%'
		}, 'authentication': {
			name: 'authentication',
			fieldLabel: '认证',//'认定专业',
 			anchor:'95%'
		}, 'name': {
			name: 'name',
			fieldLabel: '技能名称',
//			hidden:true,
			anchor:'95%'
		}
	};
	
    var ColumnsAbility = [
    	{name: 'seqnum', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'personnum', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'fzwh', type: 'string'},
    	{name: 'memo', type: 'string'},
    	{name: 'fzsj', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'grade', type: 'string'},    	
		{name: 'authentication', type: 'string'},
    	{name: 'name', type: 'string'}
		];
		
    var PlantAbility = Ext.data.Record.create(Columns);			//定义记录集
    PlantIntAbility = {
    	seqnum: '',
    	personnum: selectedUserId, 
    	type: '',
    	fzwh: '',
    	memo: '',
    	fzsj: '',
    	grade: '',
    	authentication: '',
    	name: ''
    };
    
    var smAbility =  new Ext.grid.CheckboxSelectionModel();
    var cmAbility = new Ext.grid.ColumnModel([		// 创建列模型
    	smAbility, {
           id:fcAbility['seqnum'].name,
           header: fcAbility['seqnum'].fieldLabel,
           dataIndex: fcAbility['seqnum'].name,
           hidden:true,
           width: 200
        },  {id:fcAbility['personnum'].name,
           header: fcAbility['personnum'].fieldLabel,
           dataIndex: fcAbility['personnum'].name,
           hidden:true,
         //  value:'10000000000000',
           width: 200
        }, {
           id:fcAbility['name'].name,
           header: fcAbility['name'].fieldLabel,
           dataIndex: fcAbility['name'].name,
//           hidden: true,
           width: 80
           ,editor: new fm.TextField(fcAbility['name'])
        },{
           id:fcAbility['type'].name,
           header: fcAbility['type'].fieldLabel,
           dataIndex: fcAbility['type'].name,
//           hidden:true,
           width: 120
           ,editor: new fm.TextField(fcAbility['name'])
        }, {
           id:fcAbility['grade'].name,
           align: 'center',
           header: fcAbility['grade'].fieldLabel,
           dataIndex: fcAbility['grade'].name,
//           hidden:true,
           width: 120
           ,editor: new fm.TextField(fcAbility['grade'])
        }, {
           id:fcAbility['authentication'].name,
           header: fcAbility['authentication'].fieldLabel,
           dataIndex: fcAbility['authentication'].name,
//           hidden:true,
           width: 120
           ,editor: new fm.TextField(fcAbility['authentication'])
        }, {
           id:fcAbility['memo'].name,
           header: fcAbility['memo'].fieldLabel,
           dataIndex: fcAbility['memo'].name,
           width: 80
           ,editor: new fm.TextField(fcAbility['memo'])
        }, {
           id:fcAbility['fzwh'].name,
           header: fcAbility['fzwh'].fieldLabel,
           dataIndex: fcAbility['fzwh'].name,
           hidden:true,
           width: 80
           ,editor: new fm.TextField(fcAbility['fzwh'])
         }, {
           id:fcAbility['fzsj'].name,
           header: fcAbility['fzsj'].fieldLabel,
           dataIndex: fcAbility['fzsj'].name,
           hidden:true,
           width: 100
           ,editor: new fm.DateField(fcAbility['fzsj'])
        }
	]);
    cmAbility.defaultSortable = true;						//设置是否可排序

    dsAbility = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanAbility,				
	    	business: business,
	    	method: listAbilityMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsAbility),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsAbility.setDefaultSort('type', 'desc');	//设置默认排序列
    
	gridAbilityPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'Ability-grid-panel',
        ds: dsAbility,
        cm: cmAbility,
        sm: smAbility,
        tbar: [],
        title: gridAbilityPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: dsAbility,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantAbility,				
      	plantInt: PlantIntAbility,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanAbility,					
      	business: business,	
      	primaryKey: primaryAbilityKey,		
      	insertHandler: insertAbilityFun,
      	deleteHandler: deleteAbilityFun,
		insertMethod: 'insertUserAbility',
		saveMethod: 'updateUserAbility',
		deleteMethod: 'deleteUserAbility'
	});
	//smAbility.on('selectionchange', orgGridRowSelected);
	gridAbilityPanel.on('activate',orgGridRowSelected)
//gridAbilityPanel--------------------------------------------------------------------------------------------------	
//gridWorkexepPanel--------------------------------------------------------------------------------------------------	
var 工作经历
    var fcWorkexep = {		// 创建编辑域配置
    	'seqnum': {
			name: 'seqnum',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'personnum': {
			name: 'personnum',
			fieldLabel: '用户id',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'company': {
			name: 'company',
			fieldLabel: '公司名称',
			anchor:'95%'
		}, 'starttime': {
			name: 'starttime',
			fieldLabel: '开始时间',
            format: 'Y-m-d',
            allowBlank : false,
 			anchor:'95%'
		}, 'endtime': {
			name: 'endtime',
			fieldLabel: '结束时间',
            format: 'Y-m-d',
            allowBlank : false,
 			anchor:'95%'
		}, 'leavereason': {
			name: 'leavereason',
			fieldLabel: '离职原因',
			anchor:'95%'
		}, 'achievement': {
			name: 'achievement',
			fieldLabel: '公司规模',
			anchor:'95%'
		}, 'companytype': {
			name: 'companytype',
			fieldLabel: '行业类型',
			anchor:'95%'
		}, 'fzsj': {
			name: 'fzsj',
			fieldLabel: '结束时间',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'worktype': {
			name: 'worktype',
			fieldLabel: '工作类型',
 			anchor:'95%'
		}, 'posname': {
			name: 'posname',
			fieldLabel: '职位',
 			anchor:'95%'
		}, 'otherinfo': {
			name: 'otherinfo',
			fieldLabel: '其他信息',
            format: 'Y-m-d',
 			anchor:'95%'
		}, 'professionalpost': {
			name: 'professionalpost',
			fieldLabel: '职称',
 			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
 			anchor:'95%'
		}, 'memoc1': {
			name: 'memoc1',
			hiddenName: 'memoc1',
			fieldLabel: '三吉利',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['1', '是'],['0', '否']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}
	};
	
    var ColumnsWorkexep = [
    	{name: 'seqnum', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'personnum', type: 'string'},
		{name: 'company', type: 'string'},
    	{name: 'starttime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'endtime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'companytype', type: 'string'},
    	{name: 'achievement', type: 'string'},
		{name: 'posname', type: 'string'},
		{name: 'professionalpost', type: 'string'},    	
		{name: 'worktype', type: 'string'},
    	{name: 'otherinfo', type: 'string'},
		{name: 'leavereason', type: 'string'},
		{name: 'memo', type: 'string'}
		,{name: 'memoc1', type: 'string'}
		];
		
    var PlantWorkexep = Ext.data.Record.create(Columns);			//定义记录集
    PlantIntWorkexep = {
    	seqnum: '',
    	personnum: selectedUserId, 
    	company: '',
    	starttime: '',
    	endtime: '',
    	companytype: '',
    	achievement: '',
    	posname: '',
    	professionalpost: '',
    	worktype:'',
    	otherinfo:'',
    	leavereason:'',
    	memo: ''
    	,memoc1: '0'
    };
    
    var smWorkexep =  new Ext.grid.CheckboxSelectionModel();
    var cmWorkexep = new Ext.grid.ColumnModel([		// 创建列模型
    	smWorkexep, {
           id:fcWorkexep['seqnum'].name,
           header: fcWorkexep['seqnum'].fieldLabel,
           dataIndex: fcWorkexep['seqnum'].name,
           hidden:true,
           width: 200
        },  {id:fcWorkexep['personnum'].name,
           header: fcWorkexep['personnum'].fieldLabel,
           dataIndex: fcWorkexep['personnum'].name,
           hidden:true,
         //  value:'10000000000000',
           width: 200
        },{
           id:fcWorkexep['company'].name,
           header: fcWorkexep['company'].fieldLabel,
           dataIndex: fcWorkexep['company'].name,
           width: 120
           ,editor: new fm.TextField(fcWorkexep['company'])
        }, {
           id:fcWorkexep['starttime'].name,
           align: 'center',
           header: fcWorkexep['starttime'].fieldLabel,
           dataIndex: fcWorkexep['starttime'].name,
           renderer:formatDateTime,
           width: 120
           ,editor: new fm.DateField(fcWorkexep['starttime'])
        }, {
           id:fcWorkexep['endtime'].name,
           align: 'center',
           header: fcWorkexep['endtime'].fieldLabel,
           dataIndex: fcWorkexep['endtime'].name,
//           hidden:true,
           renderer:formatDateTime,
           width: 120
           ,editor: new fm.DateField(fcWorkexep['endtime'])
        }, {
           id:fcWorkexep['companytype'].name,
           header: fcWorkexep['companytype'].fieldLabel,
           dataIndex: fcWorkexep['companytype'].name,
//           hidden:true,
           width: 100
           ,editor: new fm.TextField(fcWorkexep['companytype'])
        }, {
           id:fcWorkexep['achievement'].name,
           header: fcWorkexep['achievement'].fieldLabel,
           dataIndex: fcWorkexep['achievement'].name,
//           hidden: true,
           width: 80
           ,editor: new fm.TextField(fcWorkexep['achievement'])
        }, {
           id:fcWorkexep['posname'].name,
           header: fcWorkexep['posname'].fieldLabel,
           dataIndex: fcWorkexep['posname'].name,
//           hidden: true,
           width: 80
           ,editor: new fm.TextField(fcWorkexep['posname'])
        }, {
           id:fcWorkexep['professionalpost'].name,
           header: fcWorkexep['professionalpost'].fieldLabel,
           dataIndex: fcWorkexep['professionalpost'].name,
           width: 100
           ,editor: new fm.TextField(fcWorkexep['professionalpost'])
        }, {
           id:fcWorkexep['worktype'].name,
           header: fcWorkexep['worktype'].fieldLabel,
           dataIndex: fcWorkexep['worktype'].name,
           width: 120
           ,editor: new fm.TextField(fcWorkexep['worktype'])
        }, {
           id:fcWorkexep['otherinfo'].name,
           header: fcWorkexep['otherinfo'].fieldLabel,
           dataIndex: fcWorkexep['otherinfo'].name,
           width: 120
           ,editor: new fm.TextField(fcWorkexep['otherinfo'])
        }, {
           id:fcWorkexep['leavereason'].name,
           header: fcWorkexep['leavereason'].fieldLabel,
           dataIndex: fcWorkexep['leavereason'].name,
           width: 120
           ,editor: new fm.TextField(fcWorkexep['leavereason'])
        }, {
           id:fcWorkexep['memo'].name,
           header: fcWorkexep['memo'].fieldLabel,
           dataIndex: fcWorkexep['memo'].name,
//           hidden:true,
           width: 80
           ,editor: new fm.TextField(fcWorkexep['memo'])
        }, {
           id:fcWorkexep['memoc1'].name,
           header: fcWorkexep['memoc1'].fieldLabel,
           dataIndex: fcWorkexep['memoc1'].name,
//           hidden:true,
           width: 80
           ,renderer: function(value){
           	  if (value!="")
           	  	return value=='1' ? '是':'否';
           	  else
           	  	return value;
           }
           ,editor: new fm.ComboBox(fcWorkexep['memoc1'])
        }
	]);
    cmWorkexep.defaultSortable = true;						//设置是否可排序

    dsWorkexep = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanWorkexep,				
	    	business: business,
	    	method: listWorkexepMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsWorkexep),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsWorkexep.setDefaultSort('starttime', 'desc');	//设置默认排序列
    
	gridWorkexepPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'Workexep-grid-panel',
        ds: dsWorkexep,
        cm: cmWorkexep,
        sm: smWorkexep,
        tbar: [],
        title: gridWorkexepPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: dsWorkexep,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantWorkexep,				
      	plantInt: PlantIntWorkexep,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanWorkexep,					
      	business: business,	
      	primaryKey: primaryWorkexepKey,		
      	insertHandler: insertWorkexepFun,
      	saveHandler: saveWorkexepFun,
      	deleteHandler: deleteWorkexepFun,
		insertMethod: 'insertUserWorkexep',
		saveMethod: 'updateUserWorkexep',
		deleteMethod: 'deleteUserWorkexep'
	});
	//smWorkexep.on('selectionchange', orgGridRowSelected);
	gridWorkexepPanel.on('activate',orgGridRowSelected)
//gridWorkexepPanel--------------------------------------------------------------------------------------------------	
//gridContractpanel  员工合同---------------------------------------------------------
var 员工合同信息
 var fcContract={
          'seqnum':{
            name:'seqnum',
            fieldLabel:'主键',
            anchor:'95%',
            readOnly:true,
            hidden:true,
            hideLabel:true
          },
          'entryDate':{
             id:'entryDate',
             name:'entryDate',
             fieldLabel:'入单位日期',
             format: 'Y-m-d',
             allowBlank : false,
             vtype: 'daterange',
             endDateField: 'leftDate',
             anchor:'95%'
          },
          'workYears':{
          name:'workYears',
          fieldLabel:'本单位工龄',
          allowBlank : false,
          anchor:'95%'
          },
          'leftDate':{
            id:'leftDate',
            name:'leftDate',
            fieldLabel:'离职日期',
            format:'Y-m-d',
            xtype:'daterange',
            startDateField:'entryDate',
            anchor:'95%'
            
          },
          'signedDate':{
            id:'signedDate',
            name:'signedDate',
            fieldLabel:'合同签订日期',
            format:'Y-m-d',
            xtype:'daterange',
            endDateField:'endDate',
            anchor:'95%'
          },
          'endDate':{
            id:'endDate',
            name:'endDate',
            fieldLabel:'合同终止日期',
            format:'Y-m-d',
            xtype:'daterange',
            startDateField:'signedDate',
            anchor:'95%'
          },
          'employModus':{
             name:'employModus',
             fieldLabel:'用工形式',
             valueField: 'k', 
			 displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: conSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            anchor:'95%'         
          },
          'personnum':{
            name:'personnum',
            fieldLabel:'用户主键',
            anchor:'95%'
          }
 };

 var ColumnsContract = [
    	{name: 'seqnum', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'personnum', type: 'string'},
		{name: 'entryDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'workYears', type: 'int'},
    	{name: 'leftDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'signedDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'endDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'employModus', type: 'string'}
		];

 var PlantContract = Ext.data.Record.create(Columns);			//定义记录集
    PlantIntContract = {
    	seqnum: '',
    	personnum: selectedUserId, 
    	entryDate: '',
    	workYears: '',
    	leftDate: '',
    	signedDate: '',
    	endDate: '',
    	employModus: ''
    };
 var smContract =  new Ext.grid.CheckboxSelectionModel();
 var cmContract = new Ext.grid.ColumnModel([		// 创建列模型
    	smContract, {
           id:fcContract['seqnum'].name,
           header: fcContract['seqnum'].fieldLabel,
           dataIndex: fcContract['seqnum'].name,
           hidden:true,
           width: 200
        },  {id:fcContract['personnum'].name,
           header: fcContract['personnum'].fieldLabel,
           dataIndex: fcContract['personnum'].name,
           hidden:true,
         //  value:'10000000000000',
           width: 200
        }, {
           id:fcContract['entryDate'].name,
           align: 'center',
           header: fcContract['entryDate'].fieldLabel,
           dataIndex: fcContract['entryDate'].name,
           renderer:formatDateTime,
           width: 120
           ,editor: new fm.DateField(fcContract['entryDate'])
        }, {
           id:fcContract['workYears'].name,
           align: 'center',
           header: fcContract['workYears'].fieldLabel,
           dataIndex: fcContract['workYears'].name,
//           hidden:true,
           width: 120
        }, {
           id:fcContract['leftDate'].name,
           header: fcContract['leftDate'].fieldLabel,
           dataIndex: fcContract['leftDate'].name,
//           hidden:true,
           renderer:formatDateTime,
           width: 100
          ,editor: new fm.DateField(fcContract['leftDate'])
        }, {
           id:fcContract['signedDate'].name,
           header: fcContract['signedDate'].fieldLabel,
           dataIndex: fcContract['signedDate'].name,
//           hidden: true,
           renderer:formatDateTime,
           width: 80
           ,editor: new fm.DateField(fcContract['signedDate'])
        }, {
           id:fcContract['endDate'].name,
           header: fcContract['endDate'].fieldLabel,
           dataIndex: fcContract['endDate'].name,
           renderer:formatDateTime,
//           hidden: true,
           width: 80
          ,editor: new fm.DateField(fcContract['endDate'])
        }, {
           id:fcContract['employModus'].name,
           header: fcContract['employModus'].fieldLabel,
           dataIndex: fcContract['employModus'].name,
           renderer:function(value){
            for(var i=0;i<conSt.getCount();i++){
            if(value==conSt.getAt(i).get('k'))
            return conSt.getAt(i).get('v')
            }
           },
           width: 100
           ,editor: new fm.ComboBox(fcContract['employModus'])
        }
	]);



    dsContract = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanContract,				
	    	business: business,
	    	method: listContractMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsContract),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsContract.setDefaultSort('entryDate', 'asc');	//设置默认排序列
    
	gridContractPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'Contract-grid-panel',
        ds: dsContract,
        cm: cmContract,
        sm: smContract,
        tbar: [],
        title: gridContractPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: dsContract,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantContract,				
      	plantInt: PlantIntContract,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanContract,					
      	business: business,	
      	primaryKey: primaryContractKey,		
      	insertHandler: insertContractFun,
      	deleteHandler: deleteContractFun,
      	//saveHandler: saveContractFun,
		insertMethod: 'insertUserContract',
		saveMethod: 'updateUserContract',
		deleteMethod: 'deleteUserContract'
	});
	//smFamily.on('selectionchange', orgGridRowSelected);
	gridContractPanel.on('activate',orgGridRowSelected)
	gridContractPanel.on('afteredit',changeWork)
	
	
	
	function changeWork(obj){
		var record = obj.record;
        var date = record.get('entryDate');
		if (date != "") {
			DWREngine.setAsync(true);
			rlzyMgm.CalWorkExp(date, function(rtn) {
				record.set('workYears', rtn);
			})
		}
	}

// gridContractpanel
// 员工合同---------------------------------------------------------

//gridFamilyPanel--------------------------------------------------------------------------------------------------	
var 家庭成员信息
    var fcFamily = {		// 创建编辑域配置
    	'seqnum': {
			name: 'seqnum',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'personnum': {
			name: 'personnum',
			
			fieldLabel: '用户id',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'realname': {
			name: 'realname',
			fieldLabel: '姓名',
			allowBlank: false,
			anchor:'95%'
		}, 'relation': {
			name: 'relation',
			fieldLabel: '关系',
 			anchor:'95%'
		}, 'company': {
			name: 'company',
			fieldLabel: '工作单位',
 			anchor:'95%'
		}, 'politicalfeatures': {
			name: 'politicalfeatures',
			fieldLabel: '政治面貌',
			anchor:'95%'
		}, 'posid': {
			name: 'posid',
			fieldLabel: '职位',
			anchor:'95%'
		}, 'professionalpost': {
			name: 'professionalpost',
			fieldLabel: '职称',
			anchor:'95%'
		}, 'mobile': {
			name: 'mobile',
			fieldLabel: '手机',
			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
			anchor:'95%'
		}
	};
	
    var ColumnsFamily = [
    	{name: 'seqnum', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'personnum', type: 'string'},
		{name: 'realname', type: 'string'},
    	{name: 'relation', type: 'string'},
    	{name: 'company', type: 'string'},
    	{name: 'politicalfeatures', type: 'string'},
    	{name: 'posid', type: 'string'},
    	{name: 'professionalpost', type: 'string'},
    	{name: 'mobile', type: 'string'},
		{name: 'memo', type: 'string'}
		];
		
    var PlantFamily = Ext.data.Record.create(Columns);			//定义记录集
    PlantIntFamily = {
    	seqnum: '',
    	personnum: selectedUserId, 
    	realname: '',
    	relation: '',
    	company: '',
    	politicalfeatures: '',
    	posid: '',
    	professionalpost: '',
    	mobile: '',
    	memo: ''
    };
    
    var smFamily =  new Ext.grid.CheckboxSelectionModel();
    var cmFamily = new Ext.grid.ColumnModel([		// 创建列模型
    	smFamily, {
           id:'seqnum',
           header: fcFamily['seqnum'].fieldLabel,
           dataIndex: fcFamily['seqnum'].name,
           hidden:true,
           width: 200
        },  {id:'personnum',
           header: fcFamily['personnum'].fieldLabel,
           dataIndex: fcFamily['personnum'].name,
           hidden:true,
         //  value:'10000000000000',
           width: 200
        },{
           id:'realname',
           header: fcFamily['realname'].fieldLabel,
           dataIndex: fcFamily['realname'].name,
           width: 120,
           editor: new fm.TextField(fcFamily['realname'])
        }, {
           id:'relation',
           header: fcFamily['relation'].fieldLabel,
           dataIndex: fcFamily['relation'].name,
           width: 80,
           editor: new fm.TextField(fcFamily['relation'])
        },{
           id:'company',
           header: fcFamily['company'].fieldLabel,
           dataIndex: fcFamily['company'].name,
           width: 120,
           editor: new fm.TextField(fcFamily['company'])
        }, {
           id:'politicalfeatures',
           header: fcFamily['politicalfeatures'].fieldLabel,
           dataIndex: fcFamily['politicalfeatures'].name,
           width: 80,
           editor: new fm.TextField(fcFamily['politicalfeatures'])
        },{
           id:'posid',
           header: fcFamily['posid'].fieldLabel,
           dataIndex: fcFamily['posid'].name,
           width: 120,
           editor: new fm.TextField(fcFamily['posid'])
        }, {
           id:'professionalpost',
           header: fcFamily['professionalpost'].fieldLabel,
           dataIndex: fcFamily['professionalpost'].name,
           width: 80,
           editor: new fm.TextField(fcFamily['professionalpost'])
        }, {
           id:'mobile',
           header: fcFamily['mobile'].fieldLabel,
           dataIndex: fcFamily['mobile'].name,
           width: 80,
           editor: new fm.TextField(fcFamily['mobile'])
        }, {
           id:'memo',
           header: fcFamily['memo'].fieldLabel,
           dataIndex: fcFamily['memo'].name,
           width: 80
           ,editor: new fm.TextField(fcFamily['memo'])
        }
	]);
    cmFamily.defaultSortable = true;						//设置是否可排序

    dsFamily = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanFamily,				
	    	business: business,
	    	method: listFamilyMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsFamily),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsFamily.setDefaultSort('relation', 'asc');	//设置默认排序列
    
	gridFamilyPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'Family-grid-panel',
        ds: dsFamily,
        cm: cmFamily,
        sm: smFamily,
        tbar: [],
        title: gridFamilyPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: dsFamily,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantFamily,				
      	plantInt: PlantIntFamily,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanFamily,					
      	business: business,	
      	primaryKey: primaryFamilyKey,		
      	insertHandler: insertFamilyFun,
      	deleteHandler: deleteFamilyFun,
		insertMethod: 'insertUserFamily',
		saveMethod: 'updateUserFamily',
		deleteMethod: 'deleteUserFamily'
	});
	//smFamily.on('selectionchange', orgGridRowSelected);
	gridFamilyPanel.on('activate',orgGridRowSelected)
//gridFamilyPanel--------------------------------------------------------------------------------------------------	
var 明细TAB
//userInfoTabPanel--------------------------------------------------------------------------------------------------	
    userInfoTabPanel = new Ext.TabPanel({
    	//id:'tab-panel',
    	region: 'south',
    	border: false,
	    //renderTo: 'tab-panel',
	    height: 220,
	    activeTab: 0,
	    items: [gridWorkexepPanel,gridEducationPanel,gridFamilyPanel,gridAbilityPanel,gridContractPanel]
    });
//userInfoTabPanel--------------------------------------------------------------------------------------------------	

//userInfoPanel--------------------------------------------------------------------------------------------------	
    userInfoPanel = new Ext.Panel({
    	id:'tab-panel',
    	region: 'center',
    	border: false,
    	split:true,
        layout:'border',
        items:[gridPanel,userInfoTabPanel]
    });
//userInfoPanel--------------------------------------------------------------------------------------------------	

//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, userInfoPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	
	gridPanel.getTopToolbar().add(exportExcelBtn)
	


	
	initOthers();
    
    function initOthers(){
		gridPanel.getTopToolbar().add( '->',  {
			text:'最大化',iconCls:'add',
			handler:function(){
				if(this.text=='最大化'){
					if(top&&top.collapsedWestAndNorth){
						top.collapsedWestAndNorth();
						this.setText('还原');
						this.setIconClass("remove")
					}
				}else{
					if(top&&top.expandWestAndNorth){
						top.expandWestAndNorth();
						this.setText('最大化');
						this.setIconClass("add")
					}
				}
			}
		});		
		root.select();	
		ds.baseParams.params = paramStr;
	    ds.load({
	    	params:{
		    	start: 0,
		    	limit: 20
	    	}
	    });
    }
    
	function orgGridRowSelected(obj){
    	var activeTab = userInfoTabPanel.getActiveTab();
		var activeTabId = activeTab.getId();
		var type = activeTabId.substring(0,activeTabId.indexOf('-'))
		var activePlantInt = eval('PlantInt'+type)
		var activeds = eval('ds'+type)
		var record = sm.getSelected();
    	setButtonStatus(record==null || record.get("userid")=="");
    	//不能修改当前登陆用户所属的角色
    	if(record!=null && ROLETYPE != '0'){
    		if(record.get("userid") == USERID){
    			cutUserBtn.setDisabled(true);
    		}
    	}
    	
		if(record!=null && record.get("userid") != ''){
			selectedUserId = record.get("userid")
			activePlantInt.personnum = selectedUserId
			paramStr = "personnum" + SPLITB +selectedUserId
			activeds.baseParams.params = paramStr;//"personnum" + SPLITB +"20070703165034070";//
		    activeds.load({
		    	params:{
			    	start: 0,
			    	limit: 20
		    	}
		    });
		}
		
		var reload = false;
		if(record==null||record.get("userid") == ''){
			//gridPanel.getTopToolbar().items.get("form").disable();
			gridPanel.getTopToolbar().items.get("edit").disable();
			gridPanel.getTopToolbar().items.get("del").disable();
			reload=true;
		}else{
			//gridPanel.getTopToolbar().items.get("form").enable()
			gridPanel.getTopToolbar().items.get("edit").enable();
			gridPanel.getTopToolbar().items.get("del").enable();
			selectedTypeName = record.get("userid")
	    	//codePlantInt.typeName = selectedTypeName
	    	reload = true;
		}
		
		
	}
	
	function setButtonStatus(flag){
		cutUserBtn.setDisabled(flag);
	}
	
	function setPassword(){
    	orgIdWhenCopied = selectedOrgId
    	var records = sm.getSelections();
    	var ids = new Array();
    	for(var i=0; i<records.length; i++){
    		ids.push(records[i].get("userid"));
    	}
    	var usersToSet = ids.join(SPLITB);
    	doSetPassWord(usersToSet)
    }
	
	function doSetPassWord(usersToSet){
		Ext.Ajax.request({
			waitMsg: 'Seting User Password ...',
			url: SYS_SERVLET,
			params: {ac: "setuserpassword", ids: usersToSet, password:defaultPwd},
	   		method: "GET",
	   		success: function(response, params) {
	   			var rspXml = response.responseXML
	   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
	   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;

	   			if(msg == SUCCESS){
	   				Ext.example.msg('操作成功！', '您重置了用户的登陆密码！！', '');
					window.setTimeout(function(){
						ds.reload();
			    	}, 500);
	   			}
	   			else
	   			{
	   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
	   				var str = '<br>失败原因：' + msg;
			        Ext.MessageBox.show({
			           title: '操作失败！',
			           msg: str,
			           width:500,
			           value:stackTrace,
			           buttons: Ext.MessageBox.OK,
			           multiline: true,
			           icon: Ext.MessageBox.ERROR
					});
	   			}
			},
			failure: function(response, params) {
				alert('Error: Save failed!');
			}
   		});    	
    }

    
    function cutUser(){
    	orgIdWhenCopied = selectedOrgId
    	var records = sm.getSelections();
    	var ids = new Array();
    	for(var i=0; i<records.length; i++){
    		ids.push(records[i].get("userid"));
    	}
    	usersToMove = ids.join(SPLITB);
    	moveAction = 'cut';
    	pasteUserBtn.setText('粘贴(' + ids.length + ")")
    	pasteUserBtn.setDisabled(false);
    	pasteUserBtn.setIconClass('pasteUser1');
    }
    
    
    
        
    function pasteUser(){
    	if (orgIdWhenCopied == selectedOrgId)
    		return;
    	
    	doUsersMove()
    	
    	pasteUserBtn.setDisabled(true);
    	
    	pasteUserBtn.setIconClass('pasteUser');
    	
    	pasteUserBtn.setText('粘贴')
    }
    
	function doUsersMove(){
		Ext.Ajax.request({
			waitMsg: 'Saving changes...',
			url: SYS_SERVLET,
			params: {ac: "movemaninfo", move: moveAction, ids: usersToMove, oldorgid: orgIdWhenCopied, orgid: selectedOrgId},
	   		method: "GET",
	   		success: function(response, params) {
	   			var rspXml = response.responseXML
	   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
	   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;

	   			if(msg == SUCCESS){
	   				Ext.example.msg('操作成功！', '您修改了用户所属的组织机构！', '');
					window.setTimeout(function(){
						ds.reload();
			    	}, 500);
	   			}
	   			else
	   			{
	   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
	   				var str = '<br>失败原因：' + msg;
			        Ext.MessageBox.show({
			           title: '操作失败！',
			           msg: str,
			           width:500,
			           value:stackTrace,
			           buttons: Ext.MessageBox.OK,
			           multiline: true,
			           icon: Ext.MessageBox.ERROR
					});
	   			}
			},
			failure: function(response, params) {
				alert('Error: Save failed!');
			}
   		});    	
    }
	
	function linkLoad(obj, record) {
    	var reload = false;
		if (record == null) {
    		if (selectedUserId != "-1"){
    			reload = true;
    			selectedUserId = "-1";
    			roleGridPanel.setTitle(roleGridPanelTitle);
    		}
    	} else {
    		if (selectedUserId != record.get("userid")){
    			reload = true;
    			selectedUserId = record.get("userid");
    			selectedUserId = selectedUserId==""? "-1":selectedUserId;
    			rolePlantInt.userid = selectedUserId;
    			var usertitle = record.get("realname")=="" ? record.get("username"):record.get("realname");
    			roleGridPanel.setTitle(usertitle + "，角色");
    		}
    	}
    	if (obj!=null && reload) {
    		roleDs.baseParams.params = "userid"+SPLITB+selectedUserId;
	    	roleDs.load();	    	
    	}	
	}
    
    function insertFun(){
    	//gridPanel.defaultInsertHandler();
    	impUser()
    }
    function insertFamilyFun(){
    	var record = sm.getSelected();
		if(record==null || record.get("userid") == '')
    		Ext.Msg.alert("提示","请先选择用户，再新增记录！")
    	else
	    	gridFamilyPanel.defaultInsertHandler();
    }
    function insertAbilityFun(){
    	var record = sm.getSelected();
		if(record==null || record.get("userid") == '')
    		Ext.Msg.alert("提示","请先选择用户，再新增记录！")
    	else
	    	gridAbilityPanel.defaultInsertHandler();
    }
    function insertEducationFun(){
    	var record = sm.getSelected();
		if(record==null || record.get("userid") == '')
    		Ext.Msg.alert("提示","请先选择用户，再新增记录！")
    	else
	    	gridEducationPanel.defaultInsertHandler();
    }
    function insertWorkexepFun(){
    	var record = sm.getSelected();
		if(record==null || record.get("userid") == '')
    		Ext.Msg.alert("提示","请先选择用户，再新增记录！")
    	else
	    	gridWorkexepPanel.defaultInsertHandler();
    }
    
    function deleteFun(){
    	if (sm.getCount() > 0) {
    		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
				if (btn == "yes") {
					var record = sm.getSelected();
					DWREngine.setAsync(false);
		    		rlzyMgm.deleteUserInfo(record.data);
		    		Ext.example.msg('操作成功！', '用户删除操作成功！');
						ds.reload();
						dsWorkexep.reload();
						dsEducation.reload();
						dsFamily.reload();
						dsAbility.reload();
						dsContract.reload();
			    	DWREngine.setAsync(true);
				}
			});
    	}
    }    
    function deleteFamilyFun(){
    	if (smFamily.getCount() > 0) {
    			gridFamilyPanel.defaultDeleteHandler(); 
    	}
    }    
    function deleteAbilityFun(){
    	if (smAbility.getCount() > 0) {
    			gridAbilityPanel.defaultDeleteHandler(); 
    	}
    }    
    function deleteEducationFun(){
    	if (smEducation.getCount() > 0) {
    			gridEducationPanel.defaultDeleteHandler(); 
    	}
    }    
    function deleteWorkexepFun(){
    	if (smWorkexep.getCount() > 0) {
    			gridWorkexepPanel.defaultDeleteHandler(); 
    	}
    }
        
    function checkPeriod(dataStore,startTimeCol,endTimeCol){
    	var flag = true
    	var nullCount = 0
    	for(i = 0; i < dataStore.getCount(); i ++){
    		var recS = dataStore.getAt(i);
    		var startTimeS = formatDateTime(recS.get(startTimeCol))
    		var endTimeS = formatDateTime(recS.get(endTimeCol))
//    		alert(formatDateTime(startTimeS)+'---'+formatDateTime(endTimeS))
    		if(startTimeS == null || startTimeS == ""){
    			flag = false
//    			alert(1)
	    		break;
   			}
    		if(endTimeS == null || endTimeS == ""){
    			endTimeS = formatDateTime(new Date())
    			nullCount++
	    		if(nullCount > 1){
	    			flag = false
//    			alert(2)
		    		break;
	    		}
   			}else if(startTimeS >= endTimeS){
    			flag = false
//    			alert(3)
	    		break;
    		}
	    	for(j = 0; j < dataStore.getCount(); j ++){
	    		var recD = dataStore.getAt(j);
	    		var startTimeD = formatDateTime(recD.get(startTimeCol))
	    		var endTimeD = formatDateTime(recD.get(endTimeCol))
	    		if(endTimeD == null || endTimeD == ""){
	    			endTimeD = formatDateTime(new Date())
	   			}
//	   			alert(startTimeS +"---"+ startTimeD +"---"+ endTimeS == endTimeD)
	    		if(startTimeS == startTimeD && endTimeS == endTimeD){
	    			continue;
	    		}else if(startTimeS == startTimeD || endTimeS == endTimeD){
	    			flag = false
//    			alert(4)
	    			break;
	    		}else if((startTimeS < startTimeD && endTimeS > startTimeD) || (startTimeS > startTimeD && startTimeS < endTimeD)){
	    			flag = false
//    			alert(5)
	    			break;
	    		}
	    	}
	    	if(flag == false){
	    		break;
	    	}
    	}
    	return flag
    }

//***********************************************************
//员工合同管理CRUD 函数定义
 function insertContractFun(){
    var record = sm.getSelected();
		if(record==null || record.get("userid") == ''){
		
    		Ext.Msg.alert("提示","请先选择用户，再新增记录！")
		}
    	else{
    	    
    	   //DWREngine.setAsync(true);
	        //rlzyMgm.checkUsercontract(selectedUserId,function(stn){
	    	//if('exist'==stn){
            //Ext.Msg.alert("提示","一条用户暂时只能关联一个合同！")
	    	//}else{
	    	//
	    	//}
	    	//});
           // DWREngine.setAsync(false);
           if(gridContractPanel.getStore().getCount()==0){
             gridContractPanel.defaultInsertHandler();
             
             
             
             
           }else {
          Ext.Msg.alert("提示","一个用户暂时只能关联一个合同！")
           }
    	}
            
 }

function  saveContractFun(){
    if(checkPeriod(dsContract,"signedDate","endDate")||checkPeriod(dsContract,"entryDate","leftDate")){
      gridContractPanel.defaultSaveHandler();
    }else {
    
    Ext.Msg.alert("提示","时间有误，请检查核对修改后保存！")
    
    
    }


}


 function deleteContractFun(){
    	if (smContract.getCount() > 0) {
    			gridContractPanel.defaultDeleteHandler(); 
    	}
    }   


//******************************************************************
/*    function saveFun(){
    	ds.baseParams.orgid = selectedOrgId 
    	gridPanel.defaultSaveHandler();
    }        */
    function saveWorkexepFun(){
    	if(checkPeriod(dsWorkexep,"starttime","endtime")){
	    	//ds.baseParams.orgid = selectedOrgId 
	    	gridWorkexepPanel.defaultSaveHandler();
	    	
	    	//计算工龄、年休假
	    	var d = new Date();
	    	DWREngine.setAsync(true);
	    	rlzyMgm.makeKqAnnualleave(d.getYear(),selectedUserId,'user',function(rtn){
	    	})
    	}else{
    		Ext.Msg.alert("提示","工作经历时间有误，请检查核对修改后保存！")
    	}
    }        
    
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
    
    function loadSign(){
		USERID = sm.getSelected().get('userid');
		if (!uploadWindow){
			uploadWindow = 	new Ext.Window({	               
				title: '上传手写签名图片',
				iconCls: 'form',
				layout: 'fit',
				width: 450, height: 180,
				modal: true,
				closeAction: 'hide',
				maximizable: false, resizable: false,
				plain: true, border: false,
				autoLoad: {
					url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
					params: 'type=uploadSign',
					text: 'Loading...'
				}
			});
		} else {
			uploadWindow.doAutoLoad();
		}
		uploadWindow.show();
	}
	
    function impUser(){
		rootWin = new Ext.tree.AsyncTreeNode({
	       text: USERBELONGUNITNAME,
	       id: USERBELONGUNITID,
	       expanded:true
	    });
	     treeLoaderWin = new Ext.tree.TreeLoader({
			dataUrl: treeNodeUrl + "&parentId=" + USERBELONGUNITID + "&treeName=HrManOrgTree",
			requestMethod: "GET"
		})
			treePanelWin = new Ext.tree.TreePanel({
	        id:'orgs-tree-win',
	        region:'west',
	        split:true,
	        width: 196,
	        minSize: 175,
	        maxSize: 500,
	        frame: false,
	        layout: 'accordion',
	        margins:'5 0 5 5',
	        cmargins:'0 0 0 0',
	        rootVisible: true,
	        lines:false,
	        autoScroll:true,
	        collapsible: true,
	        animCollapse:false,
	        animate: false,
	        collapseMode:'mini',
	        tbar: [{
	            iconCls: 'icon-expand-all',
				tooltip: '全部展开',
	            handler: function(){ rootWin.expand(true); }
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部折叠',
	            handler: function(){ rootWin.collapse(true); }
	        }],
	        loader: treeLoaderWin,
	        root: rootWin,
	        collapseFirst:false
		});    
	treePanelWin.on('beforeload', function(node){ 
		treePanelWin.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=HrManOrgTree"; 
	});

    treePanelWin.on('click', function(node, e){
		e.stopEvent();
		selectedOrgIdWin = node.id
		selectedOrgNameWin = node.text
		var selectedTypeWin = node.attributes.nodeType
		var paramStrCurWin = "unitType"+SPLITB+selectedTypeWin + SPLITA 
		                + "posid" + SPLITB +node.id
		//var paramStrCurWin = "unitType = '"+selectedTypeWin+"' and posid = '"+node.id+"'"
		if (selectedOrgIdWin==USERBELONGUNITID)
		{
			paramStrCurWin ="";
		}
		dsUser.baseParams.params = paramStrCurWin;
		dsUser.load({
			params:{
			 	start: 0,
			 	limit: 10
			}
		});
    });
 
 //gridPanel--------------------------------------------------------------------------------------------------	
    var fcWin = {		// 创建编辑域配置
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'unitid': {
			name: 'unitid',
			fieldLabel: '单位ID',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'useraccount': {
			name: 'useraccount',
			fieldLabel: '用户名',
			allowBlank: false,
			anchor:'95%'
		}, 'userpassword': {
			name: 'userpassword',
			fieldLabel: '用户口令',
			readOnly:true,
			allowBlank: false,
			//inputType: 'userpassword',
			hidden:true,
			anchor:'95%'
		}, 'realname': {
			name: 'realname',
			fieldLabel: '用户姓名',
			anchor:'95%'
		}, 'sex': {
			name: 'sex',
			fieldLabel: '性别',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '男'],['1', '女']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'userstate': {
			name: 'userstate',
			fieldLabel: '状态',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: statusList
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'lastlogon': {
			name: 'lastlogon',
			fieldLabel: '最后登录时间',
            format: 'Y-m-d',
 			anchor:'95%'
        }, 'createdon': {
			name: 'createdon',
			fieldLabel: '创建时间',
            format: 'Y-m-d',
 			anchor:'95%'
        }, 'phone': {
			name: 'phone',
			fieldLabel: '座机',
			anchor:'95%'
		}, 'mobile': {
			name: 'mobile',
			fieldLabel: '手机',
			anchor:'95%'
		}, 'email': {
			name: 'email',
			fieldLabel: '电子邮件',
			anchor:'95%'
		}, 'posid': {
			name: 'posid',
			fieldLabel: '组织结构ID',
			anchor:'95%'
		}, 'homeaddress': {
			name: 'homeaddress',
			fieldLabel: '家庭住址',
			anchor:'95%'
		}
	};
    var smUser =  new Ext.grid.CheckboxSelectionModel();
    var cmUser = new Ext.grid.ColumnModel([		// 创建列模型
    	smUser, {
           id:'userid',
           header: fcWin['userid'].fieldLabel,
           dataIndex: fcWin['userid'].name,
           hidden:true,
           width: 200
        },  {id:'unitid',
           header: fcWin['unitid'].fieldLabel,
           dataIndex: fcWin['unitid'].name,
           hidden:true,
         //  value:'10000000000000',
           width: 200
        },{
           id:'useraccount',
           header: fcWin['useraccount'].fieldLabel,
           dataIndex: fcWin['useraccount'].name,
           hidden:true,
           width: 120
           //,editor: new fm.TextField(fcWin['useraccount'])
        }, {
           id:'userpassword',
           header: fcWin['userpassword'].fieldLabel,
           dataIndex: fcWin['userpassword'].name,
           width: 100,
           hidden:true
           //,editor: new fm.TextField(fcWin['userpassword'])
        }, {
           id:'realname',
           header: fcWin['realname'].fieldLabel,
           dataIndex: fcWin['realname'].name,
           width: 120
           //,editor: new fm.TextField(fcWin['realname'])
        }, {
           id:'sex',
           header: fcWin['sex'].fieldLabel,
           dataIndex: fcWin['sex'].name,
           width: 80,
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '男':'女';
           	  else
           	  	return value;
           }
           //,editor: new fm.ComboBox(fcWin['sex'])
        }, {
           id:'lastlogon',
           align: 'center',
           header: fcWin['lastlogon'].fieldLabel,
           dataIndex: fcWin['lastlogon'].name,
           hidden:true,
           renderer:formatDateTime,
           width: 120
        }, {
           id:'phone',
           align: 'center',
           header: fcWin['phone'].fieldLabel,
           dataIndex: fcWin['phone'].name,
           width: 60
           //,editor: new fm.TextField(fcWin['phone'])
        }, {
           id:'mobile',
           header: fcWin['mobile'].fieldLabel,
           dataIndex: fcWin['mobile'].name,
           width: 80
           //,editor: new fm.TextField(fcWin['mobile'])
        }, {
           id:'email',
           header: fcWin['email'].fieldLabel,
           dataIndex: fcWin['email'].name,
           width: 80
           //,editor: new fm.TextField(fcWin['email'])
        }, {
           id:'homeaddress',
           header: fcWin['homeaddress'].fieldLabel,
           dataIndex: fcWin['homeaddress'].name,
           width: 80
        }
	]);
    cmUser.defaultSortable = true;						//设置是否可排序

    dsUser = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanUser,				
	    	business: 'systemMgm',
	    	method: listUserMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsUser.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
	var getUsers = new Ext.Button({
		text: '导入系统用户',
		iconCls: 'save',
		handler: function(){
			if(selectRecords){
				if (selectRecords.length > 0){
					rlzyMgm.impUserInfoByUserIdStr(selectedUserId,function(rtn){
						if(rtn){
							Ext.Msg.alert('提示','导入成功！')
							ds.load({
								params:{
								 	start: 0,
								 	limit: 20
								}
							});
						}else{
							Ext.Msg.alert('提示','导入过程中发生错误！')
						}
					})
				}else{
					Ext.Msg.alert('提示', '请先选择需要导入的用户！');
				}
			}
		}
	})
		
	userSelectPanel = new Ext.grid.GridPanel({
		ds: dsUser,
		cm: cmUser,
		sm: smUser,
		tbar: [gridPanelTitle, '->', getUsers],
		border: false,
		region: 'center',
		layout: 'accordion',
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
	        pageSize: 10,
	        store: dsUser,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    }),
	    width: 200
	});
	smUser.on('selectionchange', function (obj){
		var record = smUser.getSelections();//getSelected();
		for(i = 0;i<record.length;i++){
			if(i==0)
				selectedUserId = ""
			selectedUserId += (selectedUserId == ""?"":",") + record[i].get("userid")
		}
		selectRecords = record
	});
//gridPanel--------------------------------------------------------------------------------------------------	
    var borderPanel = new Ext.Panel({
    	layout : 'border',
    	items : [ treePanelWin, userSelectPanel]
    });
    
    	rootWin.select();	
		dsUser.baseParams.params = "";
	    dsUser.load({
	    	params:{
		    	start: 0,
		    	limit: 10
	    	}
	    });
    
    	var win
    	if(!win){
			
			var win = new Ext.Window({
				id:'userChooseWin',
				title : '从系统用户导入用户信息',
				// maximizable : true,
				// maximized : true,
				width : 780,
				height : 330,
				autoScroll : true,
				// bodyBorder : true,
				// draggable : true,
				isTopContainer : true,
				modal : true,
				resizable : false,
				layout : 'border',
				items : [ treePanelWin, userSelectPanel]
			})
    	}
    	win.show();
    }
    

});


