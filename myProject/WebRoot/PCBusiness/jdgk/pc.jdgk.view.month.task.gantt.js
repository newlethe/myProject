
var ProjectUID;
var dataProject;

function loadProject(){
    //Edo.MessageBox.loading("加载项目数据");
    //从服务端加载甘特图数据,填充进gantt对象
    ProjectService.get(
        {
            project: ProjectUID    //传递一个项目ID(数据库内已保存的!!!)
        },  
        function(data){
            dataProject = new Edo.data.DataProject(data);
            
            dataProject.set('plugins', [
                new Edo.project.EdoProject()                       
            ]);
            project.set('data', dataProject);    
            //Edo.MessageBox.hide();
            
            //初始化时设置combo默认值
            monthFilter(monthCombo.getValue(),filterCombo.getValue());
            selectView(viewMode.getValue());
        }, 
        function(msg, err){            
            //if(msg="null"){Edo.MessageBox.alert('提示','下面没有信息')}
            //Edo.MessageBox.hide();
        }
    );
}


//根据月份过滤显示任务
function monthFilter(date,query){
	if(typeof(monthCombo) !== 'undefined'){
		if(date == null)
			date = (new Date()).format('Ym');
		if(query == null)
			query = 'all';
		monthCombo.setValue(date);
		filterCombo.setValue(query);
		//设置过滤条件		
		if(typeof(dataProject) !== 'undefined'){
		    dataProject.Tasks.filter(function(o){
			    var s = o.Start;
			    var f = o.Finish;
			    var b = o.Baseline;
			    var _base = false;
			    if(b != null && b.length > 0){
				    var b_s = b[0].Start;
				    var b_f = b[0].Finish;
			   		_base = b_s.getFullYear() == date.substr(0,4) && ((b_s.getMonth()+1) <= date.substr(4,6) && (b_f.getMonth()+1) >= date.substr(4,6));
			    }
			   	var _start = s.getFullYear() == date.substr(0,4) && ((s.getMonth()+1) <= date.substr(4,6) && (f.getMonth()+1) >= date.substr(4,6));
			   	if(query == 'all'){
			    	return _start || _base;
			    }else if(query == 'li'){
			    	return (_start || _base) && o.OutlineNumber.length==1;
			    }else if(query == '2'){
			    	return (_start || _base) && ((o.OutlineNumber.length==1)||(o.OutlineNumber.length==3));
			    }
			});
		}
	}
}

//选择任务级别“里程碑”或“一级网络”
function selectPlan(plan){
	if(typeof(taskLevel) !== 'undefined'){
		if(plan == null)
			plan = "li";
		
		taskLevel.setValue(plan);
		DWREngine.setAsync(false);
		pcJdgkMgm.isHaveProjectPlan(CURRENTAPPID,plan,function(str){
			ProjectUID = str
		})
		DWREngine.setAsync(true);
		loadProject();
	}
}

//选择查看视图
function selectView(view){
	if(typeof(viewMode) !== 'undefined'){
		if(view == null)
			view = 'all';
		viewMode.setValue(view);
		if(view=="all"){
		 	project.gantt.parent.set('visible', true);
			project.tree.parent.set('visible', true);
		}else if(view=="tree"){
			project.gantt.parent.set('visible', false);
			project.tree.parent.set('visible', true);
		}else if(view=="gantt"){
		    project.gantt.parent.set('visible', true);
			project.tree.parent.set('visible', false);
		}
	}
}

//显示月度combox数据
function monthList(){
	var date = new Date();
	var thisYear = date.getFullYear();
	var thisMonth = date.getMonth()+1;
	var listArr = new Array();
	for(var y = thisYear; y >= thisYear - 2; y--){
		for(var m = (y == thisYear ? thisMonth : 12); m >= 1; m--){
			m = m < 10 ? "0"+m : m;
			var monthListObj = {id:'',name:''};
			monthListObj.id = y+""+m;
			monthListObj.name = y+"年"+m+"月";
			listArr.push(monthListObj);
		}
	}
	return listArr;
}

//导出计划
function downloadProject(o, success, fail){
    //Edo.MessageBox.saveing('下载', '正在下载项目文件,请稍等...');

    o.method = 'savefile';
    o.filetype = o.filetype || 'mpp';    
    
    Edo.util.Ajax.request({        
        type: 'post',
        url: BASE_PATH+'gantt/EdoService/EdoProject.jsp',
        params: o,
        onSuccess: function(text){        
            location = BASE_PATH+"gantt/EdoService/EdoProject.jsp?method=download&file="+text;
            //Edo.MessageBox.hide();
        },
        onFail: function(code){
            alert("导出失败:"+code);
            //Edo.MessageBox.hide();
        }
    });
}


