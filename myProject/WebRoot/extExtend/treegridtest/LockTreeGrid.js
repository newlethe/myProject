Ext.namespace('Ext.ux.maximgb.treegrid');

/**
 * This class shouldn't be created directly use NestedSetStore or
 * AdjacencyListStore instead.
 * 
 * @abstract
 */
Ext.ux.maximgb.treegrid.AbstractTreeStore = Ext.extend(Ext.data.Store, {
	/**
	 * @cfg {String} is_leaf_field_name Record leaf flag field name.
	 */
	leaf_field_name : '_is_leaf',
	isloading : false,

	/**
	 * Current page offset.
	 * 
	 * @access private
	 */
	page_offset : 0,

	/**
	 * Current active node.
	 * 
	 * @access private
	 */
	active_node : null,

	/**
	 * @constructor
	 */
	constructor : function(config) {
		Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.constructor.call(
				this, config);

		if (!this.paramNames.active_node) {
			this.paramNames.active_node = 'anode';
		}

		this.addEvents(
				/**
				 * @event beforeexpandnode Fires before node expand. Return
				 *        false to cancel operation. param {AbstractTreeStore}
				 *        this param {Record} record
				 */
				'beforeexpandnode',
				/**
				 * @event expandnode Fires after node expand. param
				 *        {AbstractTreeStore} this param {Record} record
				 */
				'expandnode',
				/**
				 * @event expandnodefailed Fires when expand node operation is
				 *        failed. param {AbstractTreeStore} this param {id}
				 *        Record id param {Record} Record, may be undefined
				 */
				'expandnodefailed',
				/**
				 * @event beforecollapsenode Fires before node collapse. Return
				 *        false to cancel operation. param {AbstractTreeStore}
				 *        this param {Record} record
				 */
				'beforecollapsenode',
				/**
				 * @event collapsenode Fires after node collapse. param
				 *        {AbstractTreeStore} this param {Record} record
				 */
				'collapsenode',
				/**
				 * @event beforeactivenodechange Fires before active node
				 *        change. Return false to cancel operation. param
				 *        {AbstractTreeStore} this param {Record} old active
				 *        node record param {Record} new active node record
				 */
				'beforeactivenodechange',
				/**
				 * @event activenodechange Fires after active node change. param
				 *        {AbstractTreeStore} this param {Record} old active
				 *        node record param {Record} new active node record
				 */
				'activenodechange',
				/**
				 * 注册check事件
				 */
				'check',
				/**
				 * 注册展开子节点事件
				 */
				'expandChildrenNode');
	},

	// Store methods.
	// -----------------------------------------------------------------------------------------------
	/**
	 * Removes record and all its descendants.
	 * 
	 * @access public
	 * @param {Record}
	 *            record Record to remove.
	 */
	remove : function(record) {
		// ----- Modification start
		if (record === this.active_node) {
			this.setActiveNode(null);
		}
		this.removeNodeDescendants(record);
		// ----- End of modification
		Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.remove.call(this,
				record);
	},

	/**
	 * Removes node descendants.
	 * 
	 * @access private
	 */
	removeNodeDescendants : function(rc) {
		var i, len, children = this.getNodeChildren(rc);
		for (i = 0, len = children.length; i < len; i++) {
			this.remove(children[i]);
		}
	},

	/**
	 * Applyes current sort method.
	 * 
	 * @access private
	 */
	applySort : function() {
		if (this.sortInfo && !this.remoteSort) {
			var s = this.sortInfo, f = s.field;
			this.sortData(f, s.direction);
		}
		// ----- Modification start
		else {
			this.applyTreeSort();
		}
		// ----- End of modification
	},

	/**
	 * Sorts data according to sort params and then applyes tree sorting.
	 * 
	 * @access private
	 */
	sortData : function(f, direction) {
		direction = direction || 'ASC';
		var st = this.fields.get(f).sortType;
		var fn = function(r1, r2) {
			var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		};
		this.data.sort(direction, fn);
		if (this.snapshot && this.snapshot != this.data) {
			this.snapshot.sort(direction, fn);
		}
		// ----- Modification start
		this.applyTreeSort();
		// ----- End of modification
	},

	/**
	 * Loads current active record data.
	 */
	load : function(options) {
		if (options) {
			if (options.params) {
				if (options.params[this.paramNames.active_node] === undefined) {
					options.params[this.paramNames.active_node] = this.active_node
							? this.active_node.id
							: null;
				}
			} else {
				options.params = {};
				options.params[this.paramNames.active_node] = this.active_node
						? this.active_node.id
						: null;
			}
		} else {
			options = {
				params : {}
			};
			options.params[this.paramNames.active_node] = this.active_node
					? this.active_node.id
					: null;
		}
		if (options.params[this.paramNames.active_node] !== null) {
			options.add = true;
		}
		return Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.load.call(
				this, options);
	},

	/**
	 * Called as a callback by the Reader during load operation.
	 * 
	 * @access private
	 */
	loadRecords : function(o, options, success) {
		if (!o || success === false) {
			if (success !== false) {
				this.fireEvent("load", this, [], options);
			}
			if (options.callback) {
				options.callback
						.call(options.scope || this, [], options, false);
			}
			return;
		}

		var r = o.records, t = o.totalRecords || r.length, page_offset = this
				.getPageOffsetFromOptions(options), loaded_node_id = this
				.getLoadedNodeIdFromOptions(options), loaded_node, i, len, self = this;

		if (!options || options.add !== true || loaded_node_id === null) {
			if (this.pruneModifiedRecords) {
				this.modified = [];
			}
			for (var i = 0, len = r.length; i < len; i++) {
				r[i].join(this);
			}
			if (this.snapshot) {
				this.data = this.snapshot;
				delete this.snapshot;
			}
			this.data.clear();
			this.data.addAll(r);
			this.page_offset = page_offset;
			this.totalLength = t;
			this.applySort();
			this.fireEvent("datachanged", this);
		} else {
			loaded_node = this.getById(loaded_node_id);
			if (loaded_node) {
				this.setNodeChildrenOffset(loaded_node, page_offset);
				this.setNodeChildrenTotalCount(loaded_node, Math.max(t,
								r.length));

				this.removeNodeDescendants(loaded_node);
				this.suspendEvents();
				for (i = 0, len = r.length; i < len; i++) {
					this.add(r[i]);
				}
				this.applySort();
				this.resumeEvents();
				var idx = [];

				r.sort(function(r1, r2) {
							var idx1 = self.data.indexOf(r1), idx2 = self.data
									.indexOf(r2), r;

							if (idx1 > idx2) {
								r = 1;
							} else {
								r = -1;
							}
							return r;
						});

				for (i = 0, len = r.length; i < len; i++) {
					this
							.fireEvent("add", this, [r[i]], this.data
											.indexOf(r[i]));
				}

				/*
				 * this.suspendEvents();
				 * this.removeNodeDescendants(loaded_node); this.add(r);
				 * this.applyTreeSort(); this.resumeEvents();
				 * this.fireEvent("datachanged", this);
				 */
			}
		}
		this.fireEvent("load", this, r, options);
		if (options.callback) {
			options.callback.call(options.scope || this, r, options, true);
		}
	},

	// Tree support methods.
	// -----------------------------------------------------------------------------------------------

	/**
	 * Sorts store data with respect to nodes parent-child relation. Every child
	 * node will be positioned after its parent.
	 * 
	 * @access public
	 */
	applyTreeSort : function() {
		var i, len, temp, rec, records = [], roots = this.getRootNodes();

		// Sorting data
		for (i = 0, len = roots.length; i < len; i++) {
			rec = roots[i];
			records.push(rec);
			this.collectNodeChildrenTreeSorted(records, rec);
		}

		if (records.length > 0) {
			this.data.clear();
			this.data.addAll(records);
		}

		// Sorting the snapshot if one present.
		if (this.snapshot && this.snapshot !== this.data) {
			temp = this.data;
			this.data = this.snapshot;
			this.snapshot = null;
			this.applyTreeSort();
			this.snapshot = this.data;
			this.data = temp;
		}
	},

	/**
	 * Recusively collects rec descendants and adds them to records[] array.
	 * 
	 * @access private
	 * @param {Record[]}
	 *            records
	 * @param {Record}
	 *            rec
	 */
	collectNodeChildrenTreeSorted : function(records, rec) {
		var i, len, child, children = this.getNodeChildren(rec);

		for (i = 0, len = children.length; i < len; i++) {
			child = children[i];
			records.push(child);
			this.collectNodeChildrenTreeSorted(records, child);
		}
	},

	/**
	 * Returns current active node.
	 * 
	 * @access public
	 * @return {Record}
	 */
	getActiveNode : function() {
		return this.active_node;
	},

	/**
	 * Sets active node.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc Record to set active.
	 */
	setActiveNode : function(rc) {
		if (this.active_node !== rc) {
			if (rc) {
				if (this.data.indexOf(rc) != -1) {
					if (this.fireEvent('beforeactivenodechange', this,
							this.active_node, rc) !== false) {
						this.active_node = rc;
						this.fireEvent('activenodechange', this,
								this.active_node, rc);
					}
				} else {
					throw "Given record is not from the store.";
				}
			} else {
				if (this.fireEvent('beforeactivenodechange', this,
						this.active_node, rc) !== false) {
					this.active_node = rc;
					this.fireEvent('activenodechange', this, this.active_node,
							rc);
				}
			}
		}
	},

	/**
	 * Returns true if node is expanded.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 */
	isExpandedNode : function(rc) {
		return rc.ux_maximgb_treegrid_expanded === true;
	},

	/**
	 * Sets node expanded flag.
	 * 
	 * @access private
	 */
	setNodeExpanded : function(rc, value) {
		rc.ux_maximgb_treegrid_expanded = value;
	},

	/**
	 * Returns true if node's ancestors are all expanded - node is visible.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 */
	isVisibleNode : function(rc) {
		var i, len, ancestors = this.getNodeAncestors(rc), result = true;

		for (i = 0, len = ancestors.length; i < len; i++) {
			result = result && this.isExpandedNode(ancestors[i]);
			if (!result) {
				break;
			}
		}

		return result;
	},

	/**
	 * Returns true if node is a leaf.
	 * 
	 * @access public
	 * @return {Boolean}
	 */
	isLeafNode : function(rc) {
		return rc.get(this.leaf_field_name) == true;
	},

	/**
	 * Returns true if node was loaded.
	 * 
	 * @access public
	 * @return {Boolean}
	 */
	isLoadedNode : function(rc) {
		var result;

		if (rc.ux_maximgb_treegrid_loaded !== undefined) {
			result = rc.ux_maximgb_treegrid_loaded
		} else if (this.isLeafNode(rc) || this.hasChildNodes(rc)) {
			result = true;
		} else {
			result = false;
		}

		return result;
	},

	/**
	 * Sets node loaded state.
	 * 
	 * @access private
	 * @param {Record}
	 *            rc
	 * @param {Boolean}
	 *            value
	 */
	setNodeLoaded : function(rc, value) {
		rc.ux_maximgb_treegrid_loaded = value;
	},

	/**
	 * Returns node's children offset.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 * @return {Integer}
	 */
	getNodeChildrenOffset : function(rc) {
		return rc.ux_maximgb_treegrid_offset || 0;
	},

	/**
	 * Sets node's children offset.
	 * 
	 * @access private
	 * @param {Record}
	 *            rc
	 * @parma {Integer} value
	 */
	setNodeChildrenOffset : function(rc, value) {
		rc.ux_maximgb_treegrid_offset = value;
	},

	/**
	 * Returns node's children total count
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 * @return {Integer}
	 */
	getNodeChildrenTotalCount : function(rc) {
		return rc.ux_maximgb_treegrid_total || 0;
	},

	/**
	 * Sets node's children total count.
	 * 
	 * @access private
	 * @param {Record}
	 *            rc
	 * @param {Integer}
	 *            value
	 */
	setNodeChildrenTotalCount : function(rc, value) {
		rc.ux_maximgb_treegrid_total = value;
	},
	
	/**
	 * Collapses All.
	 * 
	 * @access public
	 */
	collapseAllNode : function() {
		var root = this.getAt(0);
    	if(root) {
			this.collapseNode(root, true);
    	}
	},
	
	/**
	 * Collapses node.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 * @param {Record}
	 *            rc Node to collapse.
	 */
	collapseNode : function(rc, deep) {
		if(this.isExpandedNode(rc)){
			if(this.fireEvent('beforecollapsenode', this, rc) === false){
				return;
			}
			this.setNodeExpanded(rc, false);
			this.fireEvent('collapsenode', this, rc);
		}
		if(deep === true){
			this.collapseChildNodes(rc, deep);
        }
	},
	/**
     * Collapse all child nodes
     * @param {Boolean} deep (optional) true if the child nodes should also collapse their child nodes
     */
    collapseChildNodes : function(rc, deep){
        var cs = this.getNodeChildren(rc);
        for(var i = 0, len = cs.length; i < len; i++) {
        	this.collapseNode(cs[i], deep);
        }
    },
	/**
	 * 进行check事件添加
	 * 
	 * @param {}
	 *            rc
	 */
	checkRecord : function(rc, row, target) {
		this.fireEvent('check', this, rc, row, target);
	},
	/**
	 * 注册展开子节点事件
	 * 
	 * @param {}
	 *            rc
	 */
	checkparentNode : function(rc, e) {
		this.fireEvent('checkparentNode', this, rc);
	},
	/**
	 * Expands node.
	 * 
	 * @access public
	 * @param {Record}
	 *            rc
	 */
	isloading : false,
	
	/**
	 * expand All.
	 * 
	 * @access public
	 */
	expandAllNode : function() {
		var root = this.getAt(0);
    	if(root) {
			this.expandNode(root, true);
    	}
	},
	
	expandNode : function(rc, deep, callback) {
		var params;
		if (!this.isExpandedNode(rc)
				&& this.fireEvent('beforeexpandnode', this, rc) !== false) {
			
			if(this.isloading){ // if an async load is already running,waiting til it's done
				var timer;
				var f = function(){
					if(!this.loading){ // done loading
						clearInterval(timer);
						this.expandNode(rc, deep, callback);
					}
				}.createDelegate(this);
				timer = setInterval(f, 200);
				return;
			}
			
			// If node is already loaded then expanding now.
			if (this.isLoadedNode(rc)) {
				this.isloading = false
				this.setNodeExpanded(rc, true);
				this.fireEvent('expandnode', this, rc);
				if(deep === true){
					this.expandChildNodes(rc, deep, callback);
				}
				if(callback) {
					var args = [rc];
					Ext.callback(callback, this, args);
				}
			}
			// If node isn't loaded yet then expanding after load.
			else {
				this.isloading = true
				params = {};
				params[this.paramNames.active_node] = rc.id;
				this.load({
							add : true,
							params : params,
							deep: deep,
							cb: callback,
							callback : this.expandNodeCallback,
							scope : this
						});
			}
		} else {
			if(callback) {
				var args = [rc];
				Ext.callback(callback, this, args);
			}
			if(deep === true){
				this.expandChildNodes(rc, deep, callback);
			}
		}
	},
	
	expandChildNodes : function(rc, deep, callback) {
        var cs = this.getNodeChildren(rc),
            i,
            len = cs.length;
        for (i = 0; i < len; i++) {
         	this.expandNode(cs[i], deep, callback);
        }
    },

	/**
	 * @access private
	 */
	expandNodeCallback : function(r, options, success) {
		var rc = this.getById(options.params[this.paramNames.active_node]);
		this.isloading = false;
		if (success && rc) {
			this.setNodeLoaded(rc, true);
			this.setNodeExpanded(rc, true);
			if(options.cb) {
				var args = [rc];
				Ext.callback(options.cb, this, args);
			}
			if(options.deep===true) {
				this.expandChildNodes(rc, true, options.cb);
			}
			this.fireEvent('expandnode', this, rc);
		} else {
			this.fireEvent('expandnodefailed', this,
					options.params[this.paramNames.active_node], rc);
		}
	},
	/**
	 * Returns loaded node id from the load options.
	 * 
	 * @access public
	 */
	getLoadedNodeIdFromOptions : function(options) {
		var result = null;
		if (options && options.params
				&& options.params[this.paramNames.active_node]) {
			result = options.params[this.paramNames.active_node];
		}
		return result;
	},
	// 设置加载结束
	setIsLoading : function() {
		this.isloading = false;
	},
	/**
	 * Returns start offset from the load options.
	 */
	getPageOffsetFromOptions : function(options) {
		var result = 0;
		if (options && options.params && options.params[this.paramNames.start]) {
			result = parseInt(options.params[this.paramNames.start], 10);
			if (isNaN(result)) {
				result = 0;
			}
		}
		return result;
	},

	// Public
	hasNextSiblingNode : function(rc) {
		return this.getNodeNextSibling(rc) !== null;
	},

	// Public
	hasPrevSiblingNode : function(rc) {
		return this.getNodePrevSibling(rc) !== null;
	},

	// Public
	hasChildNodes : function(rc) {
		return this.getNodeChildrenCount(rc) > 0;
	},

	getResolvedXY : function(resolved){
		if(!resolved){
			return null;
		}
		var c = resolved.cell, r = resolved.row;
		return c ? Ext.fly(c).getXY() : [this.scroller.getX(), Ext.fly(r).getY()];
	},

	// Public
	getNodeAncestors : function(rc) {
		var ancestors = [], parent;

		parent = this.getNodeParent(rc);
		while (parent) {
			ancestors.push(parent);
			parent = this.getNodeParent(parent);
		}

		return ancestors;
	},

	// Public
	getNodeChildrenCount : function(rc) {
		return this.getNodeChildren(rc).length;
	},

	// Public
	getNodeNextSibling : function(rc) {
		var siblings, parent, index, result = null;

		parent = this.getNodeParent(rc);
		if (parent) {
			siblings = this.getNodeChildren(parent);
		} else {
			siblings = this.getRootNodes();
		}

		index = siblings.indexOf(rc);

		if (index < siblings.length - 1) {
			result = siblings[index + 1];
		}

		return result;
	},

	// Public
	getNodePrevSibling : function(rc) {
		var siblings, parent, index, result = null;

		parent = this.getNodeParent(rc);
		if (parent) {
			siblings = this.getNodeChildren(parent);
		} else {
			siblings = this.getRootNodes();
		}

		index = siblings.indexOf(rc);
		if (index > 0) {
			result = siblings[index - 1];
		}

		return result;
	},

	// Abstract tree support methods.
	// -----------------------------------------------------------------------------------------------

	// Public - Abstract
	getRootNodes : function() {
		throw 'Abstract method call';
	},

	// Public - Abstract
	getNodeDepth : function(rc) {
		throw 'Abstract method call';
	},

	// Public - Abstract
	getNodeParent : function(rc) {
		throw 'Abstract method call';
	},

	// Public - Abstract
	getNodeChildren : function(rc) {
		throw 'Abstract method call';
	},

	// Public - Abstract
	addToNode : function(parent, child) {
		throw 'Abstract method call';
	},

	// Public - Abstract
	removeFromNode : function(parent, child) {
		throw 'Abstract method call';
	},

	// Paging support methods.
	// -----------------------------------------------------------------------------------------------
	/**
	 * Returns top level node page offset.
	 * 
	 * @access public
	 * @return {Integer}
	 */
	getPageOffset : function() {
		return this.page_offset;
	},

	/**
	 * Returns active node page offset.
	 * 
	 * @access public
	 * @return {Integer}
	 */
	getActiveNodePageOffset : function() {
		var result;

		if (this.active_node) {
			result = this.getNodeChildrenOffset(this.active_node);
		} else {
			result = this.getPageOffset();
		}

		return result;
	},

	/**
	 * Returns active node children count.
	 * 
	 * @access public
	 * @return {Integer}
	 */
	getActiveNodeCount : function() {
		var result;

		if (this.active_node) {
			result = this.getNodeChildrenCount(this.active_node);
		} else {
			result = this.getRootNodes().length;
		}

		return result;
	},

	/**
	 * Returns active node total children count.
	 * 
	 * @access public
	 * @return {Integer}
	 */
	getActiveNodeTotalCount : function() {
		var result;

		if (this.active_node) {
			result = this.getNodeChildrenTotalCount(this.active_node);
		} else {
			result = this.getTotalCount();
		}

		return result;
	}
});

