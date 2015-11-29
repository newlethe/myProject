Ext.onReady(function() {
	window.frames[0].location.href = CONTEXT_PATH
					+ '/PCBusiness/pcCon/contract/cont.generalInfo.input.jsp?sj='
					+ sj + '&pid=' + pid + "&type=" + type;
});