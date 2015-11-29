
Ext.grid.CheckboxGroupingView = Ext.extend(Ext.grid.GroupingView, {initTemplates: function() {
        var B = this.grid.getColumnModel();
        
        Ext.grid.GroupingView.superclass.initTemplates.call(this);
        this.state = {};
        var A = this.grid.getSelectionModel();
        A.on(A.selectRow ? "beforerowselect" : "beforecellselect", this.onBeforeRowSelect, this);
        if (!this.startGroup) {
            this.startGroup = new Ext.XTemplate("<div id=\"{groupId}\" class=\"x-grid-group {cls}\">", "<div id=\"{groupId}-hd\" class=\"x-grid-group-hd x-grid-group-hd-checkbox\" style=\"{style}\"><div class=\"x-grid-group-hd-chx\" style=\"float:left;background:none;padding:0px;position:relative;left:15px;top:4px;\"><div class=\"x-grid3-hd-checker\">&nbsp;</div></div><div>", this.groupTextTpl, "</div></div>", "<div id=\"{groupId}-bd\" class=\"x-grid-group-body\">")
        }
        this.startGroup.compile();
        this.endGroup = "</div></div>"
        var f = function(r, index){
          var flag = this.isSelected(index);
          var r = this.grid.getView().getRow(index);
          var g, gs = this.grid.getView().getGroups(), c = 0;
          for(var i = 0, len = gs.length; i < len; i++){
            g = gs[i].childNodes[1].childNodes;
            if(gs[i] == r.parentNode.parentNode){
	            for(var j = 0, jlen = g.length; j < jlen; j++){
		          	if(Ext.fly(g[j]).hasClass("x-grid3-row-selected")){
		          		c++;
		          	}
		          }
		          var hdc = gs[i].childNodes[0].childNodes[0];
		          if(c == g.length){
	            	hdc.className="x-grid-group-hd-chx-on"
		          } else if(c==0) {
		          	hdc.className="x-grid-group-hd-chx"
		          } else {
		          	hdc.className="x-grid-group-hd-chx-dsc"
		          }
		          break;
		        }
		      }
		   	}
        this.grid.getSelectionModel().on("rowselect", f);
				this.grid.getSelectionModel().on("rowdeselect", f);
		   
		    this.grid.getSelectionModel().onHdMouseDown = function(e, t){
        if(t.className == 'x-grid3-hd-checker'){
            e.stopEvent();
            var hd = Ext.fly(t.parentNode);
            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
            if(isChecked){
                hd.removeClass('x-grid3-hd-checker-on');
                this.clearSelections();
            }else{
                hd.addClass('x-grid3-hd-checker-on');
                this.selectAll();
            }
            var h, gs = this.grid.getView().getGroups();
            for(var i = 0, len = gs.length; i < len; i++){
	            var h = gs[i].childNodes[0].childNodes[0];
	            h.className = isChecked ? "x-grid-group-hd-chx" : "x-grid-group-hd-chx-on"
			      }
        }
        
       };
    },    
    onGroupByClick : function(){
    	Ext.grid.CheckboxGroupingView.superclass.onGroupByClick.call(this);
    	var g, gs = this.grid.getView().getGroups(), c = 0;
      for(var i = 0, len = gs.length; i < len; i++){
        g = gs[i].childNodes[1].childNodes;
        c = 0;
        for(var j = 0, jlen = g.length; j < jlen; j++){
        	if(Ext.fly(g[j]).hasClass("x-grid3-row-selected")){
        		c++;
        	}
        }
        var hdc = gs[i].childNodes[0].childNodes[0];
        if(c == g.length){
        	hdc.className="x-grid-group-hd-chx-on"
        } else if(c==0) {
        	hdc.className="x-grid-group-hd-chx"
        } else {
        	hdc.className="x-grid-group-hd-chx-dsc"
        }
      }
    }, 
    interceptMouse : function(e){
    		var chx = e.getTarget('.x-grid3-hd-checker', this.mainBody);
    		if(chx){
    			e.stopEvent();
    			var hdc = chx.parentNode
    			var c = hdc.className,isAllChecked;
    			if(c=="x-grid-group-hd-chx"){
    				hdc.className = "x-grid-group-hd-chx-on";
    				isAllChecked = false
    			} else {
    				hdc.className = "x-grid-group-hd-chx";
    				isAllChecked = true
    			}
    			var gid = Ext.fly(chx).findParent(".x-grid-group", this.mainBody);
    			this.toggleGroupCheck(isAllChecked, gid);
    			return;
    		}
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
    		
        if(hd){
            e.stopEvent();
            this.toggleGroup(hd.parentNode);
        }
    },toggleGroupCheck : function(isChecked, gid){
    		var g, gs = this.getGroups();
    		for(var i = 0, len = gs.length; i < len; i++){
            g = gs[i].childNodes[1].childNodes;
            gs[i].allchecked = !isChecked;
            if(gs[i] == gid){
	            for(var j = 0, jlen = g.length; j < jlen; j++){
	                if(g[j].childNodes[0]){
	                	var r = g[j].childNodes[0].rows[0]
	                	if(r){
					            if(!isChecked){
				                this.grid.getSelectionModel().selectRow(g[j].rowIndex, true);
					            }else{
				            		this.grid.getSelectionModel().deselectRow(g[j].rowIndex);
					            }
					          }
	                }
	            }
	          }
        }
    }});
Ext.grid.CheckboxGroupingView.GROUP_ID = 1000;