/**
 * Tree store for adjacency list tree representation.
 */
Ext.ux.maximgb.treegrid.AdjacencyListStore = Ext.extend(
		Ext.ux.maximgb.treegrid.AbstractTreeStore, {
			/**
			 * @cfg {String} parent_id_field_name Record parent id field name.
			 */
			parent_id_field_name : '_parent',

			getRootNodes : function() {
				var i, len, result = [], records = this.data.getRange();

				for (i = 0, len = records.length; i < len; i++) {
					if (records[i].get(this.parent_id_field_name) == "0") {
						result.push(records[i]);
					}
				}

				return result;
			},

			getNodeDepth : function(rc) {
				return this.getNodeAncestors(rc).length;
			},

			getNodeParent : function(rc) {
				return this.getById(rc.get(this.parent_id_field_name));
			},

			getNodeChildren : function(rc) {
				var i, len, result = [], records = this.data.getRange();

				for (i = 0, len = records.length; i < len; i++) {
					if (records[i].get(this.parent_id_field_name) == rc.id) {
						result.push(records[i]);
					}
				}
				return result;
			}
		});

/**
 * Tree store for nested set tree representation.
 */
Ext.ux.maximgb.treegrid.NestedSetStore = Ext.extend(
		Ext.ux.maximgb.treegrid.AbstractTreeStore, {
			/**
			 * @cfg {String} left_field_name Record NS-left bound field name.
			 */
			left_field_name : '_lft',

			/**
			 * @cfg {String} right_field_name Record NS-right bound field name.
			 */
			right_field_name : '_rgt',

			/**
			 * @cfg {String} level_field_name Record NS-level field name.
			 */
			level_field_name : '_level',

			/**
			 * @cfg {Number} root_node_level Root node level.
			 */
			root_node_level : 1,

			getRootNodes : function() {
				var i, len, result = [], records = this.data.getRange();

				for (i = 0, len = records.length; i < len; i++) {
					if (records[i].get(this.level_field_name) == this.root_node_level) {
						result.push(records[i]);
					}
				}

				return result;
			},

			getNodeDepth : function(rc) {
				return rc.get(this.level_field_name) - this.root_node_level;
			},

			getNodeParent : function(rc) {
				var result = null, rec, records = this.data.getRange(), i, len, lft, r_lft, rgt, r_rgt, level, r_level;

				lft = rc.get(this.left_field_name);
				rgt = rc.get(this.right_field_name);
				level = rc.get(this.level_field_name);

				for (i = 0, len = records.length; i < len; i++) {
					rec = records[i];
					r_lft = rec.get(this.left_field_name);
					r_rgt = rec.get(this.right_field_name);
					r_level = rec.get(this.level_field_name);

					if (r_level == level - 1 && r_lft < lft && r_rgt > rgt) {
						result = rec;
						break;
					}
				}

				return result;
			},

			getNodeChildren : function(rc) {
				var lft, r_lft, rgt, r_rgt, level, r_level, records, rec, result = [];

				records = this.data.getRange();

				lft = rc.get(this.left_field_name);
				rgt = rc.get(this.right_field_name);
				level = rc.get(this.level_field_name);

				for (var i = 0, len = records.length; i < len; i++) {
					rec = records[i];
					r_lft = rec.get(this.left_field_name);
					r_rgt = rec.get(this.right_field_name);
					r_level = rec.get(this.level_field_name);

					if (r_level == level + 1 && r_lft > lft && r_rgt < rgt) {
						result.push(rec);
					}
				}

				return result;
			}
		});

