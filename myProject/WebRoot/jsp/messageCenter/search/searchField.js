Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    initComponent : function(){
                Ext.app.SearchField.superclass.initComponent.call(this);
                this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },


    onTrigger1Click : function(){
        if(this.hasSearch){
                        this.el.dom.value = '';
            this.triggers[0].hide();
            this.hasSearch = false;
                        this.focus();
        }
    },

    emptyText: '输入关键字进行搜索'
});
