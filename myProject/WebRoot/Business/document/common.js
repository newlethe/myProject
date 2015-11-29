/**
 * 统一处理资料数量单位问题  [[1,'碟'],[2,'张'],[3,'页'],[4,'套'],[5,'份'],[6,'卷']]
 * qiupy  2014-03-12
 */
var bookNumUnitArr = new Array();
var bookNumUnitCombo,bookNumUnitStore;
Ext.onReady(function() {
	DWREngine.setAsync(false);
	appMgm.getCodeValue('资料数量单位', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bookNumUnitArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	bookNumUnitStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bookNumUnitArr
			});
	bookNumUnitCombo = new Ext.form.ComboBox({
				name: 'book',
				fieldLabel: '单位',
				allowBlank : false,
				emptyText : '请选择...',
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            triggerAction: 'all',
				store : bookNumUnitStore,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
});
function bookNumUnitRender(v,m,r) {
	for(var i = 0;i<bookNumUnitArr.length;i++){
		if(v == bookNumUnitArr[i][0]){
			return bookNumUnitArr[i][1];
		}
	}
}