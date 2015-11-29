/**
 * @class Ext.ux.GroupDataView
 * @extends Ext.DataView
 * This class extends a DataView to allow grouping similar to that of groupinggridview.
 * @license: BSD
 * @author: Robert B. Williams (extjs id: vtswingkid)
 * @constructor
 * Creates a new GroupDataView
 * @param {Object} config Configuration options
 * @version 0.1.0
 */
Ext.namespace("Ext.ux");
Ext.ux.GroupDataView = Ext.extend(Ext.DataView, {
    initComponent : function(){
        Ext.ux.GroupDataView.superclass.initComponent.call(this);
		this.state = {};
        if(!this.startGroup){
            this.startGroup = new Ext.XTemplate(
                '<div id="{groupId}" class="x-grid-group {cls}">',
                    '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', 
					(this.groupTextTpl ? this.groupTextTpl : '{text}' ),
					'</div></div>',
                    '<div id="{groupId}-bd" class="x-grid-group-body">'
            );
        }
        this.startGroup.compile();
        this.endGroup = '</div></div>';
	},
    afterRender : function(){
        Ext.ux.GroupDataView.superclass.afterRender.call(this);
		this.el.on('mousedown', this.interceptMouse, this);
	},
    refresh : function(){
        this.clearSelections(false, true);
        this.el.update("");
        var records = this.store.getRange();
        if(records.length < 1){
            if(!this.deferEmptyText || this.hasSkippedEmptyText){
                this.el.update(this.emptyText);
            }
            this.hasSkippedEmptyText = true;
            this.all.clear();
            return;
        }
		this.el.dom.innerHTML=this.doRender(records)
        this.all.fill(Ext.query(this.itemSelector, this.el.dom));
        this.updateIndexes(0);
    },
	getTotalWidth : function(){
        return this.el.getWidth(true)+'px';
    },
	getGroupField : function(){
        return this.store.getGroupState();
    },
	doRender : function(records){
        if(records.length < 1){
            return '';
        }
        var groupField = this.getGroupField();
        this.enableGrouping = !!groupField;

        if(!this.enableGrouping || this.isUpdating){
            return this.tpl.apply(this.collectData(records));
        }

        var gstyle = 'width:'+this.getTotalWidth()+';';
        var gidPrefix = this.el.id;
        var prefix = this.showGroupName!==false ? groupField+': ' : '';

        var groups = [], curGroup, i, len, gid;
        for(i = 0, len = records.length; i < len; i++){
            var r = records[i],
            	gvalue = r.data[groupField],
            	g = String(gvalue);
            if(!curGroup || curGroup.group != g){
                gid = gidPrefix + '-gp-' + groupField + '-' + Ext.util.Format.htmlEncode(g);
               	// if state is defined use it, however state is in terms of expanded
				// so negate it, otherwise use the default.
				var isCollapsed  = typeof this.state[gid] !== 'undefined' ? !this.state[gid] : this.startCollapsed | false;
				var gcls = isCollapsed ? 'x-grid-group-collapsed' : '';	
                curGroup = {
                    group: g,
                    gvalue: gvalue,
                    text: prefix + g,
                    groupId: gid,
                    startRow: i,
                    rs: [r],
                    cls: gcls,
                    style: gstyle
                };
                groups.push(curGroup);
            }else{
                curGroup.rs.push(r);
            }
            r._groupId = gid;
        }

        var buf = [];
        for(i = 0, len = groups.length; i < len; i++){
            var g = groups[i];
            if(g.gvalue)buf[buf.length] = this.startGroup.apply(g);
			buf[buf.length] = this.tpl.apply(this.collectData(g.rs));
			if(g.gvalue)buf[buf.length] = this.endGroup;
        }
		return buf.join('');
    },
    toggleGroup : function(group, expanded){
        group = Ext.getDom(group);
        var gel = Ext.fly(group);
        expanded = expanded !== undefined ?
                expanded : gel.hasClass('x-grid-group-collapsed');
        this.state[gel.dom.id] = expanded;
        gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
		//if(this.combo)this.combo.restrictHeight();
    },
    toggleAllGroups : function(expanded){
        var groups = this.getGroups();
        for(var i = 0, len = groups.length; i < len; i++){
            this.toggleGroup(groups[i], expanded);
        }
    },
    expandAllGroups : function(){
        this.toggleAllGroups(true);
    },
    collapseAllGroups : function(){
        this.toggleAllGroups(false);
    },
    interceptMouse : function(e){
        var hd = e.getTarget('.x-grid-group-hd', this.el);
        if(hd){
            e.stopEvent();
            this.toggleGroup(hd.parentNode);
        }
    },
    onUpdate : function(ds, record){
		this.refresh();
    },

    // private
    onAdd: function(ds, records, index){
		this.refresh();
	}	
});
Ext.reg('uxgroupdataview', Ext.ux.GroupDataView);

/**
 * @class Ext.ux.form.GroupComboBox
 * @extends Ext.form.ComboBox
 * This class extends a combobox to allow grouping to be displayed like that of the groupinggrid.
 * @license: BSD
 * @author: Robert B. Williams (extjs id: vtswingkid)
 * @constructor
 * Creates a new GroupComboBox
 * @param {Object} config Configuration options
 * @version 0.1.0
 */
Ext.namespace("Ext.ux", "Ext.ux.form");
Ext.ux.form.GroupComboBox = Ext.extend(Ext.form.ComboBox, {
    initList : function(){
        if(!this.list){
            var cls = 'x-combo-list';

            this.list = new Ext.Layer({
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;

            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.on('mouseover', this.onViewOver, this);
            this.innerList.on('mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(this.pageSize){
                this.footer = this.list.createChild({cls:cls+'-ft'});
                this.pageTb = new Ext.PagingToolbar({
                    store:this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            if(!this.tpl){
                this.tpl = '<tpl for="."><div class="'+cls+'-item" " ext:qtip="{'+this.displayField+'}" >{' + this.displayField + '}</div></tpl>';
            }

            this.view = new Ext.ux.GroupDataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
			    showGroupName: this.showGroupName,
			    startCollapsed: this.startCollapsed,
				groupTextTpl: this.groupTextTpl,
				combo: this
            });

            this.view.on('click', this.onViewClick, this);

            this.bindStore(this.store, true);

            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.resizer.on('resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
    }
});
Ext.reg('uxgroupcombo', Ext.ux.form.GroupComboBox);