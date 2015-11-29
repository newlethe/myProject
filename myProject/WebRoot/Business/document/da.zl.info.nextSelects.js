/**
 * 翻页后，保持已经选择的记录仍然选中
 */
var collection=new Ext.util.MixedCollection();
function storeSelects(dsSelect,smSelect){
	dsSelect.on('load',function(store1, records, options){
		store1.each(function(rec) {   
	         if (collection.containsKey(rec.get("daid"))) {   
	             smSelect.selectRecords([rec], true);   
	         }   
	    }); 
	});
	dsSelect.on('beforeload',function(store2, options){
         store2.each(function(rec) {   
             if (smSelect.isSelected(rec)) {   
                 collection.add(rec.get("daid"),rec);   
             } else {   
                 collection.removeKey(rec.get("daid"));   
             }   
         });   
	});
	smSelect.on('rowselect',function(sm, rowIndex, rec){
		collection.add(rec.get("daid"),rec); 
	});
	smSelect.on('rowdeselect',function(sm, rowIndex, rec){
		collection.removeKey(rec.get("daid")); 
	});
}
function collectionClear(){
	collection.clear();
}
function collectionToRecords(){
	var recs=new Array();
	for(var i = 0;i<collection.getCount();i++){
		recs.push(collection.item(i));
	}
	collectionClear();
	return recs;
}