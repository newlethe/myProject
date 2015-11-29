Ext.ux.PagingToolbar = Ext.extend(Ext.PagingToolbar, {
	maxSize:500,
    onRender : function(ct, position){
        Ext.PagingToolbar.superclass.onRender.call(this, ct, position);
        this.maxSize = (this.maxSize>1000)?1000:this.maxSize;
        this.first = this.addButton({
            tooltip: this.firstText,
            iconCls: "x-tbar-page-first",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["first"])
        });
        this.prev = this.addButton({
            tooltip: this.prevText,
            iconCls: "x-tbar-page-prev",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["prev"])
        });
        this.addSeparator();
        this.add(this.beforePageText);
        this.field = Ext.get(this.addDom({
           tag: "input",
           type: "text",
           size: "3",
           value: "1",
           style:"text-align:center",
           cls: "x-tbar-page-number"
        }).el);
        this.field.on("keydown", this.onPagingKeydown, this);
        this.field.on("focus", function(){this.dom.select();});
        this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
        this.field.setHeight(18);
        this.addSeparator();
        this.next = this.addButton({
            tooltip: this.nextText,
            iconCls: "x-tbar-page-next",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["next"])
        });
        this.last = this.addButton({
            tooltip: this.lastText,
            iconCls: "x-tbar-page-last",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["last"])
        });
        this.addSeparator();
        this.add("每页");
        this.pfield = Ext.get(this.addDom({
           tag: "input",
           type: "text",
           qtip: "设置后按回车进行查询",
           style:"text-align:center",
           cls: "x-tbar-page-number",
           value: this.pageSize
        }).el);
        this.pfield.setHeight(18);
        this.pfield.setWidth(40);
        this.pfield.on("keypress", function(e,el){
            var k = e.getKey();
            if(!Ext.isIE && (e.isSpecialKey() || k == e.BACKSPACE || k == e.DELETE)){
                return;
            }
            var c = e.getCharCode();
            if("0123456789".indexOf(String.fromCharCode(c)) === -1){
                e.stopEvent();
            }
        }, this);
        this.pfield.on("keyup", function(e,el){
        	if(el.value>this.maxSize||el.value===0||el.value==="0"){
        		el.value = this.pageSize;
        		Ext.example.msg("提示","每页显示的记录数只能设置1~"+this.maxSize+"!",2)
        	}else{
        		if(el.value!="") this.pageSize = parseInt(el.value, 10);
        	}
        }, this);
        this.pfield.on("keydown", this.onPagingKeydown, this);
        this.pfield.on("blur", function(e,el){
        	el.style.backgroundColor = "";
        	if(el.value==""){
        		el.value = this.pageSize;
        	}
        }, this);
        this.pfield.on("focus", function(){
        	this.dom.style.backgroundColor="#D3FCD7";
        });
        this.add("条");
        this.addSeparator();
        this.loading = this.addButton({
            tooltip: this.refreshText,
            iconCls: "x-tbar-loading",
            handler: this.onClick.createDelegate(this, ["refresh"])
        });

        if(this.displayInfo){
            this.displayEl = Ext.fly(this.el.dom).createChild({cls:'x-paging-info'});
        }
        if(this.dsLoaded){
            this.onLoad.apply(this, this.dsLoaded);
        }
    },
    onPagingKeydown : function(e){
    	if(e.getKey()==e.RETURN){
    		this.pfield.dom.value = this.pageSize;
	    	Ext.ux.PagingToolbar.superclass.onPagingKeydown.call(this,e);
    	}
    }
});
