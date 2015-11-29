var mainPanel, api, helpWindow, pwdWindow ;

Docs = {};

ApiPanel = function() {
	var root = new Ext.tree.TreeNode({
       text:MODULE_ROOT_NAME,
       id:'root',
       expanded:true
    }) 
    ApiPanel.superclass.constructor.call(this, {
        id:'api-tree',
        region:'west',
        split:true,
        width: 190,
        minSize: 100,
        maxSize: 250,
        collapsible: true,
        margins:'0 0 0 0',
        cmargins:'0 0 0 0',
        rootVisible: true,
        lines:true,
        autoScroll:true,
        animCollapse:false,
        animate: true,
        collapseMode:'mini',
        tbar: new Ext.Toolbar({
        	height:20
        }),
        loader: new Ext.tree.TreeLoader({
			preloadChildren: true,
			clearOnLoad: false
		}),
        root: root,
        collapseFirst:false
    });

    // no longer needed!
    //new Ext.tree.TreeSorter(this, {folderSort:true,leafAttr:'isClass'});

    this.getSelectionModel().on('beforeselect', function(sm, node){
        return node.isLeaf();
    });
};

Ext.extend(ApiPanel, Ext.tree.TreePanel, {
    selectClass : function(cls){
        if(cls){
            this.selectPath(cls);
        }
    }
});


DocPanel = Ext.extend(Ext.Panel, {
    closable: true,
    autoScroll:true,

    initComponent : function(){
        var ps = this.cclass.split('.');
        this.title = this.title;
        DocPanel.superclass.initComponent.call(this);
    }
});


MainPanel = function(){
	
	this.tabPanel = this;

	
    MainPanel.superclass.constructor.call(this, {
        id:'doc-body',
        region:'center',
        margins:'0 0 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 150,
        plugins: new Ext.ux.TabCloseMenu(),
        enableTabScroll: true,
        activeTab: 1,
		
        items: [{
            id:'welcome-panel',
            title: '欢迎使用',
            autoLoad: {url: 'welcome.html',  scope: this},
            iconCls:'icon-docs',
            autoScroll: true
        }]
    });
};

Ext.extend(MainPanel, Ext.TabPanel, {

    initEvents : function(){
        MainPanel.superclass.initEvents.call(this);
        this.body.on('click', this.onClick, this);
    },

    onClick: function(e, target){
        if(target = e.getTarget('a:not(.exi)', 3)){
            var cls = Ext.fly(target).getAttributeNS('ext', 'cls');
            e.stopEvent();
            if(cls){
                var member = Ext.fly(target).getAttributeNS('ext', 'member');
                this.loadClass(target.href, cls, member, true);
            }else if(target.className == 'inner-link'){
                this.getActiveTab().scrollToSection(target.href.split('#')[1]);
            }else{
                window.open(target.href);
            }
        }else if(target = e.getTarget('.micon', 2)){
            e.stopEvent();
            var tr = Ext.fly(target.parentNode);
            if(tr.hasClass('expandable')){
                tr.toggleClass('expanded');
            }
        }
    },
    loadClass : function(href, cls, member, node, _closable){
        var id = 'docs-' + cls;
        var tab = this.getComponent(id);
        if(tab){
            this.setActiveTab(tab);
            if(member){
                tab.scrollToMember(member);
            }
        }else{
        	if(this.items.length >= 6){
        		Ext.MessageBox.show({
			           title: '提示',
			           msg: "为了不影响应用性能，系统允许最多打开5个功能窗口，请您关闭一些功能窗口后再尝试打开该功能窗口！",
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           multiline: false,
			           icon: Ext.MessageBox.INFO
					});
        		return
        	}
            var autoLoad = {url: href, scope: this, params:{modid:node.id}, method:'GET'};
            if(member){
                autoLoad.callback = function(){
                    Ext.getCmp(id).scrollToMember(member);
                }
            }
            var p = this.add(new DocPanel({
                id: id,
                cclass : node.getPath(),
                title: node.text,
                autoLoad: autoLoad.url!="" ? autoLoad : null,
                iconCls: node.attributes.iconCls=="null"?"icon-cmp":node.attributes.iconCls,
				closable: _closable
            }));
            
            this.setActiveTab(p);
        }
    }
	
	
});

