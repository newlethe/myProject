var formDownAc,frmDownload
function fileDownloadById(fileLsh)  {	
	if(formDownAc == null){
		formDownAc = document.createElement('<form action="" id="formDownAc" method="post" name="formDownAc" TARGET="frmDownload" style="display:none">')
		frmDownload = document.createElement('<iframe name="frmDownload" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>')	  
		var divFile = document.createElement("div");
		document.appendChild(formDownAc)
		document.appendChild(frmDownload)
	}
	formDownAc.action =basePath + "/filedownload?method=fileDownload&id=" +fileLsh;
	formDownAc.submit()	
}