Ext.ux.maximgb.treegrid.GridView = Ext.extend(Ext.grid.GridView, {
	// private
	breadcrumbs_el : null,
	lockText : "Lock",
	unlockText : "Unlock",

	// private - overriden
	initTemplates : function() {
		var ts = this.templates || {};
		ts.master = new Ext.Template(
				'<div class="x-grid3" hidefocus="true">',
					// <--  locked  
					'<div class="x-grid3-locked">',						
						'<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{lockedHeader}</div></div><div class="x-clear"></div></div>',
						'<div class="x-grid3-scroller"><div class="x-grid3-body">{lockedBody}</div></div>',
					// End of Locked  -->
					'</div>',					
					'<div class="x-grid3-viewport">',
						'<div class="x-grid3-header">',
							// <--Breadcrumbs
							'<div class="x-grid3-header-inner">',
							'<!--div class="x-grid3-header-offset">',
							'<div class="ux-maximgb-treegrid-breadcrumbs">&#160;</div>',
							'</div-->',
							'</div>',
							// End of breadcrumbs  -->
							'<div class="x-grid3-header-inner">',
							'<div class="x-grid3-header-offset">{header}</div>',
							'</div>',
							'<div class="x-clear"></div>',
						'</div>',
						'<div class="x-grid3-scroller">',
							'<div class="x-grid3-body">{body}</div>',
							'<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
						'</div>',					
					'</div>',
					'<div class="x-grid3-resize-marker">&#160;</div>',
					'<div class="x-grid3-resize-proxy">&#160;</div>',
				'</div>');

		ts.row = new Ext.Template(
				'<div class="x-grid3-row {alt} ux-maximgb-treegrid-level-{level}" style="{tstyle} {display_style}">',  // <-- tree level css -->
				'<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<tbody>',
				'<tr>{cells}</tr>',
                (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
                '</tbody></table></div>');

		ts.cell = new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'{treeui}',  // <-- treeui -->
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
				'</td>');

		// <-- tree ui
		ts.treeui = new Ext.Template(
				'<div class="ux-maximgb-treegrid-uiwrap" style="width: {wrap_width}px">',
				'{elbow_line}',
				'<div style="left: {left}px" class="{cls}">&#160;</div>',
				'<div style="left: {left1}px" class="{diyStyle}">&#160;</div>',
				(!this.grid.ifcheck ? '' : '<div style="left: {leftbox}px" id="blank-{id}" class="{blank}"><input type=checkbox  id="masker-{cid}"  class="masker" {disabled} name="checkNode" {checked} /> </div>'),
				'</div>');

		ts.elbow_line = new Ext.Template('<div style="left: {left}px" class="{cls}">&#160;</div>');
		ts.brd_item = new Ext.Template('<a href="#" id="ux-maximgb-treegrid-brditem-{id}" class="ux-maximgb-treegrid-brditem" title="{title}">{caption}</a>');
		// End of tree ui-->

		// <-- group cell
		if (!ts.gcell) {
			ts.gcell = new Ext.Template(
				'<td class="x-grid3-hd {cls} x-grid3-td-{id}" style="{style}">',
				'<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">{value}</div>',
				'</td>'
			);
		}
		// -->
		
		this.templates = ts;
		Ext.ux.maximgb.treegrid.GridView.superclass.initTemplates.call(this);
	},

	renderBody : function() {
		var markup = this.renderRows();
		return [this.templates.body.apply({ rows : markup[0] }),
				this.templates.body.apply({ rows : markup[1] })];  // <-- -->
	},
	
	refresh : function(headersToo) {
		this.fireEvent("beforerefresh", this);
		this.grid.stopEditing(true);

		var result = this.renderBody();
		this.mainBody.update(result[0]);	// <--
		this.lockedBody.update(result[1]);	// -->

		if (headersToo === true) {
			this.updateHeaders();
			this.updateHeaderSortState();
		}
		this.processRows(0, true);
		this.layout();
		this.applyEmptyText();
		this.fireEvent("refresh", this);
	},

	addRowClass : function(row, cls) {
		var r = this.getRow(row);
		if (r) {
			this.fly(r).addClass(cls);
			r = this.getLockedRow(row);	// <--
			this.fly(r).addClass(cls);	// -->
		}
	},

	removeRowClass : function(row, cls) {
		var r = this.getRow(row);
		if (r) {
			this.fly(r).removeClass(cls);
			r = this.getLockedRow(row);		// <--
			this.fly(r).removeClass(cls);	// -->
		}
	},
	
	renderUI : function() {

		var header = this.renderHeaders();
		var body = this.templates.body.apply({
					rows : ''
				});

		var html = this.templates.master.apply({
					body : body,
					header : header[0],
					lockedBody : body,			// <--
					lockedHeader : header[1]	// -->
				});

		var g = this.grid;

		g.getGridEl().dom.innerHTML = html;

		this.initElements();
		var bd = this.renderRows();				// <--
		if (bd == '') bd = ['', ''];
		this.mainBody.dom.innerHTML = bd[0];
		this.lockedBody.dom.innerHTML = bd[1];	// -->
		this.processRows(0, true);

		Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
		Ext.fly(this.lockedInnerHd).on("click", this.handleHdDown, this);	// <-- -->
		this.mainHd.on("mouseover", this.handleHdOver, this);
		this.mainHd.on("mouseout", this.handleHdOut, this);
		this.mainHd.on("mousemove", this.handleHdMove, this);
		this.lockedHd.on("mouseover", this.handleHdOver, this);			//<--
		this.lockedHd.on("mouseout", this.handleHdOut, this);
		this.lockedHd.on("mousemove", this.handleHdMove, this);	
		this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth();	//-->
		this.scroller.on('scroll', this.syncScroll, this);
		if (g.enableColumnResize !== false) {
			//  <--
			this.splitone = new Ext.grid.GridView.SplitDragZone(g, this.lockedHd.dom);
			this.splitone.setOuterHandleElId(Ext.id(this.lockedHd.dom));
			this.splitone.setOuterHandleElId(Ext.id(this.mainHd.dom));
			//  -->
		}

		if (g.enableColumnMove && this.cm.rows.length<=0) {
			this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
			this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
		}

		if (g.enableHdMenu !== false) {
			if (g.enableColumnHide !== false) {
                this.colMenu = new Ext.menu.Menu({id:g.id + "-hcols-menu"});
                this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
                this.colMenu.on("itemclick", this.handleHdMenuClick, this);
			}
            this.hmenu = new Ext.menu.Menu({id: g.id + "-hctx"});
            this.hmenu.add(
                {id:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
                {id:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"}
            );
            //  <--
			if (this.grid.enableColLock !== false && this.cm.rows.length <= 0) {
				this.hmenu.add('-',
					{id : "lock", text : this.lockText, cls : "xg-hmenu-lock"},
					{id : "unlock", text : this.unlockText, cls : "xg-hmenu-unlock"}
				);
			}
			//  -->
			if (g.enableColumnHide !== false) {
                this.hmenu.add('-',
                    {id:"columns", text: this.columnsText, menu: this.colMenu, iconCls: 'x-cols-icon'}
                );
			}
			this.hmenu.on("itemclick", this.handleHdMenuClick, this);

		}

        if(this.cm.rows.length<=0 && (g.enableDragDrop || g.enableDrag)){
            this.dragZone = new Ext.grid.GridDragZone(g, {
                ddGroup : g.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();

	},
	
	// private - overriden
	initElements : function() {
		var E = Ext.Element;
		var el = this.grid.getGridEl().dom.firstChild;
		var cs = el.childNodes;
		this.el = new E(el);
		// <--
		this.lockedWrap = new E(cs[0]);
		this.lockedHd = new E(this.lockedWrap.dom.firstChild);
		this.lockedInnerHd = this.lockedHd.dom.firstChild;
		this.lockedScroller = new E(this.lockedWrap.dom.childNodes[1]);
		this.lockedBody = new E(this.lockedScroller.dom.firstChild);
		this.mainWrap = new E(cs[1]);
		// -->
		this.mainHd = new E(this.mainWrap.dom.firstChild);
		if (this.grid.hideHeaders) {
			this.mainHd.setDisplayed(false);
		}
		// <--
		this.innerHd = this.mainHd.dom.childNodes[1];
		// -->
		this.scroller = new E(this.mainWrap.dom.childNodes[1]);
		if (this.forceFit) {
			this.scroller.setStyle('overflow-x', 'hidden');
		}
		this.mainBody = new E(this.scroller.dom.firstChild);

		this.focusEl = new E(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent("click", true);

		this.resizeMarker = new E(cs[2]);
		this.resizeProxy = new E(cs[3]);
	},
	
	insertRows : function(dm, firstRow, lastRow, isUpdate) {
		if (!isUpdate && firstRow === 0 && lastRow == dm.getCount() - 1) {
			this.refresh();
		} else {
			if (!isUpdate) {
				this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
			}
			var html = this.renderRows(firstRow, lastRow);
			var before = this.getRow(firstRow);
			var beforeLocked = this.getLockedRow(firstRow);	// <-- -->
			if (before) {
				Ext.DomHelper.insertHtml('beforeBegin', before, html[0]);
				Ext.DomHelper.insertHtml('beforeBegin', beforeLocked, html[1]);		// <-- -->
			} else {
				Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html[0]);
				Ext.DomHelper.insertHtml('beforeEnd', this.lockedBody.dom, html[1]);	// <-- -->
			}
			if (!isUpdate) {
				this.fireEvent("rowsinserted", this, firstRow, lastRow);
				this.processRows(firstRow);
			}
		}
	},

	getColumnData : function() {
		var cs = [], cm = this.cm, colCount = cm.getColumnCount();
		for (var i = 0; i < colCount; i++) {
			var name = cm.getDataIndex(i);
			cs[i] = {
				name : (typeof name == 'undefined' ? this.ds.fields.get(i).name : name),
				renderer : cm.getRenderer(i),
				id : cm.getColumnId(i),
				style : this.getColumnStyle(i),
				locked : cm.isLocked(i)	// <-- -->
			};
		}
		return cs;
	},

	// Private - Overriden
	doRender : function(cs, rs, ds, startRow, colCount, stripe) {
		var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
		// <--
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		// -->
		var tstyle = 'width:' + this.getTotalWidth() + ';';
		//<!--
		var buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {
			tstyle : tstyle
		}, r;
		// -->
		for (var j = 0, len = rs.length; j < len; j++) {
			r = rs[j];
			cb = [];
			lcb = []; //<!-- -->
			var rowIndex = (j + startRow);
			for (var i = 0; i < colCount; i++) {
				c = cs[i];
				p.id = c.id;
				p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last
						? 'x-grid3-cell-last '
						: '');
				p.attr = p.cellAttr = "";
				p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
				p.style = c.style;
				if (p.value == undefined || p.value === "") {
					p.value = "&#160;";
				}
				if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
					p.css += ' x-grid3-dirty-cell';
				}
				// <-- 
				if (c.id == this.grid.master_column_id) {
					p.treeui = this.renderCellTreeUI(r, ds, cs);
				} else {
					p.treeui = '';
				}
				if (c.locked)
					lcb[lcb.length] = ct.apply(p);
				else
					cb[cb.length] = ct.apply(p);				
				// -->
			}
			var alt = [];
			if (stripe && ((rowIndex + 1) % 2 == 0)) {
				alt[0] = "x-grid3-row-alt";
			}
			if (r.dirty) {
				alt[1] = " x-grid3-dirty-row";
			}
			rp.cols = colCount;
			if (this.getRowClass) {
				alt[2] = this.getRowClass(r, rowIndex, rp, ds);
			}
			rp.alt = alt.join(" ");
			// <--
			rp.cells = lcb.join("");
			rp.tstyle = 'width:' + lw + ';';
			lbuf[lbuf.length] = rt.apply(rp);
			rp.cells = cb.join("");
			rp.tstyle = 'width:' + (tw - lw) + ';';
			if (!ds.isVisibleNode(r)) {
				rp.display_style = 'display: none;';
			} else {
				rp.display_style = '';
			}
			rp.level = ds.getNodeDepth(r);
			// -->
			buf[buf.length] = rt.apply(rp);
		}
		return [buf.join(""), lbuf.join("")];
	},

	renderCellTreeUI : function(record, store) {
		var tpl = this.templates.treeui, line_tpl = this.templates.elbow_line, tpl_data = {}, rec, parent, depth = level = store
				.getNodeDepth(record);
		if (this.grid.ifcheck) {
			tpl_data.wrap_width = (depth + 1) * 16 + 40;
		} else {
			tpl_data.wrap_width = (depth + 1) * 16 + 16;
		}
		if (level > 0) {
			tpl_data.elbow_line = '';
			rec = record;
			var left = 0;
			while (level--) {
				parent = store.getNodeParent(rec);
				if (parent) {
					if (store.hasNextSiblingNode(parent)) {
						tpl_data.elbow_line = line_tpl.apply({
									left : level * 16,
									cls : 'ux-maximgb-treegrid-elbow-line'
								}) + tpl_data.elbow_line;
					} else {
						tpl_data.elbow_line = line_tpl.apply({
									left : level * 16,
									cls : 'ux-maximgb-treegrid-elbow-empty'
								}) + tpl_data.elbow_line;
					}
				} else {
					throw ["Tree inconsistency can't get level ", level + 1,
							" node(id=", rec.id, ") parent."].join("")
				}
				rec = parent;
			}
		}
		if (store.isLeafNode(record)) {
			if (store.hasNextSiblingNode(record)) {
				tpl_data.cls = 'ux-maximgb-treegrid-elbow';
			} else {
				tpl_data.cls = 'ux-maximgb-treegrid-elbow-end';
			}
			tpl_data.diyStyle = (!record.data.iconCls || record.data.iconCls == "")
				? "cog"
				: record.data.iconCls
		} else {
			tpl_data.cls = 'ux-maximgb-treegrid-elbow-active ';
			if (store.isExpandedNode(record)) {
				if (store.hasNextSiblingNode(record)) {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-minus';
				} else {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-minus';
				}
			} else {
				if (store.hasNextSiblingNode(record)) {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-plus';
				} else {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-plus';
				}
			}
			tpl_data.diyStyle = (!record.data.iconCls || record.data.iconCls == "")
				? "ux-test"
				: record.data.iconCls
		}
		tpl_data.left = 1 + depth * 16;
		tpl_data.left1 = 1 + depth * 16 + 16;
		tpl_data.leftbox = tpl_data.left1 + 16;
		tpl_data.blank = "blank";
		tpl_data.checked = record.data.ischeck?"checked":"";// 如果数据集中传入参数设置为checked则表示页面显示时可以check
		tpl_data.disabled = (this.grid.ifdisable&&record.data.ischeck)?"disabled":"";//checkbox选中时，判断是否禁用checkbox
		tpl_data.cid = record.id;
		return tpl.apply(tpl_data);
	},

	getLockedRows : function() {
		return this.hasRows() ? this.lockedBody.dom.childNodes : [];
	},

	getLockedRow : function(row) {
		return this.getLockedRows()[row];
	},

	getCell : function(rowIndex, colIndex) {
		var locked = this.cm.getLockedCount();
		var row;
		if (colIndex < locked) {
			row = this.getLockedRow(rowIndex);
		} else {
			row = this.getRow(rowIndex);
			colIndex -= locked;
		}
		return row.getElementsByTagName('td')[colIndex];
	},
	// <-- group 
	getHeaderCell : function(index) {
		var locked = this.cm.getLockedCount();
		if (index < locked) {
			return this.lockedHd.query('td.x-grid3-cell')[index];
		} else {
			return this.mainHd.query('td.x-grid3-cell')[(index - locked)];
		}
	},
	// -->

	scrollToTop : function() {
		Ext.ux.maximgb.treegrid.GridView.superclass.scrollToTop.call(this);
		this.syncScroll();
	},

	syncScroll : function(e) {
		Ext.ux.maximgb.treegrid.GridView.superclass.syncScroll.call(this, e);
		var mb = this.scroller.dom;
		this.lockedScroller.dom.scrollTop = mb.scrollTop;
	},
	
	// <-- group
	updateGroupStyles: function(col) {
		var tables = [this.mainHd.query('.x-grid3-header-offset > table'), this.lockedHd.query('.x-grid3-header-offset > table')], tw = this.cm.getTotalWidth(), lw = this.cm.getTotalLockedWidth();
		for (var i = 0; i < tables[0].length; i++) {
			tables[0][i].style.width = (tw - lw) + 'px';
			tables[1][i].style.width = lw + 'px';
			if (i < this.cm.rows.length) {
				var cells = [], c = [tables[1][i].firstChild.firstChild.childNodes, tables[0][i].firstChild.firstChild.childNodes];
				for (var l = 0; l < 2; l++) {
					for (var j = 0; j < c[l].length; j++) {
						cells.push(c[l][j]);
					}
				}
				for (var k = 0; k < cells.length; k++) {
					var c = this.cm.rows[i][k];
					if ((typeof col != 'number') || (col >= c.col && col < c.col + c.colspan)) {
						var gs = this.getGroupStyle(c);
						cells[k].style.width = gs.width;
						cells[k].style.display = gs.hidden ? 'none' : '';
					}
				}
			}
		}
	},

	updateSortIcon : function(col, dir) {
		var sc = this.sortClasses;
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		var hds = this.mainHd.select('td.x-grid3-cell').removeClass(sc);
		var lhds = this.lockedHd.select('td.x-grid3-cell').removeClass(sc);
		if (lclen > 0 && col < lclen)
			lhds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
		else
			hds.item(col - lclen).addClass(sc[dir == "DESC" ? 1 : 0]);
	},
	
	getGroupStyle: function(c) {
		var w = 0, h = true;
		for (var i = c.col; i < c.col + c.colspan; i++) {
			if (!this.cm.isHidden(i)) {
				var cw = this.cm.getColumnWidth(i);
				if(typeof cw == 'number'){
					w += cw;
				}
				h = false;
			}
		}
		return {
			width: w + 'px',
			hidden: h
		}
	},
	// -->

    updateAllColumnWidths : function(){
        var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
        var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
        var ws = [];
        for(var i = 0; i < clen; i++){
            ws[i] = this.getColumnWidth(i);
        }

        this.innerHd.firstChild.firstChild.style.width = (tw - lw) + 'px';
		this.mainWrap.dom.style.left = lw + 'px';
		this.lockedInnerHd.firstChild.firstChild.style.width = lw + 'px';
		this.lockedScroller.dom.style.width = (lw-1) + 'px';

        for(var i = 0; i < clen; i++){
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }

        var ns = this.getRows();
		var lns = this.getLockedRows();
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width =(tw - lw) + 'px';
            ns[i].firstChild.style.width = (tw-lw) + 'px';
            lns[i].style.width = lw + 'px';
            lns[i].firstChild.style.width = lw + 'px';
            for(var j = 0; j < lclen; j++){
				var row = lns[i].firstChild.rows[0];
                row.childNodes[j].style.width = ws[j];
            }
            for(var j = lclen; j < clen; j++){
				var row = ns[i].firstChild.rows[0];
                row.childNodes[j-lclen].style.width = ws[j]
            }
        }

        this.onAllColumnWidthsUpdated(ws, tw);
        this.updateGroupStyles(tw);
    },

    updateColumnWidth : function(col, width){
        var w = this.cm.getColumnWidth(col);
        var tw = this.cm.getTotalWidth();
		var lclen = this.cm.getLockedCount();
		var lw = this.cm.getTotalLockedWidth();
		var colIndex = col;

        var hd = this.getHeaderCell(col);
        hd.style.width = w + 'px';

		var ns, gw;
		if(col < lclen) {
			ns = this.getLockedRows();
			gw = lw;
			this.lockedInnerHd.firstChild.firstChild.style.width = gw + 'px';
			this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth() + 'px';
			this.mainWrap.dom.style.display='none';
			this.mainWrap.dom.style.display='';
		}else {
			ns = this.getRows();
			gw = tw - lw;
			col -= lclen;
			this.innerHd.firstChild.firstChild.style.width = gw + 'px';
		}
		
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = gw + 'px';
            ns[i].firstChild.style.width = gw + 'px';
            ns[i].firstChild.rows[0].childNodes[col].style.width = w + 'px';
        }

        this.onColumnWidthUpdated(col, w, tw);
		this.updateGroupStyles(colIndex);
		this.layout();
    },
    
    getHeaderCell : function(index){
	    var locked = this.cm.getLockedCount();
	    if(index < locked){
			return this.lockedHd.query('td.x-grid3-cell')[index];
		} else {
			return this.mainHd.query('td.x-grid3-cell')[(index-locked)];
		}
	},	

	updateColumnHidden : function(col, hidden) {
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
		var lclen = this.cm.getLockedCount();
		var colIndex = col;

		this.innerHd.firstChild.firstChild.style.width = tw;

		var display = hidden ? 'none' : '';
		var hd = this.getHeaderCell(col);
		hd.style.display = display;

		var ns, gw;
		if (col < lclen) {
			ns = this.getLockedRows();
			gw = lw;
			this.lockedHd.dom.firstChild.firstChild.style.width = gw;
			this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth();
		} else {
			ns = this.getRows();
			gw = tw - lw;
			col -= lclen;
			this.innerHd.firstChild.firstChild.style.width = gw;
		}

		for (var i = 0, len = ns.length; i < len; i++) {
			ns[i].style.width = gw;
			ns[i].firstChild.style.width = gw;
			ns[i].firstChild.rows[0].childNodes[col].style.display = display;
		}

		this.onColumnHiddenUpdated(col, hidden, tw);
		this.updateGroupStyles(colIndex);
		delete this.lastViewWidth;
		this.layout();
	},

	processRows : function(startRow, skipStripe) {
		if (this.ds.getCount() < 1) {
			return;
		}
		skipStripe = skipStripe || !this.grid.stripeRows;
		startRow = startRow || 0;
		var cls = ' x-grid3-row-alt ';
		var rows = this.getRows();
		var lrows = this.getLockedRows();
		for (var i = startRow, len = rows.length; i < len; i++) {
			var row = rows[i];
			var lrow = lrows[i];
			row.rowIndex = i;
			lrow.rowIndex = i;
			if (!skipStripe) {
				var isAlt = ((i + 1) % 2 == 0);
				var hasAlt = (' ' + row.className + ' ').indexOf(cls) != -1;
				if (isAlt == hasAlt) {
					continue;
				}
				if (isAlt) {
					row.className += " x-grid3-row-alt";
					lrow.className += " x-grid3-row-alt";
				} else {
					row.className = row.className
							.replace("x-grid3-row-alt", "");
					lrow.className = lrow.className.replace("x-grid3-row-alt",
							"");
				}
			}
		}
	},

	layout : function() {
		if (!this.mainBody) {
			return;
		}
		var g = this.grid;
		var c = g.getGridEl(), cm = this.cm, expandCol = g.autoExpandColumn, gv = this;
		var lw = cm.getTotalLockedWidth();
		var csize = c.getSize(true);
		var vw = csize.width;

		if (vw < 20 || csize.height < 20) {
			return;
		}

		if (g.autoHeight) {
			this.scroller.dom.style.overflow = 'visible';
			this.lockedScroller.dom.style.overflow = 'visible';
		} else {
			
			this.el.setSize(csize.width, csize.height);

			var hdHeight = this.mainHd.getHeight();
			var vh = csize.height - (hdHeight);

			this.scroller.setSize(vw - lw, vh);
			var scrollbar = (this.scroller.dom.scrollWidth > this.scroller.dom.clientWidth) ? 17 : 0;
			this.lockedScroller.setSize(cm.getTotalLockedWidth(), vh
							- scrollbar);
			if (this.innerHd) {
				this.innerHd.style.width = (vw) + 'px';
			}
		}
		if (this.forceFit) {
			if (this.lastViewWidth != vw) {
				this.fitColumns(false, false);
				this.lastViewWidth = vw;
			}
		} else {
			this.autoExpand();
		}
		this.mainWrap.dom.style.left = lw + 'px';

		this.onLayout(vw, vh);
	},
	
	refreshRow : function(record){
		Ext.grid.LockingGridView.superclass.refreshRow.call(this, record);
		var index = this.ds.indexOf(record);
		this.getLockedRow(index).rowIndex = index;
	},

	renderGroupHeaders: function(renderHeaders) {
		var ts = this.templates, rows = [[], []], tw = this.cm.getTotalWidth(), lw = this.cm.getTotalLockedWidth();
		for (var i = 0; i < this.cm.rows.length; i++) {
			var r = this.cm.rows[i], cells = [[], []], col = 0;
			if(r){
				for (var j = 0; j < r.length; j++) {
					var c = r[j];
					c.colspan = c.colspan || 1;
					c.col = col;
					var l = this.cm.isLocked(col) ? 1 : 0; 
					col += c.colspan;
					var gs = this.getGroupStyle(c);
					cells[l][j] = ts.gcell.apply({
						id: c.id || i + '-' + col,
						cls: c.header ? 'ux-grid-hd-group-cell' : 'ux-grid-hd-nogroup-cell',
						style: 'width:' + gs.width + ';' + (gs.hidden ? 'display:none;' : '') + (c.align ? 'text-align:' + c.align + ';' : ''),
						tooltip: c.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + c.tooltip + '"' : '',
						value: c.header || '&#160;',
						istyle: c.align == 'right' ? 'padding-right:8px' : ''
					});
				}
				rows[0][i] = ts.header.apply({
					tstyle: 'width:' + (tw - lw) + 'px;',
					cells: cells[0].join('')
				});
				rows[1][i] = ts.header.apply({
					tstyle: 'width:' + (lw) + 'px;',
					cells: cells[1].join('')
				});
			}
		}
		this.cm.rows.length = i;
		return rows;
	},

	renderHeaders : function() {
		var rows = this.renderGroupHeaders();
		var cm = this.cm, ts = this.templates;
		var ct = ts.hcell;
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();

		var cb = [], lb = [], sb = [], lsb = [], p = {};

		for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
			p.id = cm.getColumnId(i);
			p.value = cm.getColumnHeader(i) || "";
			p.style = this.getColumnStyle(i, true);
			if (cm.config[i].align == 'right') {
				p.istyle = 'padding-right:16px';
			} else {
				delete p.istyle;
			}
			if (cm.isLocked(i)) {
				lb[lb.length] = ct.apply(p);
			} else {
				cb[cb.length] = ct.apply(p);
			}
		}
		rows[0][rows.length] = ts.header.apply({cells : cb.join(""), tstyle : 'width:' + (tw - lw) + ';'});
		rows[1][rows.length] = ts.header.apply({cells : lb.join(""), tstyle : 'width:' + (lw) + ';'});
		return [rows[0].join(''), rows[1].join('')];
	},

    getColumnStyle : function(col, isHeader){
        var style = !isHeader ? (this.cm.config[col].css || '') : '';
        style += 'width:'+this.getColumnWidth(col)+';';
        if(this.cm.isHidden(col)){
            style += 'display:none;';
        }
        var align = this.cm.config[col].align;
        if(align){
            style += 'text-align:'+align+';';
        }
        return style;
    },
    
    // private
    getColumnWidth : function(col){
        var w = this.cm.getColumnWidth(col);
        if(typeof w == 'number'){
            return w + 'px';
        }
        return w;
    },
    
	updateHeaders : function() {
		var hd = this.renderHeaders();
		this.innerHd.firstChild.innerHTML = hd[0];
		this.lockedInnerHd.firstChild.innerHTML = hd[1];
	},

	handleHdMenuClick : function(item) {
		var index = this.hdCtxIndex;
		var cm = this.cm, ds = this.ds;
		switch (item.id) {
			case "asc" :
				ds.sort(cm.getDataIndex(index), "ASC");
				break;
			case "desc" :
				ds.sort(cm.getDataIndex(index), "DESC");
				break;
			// <--
			case "lock" :
				var lc = cm.getLockedCount();
				if (cm.getColumnCount(true) <= lc + 1) {
					this.onDenyColumnLock();
					return;
				}
				if (lc != index) {
					cm.setLocked(index, true, true);
					cm.moveColumn(index, lc);
					this.grid.fireEvent("columnmove", index, lc);
				} else {
					cm.setLocked(index, true);
				}
				break;
			case "unlock" :
				var lc = cm.getLockedCount();
				if ((lc - 1) != index) {
					cm.setLocked(index, false, true);
					cm.moveColumn(index, lc - 1);
					this.grid.fireEvent("columnmove", index, lc - 1);
				} else {
					cm.setLocked(index, false);
				}
				break;
			// -->
			default :
				index = cm.getIndexById(item.id.substr(4));
				if (index != -1) {
					if (item.checked
							&& cm.getColumnsBy(this.isHideableColumn, this).length <= 1) {
						this.onDenyColumnHide();
						return false;
					}
					cm.setHidden(index, item.checked);
				}
		}
		return true;
	},

	handleHdDown : function(e, t) {
		if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
			e.stopEvent();
			var hd = this.findHeaderCell(t);
			Ext.fly(hd).addClass('x-grid3-hd-menu-open');
			var index = this.getCellIndex(hd);
			this.hdCtxIndex = index;
			var ms = this.hmenu.items, cm = this.cm;
			ms.get("asc").setDisabled(!cm.isSortable(index));
			ms.get("desc").setDisabled(!cm.isSortable(index));
			// <--
			if (this.grid.enableColLock !== false && this.cm.rows.length <= 0) {
				ms.get("lock").setDisabled(cm.isLocked(index));
				ms.get("unlock").setDisabled(!cm.isLocked(index));
			}
			// -->
            this.hmenu.on("hide", function(){
                Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
            }, this, {single:true});
            this.hmenu.show(t, "tl-bl?");
		}
	},
	
	handleLockChange : function() {
		this.refresh(true);
	},

	onDenyColumnHide : function() {

	},

	onColumnLock : function() {
		this.handleLockChange.apply(this, arguments);
	},
	
	// Private
	getBreadcrumbsEl : function() {
		return this.breadcrumbs_el;
	},

	// Private
	expandRow : function(record, initial) {
		var ds = this.ds, i, len, row, lrow, pmel, children, index, child_index;

		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		} else {
			index = ds.indexOf(record);
		}
		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
		if (!pmel) {			
			lrow = this.getLockedRow(index);
			pmel = Ext.fly(lrow).child('.ux-maximgb-treegrid-elbow-active');
		}
		if (pmel) {	
			if (ds.hasNextSiblingNode(record)) {
				pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
				pmel.addClass('ux-maximgb-treegrid-elbow-minus');
			} else {
				pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
				pmel.addClass('ux-maximgb-treegrid-elbow-end-minus');
			}
		}
		if (ds.isVisibleNode(record)) {
			children = ds.getNodeChildren(record);
			for (i = 0, len = children.length; i < len; i++) {
				child_index = ds.indexOf(children[i]);
				row = this.getRow(child_index);
				lrow = this.getLockedRow(child_index);
				Ext.fly(row).setStyle('display', 'block');
				Ext.fly(lrow).setStyle('display', 'block');
				if (ds.isExpandedNode(children[i])) {
					this.expandRow(child_index);
				}
			}
		}		
	},

	collapseRow : function(record) {
		var ds = this.ds, i, len, children, row, lrow, index;

		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		} else {
			index = ds.indexOf(record);
		}

		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
		if (!pmel) {			
			lrow = this.getLockedRow(index);
			pmel = Ext.fly(lrow).child('.ux-maximgb-treegrid-elbow-active');
		}
		if (pmel) {
			if (ds.hasNextSiblingNode(record)) {
				pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
				pmel.addClass('ux-maximgb-treegrid-elbow-plus');
			} else {
				pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
				pmel.addClass('ux-maximgb-treegrid-elbow-end-plus');
			}
		}
		children = ds.getNodeChildren(record);
		for (i = 0, len = children.length; i < len; i++) {
			index = ds.indexOf(children[i]);
			row = this.getRow(index);
			lrow = this.getLockedRow(index);
			Ext.fly(row).setStyle('display', 'none');
			Ext.fly(lrow).setStyle('display', 'none');
			this.collapseRow(index);
		}		
	},

	/**
	 * @access private
	 */
	initData : function(ds, cm) {
		Ext.ux.maximgb.treegrid.GridView.superclass.initData.call(this, ds, cm);
		if (this.ds) {
			this.ds.un('activenodechange', this.onStoreActiveNodeChange, this);
			this.ds.un('expandnode', this.onStoreExpandNode, this);
			this.ds.un('collapsenode', this.onStoreCollapseNode, this);
			this.ds.un('check', this.onStoreCheck, this);
			this.ds.un('checkparentNode', this.checkparentNode,
					this);
		}
		if (ds) {
			ds.on('activenodechange', this.onStoreActiveNodeChange, this);
			ds.on('expandnode', this.onStoreExpandNode, this);
			ds.on('collapsenode', this.onStoreCollapseNode, this);
			ds.on('check', this.onStoreCheck, this);
			ds.on('checkparentNode', this.checkparentNode, this);
		}
	},

	onStoreActiveNodeChange : function(store, old_rc, new_rc) {
		var parents, i, len, rec, items = [], ts = this.templates;

		if (new_rc) {
			parents = this.ds.getNodeAncestors(new_rc), parents.reverse();
			parents.push(new_rc);

			for (i = 0, len = parents.length; i < len; i++) {
				rec = parents[i];
				items.push(ts.brd_item.apply({
							id : rec.id,
							title : this.grid.i18n.breadcrumbs_tip,
							caption : rec.get(this.cm.getDataIndex(this.cm
									.getIndexById(this.grid.master_column_id)))
						}));
			}

			this.breadcrumbs_el.update(this.grid.i18n.path_separator
					+ ts.brd_item.apply({
								id : '',
								title : this.grid.i18n.breadcrumbs_root_tip,
								caption : this.grid.root_title
							}) + this.grid.i18n.path_separator
					+ items.join(this.grid.i18n.path_separator));
		} else {
			this.setRootBreadcrumbs();
		}
	},

	setRootBreadcrumbs : function() {
		var ts = this.templates;
		this.breadcrumbs_el.update(this.grid.i18n.path_separator
				+ ts.brd_item.apply({
							id : '',
							title : this.grid.i18n.breadcrumbs_root_tip,
							caption : this.grid.root_title
						}));
	},

	onLoad : function(store, records, options) {
		var id = store.getLoadedNodeIdFromOptions(options);
		if (id === null) {
			Ext.ux.maximgb.treegrid.GridView.superclass.onLoad.call(this,
					store, records, options);
		}
	},

	onStoreExpandNode : function(store, rc) {
		this.expandRow(rc);
	},

	onStoreCollapseNode : function(store, rc) {
		this.collapseRow(rc);
	},
	// 增加节点中有选择为checkbox时点击选择事件时 处理选择是否选中问题
	onStoreCheck : function(store, rc, row, target) {
		if (store.getNodeChildren(rc).length > 0) {
			if (document.getElementById("masker-" + rc.id).checked) {
				var childs = store.getNodeChildren(rc);
				for (var i = 0; i < childs.length; i++) {
					document.getElementById("masker-" + childs[i].id).checked = true;
				}
			} else {
				var childs = store.getNodeChildren(rc);
				for (var i = 0; i < childs.length; i++) {
					document.getElementById("masker-" + childs[i].id).checked = false;
				}
			}
		};
		var childs = store.getNodeChildren(rc);
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			this.onStoreCheck(store, child, row, target);
		}
	},
	// 增加点击节点时判断是否有子节点如果有则展开子节点方法
	checkExpandChildNode : function(store, rc, row, target) {
		if (rc.data.iconCls == 'ux-test') {
			if (store.isExpandedNode(rc)) {
				store.collapseNode(rc);
			} else {
				store.expandNode(rc);
			}
		}
	},
	/**
	 * 
	 * @param {} node
	 * @return {Boolean}
	 */
	childHasChecked : function(store, rc){   
        var childNodes = store.getNodeChildren(rc);   
        if(childNodes || childNodes.length>0){   
            for(var i=0;i<childNodes.length;i++){   
                if(document.getElementById("masker-" + childNodes[i].id).checked){
                    return true;   
                }
            }   
        }   
        return false;   
    },
    
	/**
	 * 是否选中父节点
	 * 
	 * @param {}
	 *            store
	 * @param {}
	 *            rc
	 */
	checkparentNode : function(store, rc) {
		if(store.getNodeAncestors(rc).length>0){
			if (document.getElementById("masker-" + rc.id).checked) {
				var parents = store.getNodeAncestors(rc);
				for (var i = 0; i < parents.length; i++) {
					document.getElementById("masker-" + parents[i].id).checked = true;
				}
			} else {
				var parents = store.getNodeAncestors(rc);
				for (var i = 0; i < parents.length; i++) {
					if(this.childHasChecked(store, parents[i])) {
						return;
					}
					document.getElementById("masker-" + parents[i].id).checked = false;
				}
			}
		}
	},
	
	getCheckNodes : function (store) {
		var root = store.getAt(0);
		if (document.getElementById("masker-" + root.id).checked) {
			var allCheckedNodes = this.getCheckNodeChildren(store, root);
			allCheckedNodes.push(root);
			return allCheckedNodes;
		} else {
			return null;
		}
	},
	
	getCheckNodeChildren : function (store, rc) {
		var checkedNodes = new Array();
		var childNodes = store.getNodeChildren(rc);   
        if(childNodes && childNodes.length>0){   
            for(var i=0;i<childNodes.length;i++){
                if(document.getElementById("masker-" + childNodes[i].id).checked){
					checkedNodes.push(childNodes[i]);
					
					var checkedChildren = this.getCheckNodeChildren(store, childNodes[i]);
					if(checkedChildren && checkedChildren.length>0) {
						for (var j = 0; j < checkedChildren.length; j++) {
							checkedNodes.push(checkedChildren[j]);
						}
					}
                }
            }   
        }
        return checkedNodes;
	}
});

