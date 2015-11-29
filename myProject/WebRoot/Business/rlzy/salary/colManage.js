Ext.onReady(function(){
	var colmenu = new Ext.menu.Menu(); 
	colMangeBtn = new Ext.Toolbar.Button({
		id: 'colMange',
        icon: colsShowBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>显示列</b>",
        menu: colmenu,
        handler:function(){addColToMenu(mygrid)}
    });
    
    function addColToMenu(grid) {
    	colmenu.removeAll() ;
    	var headData = getHeadData(grid)
    	var arr = getMenu(0,headData[0].length-1,headData,0,grid)
    	for(var i=0;i<arr.length;i++) {
    		colMangeBtn.menu.add(arr[i])
    	}
    }
    function getMenu(bnode,bsize,data,l,grid) {
    	var arr = new Array() ;
    	for(var w = bnode;w<=bnode+bsize;w++) {
    		if(data[l].length>w+1&&data[l][w+1]=="#cspan") {
	    		var k = 0 ;
	    		var key = w ;
    			for(var j=w+1;j<data[l].length;j++) {
    				if(data[l][j]!="#cspan") {
    					break ;
    				} else {
    					k++ ;
    					key += "-"+j ;
    				}
    			}
    			var flag = !grid.isColumnHidden(w)  ;
				var menucol = {
	    			id:key,
	    			text:data[l][w],
	    			checked:flag,
	    			hideOnClick:false,
	    			checkHandler: onItemCheck
	    		}
	    		menucol.menu = getMenu(w,k,data,l+1,grid)
	    		arr.push(menucol)
    			w = w+k ;
	    	} else {
	    		var flag = !grid.isColumnHidden(w)  ;
				var menucol = {
	    			id:w+"",
	    			text:data[l][w],
	    			checked:flag,
	    			hideOnClick:false,
	    			checkHandler: onItemCheck
	    		}
	    		arr.push(menucol)
	    	}
    	}
    	return arr;
    }
    function onItemCheck(node,checked) {
    	var n = node.id.split("-")
    	for(var i=0;i<n.length;i++) {
    		mygrid.setColumnHidden(n[i],!checked)
    	}
    	return true
    }
})
