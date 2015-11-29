Ext.onReady(function(){
    var dataArr = new Array();
    DWREngine.setAsync(false);  
    var sql = "SELECT c.module_name,c.module_name FROM property_code c " +
            "WHERE c.type_name = (SELECT t.uids FROM property_type t " +
            "WHERE t.type_name='数据交互表')  GROUP BY C.MODULE_NAME";
    baseDao.getData(sql,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);      
            dataArr.push(temp);         
        }
    });
    DWREngine.setAsync(true);  
    var dsData = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: dataArr
    });
    
    var modelCombo = new Ext.form.ComboBox({
        store : dsData,
        readOnly : true,
        displayField : 'v',
        valueField : 'k',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        emptyText : '选择模块名称',
        selectOnFocus : true
    });
    
    //启动进度条
    function progressstart() {
        Ext.MessageBox.show({
              width: 240,
              progress: true,
              closable: false
         })
         Ext.MessageBox.wait('数据量较大时耗时较长，请稍等片刻...', '数据交互进行中，请稍等！', {
            interval : 30,
            increment : 100,
            duration : 200000,
            fn : function() {
                hideprogress();
                alert("加载超时，请重新加载！")
            }
        });
     }
     
    //隐藏进度条
    function hideprogress()  {
        if(Ext.MessageBox)  Ext.MessageBox.hide()
    }
    
    var exchangeBtn = new Ext.Button({
        id : 'exchange',
        text : '历史数据交互',
        iconCls:'btn',
        handler : function(){
            var model = modelCombo.getValue();
            if(model == ''){
                Ext.example.msg("提示", '请选择需要交互的模块！');
                return;
            }
            Ext.MessageBox.confirm('提示', '此功能自动将业务数据加入数据交互队列，进行定时交互，' +
                    '<br>同时可在系统管理查看队列信息。<br>是否开始？', function(text){
                if(text == "yes"){
                    progressstart();
                    //DWREngine.setAsync(false);
                    conoveMgm.doHistoryDataExchange(model,CURRENTAPPID,function(str){
                        hideprogress();
                        if(str == "0"){
                            Ext.example.msg("提示", '数据交互完成！');
                            dataExchangeUrl.location.reload();
                        }else if(str == "2"){
                            Ext.example.msg("提示", '模块名称错误！');
                        }else if(str == "3"){
                            Ext.example.msg("提示", '没有需要交互的数据！');
                        }else if(str == "4"){
                            Ext.example.msg("提示", '数据交互的后台异常，请查看控制台！');
                        }else{
                            Ext.example.msg("提示", '数据交互失败！');
                        }
                    });
                    //DWREngine.setAsync(true);
                }
            });
        }
    });
    
    
    var viewport = new Ext.Viewport({
		layout : 'border',
		border : false,
		items : [{
			border : false,
			autoScroll : true,
            height : 80,
			region : 'north',
			bodyStyle : 'padding:5px 10px;font:12px/20px "宋体";',
			html : '<div style="color:red;">数据交互前，请在属性代码“数据交互表”中，进行对应表和类的配置（属性代码：表名，属性值：实体类名，模块：模块名称）！<br>'
					+ '交互前输入对应模块名称，按模块将数据生成队列，方便数据管理和查看！交互成功后，将生成对应队列信息！</div>',
			tbar : new Ext.Toolbar({
				items : ['模块名称：', modelCombo, exchangeBtn]
			})
		}, {
			region : 'center',
			border : false,
            title : '待发送队列',
			split : true,
			html:"<iframe id='dataExchangeUrl' src='"+BASE_PATH+"/jsp/dataexchange/pd.pre.send.data.jsp' width='100%' height='100%' frameborder='0'></iframe>"
		}]
	});
    
    
    /*
	 * Ext.MessageBox.confirm('提示', '开始进行合同附件数据交互？', function(text){ if(text ==
	 * "yes"){ Ext.MessageBox.confirm('提示',
	 * '此功能自动将附件信息加入数据交互队列，同步的数据不包含大对象，是否开始？', function(text){ if(text ==
	 * "yes"){ Ext.getBody().mask("数据交互进行中，请稍等！"); DWREngine.setAsync(false);
	 * conoveMgm.conOveFileDataExchange(CURRENTAPPID,function(str){ if(str ==
	 * "0"){ Ext.getBody().unmask(); alert('数据交互完成'); } });
	 * DWREngine.setAsync(true); } }); } });
	 */
});