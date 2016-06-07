//Animal Ext JS - Community Support Team 
//http://www.extjs.com/forum/showthread.php?t=38654&highlight=combobox+tree&page=3  
Ext.ux.TreeCombo = Ext.extend(Ext.form.TriggerField, {

    triggerClass: 'x-form-tree-trigger',

    initComponent : function(){
        this.readOnly = true;
        Ext.ux.TreeCombo.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
        this.on('render',function(){
	        if(!this.editable){
	        	this.el.dom.style.cursor = "default";
	        	this.el.dom.onclick = this.onTriggerClick.createDelegate(this)
	        }
        },this)
        
        this.getTree();
    },

    onTriggerClick: function() {
        this.getTree().show();
        this.getTree().getEl().alignTo(this.wrap, 'tl-bl?');
    },

    getTree: function() {
        if (!this.treePanel) {
            if (!this.treeWidth) {
                this.treeWidth = Math.max(200, this.width || 200);
            }
            if (!this.treeHeight) {
                this.treeHeight = 200;
            }
            this.treePanel = new Ext.tree.TreePanel({
                renderTo: Ext.getBody(),
                loader: this.loader || new Ext.tree.TreeLoader({
                    preloadChildren: (typeof this.root == 'undefined'),
                    url: this.dataUrl || this.url
                }),
                root: this.root || new Ext.tree.AsyncTreeNode({children: this.children}),
                rootVisible: (typeof this.rootVisible != 'undefined') ? this.rootVisible : (this.root ? true : false),
                floating: true,
                autoScroll: true,
                minWidth: 200,
                minHeight: 200,
                width: this.treeWidth,
                height: this.treeHeight,
                listeners: {
                    hide: this.onTreeHide,
                    show: this.onTreeShow,
                    click: this.onTreeNodeClick,
                    scope: this
                }
            });
            this.treePanel.show();
            this.treePanel.hide();
            this.relayEvents(this.treePanel.loader, ['beforeload', 'load', 'loadexception']);
            if(this.resizable){
                this.resizer = new Ext.Resizable(this.treePanel.getEl(),  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.treePanel.setSize(w, h);
                }, this);
            }
        }
        return this.treePanel;
    },

    onTreeShow: function() {
        Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
    },

    onTreeHide: function() {
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
    },

    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.getTree().getEl())){
            this.collapse();
        }
    },

    collapse: function() {
        this.getTree().hide();
        this.resizer.resizeTo(this.treeWidth, this.treeHeight);
    },

    // private
    validateBlur : function(){
        return !this.treePanel || !this.treePanel.isVisible();
    },

    setValue: function(v) {
        if (this.treePanel) {
            var n = this.treePanel.getNodeById(v);
            if (n) {
		        this.startValue = this.value = v;
		        //2013-08-20 pengy treeCombo用在EditorGridTbarPanel时，如果未激活，在通用的保存中执行setRawValue报错
		        //增加this.rendered判断，未激活则返回false
		        if (this.rendered){
                	this.setRawValue(n.text);
		        }
            }
        }
    },

    getValue: function() {
        return this.value;
    },
	//2013-06-25 qiupy BUG4065 构造下拉框树的查询,用于重置查询条件
	reset: function() {
        this.value='';
        this.setRawValue('');
    },
    onTreeNodeClick: function(node, e) {
        this.setRawValue(node.text);
        this.value = node.id;
        this.fireEvent('select', this, node);
        this.collapse();
    },
    onRender : function(ct, position){
        Ext.ux.TreeCombo.superclass.onRender.call(this, ct, position);
        if(this.value) this.setValue(this.value);
    }
});