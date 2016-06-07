function getSN() {
	var date = new Date()
	var s = date.getYear()
		+ (date.getMonth()+101+"").substring(1)
		+ (date.getDate()+100+"").substring(1)
		+ (date.getHours()+100+"").substring(1)
		+ (date.getMinutes()+100+"").substring(1)
		+ (date.getSeconds()+100+"").substring(1)
		+ (date.getMilliseconds()+1000+"").substring(1)
		+ (Math.random()*1000+1000).toFixed(0).substring(1)
	return s
}

function trim(str) {
	return  str.replace(/(^\s*)|(\s*$)/g, "")
}