Array.prototype.contains = function(item){
	for(var i = 0 ; i< this.length;i++){
		if(item === this[i]){
			return true;
		}
	}
	return false;
}

/**
 * 禁用
 */
function toolbarDisable(opts){
	if(opts instanceof Array){
		for(var i = 0 ; i< opts.length;i++){
			opts[i].disable();
		}
	}else{
		throw new Error("params type error!");
	}
}

function toolbarEnable(opts){
	if(opts instanceof Array){
		for(var i = 0 ; i< opts.length;i++){
			opts[i].enable();
		}
	}else{
		throw new Error("params type error!");
	}
}