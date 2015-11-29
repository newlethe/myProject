/**
 * 翻页后，保持已经选择的记录仍然选中
 */
var collection=new Ext.util.MixedCollection();
//增加一个主键参数，解决主键不是uids的问题，以前调用此方法时没传这个参数，则typeof primaryKey为undefined  pengy 2013-9-6
function storeSelects(dsSelect,smSelect, primaryKey){
	var pKey = typeof primaryKey == "undefined" ? "uids" : primaryKey;
	dsSelect.on('load',function(store1, records, options){
		store1.each(function(rec) {   
	         if (collection.containsKey(rec.get(pKey))) {   
	             smSelect.selectRecords([rec], true);   
	         }   
	    }); 
	});
	dsSelect.on('beforeload',function(store2, options){
         store2.each(function(rec) {   
             if (smSelect.isSelected(rec)) {   
                 collection.add(rec.get(pKey),rec);   
             } else {   
                 collection.removeKey(rec.get(pKey));   
             }   
         });   
	});
	smSelect.on('rowselect',function(sm, rowIndex, rec){
		collection.add(rec.get(pKey),rec); 
	});
	smSelect.on('rowdeselect',function(sm, rowIndex, rec){
		collection.removeKey(rec.get(pKey)); 
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