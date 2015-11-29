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
     * Gets the hierarchical path from the root of the current node.
     * @param {String} [field] The field to construct the path from. 
     * @param {String} [separator="/"] A separator to use.
     * @return {String} The node path
     */
    getPath: function(rec, field, separator) {
        separator = separator || '/';

        var path = [rec.get(field)],
            parent = this.getNodeParent(rec);

        while (parent) {
            path.unshift(parent.get(field));
            parent = this.getNodeParent(parent);
        }
        return separator + path.join(separator);
    },
	
	/**
     * Expand the tree to the path of a particular node.
     * @param {String} path The path to expand. The path should include a leading separator.
     * @param {String} field The field to get the data from.
     * @param {String} separator (optional) A separator to use. Defaults to `'/'`.
     */
    expandPath: function(path, field, separator) {
        var me = this,
            current = me.getAt(0),
            index = 1,
            keys,
            expander;

        separator = separator || '/';

        if (Ext.isEmpty(path)) {
            return;
        }

        keys = path.split(separator);
        if (current.get(field) != keys[1]) {
            return;
        }

        expander = function(){
            if (++index === keys.length) {
                return;
            }
            var node = me.findChild(current, field, keys[index]);
            if (!node) {
                return;
            }
            current = node;
            me.expandNode(current, false, expander);
        };
        me.expandNode(current, false, expander);
    },
    
    /**
     * Finds the first child that has the attribute with the specified value.
     * @param {String} attribute The attribute name
     * @param {Object} value The value to search for
     * @param {Boolean} [deep=false] True to search through nodes deeper than the immediate children
     * @return {Ext.data.NodeInterface} The found child or null if none was found
     */
    findChild : function(rec, attribute, value, deep) {
        return this.findChildBy(rec, function() {
            return this.get(attribute) == value;
        }, null, deep);
    },

    /**
     * Finds the first child by a custom function. The child matches if the function passed returns true.
     * @param {Function} fn A function which must return true if the passed Node is the required Node.
     * @param {Object} [scope] The scope (this reference) in which the function is executed. Defaults to the Node being tested.
     * @param {Boolean} [deep=false] True to search through nodes deeper than the immediate children
     * @return {Ext.data.NodeInterface} The found child or null if none was found
     */
    findChildBy : function(rec, fn, scope, deep) {
        var cs = this.getNodeChildren(rec),
            len = cs.length,
            i = 0, n, res;

        for (; i < len; i++) {
            n = cs[i];
            if (fn.call(scope || n, n) === true) {
                return n;
            }
            else if (deep) {
                res = this.findChildBy(n, fn, scope, deep);
                if (res !== null) {
                    return res;
                }
            }
        }
        return null;
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
	setRootNodes : function(_rootid) {
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
			root_nodes_id:null,
			setRootNodes:function(_rootid){
				this.root_nodes_id=_rootid;
			},
			getRootNodes : function() {
				var i, len, result = [], records = this.data.getRange();

				for (i = 0, len = records.length; i < len; i++) {
					if (records[i].get(this.parent_id_field_name) == "0") {
						result.push(records[i]);
					}
					if(this.root_nodes_id!=null){
						if (records[i].get(this.parent_id_field_name) == this.root_nodes_id) {
							result.push(records[i]);
						}
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

	// private - overriden
	initTemplates : function() {
		var ts = this.templates || {};

		// ts.master = new Ext.Template(
		// '<div class="x-grid3" hidefocus="true">',
		// '<div class="x-grid3-viewport">',
		// '<div class="x-grid3-header">',
		// // Breadcrumbs
		// '<div class="x-grid3-header-inner">',
		// '<div class="x-grid3-header-offset">',
		// '<div class="ux-maximgb-treegrid-breadcrumbs">&#160;</div>',
		// '</div>',
		// '</div>',
		// '<div class="x-clear"></div>',
		// // End of breadcrumbs
		// // Header
		// '<div class="x-grid3-header-inner">',
		// '<div class="x-grid3-header-offset">{header}</div>',
		// '</div>',
		// '<div class="x-clear"></div>',
		// // End of header
		// '</div>',
		// // Scroller
		// '<div class="x-grid3-scroller">',
		// '<div class="x-grid3-body">{body}</div>',
		// '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
		// '</div>',
		// // End of scroller
		// '</div>',
		// '<div class="x-grid3-resize-marker">&#160;</div>',
		// '<div class="x-grid3-resize-proxy">&#160;</div>',
		// '</div>'
		// );
		// 此处上面和下面的区别是去掉点击节点时上面出现节点路径
		ts.master = new Ext.Template(
				'<div class="x-grid3" hidefocus="true">',
				'<div class="x-grid3-viewport">',
				'<div class="x-grid3-header">',
				// Breadcrumbs
				'<div class="x-grid3-header-inner">',
				'<!--div class="x-grid3-header-offset">',
				'<div class="ux-maximgb-treegrid-breadcrumbs">&#160;</div>',
				'</div-->',
				'</div>',
				'<div class="x-clear"></div>',
				// End of breadcrumbs
				// Header
				'<div class="x-grid3-header-inner">',
				'<div class="x-grid3-header-offset">{header}</div>',
				'</div>',
				'<div class="x-clear"></div>',
				// End of header
				'</div>',
				// Scroller
				'<div class="x-grid3-scroller">',
				'<div class="x-grid3-body">{body}</div>',
				'<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
				'</div>',
				// End of scroller
				'</div>', '<div class="x-grid3-resize-marker">&#160;</div>',
				'<div class="x-grid3-resize-proxy">&#160;</div>', '</div>');

		ts.row = new Ext.Template(
				'<div class="x-grid3-row {alt} ux-maximgb-treegrid-level-{level}" style="{tstyle} {display_style}">',
				'<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<tbody>',
				'<tr>{cells}</tr>',
				(this.enableRowBody
						? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}">'
								+ '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">'
								+ '<div class="x-grid3-row-body">{body}</div>'
								+ '</td>' + '</tr>'
						: ''), '</tbody>', '</table>', '</div>');

		ts.cell = new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'{treeui}',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
				'</td>');

		ts.treeui = new Ext.Template(
				'<div class="ux-maximgb-treegrid-uiwrap" style="width: {wrap_width}px">',
				'{elbow_line}',
				'<div style="left: {left}px" class="{cls}">&#160;</div>',
				'<div style="left: {left1}px" class="{diyStyle}">&#160;</div>',
				'</div>');
		// 设置是否添加checkbox按钮
		if (this.grid.ifcheck) {
			ts.treeui = new Ext.Template(
					'<div class="ux-maximgb-treegrid-uiwrap" style="width: {wrap_width}px">',
					'{elbow_line}',
					'<div style="left: {left}px" class="{cls}">&#160;</div>',
					'<div style="left: {left1}px" class="{diyStyle}">&#160;</div>',
					'<div style="left: {leftbox}px" id="blank-{id}" class="{blank}"><input type=checkbox  id="masker-{cid}"  class="masker" {disabled} name="checkNode" {checked} /> </div>',
					'</div>');
		}

		ts.elbow_line = new Ext.Template('<div style="left: {left}px" class="{cls}">&#160;</div>');

		ts.brd_item = new Ext.Template('<a href="#" id="ux-maximgb-treegrid-brditem-{id}" class="ux-maximgb-treegrid-brditem" title="{title}">{caption}</a>');

		this.templates = ts;
		Ext.ux.maximgb.treegrid.GridView.superclass.initTemplates.call(this);
	},
	refresh : function(headersToo) {
		this.fireEvent("beforerefresh", this);
		this.grid.stopEditing(true);

		var result = this.renderBody();
		this.mainBody.update(result);

		if (headersToo === true) {
			this.updateHeaders();
			this.updateHeaderSortState();
		}
		this.processRows(0, true);
		this.layout();
		this.applyEmptyText();
		this.fireEvent("refresh", this);
	},
	// private - overriden
	initElements : function() {
		var E = Ext.Element;

		var el = this.grid.getGridEl().dom.firstChild;
		var cs = el.childNodes;

		this.el = new E(el);

		this.mainWrap = new E(cs[0]);
		this.mainHd = new E(this.mainWrap.dom.firstChild);

		if (this.grid.hideHeaders) {
			this.mainHd.setDisplayed(false);
		}

		// ----- Modification start
		// Original: this.innerHd = this.mainHd.dom.firstChild;
		this.innerHd = this.mainHd.dom.childNodes[2];
		// ----- End of modification
		this.scroller = new E(this.mainWrap.dom.childNodes[1]);

		if (this.forceFit) {
			this.scroller.setStyle('overflow-x', 'hidden');
		}
		this.mainBody = new E(this.scroller.dom.firstChild);

		this.focusEl = new E(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent("click", true);

		this.resizeMarker = new E(cs[1]);
		this.resizeProxy = new E(cs[2]);
		// this.breadcrumbs_el = this.el
		// .child('.ux-maximgb-treegrid-breadcrumbs');
		// this.setRootBreadcrumbs();
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
			if (before) {
				Ext.DomHelper.insertHtml('beforeBegin', before, html);
			} else {
				Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
			}
			if (!isUpdate) {
				this.fireEvent("rowsinserted", this, firstRow, lastRow);
				this.processRows(firstRow);
			}
		}
	},

	// private
	renderRows : function(startRow, endRow) {
		// pull in all the crap needed to render rows
		var g = this.grid, cm = g.colModel, ds = g.store, stripe = g.stripeRows;
		var colCount = cm.getColumnCount();

		if (ds.getCount() < 1) {
			return "";
		}

		var cs = this.getColumnData();

		startRow = startRow || 0;
		endRow = typeof endRow == "undefined" ? ds.getCount() - 1 : endRow;
		// records to render
		var rs = ds.getRange(startRow, endRow);
		return this.doRender(cs, rs, ds, startRow, colCount, stripe);
	},
	// Private - Overriden
	doRender : function(cs, rs, ds, startRow, colCount, stripe) {
		var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
		var tstyle = 'width:' + this.getTotalWidth() + ';';
		// buffers
		var buf = [], cb, c, p = {}, rp = {
			tstyle : tstyle
		}, r;
		for (var j = 0, len = rs.length; j < len; j++) {
			r = rs[j];
			cb = [];
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
				// ----- Modification start
				if (c.id == this.grid.master_column_id) {
					p.treeui = this.renderCellTreeUI(r, ds, cs);
				} else {
					p.treeui = '';
				}
				// ----- End of modification
				cb[cb.length] = ct.apply(p);
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
			rp.cells = cb.join("");
			// ----- Modification start
			if (!ds.isVisibleNode(r)) {
				rp.display_style = 'display: none;';
			} else {
				rp.display_style = '';
			}
			rp.level = ds.getNodeDepth(r);

			// ----- End of modification
			buf[buf.length] = rt.apply(rp);
		}
		return buf.join("");
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

	// Private
	getBreadcrumbsEl : function() {
		return this.breadcrumbs_el;
	},

	// Private
	expandRow : function(record, initial) {
		var ds = this.ds, i, len, row, pmel, children, index, child_index;

		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		} else {
			index = ds.indexOf(record);
		}
		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
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
			if (ds.isVisibleNode(record)) {
				children = ds.getNodeChildren(record);
				for (i = 0, len = children.length; i < len; i++) {
					child_index = ds.indexOf(children[i]);
					row = this.getRow(child_index);
					Ext.fly(row).setStyle('display', 'block');
					if (ds.isExpandedNode(children[i])) {
						this.expandRow(child_index);
					}
				}
			}
		}
	},

	collapseRow : function(record) {
		var ds = this.ds, i, len, children, row, index;

		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		} else {
			index = ds.indexOf(record);
		}

		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
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
			children = ds.getNodeChildren(record);
			for (i = 0, len = children.length; i < len; i++) {
				index = ds.indexOf(children[i]);
				row = this.getRow(index);
				Ext.fly(row).setStyle('display', 'none');
				this.collapseRow(index);
			}
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
					if (Ext.fly(target)
							.hasClass('ux-maximgb-treegrid-elbow-active')) {
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
				else if (Ext.fly(target)
						.hasClass('ux-maximgb-treegrid-brditem')) {
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

Ext.reg('ux-maximgb-treegrid', Ext.ux.maximgb.treegrid.GridPanel);
Ext.reg('ux-maximgb-paging', Ext.ux.maximgb.treegrid.PagingToolbar);