Ext.ux.maximgb.treegrid.GridPanel = Ext.extend(Ext.grid.GridPanel, {
			ifcheck : false,
			splitAt : 0,
			ifdisable : false,//新增属性，带checkbox时，设置是否禁用已勾选项的checkbox
			/**
			 * @cfg {String|Integer} master_column_id Master column id. Master
			 *      column cells are nested. Master column cell values are used
			 *      to build breadcrumbs.
			 */
			master_column_id : 0,

			/**
			 * @cfg {String} Root node title.
			 */
			root_title : null,

			/**
			 * @cfg {Object} i18n I18N text strings.
			 */
			i18n : null,

			// Private
			initComponent : function() {
				if (this.columns && (this.columns instanceof Array)) {
					this.colModel = new Ext.grid.LockableColumnModel(this.columns);
					delete this.columns;
				}
				Ext.ux.maximgb.treegrid.GridPanel.superclass.initComponent
						.call(this);

				Ext.applyIf(this.i18n,
						Ext.ux.maximgb.treegrid.GridPanel.prototype.i18n);

				if (!this.root_title) {
					this.root_title = this.title || this.i18n.root_title;
				}

				// 去掉顶部显示节点路径
				// this.getSelectionModel().on(
				// 'selectionchange',
				// this.onTreeGridSelectionChange,
				// this
				// );
			},

			/**
			 * Returns view instance.
			 * 
			 * @access private
			 * @return {GridView}
			 */
			getView : function() {
				if (!this.view) {
					this.view = new Ext.ux.maximgb.treegrid.GridView(this.viewConfig);
				}
				return this.view;
			},
			
			getCheckNodes : function (){
				return this.getView().getCheckNodes(this.getStore());
			},

			/**
			 * @access private
			 */
			onClick : function(e) {
				var target = e.getTarget(), view = this.getView(), row = view
						.findRowIndex(target), store = this.getStore(), sm = this
						.getSelectionModel(), record, record_id, do_default = true;
				// Row click
				if (row !== false) {
					if (Ext.fly(target).hasClass('ux-maximgb-treegrid-elbow-active')) {
						record = store.getAt(row);
						if (store.isExpandedNode(record)) {
							store.collapseNode(record);
						} else {
							
							store.expandNode(record);
						}
						do_default = false;
					} else if (Ext.fly(target).hasClass('masker')) {
						record = store.getAt(row);
						store.expandNode(record, true, function (record) {
							store.checkparentNode(record);
							store.checkRecord(record);
						});
					}
				}
				// Breadcrumb click
				else if (Ext.fly(target).hasClass('ux-maximgb-treegrid-brditem')) {
					record_id = Ext.id(target);
					record_id = record_id
							.substr(record_id.lastIndexOf('-') + 1);
					if (record_id != '') {
						record = store.getById(record_id);
						row = store.indexOf(record);

						if (e.hasModifier()) {
							if (store.isExpandedNode(record)) {
								store.collapseNode(record);
							} else {
								store.expandNode(record);
							}
						} else if (sm.isSelected && !sm.isSelected(row)) {
							sm.selectRow(row);
						}
					} else {
						sm.clearSelections();
					}
					e.preventDefault();
				}
				if (do_default) {
					Ext.ux.maximgb.treegrid.GridPanel.superclass.onClick.call(
							this, e);
				}
			},

			/**
			 * @access private
			 */
			onMouseDown : function(e) {
				var target = e.getTarget();
				if (!Ext.fly(target)
						.hasClass('ux-maximgb-treegrid-elbow-active')) {
					Ext.ux.maximgb.treegrid.GridPanel.superclass.onMouseDown
							.call(this, e);
				}
			},

			/**
			 * @access private
			 */
			onDblClick : function(e) {
				var target = e.getTarget(), view = this.getView(), row = view
						.findRowIndex(target), store = this.getStore(), sm = this
						.getSelectionModel(), record, record_id;

				// Breadcrumbs select + expand/collapse
				if (!row
						&& Ext.fly(target)
								.hasClass('ux-maximgb-treegrid-brditem')) {
					record_id = Ext.id(target);
					record_id = record_id
							.substr(record_id.lastIndexOf('-') + 1);
					if (record_id != '') {
						record = store.getById(record_id);
						row = store.indexOf(record);

						if (store.isExpandedNode(record)) {
							store.collapseNode(record);
						} else {
							store.expandNode(record);
						}

						if (sm.isSelected && !sm.isSelected(row)) {
							sm.selectRow(row);
						}
					} else {
						sm.clearSelections();
					}
				}

				Ext.ux.maximgb.treegrid.GridPanel.superclass.onDblClick.call(
						this, e);
			},

			/**
			 * @access private
			 */
			onTreeGridSelectionChange : function(sm, selection) {
				var record;
				// Row selection model
				if (sm.getSelected) {
					record = sm.getSelected();
					this.getStore().setActiveNode(record);
				}
				// Cell selection model
				else if (Ext.type(selection) == 'array' && selection.length > 0) {
					record = store.getAt(selection[0])
					this.getStore().setActiveNode(record);
				} else {
					throw "Unknown selection model applyed to the grid.";
				}
			}
		});

