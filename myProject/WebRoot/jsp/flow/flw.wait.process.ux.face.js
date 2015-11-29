var conoveWin = null;//合同列表窗口
var matWin = null;//物资窗口
var oldFaceWin = null;//保存过的任务接口参数
//当流程有至少2个参数时，第一个参数为选择合同，第二个参数的自动生成依赖于合同号时可使用此方法。
//zhangh 2012-12-12
var afterSelectConnMethod = null;
/**
 * 业务选择窗口入口函数
 */
function triggerClick(){//合同、物资等窗口
	var  flag = false;	
	var _field = this;//Ext.form.TriggerField对象
	var triggertype = "";
	if(_field&&_field.setValue){
		flag = true;
		triggertype = _field.triggertype?_field.triggertype:"";
	};
	if(flag){
		switch(triggertype){
			case 'conove' ://合同窗口
				if(!conoveWin){
					conoveWin =	new Flw.wait.WinOfConove({field:_field,closeAction:'hide',id:'conovewin'})
				}else{
					conoveWin.setField(_field);//如果不是第一次显示窗口，则必须重置要填入的field
				};
				conoveWin.show();
				break;
			case 'mat' ://物资窗口
				if(!matWin){
					matWin = new Flw.wait.WinOfMat({field:_field,closeAction:'hide',id:'matwin'})
				}else{
					matWin.setField(_field);
				};
				matWin.show();
				break;
			case 'face' ://任务接口
				if(!oldFaceWin){
					oldFaceWin = new Flw.wait.WinOfSavedFace({field:_field,closeAction:'hide',id:'facewin'})
				}else{
					oldFaceWin.setField(_field);
				};
				oldFaceWin.show();
				break;
		}
	};
};
/**
 * 任务接口默认值获取函数
 * @param {} savedParams 保存过的任务接口，参数格式 [['参数1','值1'],['参数2','值2'],……]
 * @param {} faceName   任务方法名称 字符串型
 * @param {} pname  任务接口名
 * @return {}
 */
