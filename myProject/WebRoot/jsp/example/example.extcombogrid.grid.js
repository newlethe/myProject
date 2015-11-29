Ext.onReady(function (){
	var p = new Ext.ux.GridComboPanel({
		/* 基本属性 */
		bean: "com.sgepit.frame.sysman.hbm.AppFileinfo",
		columns: ["fileid,主键","filename,文件名","filesize,文件大小",
		{id:"filedate", header: "创建时间", dataIndex:'filedate', width: 120, sortable: true}],
		
		/* 编辑属性 */
		fields: ["filename","filesize","filedate"],
		editRow: true,
		form: true,
		formSections: ["第1节","第2节"],
		formFields: [
		["fileid", "filename"],
		["filesize","filedate","filesource,存储位置","mimetype,类型"]],
		
		/* 其他属性 */
		where: "filesize>0",
		orderBy: "filedate desc"
	});
	/* 更改Ext对象属性的方法 */
    p.setColumnProperty("fileid", "hidden:true");
	p.setColumnProperty("filename", "width:300");
	p.setEditColumnProperty("fileid", "hidden:true");
	p.setEditColumnProperty("filesize", "value:100");
});