Ext.ux.maximgb.treegrid.GridPanel.prototype.i18n = {
	path_separator : ' / ',
	root_title : '[root]',
	breadcrumbs_tip : 'Click to select node, CTRL+Click to expand or collapse node, Double click to select and expand or collapse node.',
	breadcrumbs_root_tip : 'Click to select the top level node.'
}

/**
 * Paging toolbar for work this AbstractTreeStore.
 */
Ext.ux.maximgb.treegrid.PagingToolbar = Ext.extend(Ext.PagingToolbar, {
	onRender : function(ct, position) {
		Ext.ux.maximgb.treegrid.PagingToolbar.superclass.onRender.call(this,
				ct, position);
		this.updateUI();
	},

	getPageData : function() {
		var total = 0, cursor = 0;
		if (this.store) {
			cursor = this.store.getActiveNodePageOffset();
			total = this.store.getActiveNodeTotalCount();
		}
		return {
			total : total,
			activePage : Math.ceil((cursor + this.pageSize) / this.pageSize),
			pages : total < this.pageSize ? 1 : Math
					.ceil(total / this.pageSize)
		};
	},

	updateInfo : function() {
		var count = 0, cursor = 0, total = 0, msg;
		if (this.displayEl) {
			if (this.store) {
				cursor = this.store.getActiveNodePageOffset();
				count = this.store.getActiveNodeCount();
				total = this.store.getActiveNodeTotalCount();
			}
			msg = count == 0 ? this.emptyMsg : String.format(this.displayMsg,
					cursor + 1, cursor + count, total);
			this.displayEl.update(msg);
		}
	},

	updateUI : function() {
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;

		this.afterTextEl.el.innerHTML = String.format(this.afterPageText,
				d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.loading.enable();
		this.updateInfo();
	},

	unbind : function(store) {
		Ext.ux.maximgb.treegrid.PagingToolbar.superclass.unbind.call(this,
				store);
		store.un('activenodechange', this.onStoreActiveNodeChange, this);
	},

	bind : function(store) {
		Ext.ux.maximgb.treegrid.PagingToolbar.superclass.bind.call(this, store);
		store.on('activenodechange', this.onStoreActiveNodeChange, this);
	},

	beforeLoad : function(store, options) {
		Ext.ux.maximgb.treegrid.PagingToolbar.superclass.beforeLoad.call(this,
				store, options);
		if (options && options.params) {
			if (options.params[this.paramNames.start] === undefined) {
				options.params[this.paramNames.start] = 0;
			}
			if (options.params[this.paramNames.limit] === undefined) {
				options.params[this.paramNames.limit] = this.pageSize;
			}
		}
	},

	onClick : function(which) {
		var store = this.store, cursor = store ? store
				.getActiveNodePageOffset() : 0, total = store ? store
				.getActiveNodeTotalCount() : 0;
		switch (which) {
			case "first" :
				this.doLoad(0);
				break;
			case "prev" :
				this.doLoad(Math.max(0, cursor - this.pageSize));
				break;
			case "next" :
				this.doLoad(cursor + this.pageSize);
				break;
			case "last" :
				var extra = total % this.pageSize;
				var lastStart = extra ? (total - extra) : total - this.pageSize;
				this.doLoad(lastStart);
				break;
			case "refresh" :
				this.doLoad(cursor);
				break;
		}
	},

	onStoreActiveNodeChange : function(store, old_rec, new_rec) {
		if (this.rendered) {
			this.updateUI();
		}
	}
});

Ext.grid.LockableColumnModel = function(config) {
	Ext.grid.LockableColumnModel.superclass.constructor.call(this, config);
};

Ext.extend(Ext.grid.LockableColumnModel, Ext.grid.ColumnModel, {
	rows : [],
	
	getTotalLockedWidth : function() {
		var totalWidth = 0;
		for (var i = 0; i < this.config.length; i++) {
			if (this.isLocked(i) && !this.isHidden(i)) {
				totalWidth += this.getColumnWidth(i);
			}
		}
		return totalWidth;
	}
});


Ext.reg('ux-maximgb-treegrid', Ext.ux.maximgb.treegrid.GridPanel);
Ext.reg('ux-maximgb-paging', Ext.ux.maximgb.treegrid.PagingToolbar);