Ext.onReady(function(){

    Ext.QuickTips.init();

    api = new ApiPanel();
    mainPanel = new MainPanel();

    var nodes = new Array();
    var root = api.getRootNode();
	for(var i=0; i<treedata.length; i++) { // 遍历生成节点
	 	var flag = treedata[i][2]=='1' ? true : false
	 	var first = treedata[i][4]=='1' ? true : false
	 	var url = (!flag || treedata[i][5]=="null") ? "" : "jspDispatcher.jsp";
	 	var node = new Ext.tree.TreeNode({
	 		id: treedata[i][0],
	 		text: treedata[i][1],
			leaf: flag,
			//cls: flag ? "cls" : "package",
			//iconCls: flag ? "icon-cmp" : "icon-pkg",
			iconCls: treedata[i][7],
			parentId: treedata[i][3],
			href: url 
	 	});
	
		nodes.push(node)
		
		if (first){
			root.appendChild(node)
		} else{
			append(node)
		}
		
	}

	function append(node) { // 递归调用
		if (nodes.length > 1) {
			var temp = nodes[nodes.length - 2]
			if (node.attributes.parentId == temp.id){
				temp.appendChild(node)
			} else if (node.attributes.parentId == temp.attributes.parentId &&
 				temp.parentNode!=null)
			{
				temp.parentNode.appendChild(node)
				if (node.leaf)
				nodes.pop()
			} else {
				var tt = temp
				nodes[nodes.length - 2] = node
				nodes[nodes.length - 1] = tt
				nodes.pop()
				append(node)
			}
		}    
	}
	
    api.on('click', function(node, e){
         if(node.isLeaf()){
            e.stopEvent();
             mainPanel.loadClass(node.attributes.href, node.id, false, node, true);
         }
    });

    mainPanel.on('tabchange', function(tp, tab){
        api.selectClass(tab.cclass); 
    });
    
    // invalid memory leak, important!
    mainPanel.on("beforeremove", function(c, p){
    	var frame = p.getEl().dom.getElementsByTagName("IFRAME")[0];
    	if (frame) {
	    	frame.src = "about:blank"
	    	frame.parentNode.removeChild(frame)
	    	frame = null;
    	}
	    if (Ext.isIE) 
    		CollectGarbage();
    })
    
    var hd = new Ext.Panel({
        border: false,
        layout:'anchor',
        region:'north',
        cls: 'docs-header',
        height:46
        /*items: [{
            xtype:'box',
            el:'header',
            border:false,
            anchor: 'none -25'
        },
        new Ext.Toolbar({
            cls:'top-toolbar',
            items:[ ' ',
			new Ext.form.TextField({
				width: 200,
				emptyText:'查找模块',
				listeners:{
					render: function(f){
						f.el.on('keydown', filterTree, f, {buffer: 350});
					}
				}
			}), ' ', ' ',
			{
                iconCls: 'icon-expand-all',
				tooltip: '全部展开',
                handler: function(){ api.root.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: '全部折叠',
                handler: function(){ api.root.collapse(true); }
            }/*, '->', {
                //tooltip:'Hide Inherited Members',
                iconCls: 'icon-hide-inherited',
                enableToggle: true,
                toggleHandler : function(b, pressed){
                     //mainPanel[pressed ? 'addClass' : 'removeClass']('hide-inherited');
                }
            }, '-', {
                //tooltip:'Expand All Members',
                iconCls: 'icon-expand-members',
                enableToggle: true,
                toggleHandler : function(b, pressed){
                    //mainPanel[pressed ? 'addClass' : 'removeClass']('full-details');
                }
            }]
        })]*/
    })

    var viewport = new Ext.Viewport({
        layout:'border',
//        items:[ hd, api, mainPanel ]
		items:[hd, api, mainPanel ]
    });

    api.expandPath('/root');

    // allow for link in
    var page = window.location.href.split('?')[1];
    if(page){
        var ps = Ext.urlDecode(page);
        var cls = ps['class'];
        mainPanel.loadClass('output/' + cls + '.html', cls, ps.member, true);
    }
    
    viewport.doLayout();
	
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
	
	var filter = new Ext.tree.TreeFilter(api, {
		clearBlank: true,
		autoClear: true
	});
	
	var hiddenPkgs = [];
	function filterTree(e){
		var text = e.target.value;
		Ext.each(hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			filter.clear();
			return;
		}
		api.expandAll();
		
		var re = new RegExp('^' + text, 'i');
		filter.filterBy(function(n){
			return !n.isLeaf() || re.test(n.text);
		});
		
		/* hide empty packages that weren't filtered*/
		hiddenPkgs = [];
		api.root.cascade(function(n){
			if(!n.isLeaf() && !n.firstChild ){
				n.ui.hide();
				hiddenPkgs.push(n);
			}
		});
		
	}
	
	root.expand(false, true, function()
	{
		
		for (var index=0; index<root.childNodes.length;index++)
		{
			root.childNodes[index].expand()
		}
		
	})
	
	//TODO
	loadCustomModule("待办事项", false);

});


Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        if(!this.store.baseParams){
			this.store.baseParams = {};
		}
		Ext.app.SearchField.superclass.initComponent.call(this);
		this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.store.baseParams[this.paramName] = '';
			this.store.removeAll();
			this.el.dom.value = '';
            this.triggers[0].hide();
            this.hasSearch = false;
			this.focus();
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
		if(v.length < 2){
			Ext.Msg.alert('Invalid Search', 'You must enter a minimum of 2 characters to search the API');
			return;
		}
		this.store.baseParams[this.paramName] = v;
        var o = {start: 0};
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
		this.focus();
    }
});


