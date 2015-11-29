Ext.onReady(function() {

	var flagShow = false;
//	var intoTabPanel1 = new Ext.TabPanel({
//				id : 'intoTabPanel1',
//				activeTab : 0,
//				border : false,
//				region : 'center',
//				items : [intosContentPanel1, intosContentPanel2,
//						intosContentPanel3]
//			});

	var intosPanel = new Ext.Panel({
				id : 'intosPanel',
				layout : 'border',
				region : 'center',
				border : false,
				title : '入库管理',
//				items : [intoTabPanel1]
				items : [intosContentPanel3]
			});
//	var outTabPanel1 = new Ext.TabPanel({
//				id : 'outTabPanel1',
//				activeTab : 0,
//				border : false,
//				region : 'center',
//				items : [outContentPanel1, outContentPanel2, outContentPanel3]
//			});
	var outsPanel = new Ext.Panel({
				id : 'outsPanel',
				layout : 'border',
				region : 'center',
				title : '出库管理',
				// items : [outTabPanel1]
				items : [outContentPanel3]
			});
	var tabPanel = new Ext.TabPanel({
				activeTab : 0,
				border : false,
				region : 'center',
				items : [intosPanel, outsPanel]
			});

	var mainPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				items : [tabPanel]
			});
	var viewPort = new Ext.Viewport({
				layout : 'border',
				border : false,
				items : [mainPanel]
			});

	if (USERDEPTID == "102010103") {
		tabPanel.getActiveTab("intosPanel").disable();
		tabPanel.setActiveTab('outsPanel');
	}
