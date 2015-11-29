//#7B68EE,#32CD32
var FLW_NODE = function(name, person, bgColor, isCurrent){
	this.name = name ? name : '未定义';
	this.person = person ? person : '空值';
	this.bgColor = bgColor ? bgColor : '#7B68EE';
	this.isCurrent = isCurrent ? 'red' : 'black';
	this.attributes = new Array();
	this.init();
}

FLW_NODE.prototype = {
	init : function(){
		this.attributes['top']=0;				//上连接线
		this.attributes['right']=0;				//右连接线
		this.attributes['bottom']=0;			//下连接线
		this.attributes['left']=0;				//左连接线
		this.attributes['top_left']=0;			//上左边线
		this.attributes['top_right']=0;			//上右边线
		this.attributes['right_top']=0;			//右上边线
		this.attributes['right_bottom']=0;		//右下边线
		this.attributes['bottom_left']=0;		//下左边线
		this.attributes['bottom_right']=0;		//下右边线
		this.attributes['left_top']=0;			//左上边线
		this.attributes['left_bottom']=0;		//左下边线
	},
	
	setAttribute : function(_pos, _px){
		this.attributes[_pos]=_px;
	},
	
	getAttribute : function(_pos){
		return this.attributes[_pos];
	},
	
	getHTML : function(){
		var outStr = '';
			outStr += '<TABLE border="1" cellspacing="0" cellpadding="0" borderColor="white">';
			outStr += '<TR>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-top-width: '+this.attributes['top_left']+'px; border-left-width: '+this.attributes['left_top']+'px;">&nbsp;</TD>';
			outStr += '<TD colspan="2" style="border-width: 0px; border-color: black; width=20px; border-right-width: '+this.attributes['top']+'px; border-top-width: '+this.attributes['top_left']+'">&nbsp;</TD>';
			outStr += '<TD colspan="2" style="border-width: 0px; border-color: black; width=20px; border-top-width: '+this.attributes['top_right']+'px;">&nbsp;</TD>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-top-width: '+this.attributes['top_right']+'px; border-right-width: '+this.attributes['right_top']+'px;">&nbsp;</TD>';
			outStr += '</TR>';
			outStr += '<TR>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-bottom-width: '+this.attributes['left']+'px; border-left-width: '+this.attributes['left_top']+'px;">&nbsp;</TD>';
			outStr += '<TD colspan="4" rowspan="2" style="border-color: '+this.isCurrent+'; border-width: 3px; border-style: double; padding: 5px 5px; font-size: 12px; text-align: center; background-color: '+this.bgColor+'">'+this.name+'<br>'+this.person+'</TD>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-bottom-width: '+this.attributes['right']+'px; border-right-width: '+this.attributes['right_top']+'px;">&nbsp;</TD>';
			outStr += '</TR>';
			outStr += '<TR>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-left-width: '+this.attributes['left_bottom']+'px;">&nbsp;</TD>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-right-width: '+this.attributes['right_bottom']+'px;">&nbsp;</TD>';
			outStr += '</TR>';
			outStr += '<TR>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-bottom-width: '+this.attributes['bottom_left']+'px; border-left-width: '+this.attributes['left_bottom']+'px;">&nbsp;</TD>';
			outStr += '<TD colspan="2" style="border-width: 0px; border-color: black; width=20px; border-right-width: '+this.attributes['bottom']+'px; border-bottom-width: '+this.attributes['bottom_left']+'px;">&nbsp;</TD>';
			outStr += '<TD colspan="2" style="border-width: 0px; border-color: black; width=20px; border-bottom-width: '+this.attributes['bottom_right']+'px;">&nbsp;</TD>';
			outStr += '<TD style="border-width: 0px; border-color: black; width=20px; border-right-width: '+this.attributes['right_bottom']+'px; border-bottom-width: '+this.attributes['bottom_right']+'px;">&nbsp;</TD>';
			outStr += '</TR>';
			outStr += '</TABLE>';
		return outStr;
	}
};