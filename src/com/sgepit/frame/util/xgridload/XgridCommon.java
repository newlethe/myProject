package com.sgepit.frame.util.xgridload;

public class XgridCommon {
	//从数据库读取数据生成表格
	public String GetXML(String[] cols,String[] dataOnlyCols,String PK,String tableName,
			String where,String orderBy,String[] rootCols,String rootTableName,String rootWhere,
			String rootOrderBy,String[] selfJoinCols,String[] nestedCols,boolean lockSet)  {
		return XgridXMLUtil.GetXML(cols,dataOnlyCols,PK,tableName,where,orderBy,rootCols,rootTableName,rootWhere,rootOrderBy,selfJoinCols,nestedCols,lockSet) ;
	}
	
	//根据sql生成xgrid的xml<非treegrid>
	public String getSQLXgrid(String[] header,String sql,String types,String[] combox,String widths)  {
		return SQLXgrid.getSQLXgrid(header,sql,types,combox,widths) ;
	}
	
	//根据配置生成xgrid的xml(判断是否需要表尾)
	//可废弃，用getXgridXML方法；
	public String getXgridXMLWithFlag(String gridType,String sj_type,String modelType,String unit_id,String company_id,String keycol,String filter,String ordercol,String parentsql,String bpnode,String relatedCol,boolean footerFlag,boolean searchFlag) {
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.getXgridXML(gridType,sj_type,modelType,unit_id,company_id,keycol,filter,ordercol,parentsql,bpnode,relatedCol,footerFlag,searchFlag);
	}
	
	//根据配置生成xgrid的xml
	public String getXgridXML(String gridType,String sj_type,String modelType,String unit_id,String company_id,String keycol,String filter,String ordercol,String parentsql,String bpnode,String relatedCol,boolean footerFlag,boolean searchFlag) {
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.getXgridXML(gridType,sj_type,modelType,unit_id,company_id,keycol,filter,ordercol,parentsql,bpnode,relatedCol,footerFlag,searchFlag);
	}
	
	//根据配置生成普通grid的xml
	public String getCommonXgridXML(String sj_type,String modelType,String unit_id,String company_id,String keycol,String filter,String ordercol) {
		String gridType = "" ;
		String parentsql = null ;
		String relatedCol = null ;
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.getXgridXML(gridType,sj_type,modelType,unit_id,company_id,keycol,filter,ordercol,parentsql,null,relatedCol,true,true);
	}
	
	//根据配置生成treegrid的xml
	public String getTreeXgridXML(String sj_type,String modelType,String unit_id,String company_id,String keycol,String filter,String ordercol,String parentsql,String bpnode,String relatedCol) {
		String gridType = "tree" ;
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.getXgridXML(gridType,sj_type,modelType,unit_id,company_id,keycol,filter,ordercol,parentsql,bpnode,relatedCol,false,true);
	}
	
	//按照特定的xml格式保存xgrid提交的数据
	public String saveXgrid(String xml){  
		return XgridXML.saveXgrid(xml);
	}
	
	/**	保存xgrid数据，通过列配置，确定哪些行需要保存
	 *	区别于saveXgrid的方法是：如果列配置为ro*或者ro[=sum]这些列不保存到数据库中；
	 * 	此方法支持xgrid的某些列是从视图计算取数
	 * @param xml	需要保存数据的xml字符串；
	 * @param sj_type	报表模板时间
	 * @param modelType	模板类型
	 * @param unit_id	单位ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-3-13
	 */
	public String saveXgridByColConfig(String xml, String sj_type, String modelType, String unit_id){  
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.saveXgridByColConfig(xml, sj_type, modelType, unit_id);
	}
	
	//poi导出xgrid页面内容
	public String xgridToExcel(String xml){  
		XMLToExcel xmloExcel = new XMLToExcel() ;
		return xmloExcel.XMLStringToExcel(xml);
	}
	
	//获得excel模板文件号
	public String getExcelTemplet(String sj_type,String type,String unit_id){  
		return XgridXML.getExcelTemplet(sj_type,type,unit_id);
	}
	
	//获得excel模板的值
	public String getTempletExcelData(String[] data,String gridType,String sj_type,String modelType,String company_id,String keycol,String filter,String ordercol,String parentsql,String bpnode,String relatedCol){  
		XgridXML xgridxml = new XgridXML() ;
		return xgridxml.getTempletExcelData(data,gridType,sj_type,modelType,company_id,keycol,filter,ordercol,parentsql,bpnode,relatedCol);
	}
	
	//删除文件
	public boolean deleteTempFile(String fileid) {
		XMLToExcel xmloExcel = new XMLToExcel() ;
		return xmloExcel.deleteTempFile(fileid) ;
	}
	
}