/**
 * Makes a ComboBox more closely mimic an HTML SELECT.  Supports clicking and dragging
 * through the list, with item selection occurring when the mouse button is released.
 * When used will automatically set {@link #editable} to false and call {@link Ext.Element#unselectable}
 * on inner elements.  Re-enabling editable after calling this will NOT work.
 *
 * @author Corey Gilmore
 * http://extjs.com/forum/showthread.php?t=6392
 *
 * @history 2007-07-08 jvs
 * Slight mods for Ext 2.0
 */
Ext.ux.SelectBox = function(config){
	this.searchResetDelay = 1000;
	config = config || {};
	config = Ext.apply(config || {}, {
		editable: false,
		forceSelection: true,
		rowHeight: false,
		lastSearchTerm: false,
        triggerAction: 'all',
        mode: 'local'
    });

	Ext.ux.SelectBox.superclass.constructor.apply(this, arguments);

	this.lastSelectedIndex = this.selectedIndex || 0;
};

Ext.extend(Ext.ux.SelectBox, Ext.form.ComboBox, {
    lazyInit: false,
	initEvents : function(){
		Ext.ux.SelectBox.superclass.initEvents.apply(this, arguments);
		// you need to use keypress to capture upper/lower case and shift+key, but it doesn't work in IE
		this.el.on('keydown', this.keySearch, this, true);
		this.cshTask = new Ext.util.DelayedTask(this.clearSearchHistory, this);
	},

	keySearch : function(e, target, options) {
		var raw = e.getKey();
		var key = String.fromCharCode(raw);
		var startIndex = 0;

		if( !this.store.getCount() ) {
			return;
		}

		switch(raw) {
			case Ext.EventObject.HOME:
				e.stopEvent();
				this.selectFirst();
				return;

			case Ext.EventObject.END:
				e.stopEvent();
				this.selectLast();
				return;

			case Ext.EventObject.PAGEDOWN:
				this.selectNextPage();
				e.stopEvent();
				return;

			case Ext.EventObject.PAGEUP:
				this.selectPrevPage();
				e.stopEvent();
				return;
		}

		// skip special keys other than the shift key
		if( (e.hasModifier() && !e.shiftKey) || e.isNavKeyPress() || e.isSpecialKey() ) {
			return;
		}
		if( this.lastSearchTerm == key ) {
			startIndex = this.lastSelectedIndex;
		}
		this.search(this.displayField, key, startIndex);
		this.cshTask.delay(this.searchResetDelay);
	},

	onRender : function(ct, position) {
		this.store.on('load', this.calcRowsPerPage, this);
		Ext.ux.SelectBox.superclass.onRender.apply(this, arguments);
		if( this.mode == 'local' ) {
			this.calcRowsPerPage();
		}
	},

	onSelect : function(record, index, skipCollapse){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.setValue(record.data[this.valueField || this.displayField]);
			if( !skipCollapse ) {
				this.collapse();
			}
			this.lastSelectedIndex = index + 1;
			this.fireEvent('select', this, record, index);
		}
	},

	render : function(ct) {
		Ext.ux.SelectBox.superclass.render.apply(this, arguments);
		if( Ext.isSafari ) {
			this.el.swallowEvent('mousedown', true);
		}
		this.el.unselectable();
		this.innerList.unselectable();
		this.trigger.unselectable();
		this.innerList.on('mouseup', function(e, target, options) {
			if( target.id && target.id == this.innerList.id ) {
				return;
			}
			this.onViewClick();
		}, this);

		this.innerList.on('mouseover', function(e, target, options) {
			if( target.id && target.id == this.innerList.id ) {
				return;
			}
			this.lastSelectedIndex = this.view.getSelectedIndexes()[0] + 1;
			this.cshTask.delay(this.searchResetDelay);
		}, this);

		this.trigger.un('click', this.onTriggerClick, this);
		this.trigger.on('mousedown', function(e, target, options) {
			e.preventDefault();
			this.onTriggerClick();
		}, this);

		this.on('collapse', function(e, target, options) {
			Ext.getDoc().un('mouseup', this.collapseIf, this);
		}, this, true);

		this.on('expand', function(e, target, options) {
			Ext.getDoc().on('mouseup', this.collapseIf, this);
		}, this, true);
	},

	clearSearchHistory : function() {
		this.lastSelectedIndex = 0;
		this.lastSearchTerm = false;
	},

	selectFirst : function() {
		this.focusAndSelect(this.store.data.first());
	},

	selectLast : function() {
		this.focusAndSelect(this.store.data.last());
	},

	selectPrevPage : function() {
		if( !this.rowHeight ) {
			return;
		}
		var index = Math.max(this.selectedIndex-this.rowsPerPage, 0);
		this.focusAndSelect(this.store.getAt(index));
	},

	selectNextPage : function() {
		if( !this.rowHeight ) {
			return;
		}
		var index = Math.min(this.selectedIndex+this.rowsPerPage, this.store.getCount() - 1);
		this.focusAndSelect(this.store.getAt(index));
	},

	search : function(field, value, startIndex) {
		field = field || this.displayField;
		this.lastSearchTerm = value;
		var index = this.store.find.apply(this.store, arguments);
		if( index !== -1 ) {
			this.focusAndSelect(index);
		}
	},

	focusAndSelect : function(record) {
		var index = typeof record === 'number' ? record : this.store.indexOf(record);
		this.select(index, this.isExpanded());
		this.onSelect(this.store.getAt(record), index, this.isExpanded());
	},

	calcRowsPerPage : function() {
		if( this.store.getCount() ) {
			this.rowHeight = Ext.fly(this.view.getNode(0)).getHeight();
			this.rowsPerPage = this.maxHeight / this.rowHeight;
		} else {
			this.rowHeight = false;
		}
	}

});

