Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);//行号   
            var cindex = this.grid.getView().findCellIndex(t);//列好   
            var record = this.grid.store.getAt(index);//行记录   
            var field = this.grid.colModel.getDataIndex(cindex);//列名   
            var value = !record.data[this.dataIndex];//点击后，获得当前checkbox值的相反值   
            record.set(this.dataIndex, value);//设定checkbox被选择时候的值
            if(this.autoCommit===true) record.commit();
            //事件的参数   
            var e = {   
              grid: this.grid,   
              record: record,   
              field: field,    
              originalValue: !record.data[this.dataIndex],   
              value: record.data[this.dataIndex],   
              row: index,   
              column: cindex   
           };   
           this.grid.fireEvent("afteredit", e); //申请事件，参数  
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};