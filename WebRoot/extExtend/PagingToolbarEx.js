Ext.PagingToolbarEx = Ext.extend(Ext.PagingToolbar, {
	updateInfo: function(){
		if(this.displayEl){
			var count = this.store.getCount();
			var msg = count == 0 ? this.emptyMsg : String.format(this.displayMsg, this.cursor, this.cursor + count - 1, this.store.getTotalCount());
			this.displayEl.update(msg);
		}
	},
	onLoad: function(store, r, o){
		var d =this.getPageData(), ap = d.activePage, ps = d.pages;
		this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1 || ps == 0);
		this.prev.setDisabled( ap == 1 || ps == 0);
		this.next.setDisabled(ap == ps || ps == 0);
		this.last.setDisabled(ap == ps || ps == 0);
		this.loading.enable();
		this.loading.setDisabled(ps == 0);
		this.updateInfo();
		
	},
	getPageData: function(){
		var total = this.store.getTotalCount();
		this.cursor = this.cursor==0?1:this.cursor
		return {
			total: total,
			activePage: total != 0 && Math.ceil(this.cursor / this.pageSize),
			pages: total !=0 && total < this.pageSize ? 1 : Math.ceil(total / this.pageSize)
		}
	},
	onClick: function(which){
				
				var store = this.store;
				var d = this.getPageData();
				switch(which) {
					case 'first':
						this.doLoad(1);
						break;
					case 'prev':
						this.doLoad(Math.max(1, d.activePage - 1));
						break;
					case 'next':
						this.doLoad(Math.min(d.pages, d.activePage + 1));
						break;
					case 'last':
						this.doLoad(d.pages);
						break;
					case 'refresh':
						this.doLoad(d.activePage);
						break;
				}
			},
	onPagingKeydown: function(e){
						var k = e.getKey()
						var d = this.getPageData()
						if(e.getKey()==e.RETURN){
							e.stopEvent();
							var pageNum = this.readPage()
							if(pageNum>0 && pageNum<=d.pages) {
								this.doLoad(pageNum)
							}
						}
					},
	doLoad: function(num){ this.cursor = (num-1) * this.pageSize + 1; this.store.loadPage(num) }
});