function getTaskParamValue(savedParams,faceName,pname){
	var name = "";
	var maxStockBhPrefix = USERNAME + new Date().format('ym');
	var maxStockBh;
	var incrementLsh;
	if (faceName == '合同新增') {
		name = "合同编号";
	} else if (faceName == '合同修改') {
		if (pname == 'conno') name = "合同编号";
		if (pname == 'signdate') name = "签订日期";
	} else if (faceName == '合同付款分摊') {
		name = "付款编号";
	} else if (faceName == '合同分摊') {
		name = "合同编号";
	} else if (faceName == '付款申请') {
		name = "合同编号";
		if (pname == 'payno'){
			var payno;
			DWREngine.setAsync(false); 
			conpayMgm.AutoPayNo(REALNAME, USERNAME, function(value){
				payno = value;
			});
			DWREngine.setAsync(true);
			return payno;
		}
	} else if (faceName == '付款批准' || faceName == '付款实际') {
		if (pname == 'payno') name = "付款编号";{
				if (pname == 'payno'){
					var payno;
					DWREngine.setAsync(false); 
					conpayMgm.AutoPayNo(REALNAME, USERNAME, function(value){
						payno = value;
					});
					DWREngine.setAsync(true);
					return payno;
				}
		}
		if (pname == 'conno') name = "合同编号";
	} else if (faceName == '变更新增') {
		name = "合同编号";
		if (pname == 'chano'){
			var chano;
			var g_conno;
			for(var t=0; t<savedParams.length; t++){
				if (savedParams[t][0] == name) {
					g_conno = savedParams[t][1]; break;
				}
			}
			DWREngine.setAsync(false); 
			conchaMgm.autoChaNo(g_conno, function(value){
				chano = value;
			});
			DWREngine.setAsync(true);
			return chano;
		}
		if (pname == 'chano') name = "变更编号";
		if (pname == 'conno') name = "合同编号";
	} else if (faceName == '变更修改') {
		if (pname == 'chano') name = "变更编号";
		if (pname == 'conno') name = "合同编号";
	} else if (faceName == '合同结算') {
		name = "合同编号";
	} else if (faceName == '合同变更分摊') {
		name = "变更编号";
	//} else if (faceName == '设备入库' || faceName == '设备到货') {
	//	name = "合同编号";
	} else if (faceName == '设备开箱主表信息录入' 
			|| faceName == '设备开箱从表信息录入') {
		if (pname == 'boxno'){
			name = "开箱单号";
			//新增编号获取
			DWREngine.setAsync(false);
				maxStockBhPrefix = USERNAME + new Date().format('ym');
				stockMgm.getStockPlanNewBh(maxStockBhPrefix,"boxno","equ_open_box",null,function(dat){
					if(dat != "")	{
						maxStockBh = dat;
						incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
					}	
				})
			DWREngine.setAsync(true);
			return maxStockBh;
		}
		if (pname == 'conno') name = "合同编号";
	} else if (faceName == '申请领用') {
		name = "合同编号";
		if (pname == 'recno') {
			var recno; 
			var g_conno;
			for(var t=0; t<savedParams.length; t++){
				if (savedParams[t][0] == name) {
					g_conno = savedParams[t][1]; break;
				}
			}
			DWREngine.setAsync(false);
			baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conno='"+g_conno+"'", function(list){
				equRecMgm.getRecNo(list[0].conid, function(recNo){
					recno = recNo;
		    	}); 
			});
			DWREngine.setAsync(true);
			return recno;
		}
		if (pname == 'conno') name = "合同编号";
	} else if (faceName == '实际领用') {
		if (pname == 'recno') name = "领用单号";
		if (pname == 'conno') name = "合同编号";
	}else if (faceName == '工程量投资完成') {
		gcltzwc=true;
		if(pname=='mon_id'){
			DWREngine.setAsync(false);	
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"mon_id","PRO_ACM_MONTH",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			DWREngine.setAsync(true);
			return maxStockBh;
		}
	}else if(faceName == '上传合同附件'){
		name = "合同编号";
	}else if(faceName == '资料移交'){
		return _insid;
	}else if(faceName == '申请计划主表'){
		DWREngine.setAsync(false);	
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","wz_cjspb",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}else if(faceName == '采购计划主表'){
			DWREngine.setAsync(false);	
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","wz_cjhpb",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			DWREngine.setAsync(true);
			return maxStockBh;
	}else if(faceName == '物资到货入库'){
			DWREngine.setAsync(false);	
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"in_no","mat_store_in",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			DWREngine.setAsync(true);
			return maxStockBh;
	}else if(faceName == '物资计划内领用'){
			DWREngine.setAsync(false);	
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"out_no","mat_store_out",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			DWREngine.setAsync(true);
			return maxStockBh;
	}else if(faceName == '物资计划外领用'){
			DWREngine.setAsync(false);
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"out_no","mat_store_out",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			DWREngine.setAsync(true);
			return maxStockBh;
	}else if(faceName == '监理工程量投资完成'){
		var _conno="",_mon_id="";
		DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwFaceParamsIns", "insid='"+_insid+"'", function(list){
			var params = list[0].paramvalues.split("`");
			for(var i=0;i<params.length;i++){
			    if(params[i].split(":")[0] == "conno"){_conno = params[i].split(":")[1]}
			    if(params[i].split(":")[0] == "mon_id"){_mon_id = params[i].split(":")[1]}
			}
		});
		DWREngine.setAsync(true);
		if(pname=='mon_id'){return _mon_id}
		if(pname=='conno'){ return _conno}
	}else if(faceName == '业主工程量投资完成'){
		var _conno="";_mon_id="";
		DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwFaceParamsIns", "insid='"+_insid+"'", function(list){
			var params = list[0].paramvalues.split("`");
			for(var i=0;i<params.length;i++){
			    if(params[i].split(":")[0] == "conno"){_conno = params[i].split(":")[1]}
			    if(params[i].split(":")[0] == "mon_id"){_mon_id = params[i].split(":")[1]}
			}
		});
		DWREngine.setAsync(true);
		if(pname=='mon_id'){return _mon_id}
		if(pname=='conno'){ return _conno}
	}else if(faceName == '部门资金计划上报'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","bdg_month_money_plan",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}else if(faceName == '部门资金计划汇总'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"hzbh","bdg_month_money_plan",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}else if(faceName == '部门资金计划补录'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","bdg_month_money_plan",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}else if(faceName == '费用报销管理'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"memo","dept_reimburse",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}
	else if(faceName == '部门周工作上报' || faceName == '部门周工作汇总'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","GZ_WEEK_REPORT",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}
	//2010-12-09 月工作上报和汇总流程中自动生成编号
	else if(faceName == '部门月工作上报' || faceName == '部门月工作汇总'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","GZ_MONTH_REPORT",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}
	else if(faceName == '安全专款申请'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","SAFETY_MONEY_APPLY",null,function(dat){	
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}
	//-----2010-12-29-----
	else if(faceName == '安全专款执行评估'){
		DWREngine.setAsync(false);	
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","SAFETY_MONEY_APPLY_PG",null,function(dat){	
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		return maxStockBh;
	}
	//--2011-03-16--设备到货编号--zhangh--
	else if(faceName == '设备到货'){
		DWREngine.setAsync(false);
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"gg_no","equ_get_goods_arr",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		if(pname=='gg_no'){return maxStockBh}
	}
	//--2011-03-16--设备开箱编号--zhangh--
	else if(faceName == '设备开箱'){
		DWREngine.setAsync(false);
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"boxno","equ_open_box",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		if(pname=='boxno'){return maxStockBh}
	}
	//--2011-03-17--设备入库编号--zhangh--
	else if(faceName == '设备入库'){
		var initYear = new Date().getYear() + '-'
	    var init = CURRENTAPPID+'-RKD-'+initYear
	    var initBh = ''
	    DWREngine.setAsync(false)
	    	equGetGoodsMgm.initGetGoodsBh(init,function(str){
	    		initBh = str
	    	})

			maxStockBhPrefix = USERNAME + new Date().format('ym');
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"gg_no","equ_get_goods",null,function(dat){
				if(dat != "")	{
					initBh = dat;
					//incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
		DWREngine.setAsync(true);
		if(pname=='gg_no'){return initBh}
	}
	//--2011-03-17--设备出库编号--zhangh--
	else if(faceName == '设备出库'){
		var initYear = new Date().getYear() + '-'
	    var init = CURRENTAPPID+'-CKD-'+initYear
	    var initBh = ''
	    DWREngine.setAsync(false)
	    	equGetGoodsMgm.initHouseOutBh(init,function(str){
	    		initBh = str
	    	})
			maxStockBhPrefix = USERNAME + new Date().format('ym');
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"outno","equ_houseout",null,function(dat){
				if(dat != "")	{
					initBh = dat;
					//incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
		DWREngine.setAsync(true);
		if(pname=='outno'){return initBh}
	}
	//--2012-12-11--设备入库单新增--zhangh--新版设备使用，先选择合同，然后生成单号
    else if(faceName == '设备入库单新增'){
        afterSelectConnMethod = function(conno){
	        DWREngine.setAsync(false);
	        var newRkNo = conno+"-RK-";
	        equMgm.getEquNewDhNo(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,function(str){
	            newRkNo = str;
	        });
	        DWREngine.setAsync(true);
            var obj = document.getElementsByName('flowid')
            if(obj&&obj.length>0)
                obj[0].value = newRkNo;
        }
    }
    //--2012-12-12--设备出库单新增--zhangh--新版设备使用，先选择合同，然后生成单号
    else if(faceName == '设备出库单新增'){
        afterSelectConnMethod = function(conno){
            DWREngine.setAsync(false);
            var newCkNo = conno+"-CK-";
            equMgm.getEquNewDhNo(CURRENTAPPID,newCkNo,"out_no","equ_goods_stock_out", null, function(str) {
                newCkNo = str;
            });
            DWREngine.setAsync(true);
            var obj = document.getElementsByName('flowid')
            if(obj&&obj.length>0)
                obj[0].value = newCkNo;
        }
    }
    else if(faceName == '专用工具借用新增'){
        DWREngine.setAsync(false);  
        stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","equ_special_tools",null,function(dat){
            if(dat != "")   {
                maxStockBh = dat;
                incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
            }   
        })
        DWREngine.setAsync(true);
        return maxStockBh;
	}   
	var value = "";
	if(!savedParams) return value;
	for(var t=0; t<savedParams.length; t++){
		if (savedParams[t][0] == pname) {
			value = savedParams[t][1]; break;
		}
	}
	return value;
};
Ext.ns("Flw","Flw.wait");
/**
 * 合同列表
 * @class Flw.wait.WinOfConove
 * @extends Ext.Window
 */
Flw.wait.WinOfConove=Ext.extend(Ext.Window ,{
	title: '合同列表',
	iconCls: 'form', layout: 'fit',
	closeAction: 'hide',
	width: 592, height: 280,
	modal: true, resizable: false,
	closable: true, border: false,
	maximizable: false, plain: true,
	field:null,//
	conTypeCombo:null,
	connoField:null,
	connameField:null,
	tbar:null,
	store:null,
	items:null,
	//获取合同Grid
	getConovegrid:function(){
		return this.items.get(0);
	},
	//获取合同ds
	getConoveStore:function(){
		return this.getConovegrid().getStore();
	},
	setField:function(f){
		this.field = f;
	},
	initComponent: function(){
		var _self = this;
		//合同类型
		this.conTypeCombo = new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({fields: ['k', 'v']}),
	    	displayField:'v',  	valueField:'k',id:'test',
	    	typeAhead: true,   	mode: 'local',
	    	triggerAction: 'all', 	emptyText:'选择合同分类....',
	    	selectOnFocus:true,   	width:110,
	    	red:new Ext.data.Record.create([{name:'v',type:'string'},{name:'k',type:'string'}]),
	    	listeners: {
	    		select: function(combo, record, index){
		    		var _ds = _self.getConoveStore();
	    			var sql = (combo.getValue() == '-1') ? "" : "condivno='"+combo.getValue()+"'";
		    		if(gcltzwc && sql==""){
					     _ds.baseParams.params =  " conid in(select distinct conid from com.sgepit.pmis.budget.hbm.BdgProject )";
					}else{
		    			_ds.baseParams.params = (combo.getValue() == '-1') ? "" : "condivno='"+combo.getValue()+"'";
					}
		    		_ds.load();
		    	},
		    	beforerender : function(combo){
		    			DWREngine.setAsync(false);
		    			combo.store.add(new combo.red({k:'-1',v:'所有合同'}))
						appMgm.getCodeValue('合同划分类型',function(list){
							for(var i = 0; i < list.length; i++) {
				    			combo.store.add(new combo.red({k:list[i].propertyCode,v:list[i].propertyName}));
							}
					    }); 
						DWREngine.setAsync(false);
		    	}
		    }
		});
		//合同编号过滤
		this.connoField = new Ext.form.TextField({
				xtype: 'textfield', name: 'conno', width: 110
		});
		//合同名称过滤
		this.connameField = new Ext.form.TextField({
				xtype: 'textfield', name: 'conname', width: 110
		});
		this.tbar = [this.conTypeCombo, '-','<font color=#15428b>合同编号：</font>'
		    ,this.connoField, '-','<font color=#15428b>合同名称：</font>'
			,this.connameField, '-', '->'
			,{
				text: '查询', iconCls: 'btn', handler: function(){
					var sql = "";
					if (_self.connoField.getValue() != ''){
						sql += "conno like '%"+_self.connoField.getValue()+"%'";
					}
					if (_self.connameField.getValue() != ''){
						if (sql != '') sql += " and ";
						sql += "conname like '%"+_self.connameField.getValue()+"%'";
					}
					if (_self.conTypeCombo.getValue() != '-1' && _self.conTypeCombo.getValue() != ''){
						_self.getConoveStore().baseParams.params = sql + " and condivno='"+_self.conTypeCombo.getValue()+"'";
					} else {
						_self.getConoveStore().baseParams.params = sql;
					}
					if(gcltzwc){
					     _self.getConoveStore().baseParams.params = sql + " and conid in(select distinct conid from com.sgepit.pmis.budget.hbm.BdgProject )";
					}
					_self.getConoveStore().load();
				}
			}, '-'
			,{
				text: '选择', iconCls: 'save', handler: function(){
					var sm = _self.getConovegrid().getSelectionModel()
					if (sm.getSelected()){
						if(_self.field&&_self.field.setValue){
							_self.field.setValue(sm.getSelected().get('conno'));
						}
						_self.hide();
					} else {
						Ext.example.msg('提示', '请选择数据！');
					}
				}
			}
		];
		this.store = new Ext.data.Store({
			baseParams: {
				ac: 'list',
				bean: 'com.sgepit.pmis.contract.hbm.ConOve',
				business: 'baseMgm',
				method: 'findWhereOrderBy'
			},
			proxy: new Ext.data.HttpProxy({
				method: 'GET',
				url: MAIN_SERVLET
			}),
			reader: new Ext.data.JsonReader({
				root: 'topics',
				totalProperty: 'totalCount',
				id: 'conid'
			}, [
				{name: 'conid', type: 'string'},
				{name: 'conno', type: 'string'},
				{name: 'conname', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		});
		
		this.items=[{
				border: false,
				xtype:"grid",
				header: false,
				autoScroll: true,
				loadMask: true, stripeRows: true,
				viewConfig: {
					forceFit: true,
					ignoreAdd: true
				},
				store: _self.store,
				bbar:new Ext.PagingToolbar({
					pageSize: PAGE_SIZE,
		            store: _self.store,
		            displayInfo: true,
		            displayMsg: ' {0} - {1} / {2}',
		            emptyMsg: "无记录。"
		        }),
				cm: new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer({
						width: 20
					}), {
						id: 'conid',
						header: '合同ID',
						dataIndex: 'conid',
						hidden: true
					}, {
						id: 'conno',
						header: '合同编号',
						dataIndex: 'conno',
						width: .3
					}, {
						id: 'conname',
						header: '合同名称',
						dataIndex: 'conname',
						width: .6
					}
				])
			}
		]
		this.on('show',function(){
			this.getConoveStore().load();
		});
        this.on('hide',function(){
            if(afterSelectConnMethod != null){
                if(_self.field){
                    afterSelectConnMethod(_self.field.getValue());
                }
                
            }
        });
		Flw.wait.WinOfConove.superclass.initComponent.call(this);
	}
})
Ext.reg("conwin",Flw.wait.WinOfConove);
/**
 * 物资待入库
 * @class Flw.wait.WinOfMat
 * @extends Ext.Window
 */
Flw.wait.WinOfMat=Ext.extend(Ext.Window ,{
	title: '物资待入库列表',
	iconCls: 'form', layout: 'fit',
	closeAction: 'hide',
	width: 592, height: 280,
	modal: true, resizable: false,
	closable: true, border: false,
	maximizable: false, plain: true,
	field:null,//
	items:null,
	tbar:null,
	store:null,
	//获取物资Grid
	getMatgrid:function(){
		return this.items.get(0);
	},
	//获取物资store
	getMatStore:function(){
		return this.getMatgrid().getStore();
	},
	setField:function(f){
		this.field = f;
	},
	initComponent: function(){
		var _self = this;
		this.tbar = [{text: '选择', iconCls: 'save', handler: function(){
				var sm = _self.getMatgrid().getSelectionModel()
				if (sm.getSelected()){
					if(_self.field&&_self.field.setValue){
						_self.field.setValue(sm.getSelected().get('bh'));
					}
					_self.hide();
				} else {
					Ext.example.msg('提示', '请选择数据！');
				}
			}
		}];
		this.store = new Ext.data.Store({
			baseParams: {ac: 'list',bean: 'com.sgepit.pmis.wzgl.hbm.WzInput',business: 'baseMgm',method: 'findWhereOrderBy'},
			proxy: new Ext.data.HttpProxy({method: 'GET',url: MAIN_SERVLET}),
			reader: new Ext.data.JsonReader({
				root: 'topics',totalProperty: 'totalCount',id: 'uids'
			}, [
				{name: 'uids', type: 'string'},
				{name: 'bh', type: 'string'},
				{name: 'bm', type: 'string'},
				{name: 'pm', type: 'string'},
				{name: 'gg', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		});
		this.items=[{
			border: false,
			xtype:"grid",
			header: false,
			autoScroll: true,
			loadMask: true, stripeRows: true,
			viewConfig: {
				forceFit: true,
				ignoreAdd: true
			},
			viewConfig: {
				forceFit: true,
				ignoreAdd: true
			},
			ds:_self.store,
			cm: new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer({width: 20}), 
				{	id: 'uids',header: '主键',dataIndex: 'uids',hidden: true
				}, {id: 'bh',header: '入库编号',dataIndex: 'bh',width: .3
				}, {id: 'bm',header: '编码',dataIndex: 'bm',width: .3
				}, {id: 'pm',header: '品名',dataIndex: 'pm',width: .3
				}, {id: 'gg',header: '规格',dataIndex: 'gg',width: .6}
			]),
			bbar: new Ext.PagingToolbar({
	            pageSize: PAGE_SIZE,
	            store: _self.store,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        }),
	        listeners:{
	        	'beforerender':function(cmp){
	        		cmp.getStore().baseParams.params = " bill_type='计划入库' and bill_state ='N'"
					cmp.getStore().load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
	        	}
	        }
		}];
		Flw.wait.WinOfMat.superclass.initComponent.call(this);
	}
})
Ext.reg("matwindow",Flw.wait.WinOfMat);
/**
 * 其他保存过的接口数值
 * @class Flw.wait.WinOfSavedFace
 * @extends Ext.Window
 * 必须的参数：insid
 */
Flw.wait.WinOfSavedFace=Ext.extend(Ext.Window ,{
	title:"业务接口",
	width:400,
	height:250,
	modal: true, resizable: false,
	closable: true, border: false,
	maximizable: false, plain: true,
	field:null,
	layout:"fit",
	insid:window['_insid']?_insid:"",//必须参数
	initComponent: function(){
		var _self = this;
		this.tbar = ['->',{
			text: '选择', iconCls: 'save', handler: function(){
				var sm = _self.items.get(0).getSelectionModel()
				if (sm.getSelected()){
					if(_self.field&&_self.field.setValue){
						_self.field.setValue(sm.getSelected().get('val'));
					}
					_self.hide();
				} else {
					Ext.example.msg('提示', '请选择数据！');
				}
			}
		}];
		
		this.items=[{
			border: false,
			xtype:"grid",
			header: false,
			autoScroll: true,
			loadMask: true, stripeRows: true,
			enableColumnMove :false,
			enableColumnResize  :false,
			enableHdMenu :false,
			viewConfig: {
				forceFit: true,
				ignoreAdd: true
			},
			sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
			cm:new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer({
					width: 20
				}),{
					header:"参数中文名",
					resizable:true,
					sortable:false,
					dataIndex:"pcname",
					width:100
				},{
					header:"参数名",
					sortable:false,
					resizable:true,
					dataIndex:"pname",
					width:100
				},{
					header:"数值",
					sortable:false,
					resizable:true,
					dataIndex:"val",
					width:100
			}]),
			store: new Ext.data.SimpleStore({
	    		fields: [
		            {name: 'pcname', type: 'string'},
		            {name: 'pname', type: 'string'},
		            {name: 'val', type: 'string'}
		        ]
	    	})
		}];
		this.on('show',function(){
			this.loadData()
		})
		Flw.wait.WinOfSavedFace.superclass.initComponent.call(this);
	},
	loadData:function(){
		var savedFaceDS = this.items.get(0).getStore();
		var insid = this.insid?this.insid:"";
		var sql = "select t1.pcname,t1.pname,t3.paramvalues from flw_face_params t1,flw_node t2,flw_face_params_ins t3 " +
				  "where t1.faceid=t2.funid and t2.nodeid=t3.nodeid and t3.insid='"+insid+"'";
		savedFaceDS.removeAll();		  
		DWREngine.setAsync(false);
		baseMgm.getData(sql,function(list){
			var data = new Array();
			for(var i=0;i<list.length;i++){
				var pcname = list[i][0];
				var pname = list[i][1];
				var paramvalues = list[i][2];
				if(paramvalues.indexOf(pname)>-1){
					var kv = paramvalues.substring(paramvalues.indexOf(pname));
					if(kv.indexOf("`")>-1)
						kv = kv.substring(0,kv.indexOf("`"));
					var kvArr = kv.split(":");
					data.push([pcname,pname,kvArr[kvArr.length-2]]);
				}
			}
			savedFaceDS.loadData(data);	
		})
		DWREngine.setAsync(true);
	},
	setField:function(f){
		this.field = f;
	}
});
Ext.reg("savedfacewin",Flw.wait.WinOfSavedFace);