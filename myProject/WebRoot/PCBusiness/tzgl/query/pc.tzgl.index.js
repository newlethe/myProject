if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

//var _reg=/,/g    //正则表达式
//var sqlPid=USERPIDS.replace(_reg,"','");
//	sqlPid="('"+sqlPid+"')";
var edit_sjType=new Date().format("Ym");
var edit_sjtypeOn = edit_sjType-1;
var edit_unitid=USERBELONGUNITID;
var edit_prjName="%";
var sqlPid="unitid"+SPLITB+edit_unitid+SPLITA+"sjType"+SPLITB+edit_sjtypeOn+SPLITA+"type"+SPLITB+USERBELONGUNITTYPEID
Ext.onReady(function (){
    var projDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "",				
	    	business: "PCTzglServiceImpl",
	    	method: "indexOfTzglCount",
	    	params:sqlPid
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "pid"
        }, [
        	{name: 'pid', type: 'string'},
        	{name: 'pname', type: 'string'},
        	{name: 'zTouz', type: 'float'},
        	{name: 'nJihTouz', type: 'float'},
        	{name: 'yWancTouz', type: 'float'},
        	{name: 'nLjWcTouz', type: 'float'},
        	{name: 'ljWcTouz', type: 'float'},
        	{name: 'completeMoney', type: 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	
	var _columns = [{
           header: "总投资",
           dataIndex: "zTouz",
           width: 120,
           align:"right",
           renderer:function(v){
           		//return (v/10000).toFixed(2);
                return v
          	}
        },{
           header: "本年度投资计划",
           dataIndex: "nJihTouz",
           width: 120,
           align:"right",
           renderer:function(v,meta,rec){
           		var url = "PCBusiness/tzgl/query/pc.tzgl.yearInvest.report.jsp?sj="+edit_sjType.substring(0,4)
           		var pid = rec.get('pid');
           		var pname = rec.get('pname');
           		return "<a href='javascript:void(0)' onclick='dolink(\""+url+"\",\""+pid+"\",\""+pname+"\")'>"+v+"</a>";
          	}
        },{
        	header:'本月投资<br/>计划完成',
        	dataIndex: "yWancTouz",
        	width: 110,
        	align:"right",
        	renderer:function(v,meta,rec){
           		var url = "PCBusiness/tzgl/query/pc.tzgl.monthInvest.report.jsp?sj="+rec.get('sjType')
           		var pid = rec.get('pid');
           		var pname = rec.get('pname');
           		return "<a href='javascript:void(0)' onclick='dolink(\""+url+"\",\""+pid+"\",\""+pname+"\")'>"+(v).toFixed(2)+"</a>";
          	}
        },{
        	header:'本年累计<br/>投资完成',
        	dataIndex: "nLjWcTouz",
        	width: 120,
        	align:"right",
        	renderer:function(v,meta,rec){
        		return (v).toFixed(2);
			}
        },{
        	header:'本年投资<br/>完成百分比',
        	width: 90,
        	dataIndex: "count4",
        	align:"right",
        	renderer: function(value, metadata, record, rowIndex,
						colIndex, store){
				var nLjWcTouz = record.data.nLjWcTouz;
				var nJihTouz = record.data.nJihTouz;
				if(nJihTouz && nLjWcTouz) return (((nLjWcTouz/nJihTouz)*100).toFixed(2))+"%";	
				else return 0;		
			}
        },{
        	header:'累计投资</br>完成',
        	dataIndex: "ljWcTouz",
        	width: 110,
        	align:"right",
        	renderer:function(v,meta,rec){
           		return v.toFixed(2);
			}
        },{
        	header:'累计投资<br/>完成百分比',
        	dataIndex: "ljWcTouz",
        	width: 80,
        	align:"right",
        	renderer: function(value, metadata, record, rowIndex,
						colIndex, store){
				var ljWcTouz = record.data.ljWcTouz;
				//var zTouz = record.data.zTouz/10000;
				var zTouz = record.data.zTouz;
				if(zTouz && ljWcTouz)return (((ljWcTouz/zTouz)*100).toFixed(2))+"%";	
				else return 0;		
			}
        },{
        	header:'施工投资<br/>完成金额',
        	dataIndex: "completeMoney",
        	width: 110,
        	align:"right",
        	renderer:function(v,meta,rec){
           		return v.toFixed(2);
          	}
        },{
        	header:'施工投资完成',
        	dataIndex: "complete",
        	width: 100,
        	align:"center",
        	renderer:function(v,meta,rec){
           		var url = "Business/planMgm/qantitiesComp/gcl.tz.comp.jsp";
           		var pid = rec.get('pid');
           		var pname = rec.get('pname');
           		return "<a href='javascript:void(0)' onclick='dolink(\""+url+"\",\""+pid+"\",\""+pname+"\")' style='color:blue;'>查看</a>";
          	}
        }]
	
	
	var currDate = new Date();
	var dataSZ = currDate.setMonth(currDate.getMonth()-1);//改变当前月为上一月
	var currMonth = (currDate.getMonth()+101+"").substring(1);
	var curSjType = currDate.getFullYear() +(currMonth);
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: getYearMonthBySjType(null,null)
	});
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store :dsCombo_yearMonth,
				valueField : 'k',
				displayField : 'v',
				emptyText:"默认当前年月",
				editable:false,
				value : curSjType,
				width : 100,
				listeners:{
	       			'select':function(combo,record){
	       				edit_sjType=record.get("k");
	       				projDS.baseParams.params="unitid"+SPLITB+edit_unitid+SPLITA+
	       										 "sjType"+SPLITB+edit_sjType+SPLITA+
	       										 "prjName"+SPLITB+edit_prjName+SPLITA+
	       										 "type"+SPLITB+USERBELONGUNITTYPEID;
	       				projDS.reload();
	       			}
	       		}
			});

	var queryBtn = new Ext.Button({
		text : '多项目汇总查询 ',
		id : 'multiQuery',
		handler : function(){
			var sj = yearMonthCombo.getValue();
			parent.frames["contentFrame"].location.href = BASE_PATH + "PCBusiness/tzgl/query/pc.tzgl.comp.report.jsp?sj="+sj
		}
	});

	var p = new PC.ProjectStatisGrid({
		tbar:["年月：&nbsp;&nbsp;",yearMonthCombo, '-', queryBtn, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"],
		prjRenderer:function(value,meta,record,store){
			var pid=record.get('pid');
			var pname=record.get('prjName');
			meta.attr = "title='"+value+"'";
			return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>";
		},
		ds:projDS,
		columns:_columns,
		//autoExpandColumn: 1,
		viewConfig:{forceFit:false},
		searchHandler:function(store,unitid,projName){
			var sql="";
			if(unitid !=""){
				edit_unitid=unitid;
				sql+="unitid"+SPLITB+edit_unitid;
			}
			if(projName !=""){
				edit_prjName=projName;
				sql+=SPLITA+"prjName"+SPLITB+edit_prjName;
			}
			sql+=SPLITA+"sjType"+SPLITB+edit_sjtypeOn+SPLITA+"type"+SPLITB+USERBELONGUNITTYPEID;
			store.baseParams.params=sql;
			store.load();
		}
	})
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
	
	p.getColumnModel().setHidden(3, true);              //隐藏产业类型字段  
	p.getColumnModel().setHidden(5, true);              //隐藏投资规模字段  
	p.getColumnModel().setHidden(6, true);             //隐藏建设性质字段
	p.getColumnModel().setHidden(7, true);             //隐藏项目负责人字段
	p.getColumnModel().setHidden(10, true);			   //隐藏本月投资计划完成	
	projDS.load();
});

function projDetail(pid,accidentType){
	if(pid){
		var pname="";
		DWREngine.setAsync(false);
			var bean="com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo";
			baseDao.findByWhere2(bean, "pid='"+pid+"'",function(list){
				if(list.length>0){
					pname=list[0].prjName;
				}
			});
		switchoverProj(pid,pname);
		DWREngine.setAsync(true);
		parent.lt.expand();
		parent.frames["contentFrame"].location.href =CONTEXT_PATH+'/PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.jsp?isQuery=true&edit_accidentType='+accidentType;
	}
}

function dolink(url,pid,pname){
	if(switchoverProj(pid,pname)){
		top.frames["contentFrame"].location.href = CONTEXT_PATH+'/'+url;
		try{
			top.backToSubSystemBtn.show()
		}catch(ex){}
	}
}
