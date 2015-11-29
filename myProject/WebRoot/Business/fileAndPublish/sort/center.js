var centerPanel
Ext.onReady(function(){
    sortBhField = new Ext.form.TextField({
        allowBlank: false,
        id : 'sortBh',
        fieldLabel: '分类编号<font color="red">*</font>',
        //size: 500,
        maxLength:500,
        maxLengthText :"输入不能多于100个字符",
        validator: textValidator,
        anchor: '95%'
    });
    sortNameField = new Ext.form.TextField({
        allowBlank: false,      
        id : 'sortName',
        fieldLabel: '分类名称<font color="red">*</font>',
        //size: 500,
        maxLength:500,
        maxLengthText :"输入不能多于100个字符",
        validator: textValidator,
        anchor: '95%'
    });
    
    parentNodeField = new Ext.form.TextField({
        allowBlank: true,
        disabled : true,
        id : 'parentNodeName',
        fieldLabel: '上层分类名称',
        //size: 500,
        maxLength:500,
        maxLengthText :"输入不能多于100个字符",
        validator: textValidator,
        anchor: '95%'
    });
    
    sortPathField = new Ext.form.TextField({
        allowBlank: true,
        disabled : true,
        id : 'sortPath',
        fieldLabel: '完整路径',
        //size: 500,
        maxLength:500,
        maxLengthText :"输入不能多于100个字符",
        validator: textValidator,
        anchor: '95%'
    });
    
    //隐藏域，传递parentid
    //?method=updateNode&uids='+selectNode.id+"&sortBh="+encodeURIComponent(data.sortBh)+"&sortName="+encodeURIComponent(data.sortName));

    //pid
			pidField = new Ext.form.Hidden({
				fieldLabel : 'pid',
				name : 'pid',
				id : 'pid',
				value : CURRENTAPPID
			});
    
    var idField = new Ext.form.Hidden({
        id : 'uids-field',
        name : 'uids'
    });
    
    //如果是下发分类的接受端，不能编辑分类
    var disableBtn = ModuleLVL != '1' ||  (isSortIssue == '1' && DEPLOY_UNITTYPE == 'A' ) ;
    
    
    sortPropertyForm = new Ext.FormPanel({
        id: 'sortProperty_Form',
        title: '分类属性',
        height:250,
        frame:true,
        //region: 'center',
        bodyBorder: true,
        border: true,
        bodyStyle:'padding:5px 5px 5px 5px',
        layout: 'form',
        buttons:[{ 
                text:'保存',
                handler: infoSaveFun,
                disabled : disableBtn
            }] 
    });
    sortPropertyForm.add(sortPathField,parentNodeField,sortBhField,sortNameField);
    sortPropertyForm.add(idField, pidField);
    
    var savable = !disableBtn;
    fileUploadUrl = CONTEXT_PATH+"/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPTemplate&editable="+savable+"&businessId=";    
    filePanel = new Ext.Panel({
       border: true,
       //region: fileRegion,
       //height:'60%',
       height: 430,
       title:"模板",
       html: "<iframe name='fileFrame' src='' frameborder=0 style='width:100%;height:100%;'></iframe>"
    });
    
    centerPanel = new Ext.Panel({
        region:'center',
        width : "50%",
        //layout : 'border',
        //layout:"column",
        items : [sortPropertyForm,filePanel]
    })
    
    function infoSaveFun(){
        var form = sortPropertyForm.getForm();
        
        
            var data = form.getValues();
            idField.setValue(selectNode.id);
            //alert(CONTEXT_PATH + '/servlet/ComFileSortServlet?method=updateNode&uids='+selectNode.id+"&sortBh="+data.sortBh+"&sortName="+encodeURIComponent(data.sortName));
            form.submit({
                waitMsg: '保存中......',
                method : 'POST',
                url : CONTEXT_PATH + '/servlet/ComFileSortServlet?method=updateNode',
                success : function(response) {
                    
                    selectNode.text = data.sortName
                    selectNode.attributes.desc = data.sortBh;
                    if (isSortIssue){
                     ComFileSortDWR.setSyncStatus(g_rootId, false, function(retVal){
                  	  rootNode.reload(); 
                    });
                    }
                    else{
                    	 rootNode.reload(); 
                    }
                   
                                     
                },
                failure : function(response) {
                    Ext.MessageBox.alert("提示",response.responseText)
                }
            });
        
    }
})

//标题的页面验证
function textValidator(val){
    /*if(val.indexOf("'")>-1 || val.indexOf('"')>-1) {
        return "输入带有 ' \" 等特殊字符，请重新输入！";
    } else {
        return true;
    }*/
    
    var strHTML=/'|"|\<.|\>.$/ 
    if(strHTML.test(val)){
        return "不能包含HTML字符或者' \"等特殊字符，请重新输入";
    }  else{
        return true
    }   
}

