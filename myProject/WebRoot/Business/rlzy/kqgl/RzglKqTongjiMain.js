var pid = CURRENTAPPID;
var xgridParam = new Object() ;
var filter = " 1=1" ;
if(powerLevel == 'geren'){
	filter = " 1=1 and userid='"+USERID+"'";
}
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('考勤统计查询');
	a.setWidth('0');
	a.attachURL(CONTEXT_PATH+'/Business/rlzy/kqgl/RzglKqTongjiQuery.jsp');
	
	var queryToolbar = a.attachToolbar();
	var y = (new Date()).getYear();
	var tbar = [{type:"label",text:"年度:"},
	 			{type:"combo",id:"year",
	 				name:'year',width:"80",
	 				data:[[y-5,y-5+'年'],[y-4,y-4+'年'],[y-3,y-3+'年'],[y-2,y-2+'年'],[y-1,y-1+'年'],[y,y+'年'],[y+1,y+1+'年'],[y+1,y+1+'年'],[y+2,y+2+'年'],[y+3,y+3+'年'],[y+4,y+4+'年']]
	 			},
	 			{type:"label",text:"月份:"},
				{type:"combo",id:"month",
					name:'month',width:"60",
					data:[['01','1月'],['02','2月'],['03','3月'],['04','4月'],['05','5月'],['06','6月'],['07','7月'],['08','8月'],['09','9月'],['10','10月'],['11','11月'],['12','12月']]
				},
				{type:"button",id:"query",text:"查询"}
			    ];
	queryToolbar.render(tbar);
	queryToolbar.getCombo("year").selectOption(5);
	queryToolbar.getCombo("month").selectOption((new Date()).getMonth());
	
	
	//调用xgrid页面
	xgridParam.widths = "80,80,60,60,60,60,60,60,60,60,60,60,60,60,60,60" ;
	xgridParam.filter = filter;
	xgridParam.powerLevel = powerLevel;
	xgridParam.queryToolbar = queryToolbar;
}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器