Edo.util.Dom.on(window, 'domload', function(){
	Edo.create({    //工具栏
		id: 'box',
		type: 'box',
		render: document.body,
		children: [
			{
				type: 'group',
				cls: 'e-toolbar',
				horizontalGap: 0,
				width: '100%',
				verticalAlign: 'bottom',
				layout: 'horizontal',
				children: [
					{ 
						type:'label',
						text:'&nbsp;月度：'
					},{
				     	id : 'monthCombo',
						type : 'combo',
				     	readOnly: true,
						valueField: 'id', 
						displayField: 'name',
				     	popupHeight : 210,
				     	onselectionchange : function(e){
							var date = this.getValue();
				    	 	var query = filterCombo.getValue();	
							monthFilter(date,query);
						},
						data: monthList()
				     },{ 
				     	type:'label',
				     	text:'&nbsp;任务级别：'
				     },{
				     	id : 'taskLevel',
				    	type : 'combo',
				     	//type : 'multicombo',
				     	readOnly: true,
				     	valueField: 'id', 
						displayField: 'name',
				     	popupHeight : 50,
				     	onselectionchange: function(e){
							selectPlan(this.getValue());
						},
						data: [
						    {id:'li',name: '里程碑'},
						    {id:'yi',name: '一级网络计划'}
						]
				     },{ 
				     	type:'label',
				     	text:'&nbsp;视图查看：'
				     },{
				     	id : 'viewMode',
				    	type: 'combo',
				     	readOnly: true,
				     	valueField: 'id', 
						displayField: 'name',
				     	popupHeight : 70,
						onselectionchange: function(e){
							selectView(this.getValue());
						},
						data: [
						    {id:'all',name: '显示全部'},
						    {id:'tree',name: '显示任务树'},
						    {id:'gantt',name: '显示Gantt图'}
						]
				     },{
				     	type:'label',
				     	text:'&nbsp;过滤查询：'
				     },{
				    	id : 'filterCombo',
				     	type: 'combo',
				     	readOnly: true,
				     	valueField: 'id', 
						displayField: 'name',
				     	popupHeight : 70,
						onselectionchange: function(e){
				    	 	var date = monthCombo.getValue()
				    	 	var query = this.getValue();	
							monthFilter(date,query);
						},
						data: [
						    {id:'all',name: '全部'},
						    {id:'li',name: '里程牌节点'},
						    {id:'2',name: '二层任务'}
						]
				     },{
				    	type : 'button',
				    	icon : 'e-icon-download',
				    	text : '导出计划文件',
				    	onclick : function(e){
				    		downloadProject({
                                filetype: 'xml',
                                project: project.data.toJson()
                            });
				    	}
					}
                ]
            }
        ]
    });                                        
    
    
    //创建甘特图组件对象
    Edo.create({
        id: 'project',
        type: 'project',
        readOnly: true,
        render: document.body
    });
    
	project.gantt.set('visible', true); 			//默认只是显示任务树，不显示条形图
	project.gantt.set('dateView', 'month-week');    //设置默认为月/周日期模式		(右键：日期->月/周)
	project.gantt.set('progressLineVisible',true);	//设置默认显示进度线
	project.gantt.set('viewMode', 'track');			//设置跟踪甘特图显示模式  		(右键：视图->跟踪甘特图)
	//project.gantt.set('viewMode', 'gantt');		//设置甘特图显示模式 			(右键：视图->甘特图)
	//project.gantt.set('baselineIndex', 0);		//设置甘特图的baselineIndex，这个属性也可以不显示设置，默认为0：

	//使project可拖拽调节尺寸
	Edo.managers.ResizeManager.reg({target: project});
	//初始化 自定义的combo，
  	monthFilter();
    selectPlan();
    selectView();


    var columns = project.tree.groupColumns;
    //修改任务窗口标题栏
    columns[0].header = "月进度任务分析";
    //新增列
	columns[0].columns.insert(5, {
	    header: '计划开始时间',
	    headerAlign : "center",
	    align : "center",
	    width : 90,
	    dataIndex: 'Baseline'
	});
	
	project.tree.columns[2].width=300;
	
    project.tree.set('columns', columns);
    project.tree.columns[5].renderer=function(v){
    	if(typeof(v)!='undefined')
    	return v[0].Start.format('Y-m-d');
    }
    
	columns[0].columns.insert(6, {
	    header: '计划完成时间',
	    headerAlign : "center",
	    align : "center",
	    width : 90,
	    dataIndex: 'Baseline'    
	});
	if(DEPLOY_UNITTYPE == "0"){
		columns[0].columns.removeAt(9);//屏蔽前置任务字段
		columns[0].columns.removeAt(9);//屏蔽资源名称字段
	}
	project.tree.set('columns', columns);
    project.tree.columns[6].renderer=function(v){
   	 if(typeof(v)!='undefined')
    	return v[0].Finish.format('Y-m-d');
    }


  	//1)获得状态列
    var columnName = project.tree.groupColumns[0].columns[2];
    //2)保留状态列原有的渲染器函数
    var fn = columnName.renderer;
    //3)给状态列增加新的渲染器
    columnName.renderer = function(v, r){
		//4)使用原有的渲染器, 得到一个HTML字符串
		var html = fn.apply(null, arguments);
		//Critical为1则是关键路径
		if(r.Critical == '1'){
			html = "<span style='color:#f00;'>"+html+"</span>"
		}
		return html;
	}
	
	//重新渲染第一列样式
    var columnId = project.tree.groupColumns[0].columns[0];
    columnId.renderer = function(v, r){
		columnId.style = "cursor:default;";
    	return v;
    }
    
	
    //对右键菜单的控制
    //右键方法 edo.js line:6922
    var menu = project.getMenu();
	menu.getChildAt(1).set('visible',false);	//隐藏分割线
   	menu.getChildAt(2).set('visible',false);	//升级
   	menu.getChildAt(3).set('visible',false);	//降级
   	menu.getChildAt(4).set('visible',false);	//隐藏分割线
   	menu.getChildAt(5).set('visible',false);	//新增任务
   	menu.getChildAt(6).set('visible',false);	//修改任务
   	menu.getChildAt(7).set('visible',false);	//删除任务
   	//menu.getChildAt(9).set('visible',false);	//跟踪
    
    

	//将甘特图撑满页面
	function onWindowResize(){    
	    var size = Edo.util.Dom.getViewSize(document);
	    project.set({
	        width: size.width,
	        height: size.height-40
	    });
	    box.set({
			width: size.width
		})
	}
	Edo.util.Dom.on(window, 'resize', onWindowResize);
	onWindowResize();    
});
