
var gridPanelTitle = "该概算分摊情况查看"

var fm = Ext.form;			
var fc = {		// 创建编辑域配置
	/*'bdgid': {
		name: 'bdgid',
		fieldLabel: '概算id ',
		anchor:'95%'
     },'conid': {
		name: 'conid',
		fieldLabel: '合同id',
		anchor:'95%'
     },*/
	'conno': {
		name: 'conno',
		fieldLabel: '合同编号',
		anchor:'95%'
     },
	'conname': {
		name: 'conname',
		fieldLabel: '合同名称',
		anchor:'95%'
     }, 'realmoney': {
		name: 'realmoney',
		fieldLabel: '合同分摊金额',
		anchor:'95%'
     }, 'bdgmoney': {
		name: 'bdgmoney',
		fieldLabel: '概算金额',
		anchor:'95%'
     }, 'bdgname': {
		name: 'bdgname',
		fieldLabel: '概算名称',
		anchor:'95%'
     },'money': {
		name: 'money',
		fieldLabel: '工程量分摊',
		anchor:'95%'
     },'factpay': {
		name: 'factpay',
		fieldLabel: '付款分摊',
		anchor:'95%'
     },'camoney': {
		name: 'camoney',
		fieldLabel: '变更分摊',
		anchor:'95%'
     },'appmoney': {
		name: 'appmoney',
		fieldLabel: '违约分摊',
		anchor:'95%'
     },'clamoney': {
		name: 'clamoney',
		fieldLabel: '索赔分摊',
		anchor:'95%'
     },'balmoney': {
		name: 'balmoney',
		fieldLabel: '结算分摊',
		anchor:'95%'
     }
}

//  定义记录集
var Columns = [
	{name: 'bdgid', type: 'string'},
	{name: 'conid', type: 'string'},
	{name: 'conno', type: 'string'},
	{name: 'conname', type: 'string'},
	{name: 'realmoney', type: 'float'},
	{name: 'bdgname', type: 'string'},
	{name: 'bdgmoney', type: 'float'},
	{name: 'money', type: 'float'},
	{name: 'factpay', type: 'float'},
	{name: 'camoney ', type: 'float'},
	{name: 'appmoney', type: 'float'},
	{name: 'clamoney', type: 'float'},
	{name: 'balmoney', type: 'float'}
];

// 创建列模型
var cm = new Ext.grid.ColumnModel([		
	new Ext.grid.RowNumberer(),
	/*{
       id:'bdgid',
       header: fc['bdgid'].fieldLabel,
       dataIndex: fc['bdgid'].name,
       width: 150
    },{
       id:'conid',
       header: fc['conid'].fieldLabel,
       dataIndex: fc['conid'].name,
       width: 150
    },*/{
       id:'conno',
       header: fc['conno'].fieldLabel,
       dataIndex: fc['conno'].name,
       width: 150
    },
	{
       id:'conname',
       header: fc['conname'].fieldLabel,
       dataIndex: fc['conname'].name,
       width: 150
    },{
       header: fc['realmoney'].fieldLabel,
       dataIndex: fc['realmoney'].name,
       align: 'right',
       renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['bdgmoney'].fieldLabel,
       dataIndex: fc['bdgmoney'].name,
       align: 'right',
       renderer: function(value){  
       	if(value!=="")
            return "<div id='bdgmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['bdgname'].fieldLabel,
       dataIndex: fc['bdgname'].name,
       width: 90
    },{
       header: fc['money'].fieldLabel,
       dataIndex: fc['money'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){  
       	if(value!=="")
	       return "<div id='money' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       width: 90
    },{
       header: fc['factpay'].fieldLabel,
       dataIndex: fc['factpay'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){  
       	if(value!=="")
	        return "<div id='factpay' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['camoney'].fieldLabel,
       dataIndex: fc['camoney'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){ 
       	if(value!==""&&typeof(value)!="undefined")
	       return "<div id='camoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['appmoney'].fieldLabel,
       dataIndex: fc['appmoney'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){ 
       	if(value!=="")
	       return "<div id='appmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['clamoney'].fieldLabel,
       dataIndex: fc['clamoney'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){   
       	if(value!=="")
            return "<div id='clamoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    },{
       header: fc['balmoney'].fieldLabel,
       dataIndex: fc['balmoney'].name,
       align: 'right',
       renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){    
       	if(value!=="")
           return "<div id='balmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
        },
       //renderer: cnMoneyToPrec,
       width: 90
    }
]);


// 4. 创建数据源
var ds = new Ext.data.SimpleStore({
    fields: Columns 
    //data: datas
});

var grid = new Ext.grid.GridPanel({
    store: ds,
    cm: cm,
    header: false,
    viewConfig: {
        forceFit: true
    },
   // tbar: ['<font color=#15428b><b>&nbsp;'+ gridPanelTitle+'</b></font>'],
    width:800,
    height:300,
    iconCls: 'icon-show-all',
    border: false,
    region: 'center'
});
    