Ext.Ajax.on('requestcomplete', function(ajax, xhr, o){
    if(typeof urchinTracker == 'function' && o && o.url){
        urchinTracker(o.url);
    }
});

function logout(){	
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function modifyPwd(){
	if (!pwdWindow){
		pwdWindow = new Ext.Window({
			title: '修改口令', iconCls: 'icon-modify-key',
			html: "<iframe id='tree' scrolling='no' align='center' src='" + BASE_PATH+ "jsp/system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: false, maximizable: false,
			width: 500, height: 400
		});
	}
	pwdWindow.show();
}

function loadCustomModule(moduleName, closable){
	for(var i=0; i<treedata.length; i++){
		if (treedata[i][1] == moduleName) {
			var node = api.getNodeById(treedata[i][0]);
			mainPanel.loadClass(node.attributes.href, node.id, false, node, closable);
			break;
		}
	}
}

var help = '<table align="center" width="200" border="0" cellpadding="0" cellspacing="0"> '
		 + '<tr><td valign="middle" height="50"><a href="'+BASE_PATH+'cell/CellWeb.exe">CELL插件下载</a></td></tr>'
         + '<tr><td valign="middle" height="50"><a href="'+BASE_PATH+'jsp/CheckOFFICE.jsp" target="_blank">OFFICE控件检查</a></td></tr>'
         + '<tr><td valign="middle" height="50" ><a href="'+BASE_PATH+'MasterPlan/appendix/NTKOSetupControlClient4032.exe">OFFICE控件手动安装版下载</a></td></tr></table>'

function showHelp(){
	if (!helpWindow){
		helpWindow = new Ext.Window({
			title: '系统帮助', iconCls: 'bookmark',
			html: help,
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: false, maximizable: false,
			width: 300, height: 200
		});
	}
	helpWindow.show();
}