//	if (isFinance) {
//		gridPanelInto.getTopToolbar().setDisabled(true);
//		gridPanelIntoSub.getTopToolbar().setDisabled(true);
//		printEsBtn.setDisabled(false);
//	}

	// 正式入库显示更多数据显示
	for (var o in fcInto) {
		var name = fcInto[o];
		var temp = new Array();
		temp.push(fcInto[o].name);
		temp.push(fcInto[o].fieldLabel);
		var colModel = gridPanelInto.getColumnModel();
		// 锁定列不在显示更多信息中出现
		if (colModel.getLockedCount() <= colModel
				.findColumnIndex(fcInto[o].name)) {
			cmArrayInto.push(temp);
			if (!colModel.isHidden(colModel.getIndexById(o))) {
				cmHideInto.push(o)
			}
		}
	}
	store1Into.loadData(cmArrayInto)
	chooseRowInto.setValue(cmHideInto);
	chooseRowInto.setRawValue("显示更多信息");

	for (var o in fcIntoSub) {
		var name = fcIntoSub[o];
		var temp = new Array();
		temp.push(fcIntoSub[o].name);
		temp.push(fcIntoSub[o].fieldLabel);
		var colModel = gridPanelIntoSub.getColumnModel();
		// 锁定列不在显示更多信息中出现
		if (colModel.getLockedCount() <= colModel
				.findColumnIndex(fcIntoSub[o].name)) {
			cmArrayIntoSub.push(temp);
			if (!colModel.isHidden(colModel.getIndexById(o))) {
				cmHideIntoSub.push(o)
			}
		}
	}
	store1IntoSub.loadData(cmArrayIntoSub)
	chooseRowIntoSub.setValue(cmHideIntoSub);
	chooseRowIntoSub.setRawValue("显示更多信息");
	Ext.get("chooserow5").on("mouseout", function() {
		if (chooseRowIntoSub.getValue() == ""
				|| chooseRowIntoSub.getValue() == null) {
			chooseRowIntoSub.setValue(cmHideIntoSub);
			chooseRowIntoSub.setRawValue("显示更多信息");
		}
	}, this);
	Ext.get("chooserow4").on("mouseout", function() {
		if (chooseRowInto.getValue() == "" || chooseRowInto.getValue() == null) {
			chooseRowInto.setValue(cmHideInto);
			chooseRowInto.setRawValue("显示更多信息");
		}
	}, this);

	tabPanel.on('tabchange', function(t, tab) {
				if (t.activeTab.id == "intosPanel") {
					// 正式入库显示更多数据显示
					for (var o in fcInto) {
						var name = fcInto[o];
						var temp = new Array();
						temp.push(fcInto[o].name);
						temp.push(fcInto[o].fieldLabel);
						var colModel = gridPanelInto.getColumnModel();
						// 锁定列不在显示更多信息中出现
						if (colModel.getLockedCount() <= colModel
								.findColumnIndex(fcInto[o].name)) {
							cmArrayInto.push(temp);
							if (!colModel.isHidden(colModel.getIndexById(o))) {
								cmHideInto.push(o)
							}
						}
					}
					store1Into.loadData(cmArrayInto)
					chooseRowInto.setValue(cmHideInto);
					chooseRowInto.setRawValue("显示更多信息");

					for (var o in fcIntoSub) {
						var name = fcIntoSub[o];
						var temp = new Array();
						temp.push(fcIntoSub[o].name);
						temp.push(fcIntoSub[o].fieldLabel);
						var colModel = gridPanelIntoSub.getColumnModel();
						// 锁定列不在显示更多信息中出现
						if (colModel.getLockedCount() <= colModel
								.findColumnIndex(fcIntoSub[o].name)) {
							cmArrayIntoSub.push(temp);
							if (!colModel.isHidden(colModel.getIndexById(o))) {
								cmHideIntoSub.push(o)
							}
						}
					}
					store1IntoSub.loadData(cmArrayIntoSub)
					chooseRowIntoSub.setValue(cmHideIntoSub);
					chooseRowIntoSub.setRawValue("显示更多信息");
					Ext.get("chooserow5").on("mouseout", function() {
						if (chooseRowIntoSub.getValue() == ""
								|| chooseRowIntoSub.getValue() == null) {
							chooseRowIntoSub.setValue(cmHideIntoSub);
							chooseRowIntoSub.setRawValue("显示更多信息");
						}
					}, this);
					Ext.get("chooserow4").on("mouseout", function() {
						if (chooseRowInto.getValue() == ""
								|| chooseRowInto.getValue() == null) {
							chooseRowInto.setValue(cmHideInto);
							chooseRowInto.setRawValue("显示更多信息");
						}
					}, this);
				} else {
					if (tabPanelFormal.getActiveTab().id == 'stock'){
						dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
					}
				}
			})
	dsIntoFormal.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	dsSubIntoFormal.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	dsFormal.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	dsOutFormal.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	dsOutSubFormal.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

		// 以下是2013-11-4日BUG4870修改前的打开方式
		// 主体设备维护暂估入库数据显示
		/*
		 * if(flagShow == false){ flagShow = true; for(var o in fcIntoEs){ var
		 * name = fcIntoEs[o]; var temp = new Array();
		 * temp.push(fcIntoEs[o].name); temp.push(fcIntoEs[o].fieldLabel); var
		 * colModel = gridPanelIntoEs.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoEs[o].name)){
		 * cmArrayIntoEs.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEs.push(o) } } } store1IntoEs.loadData(cmArrayIntoEs)
		 * chooseRowIntoEs.setValue(cmHideIntoEs);
		 * chooseRowIntoEs.setRawValue("显示更多信息");
		 * 
		 * for(var o in fcIntoSub){ var name = fcIntoSub[o]; var temp = new
		 * Array(); temp.push(fcIntoSub[o].name);
		 * temp.push(fcIntoSub[o].fieldLabel); var colModel =
		 * gridPanelIntoEsSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoSub[o].name)){
		 * cmArrayIntoEsSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEsSub.push(o) } } }
		 * store1IntoEsSub.loadData(cmArrayIntoEsSub)
		 * chooseRowIntoEsSub.setValue(cmHideIntoEsSub);
		 * chooseRowIntoEsSub.setRawValue("显示更多信息");
		 * Ext.get("chooserow1").on("mouseout", function(){
		 * if(chooseRowIntoEsSub.getValue()==""||chooseRowIntoEsSub.getValue()==null){
		 * chooseRowIntoEsSub.setValue(cmHideIntoEsSub);
		 * chooseRowIntoEsSub.setRawValue("显示更多信息"); } }, this);
		 * Ext.get("chooserow").on("mouseout", function(){
		 * if(chooseRowIntoEs.getValue()==""||chooseRowIntoEs.getValue()==null){
		 * chooseRowIntoEs.setValue(cmHideIntoEs);
		 * chooseRowIntoEs.setRawValue("显示更多信息"); } }, this); } var flag =
		 * false; tabPanel.on('tabchange',function(t,tab){
		 * dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsEs.load({params:{start:0,limit:PAGE_SIZE}}); if(flag == false){
		 * flag = true; //暂估入库数据显示 for(var o in fcIntoEs){ var name =
		 * fcIntoEs[o]; var temp = new Array(); temp.push(fcIntoEs[o].name);
		 * temp.push(fcIntoEs[o].fieldLabel); var colModel =
		 * gridPanelIntoEs.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoEs[o].name)){
		 * cmArrayIntoEs.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEs.push(o) } } } store1IntoEs.loadData(cmArrayIntoEs)
		 * chooseRowIntoEs.setValue(cmHideIntoEs);
		 * chooseRowIntoEs.setRawValue("显示更多信息");
		 * 
		 * for(var o in fcIntoSub){ var name = fcIntoSub[o]; var temp = new
		 * Array(); temp.push(fcIntoSub[o].name);
		 * temp.push(fcIntoSub[o].fieldLabel); var colModel =
		 * gridPanelIntoEsSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoSub[o].name)){
		 * cmArrayIntoEsSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEsSub.push(o) } } }
		 * store1IntoEsSub.loadData(cmArrayIntoEsSub)
		 * chooseRowIntoEsSub.setValue(cmHideIntoEsSub);
		 * chooseRowIntoEsSub.setRawValue("显示更多信息"); } })
		 * intoTabPanel1.on('tabchange',function(t,tab){ if(t.activeTab.id ==
		 * 'intosContentPanel1'){ //暂估入库显示更多数据显示 for(var o in fcIntoEs){ var
		 * name = fcIntoEs[o]; var temp = new Array();
		 * temp.push(fcIntoEs[o].name); temp.push(fcIntoEs[o].fieldLabel); var
		 * colModel = gridPanelIntoEs.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoEs[o].name)){
		 * cmArrayIntoEs.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEs.push(o) } } } store1IntoEs.loadData(cmArrayIntoEs)
		 * chooseRowIntoEs.setValue(cmHideIntoEs);
		 * chooseRowIntoEs.setRawValue("显示更多信息");
		 * 
		 * for(var o in fcIntoEsSub){ var name = fcIntoEsSub[o]; var temp = new
		 * Array(); temp.push(fcIntoEsSub[o].name);
		 * temp.push(fcIntoEsSub[o].fieldLabel); var colModel =
		 * gridPanelIntoEsSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoEsSub[o].name)){
		 * cmArrayIntoEsSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoEsSub.push(o) } } }
		 * store1IntoEsSub.loadData(cmArrayIntoEsSub)
		 * chooseRowIntoEsSub.setValue(cmHideIntoEsSub);
		 * chooseRowIntoEsSub.setRawValue("显示更多信息"); } if(t.activeTab.id ==
		 * 'intosContentPanel2'){ if(isFinance){
		 * gridPanelIntoBack.getTopToolbar().setDisabled(true);
		 * gridPanelIntoBackSub.getTopToolbar().setDisabled(true);
		 * printBackBtn.setDisabled(false); } //冲回入库显示更多数据显示 for(var o in
		 * fcIntoBack){ var name = fcIntoBack[o]; var temp = new Array();
		 * temp.push(fcIntoBack[o].name); temp.push(fcIntoBack[o].fieldLabel);
		 * var colModel = gridPanelIntoBack.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoBack[o].name)){
		 * cmArrayIntoBack.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoBack.push(o) } } } store1IntoBack.loadData(cmArrayIntoBack)
		 * chooseRowIntoBack.setValue(cmHideIntoBack);
		 * chooseRowIntoBack.setRawValue("显示更多信息");
		 * 
		 * 
		 * for(var o in fcSubIntoBack){ var name = fcSubIntoBack[o]; var temp =
		 * new Array(); temp.push(fcSubIntoBack[o].name);
		 * temp.push(fcSubIntoBack[o].fieldLabel); var colModel =
		 * gridPanelIntoBackSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcSubIntoBack[o].name)){
		 * cmArrayIntoBackSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoBackSub.push(o) } } }
		 * store1IntoBackSub.loadData(cmArrayIntoBackSub)
		 * chooseRowIntoBackSub.setValue(cmHideIntoBackSub);
		 * chooseRowIntoBackSub.setRawValue("显示更多信息");
		 * 
		 * Ext.get("chooserow3").on("mouseout", function(){
		 * if(chooseRowIntoBack.getValue()==""||chooseRowIntoBack.getValue()==null){
		 * chooseRowIntoBack.setValue(cmHideIntoBackSub);
		 * chooseRowIntoBack.setRawValue("显示更多信息"); } }, this);
		 * Ext.get("chooserow2").on("mouseout", function(){
		 * if(chooseRowIntoBack.getValue()==""||chooseRowIntoBack.getValue()==null){
		 * chooseRowIntoBack.setValue(cmHideIntoBack);
		 * chooseRowIntoBack.setRawValue("显示更多信息"); } }, this);
		 * 
		 * //禁用正式入库ToolBar if(isFinance){
		 * gridPanelIntoBack.getTopToolbar().setDisabled(true);
		 * gridPanelIntoBackSub.getTopToolbar().setDisabled(true); } }
		 * if(t.activeTab.id == 'intosContentPanel3'){ if(isFinance){
		 * gridPanelInto.getTopToolbar().setDisabled(true);
		 * gridPanelIntoSub.getTopToolbar().setDisabled(true);
		 * printIntoBtn.setDisabled(false); } //正式入库显示更多数据显示 for(var o in
		 * fcInto){ var name = fcInto[o]; var temp = new Array();
		 * temp.push(fcInto[o].name); temp.push(fcInto[o].fieldLabel); var
		 * colModel = gridPanelInto.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcInto[o].name)){
		 * cmArrayInto.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){ cmHideInto.push(o) } } }
		 * store1Into.loadData(cmArrayInto) chooseRowInto.setValue(cmHideInto);
		 * chooseRowInto.setRawValue("显示更多信息");
		 * 
		 * 
		 * for(var o in fcIntoSub){ var name = fcIntoSub[o]; var temp = new
		 * Array(); temp.push(fcIntoSub[o].name);
		 * temp.push(fcIntoSub[o].fieldLabel); var colModel =
		 * gridPanelIntoSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoSub[o].name)){
		 * cmArrayIntoSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideIntoSub.push(o) } } } store1IntoSub.loadData(cmArrayIntoSub)
		 * chooseRowIntoSub.setValue(cmHideIntoSub);
		 * chooseRowIntoSub.setRawValue("显示更多信息");
		 * Ext.get("chooserow5").on("mouseout", function(){
		 * if(chooseRowIntoSub.getValue()==""||chooseRowIntoSub.getValue()==null){
		 * chooseRowIntoSub.setValue(cmHideIntoSub);
		 * chooseRowIntoSub.setRawValue("显示更多信息"); } }, this);
		 * Ext.get("chooserow4").on("mouseout", function(){
		 * if(chooseRowInto.getValue()==""||chooseRowInto.getValue()==null){
		 * chooseRowInto.setValue(cmHideInto);
		 * chooseRowInto.setRawValue("显示更多信息"); } }, this); //禁用冲回入库ToolBar
		 * if(isFinance){ gridPanelInto.getTopToolbar().setDisabled(true);
		 * gridPanelIntoSub.getTopToolbar().setDisabled(true); } } })
		 * 
		 * outTabPanel1.on('tabchange',function(t,tab){//tabPanelFormal
		 * if(t.activeTab.id == 'outContentPanel2'){//冲回出库 for(var o in
		 * fcOutBack){ var name = fcOutBack[o]; var temp = new Array();
		 * temp.push(fcOutBack[o].name); temp.push(fcOutBack[o].fieldLabel); var
		 * colModel = gridPanelOutBack.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOutBack[o].name)){
		 * cmArrayOutBack.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o))){
		 * cmHideOutBack.push(o) } } } store1OutBack.loadData(cmArrayOutBack)
		 * chooseRowOutBack.setValue(cmHideOutBack);
		 * chooseRowOutBack.setRawValue("显示更多信息");
		 * Ext.get("chooserow6").on("mouseout", function(){
		 * if(chooseRowOutBack.getValue()==""||chooseRowOutBack.getValue()==null){
		 * chooseRowOutBack.setValue(cmHideOutBack);
		 * chooseRowOutBack.setRawValue("显示更多信息"); } }, this);
		 * 
		 * for(var o1 in fcOutBackSub){ var name = fcOutBackSub[o1]; var temp =
		 * new Array(); temp.push(fcOutBackSub[o1].name);
		 * temp.push(fcOutBackSub[o1].fieldLabel); var colModel =
		 * gridPanelOutBackSub.getColumnModel(); //锁定列不在显示更多信息中出现
		 * if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOutBackSub[o1].name)){
		 * cmArrayOutBackSub.push(temp);
		 * if(!colModel.isHidden(colModel.getIndexById(o1))){
		 * cmHideOutBackSub.push(o1) } } }
		 * store1OutBackSub.loadData(cmArrayOutBackSub)
		 * chooseRowOutBackSub.setValue(cmHideOutBackSub);
		 * chooseRowOutBackSub.setRawValue("显示更多信息");
		 * 
		 * Ext.get("chooserow7").on("mouseout", function(){
		 * if(chooseRowOutBackSub.getValue()==""||chooseRowOutBackSub.getValue()==null){
		 * chooseRowOutBackSub.setValue(cmHideOutBackSub);
		 * chooseRowOutBackSub.setRawValue("显示更多信息"); } }, this); } })
		 * dsIntoEs.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsSubInto.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsIntoBack.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsSubIntoBack.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsIntoFormal.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsSubIntoFormal.load({params : {start : 0,limit : PAGE_SIZE}});
		 * dsBack.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsEs.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutEs.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutSubEs.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutBack.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutSubBack.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutFormal.load({params:{start:0,limit:PAGE_SIZE}});
		 * dsOutSubFormal.load({params:{start:0,limit:PAGE_SIZE}});
		 * //禁用暂估入库ToolBar if(isFinance){
		 * gridPanelIntoEs.getTopToolbar().setDisabled(true);
		 * gridPanelIntoEsSub.getTopToolbar().setDisabled(true); }
		 */
})