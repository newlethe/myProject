package com.sgepit.frame.util.xgridload;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.collections.map.ListOrderedMap;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;


public class XgridXML {
	/**
	 * 返回模板配置的表头的xgrid的xml
	 * @param gridType xgrid类型（tree or other）
	 * @param sj_type 时间【获取报表模板的时间】
	 * @param modelType 模板类型（对应sgprj_property_code中code_type = PROJECT_TYPE）
	 * @param unit_id 单位（取表头用）
	 * @param category 项目分类
	 * @param company_id 单位 取数用
	 * @param gkbm 归口部门 取项目分类用
	 * @param keycol 关联列
	 * @return xml
	 */
	public String getXgridXML(String gridType,String sj_type,String modelType,String unit_id,String company_id,String keycol,String filter,String ordercol,String parentsql,String bpnode,String relatedCol,boolean footerFlag,boolean searchFlag) {
		String xml = "" ;
		String header = getHeader(sj_type,modelType,unit_id) ;
		if(header!=null)  {
			String default_table = getDefaultTable(modelType) ;   
			HashMap<String,String> colMap = getColMap(modelType,default_table) ;
			try {
				Document document = DocumentHelper.parseText(header);
				
				List<Element> list = document.selectNodes("/rows/head/column") ;
				for(Iterator<Element> it = list.iterator();it.hasNext();) {
					Element el = (Element) it.next();
					String colId = el.attributeValue("id") ; 
					String colname = "" ;
					if(colMap.containsKey(colId)) {
						colname = colMap.get(colId).toString().trim() ;
					} else {
						colname = "dual."+"'"+colId.trim()+"'" ;
					}
					el.addAttribute("id",colname) ;
				}
				
				//转换表列类型
				tranColumnType(document,default_table,gridType) ;
				
				//追加过滤行及表尾
				String prj_table = addFilterRow(document,gridType,footerFlag,searchFlag) ;
				if(prj_table==null||prj_table.toLowerCase().equals("dual")) {
					return null ;
				}
				String sql = getDatasql(document,prj_table,sj_type,company_id,keycol.toUpperCase(),filter) ;

				//获取数据xml
				if(gridType.toLowerCase().indexOf("tree")>-1){  //treegrid
					getTreeXgrid(document,sql,prj_table,keycol.toUpperCase(),ordercol,parentsql,bpnode,relatedCol,gridType) ;
				} else {    //普通grid
					getCommonXgrid(document,sql,prj_table,keycol.toUpperCase(),ordercol) ;
				}
				
				//对树类型并有统计的列明细列重设单元格类型
				if(gridType.toLowerCase().indexOf("tree")>-1) {
					List<Element> cols = document.selectNodes("/rows/head/column") ;
					for(int i=0;i<cols.size();i++) {
						Element col = cols.get(i);
						String t = col.attributeValue("type") ;
						if(t!=null&t.endsWith("[=sum]")) {
							String newType = t.substring(0,t.length()-6) ;
							List<Element> cells = document.selectNodes("//row[@detail='1']/cell["+(i+1)+"]");
							for(Element c : cells) {
								c.addAttribute("type", newType) ;
								if(newType.equals("edn")&(c.getText()==null||"".equals(c.getText()))) {
									c.setText("0") ;
								}
							}
						} else {
							List<Element> cells = document.selectNodes("//row[@detail='1']/cell["+(i+1)+"]");
							int fb = t.indexOf("[");
							int fe = t.indexOf("]");
							for(Element c : cells) {
								if (fb>-1 && fe>-1 && fb<fe) {
									c.setText(t.substring(fb+1, fe)) ;
								}
							}
						}
					}
				}
				
				xml = document.asXML() ;
			} catch (DocumentException e) {
				e.printStackTrace();
				xml = "" ;
			}
		}
		System.out.println(xml);
		return xml;
	}
	
	/**
	 * 获得表头内容
	 * @param type 类型
	 * @param sj_type 时间
	 * @param category 项目分类
	 * @param unit_id 单位
	 * @return 表头的xml串
	 */
	public String getHeader(String sj_type,String type,String unit_id) {
		return getTempletInfo(sj_type,unit_id,type,"tab1.templet_header")  ;
	}
	
	/**
	 * 获得excel的文件号
	 * @param type 类型
	 * @param sj_type 时间
	 * @param unit_id 单位
	 * @return string
	 */
	public static String getExcelTemplet(String sj_type,String type,String unit_id) {
		//基建MIS系统中将XGRID配置的模板保存到了system_longdata表，并且在XGRID模板配置表中注入了文件的流水号。因此可以直接获取文件流水号
		String returnstr = getTempletInfo(sj_type,unit_id,type,"tab1.templet_file");
		/*
		String returnstr = getTempletInfo(sj_type,unit_id,type,"'xgridExcel'||'-'||tab1.templet_sn")  ;
		if(returnstr!=null) {
			String sql = "select fileid from app_fileinfo where fileid='"+returnstr+"'" ;
			List<ListOrderedMap> list = JdbcUtil.query(sql);
			if(list.size()>0) {
				ListOrderedMap map = list.get(0) ;
				returnstr = map.getValue(0)==null?null:map.getValue(0).toString() ;
			} else {
				return "";
			}
		}*/
		return returnstr;
	}
	
	public static String getExcelInf(String sj_type, String unit_id,String type) {
		String returnStr = null ;
		returnStr = getTempletInfo(sj_type,unit_id,type,"tab1.templet_file||tab1.templet_begancell")  ;
		return returnStr;
	}
	
	public static String getTempletInfo(String sj_type, String unit_id,String type,String col) {
		String returnStr = null ;
		String unit_sql = "(select unitid,level unitlevel from sgcc_ini_unit start with unitid= '"+unit_id+"' connect by prior upunit = unitid ) tab3" ;
		String sql = "select "+col+" from sgprj_templet_config tab1,"+unit_sql+" where  " +
					"  tab1.unit_id= tab3.unitid and tab1.sj_type<='"+sj_type+"' and tab1.templet_type='"+type+"'" +
					" order by tab1.sj_type desc,tab3.unitlevel" ;
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		if(list.size()>0) {
			ListOrderedMap map = list.get(0) ;
			returnStr = map.getValue(0)==null?"":map.getValue(0).toString() ;
			
			//定义需要替换的map，包含{CORP}公司,{YYYY}年,{MM}月,{DD}日
			Map<String, String> varMap = new HashMap<String, String>();
			int yyyy,mm,dd;
			Calendar cal=Calendar.getInstance();    
			yyyy=cal.get(Calendar.YEAR);    
			mm=cal.get(Calendar.MONTH);  
			dd=cal.get(Calendar.DATE);
			varMap.put("YYYY", yyyy+"");
			varMap.put("MM", (mm+101+"").substring(1));
			varMap.put("DD", dd+"");
			String unitname = "";
			String sqlUnit = "select unitname from sgcc_ini_unit where unitid='"+unit_id+"'";
			List<ListOrderedMap> listUnit = JdbcUtil.query(sqlUnit);
			if(listUnit.size()>0) {
				ListOrderedMap mapUnit = listUnit.get(0) ;
				unitname = mapUnit.getValue(0)==null?"":mapUnit.getValue(0).toString().toUpperCase() ;
			}
			varMap.put("CORP", unitname);
			//替换头文件XML中的{CORP},{YYYY},{MM},{DD}
			returnStr = buildText(returnStr, "\\{.*?\\}", varMap);
		}
		return returnStr;
	}
	
	/**
	 * 获得配置的列map
	 * @param d_table  默认表 
	 * @param category 项目分类
	 * @return map
	 */
	private HashMap<String,String> getColMap(String modelType, String d_table) {
		HashMap<String,String> map = new HashMap<String,String>() ;
		String sql = "select code_id,code_table,code_col from sgprj_property_code where code_type='PROJECT_COL' and (model_type='" + modelType + "' or model_type is null) order by order_id";
		List<ListOrderedMap> list = JdbcUtil.query(sql);	
		for(int i=0;i<list.size();i++) {
			ListOrderedMap listMap = list.get(i) ;
			String table = listMap.getValue(listMap.indexOf("code_table".toUpperCase()))==null?d_table.toUpperCase():listMap.getValue(listMap.indexOf("code_table")).toString().toUpperCase().trim();
			String col = listMap.getValue(listMap.indexOf("code_col".toUpperCase())).toString().toUpperCase().trim() ;
			String colid = listMap.getValue(listMap.indexOf("code_id".toUpperCase())).toString().toUpperCase().trim() ;
			map.put(colid,table+"."+col) ;
		}
		return map;
	}
	
	/**
	 * 获得默认表
	 * @param code_id  类型
	 * @return string
	 */
	private String getDefaultTable(String code_id) {
		String table = "" ;
		String sql = "select code_table from sgprj_property_code where code_type='PROJECT_TYPE' and code_id='"+code_id+"' order by order_id";
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		if(list.size()>0) {
			ListOrderedMap map = list.get(0) ;
			table = map.getValue(0)==null?"":map.getValue(0).toString().toUpperCase() ;
		}
		return table;
	}
	
	/**
	 * 追加过滤行
	 * @param document
	 * @param gridType xgrid类型
	 * @return prj_table
	 */
	private String addFilterRow(Document document, String gridType,boolean footerFlag,boolean searchFlag) {
		String prj_table = null ;
		Element afterInit = null ;
		Element rows = document.getRootElement();
		Element head = rows.element("head") ;
		List list = document.selectNodes("/rows/head/afterInit") ;
		if(list.size()==0)  {
			afterInit = head.addElement("afterInit") ;
		} else {
			afterInit = head.element("afterInit") ;
		}
		Element call = afterInit.addElement("call") ;
		call.addAttribute("command", "attachHeader") ;
		String cols = "" ;
		String footer = "" ;
		List list_column = document.selectNodes("/rows/head/column") ;
		for(Iterator it = list_column.iterator();it.hasNext();) {
			Element el = (Element) it.next();
			String type = el.attributeValue("type") ; 
			String id = el.attributeValue("id") ;
			String ids[] = id.split("[.]") ;
			if((prj_table == null||prj_table.toLowerCase().equals("dual"))&&ids.length>1) {
				prj_table = ids[0].toUpperCase().trim() ;
			}
			if(type.equals("edn")||type.equals("ron")||type.equals("ed"))  {
				cols +=",#numeric_filter" ;
			} else if(type.equals("co")||type.equals("coro")){
				cols +=",#select_filter" ;
			} else {
				cols +=",#text_filter" ;
			}
			if(type.equals("edn")||type.equals("ron")) {
				footer +=",#stat_total" ;
			} else {
				footer +=",&nbsp;" ;
			}
		}
		if(searchFlag){
			Element param = call.addElement("param") ;
			param.addCDATA(cols.substring(1)) ;
		}
		if(footerFlag&&gridType.indexOf("tree")==-1)  {
			Element footercall = afterInit.addElement("call") ;
			footercall.addAttribute("command", "attachFooter") ;
			Element footparam = footercall.addElement("param") ;
			footparam.addCDATA(footer.substring(1)) ;
		}
		return prj_table ;
	}
	
	/**
	 * 转换表列类型
	 * @param document
	 * @param prj_table 项目表
	 * @param colMap 类型表
	 * @param gridType xgrid类型
	 * @param hiddenList 
	 */
	private void tranColumnType(Document document, String prj_table, String gridType) {
		List<Element> list = document.selectNodes("/rows/head/column") ;
		for(Iterator<Element> it = list.iterator();it.hasNext();) {
			Element el = (Element) it.next();
			String colId = el.attributeValue("id") ;  
			String colType = el.attributeValue("type") ;  
			if(colType.indexOf("co-")>-1||colType.indexOf("coro-")>-1)  {
				el.addAttribute("type",colType.split("[-]")[0]) ;
				LinkedHashMap<String,String> comap = new LinkedHashMap<String,String>() ;
				comap = getcomap(colType.split("[-]")[1]) ;
				Iterator<String> itco = comap.keySet().iterator() ;
				while(itco.hasNext())  {
					Object key = itco.next() ;
					String value = comap.get(key) ;
					Element option = el.addElement("option") ;
					option.addAttribute("value", key.toString()) ;
					option.setText(value)  ;
				}
			}
		}
	}
	
	/**
	 * 获得下拉列表内容的map
	 * @param code_id
	 * @return
	 */
	private LinkedHashMap<String,String> getcomap(String code_id) {
		LinkedHashMap<String,String> map = new LinkedHashMap() ;
		String sql = null ;
		String sqlcol = "select note from sgprj_property_code where code_type='PROJECT_CO' and code_id='"+code_id+"'" ;
		List<ListOrderedMap> list = JdbcUtil.query(sqlcol);
		if(list.size()>0) {
			ListOrderedMap listmap = list.get(0) ;
			sql = listmap.getValue(0).toString() ;
		}
		if(sql!=null) {
			List<ListOrderedMap> listcol = JdbcUtil.query(sql);
			for(int i = 0 ;i<listcol.size();i++ ) {
				ListOrderedMap mapcol = listcol.get(i) ;
				map.put(mapcol.getValue(0).toString(), mapcol.getValue(1).toString()) ;
			}
		}
		return map;
	}
	
	private String getDatasql(Document document, String prj_table, String sj_type, String company_id,String keycol,String filter) {
		String colsql = "" ;
		String tablesql = "" ;
		String filtersql = "" ;
		
		List<Element> list = document.selectNodes("/rows/head/column") ;
		int i=0 ;
		for(int l=0;l<list.size();l++) {
			Element el = list.get(l);
			String colname = el.attributeValue("id") ;    //SGCC_PROJ_EDU.TXT_VAL1
			String colsj = el.attributeValue("sj") ;   
			String coltype = el.attributeValue("type") ;   
			String cols[] = colname.split("[.]") ;
			if(cols[0].toLowerCase().equals("dual")) {
				colsql += cols[1]+" cols"+l+","  ;
			} else if(cols[0].toUpperCase().trim().equals(prj_table))  {
				if(coltype.equals("calendar")){
					colsql += "to_char("+colname+",'yyyy/mm/dd')," ;
				} else {
					if("ROWNUM".equalsIgnoreCase(cols[1])){//用于生成序号
						colsql += cols[1]+" cols"+l+","  ;
					}else{
						colsql += colname+" cols"+l+"," ;
					}
				}
			} else {
				String tablename = "tab"+i ;
				if(coltype.equals("calendar")){
					tablesql += ",(select to_char("+cols[1]+",'yyyy/mm/dd'),"+keycol+" from "+cols[0]+" where sj_type='"+getSjType(sj_type,colsj)+"') " + tablename ;
				} else {
					tablesql += ",(select "+cols[1]+","+keycol+" from "+cols[0]+" where sj_type='"+getSjType(sj_type,colsj)+"') " + tablename ;
				}
				if("ROWNUM".equalsIgnoreCase(cols[1])){//用于生成序号
					colsql += cols[1]+" cols"+l+","  ;
				}else{
					colsql += tablename+"."+cols[1]+" cols"+l+","  ;
				}
				filtersql += prj_table+"."+keycol+" = " +tablename+"."+keycol+"(+) and ";
				i++ ;
			}
		}
		String sjfilter = "1=1";
		if(!company_id.trim().equals(""))  {
			sjfilter += " and "+prj_table+".unit_id = '"+company_id+"'" ;
		}
		if(filter==null)  filter = "" ;
		String sql = "select "+prj_table+"."+keycol+" "+keycol + "," +colsql.substring(0, colsql.length()-1)+" from " + prj_table+ tablesql 
				   + " where "+filtersql+"  "+sjfilter + filter;
		return sql;
	}
	
	/**
	 * 时间转换
	 * @param sj_type 时间	
	 * @param colsj	转换类型
	 * @return
	 */
	private String getSjType(String sj_type, String colsj) {
		String date = sj_type ;
		int t = Integer.parseInt(colsj);
		switch(t) {
			case 10:	//本年
				date = sj_type.substring(0,4);
				break;
			case 11:	//去年
				date = Integer.parseInt(sj_type.substring(0,4)) - 1 + "";
				break;
			case 12:	//前年
				date = Integer.parseInt(sj_type.substring(0,4)) - 2 + "";
				break;
		}
		return date;
	}
	
	/**
	 * @param document
	 * @param sql
	 * @param gridType 
	 * @param category
	 * @param gkbm  取分类用的归口部门 
	 * @param addtype 
	 */
	private void getTreeXgrid(Document document, String sql, String prj_table,String keycol,String ordercol,String parentsql,String bpnode,String relatedCol, String gridType) {
		List<Element> list = document.selectNodes("/rows/head/column") ;
		Element rows = document.getRootElement() ;
		LinkedHashMap<String[],ArrayList> colmap = new LinkedHashMap() ;
		HashSet<String> pset = new HashSet() ;
		pset.add(bpnode) ;
		List<ListOrderedMap> sqllist = JdbcUtil.query(parentsql);
		for(int i=0;i<sqllist.size();i++)  {
			//将值放到list中去
			String[] key = new String[3];
			ArrayList<String> alist = new ArrayList() ;
			ListOrderedMap rsmap = sqllist.get(i) ;
			if(rsmap.containsKey("pnode".toUpperCase())) {
				key[0] = rsmap.getValue(rsmap.indexOf("pnode".toUpperCase())).toString() ;
			}
			if(rsmap.containsKey("nestedCol".toUpperCase())) {
				key[2] = rsmap.getValue(rsmap.indexOf("nestedCol".toUpperCase())).toString() ;
			}
			if(rsmap.containsKey("cnode".toUpperCase())) {
				key[1] = rsmap.getValue(rsmap.indexOf("cnode".toUpperCase())).toString() ;
			} else {
				if(rsmap.containsKey("nestedCol".toUpperCase())) {
					key[1] = rsmap.getValue(rsmap.indexOf("nestedCol".toUpperCase())).toString() ;
				}
			}
			Iterator it = rsmap.keySet().iterator();
			while(it.hasNext()) {
				Object keys = it.next() ;
				if(keys.toString().equals("nestedCol".toUpperCase())||keys.toString().equals("cnode".toUpperCase())||keys.toString().equals("pnode".toUpperCase())) {
				} else {
					alist.add(rsmap.getValue(rsmap.indexOf(keys))==null?"":rsmap.getValue(rsmap.indexOf(keys)).toString()) ;
				}
			}
			colmap.put(key, alist) ;
			pset.add(key[0]) ;
		}
		if(pset.contains(bpnode)) {
			getTreeXgridXML(rows,list,sql,prj_table,keycol,ordercol,colmap,relatedCol,bpnode,pset,1,gridType) ;
		}
	}
	
	private void getTreeXgridXML(Element rows, List<Element> list, String sql,String prj_table ,String keycol,String ordercol,LinkedHashMap map,String relatedCol,String bpnode, HashSet<String> pset, int level, String gridType) {
		Iterator it = map.keySet().iterator() ;
		while(it.hasNext()) {
			Object key =  it.next() ;
			ArrayList<String> al = (ArrayList) map.get(key) ;
			String[] keyvalues = (String[]) key ;
			if((keyvalues[0]!=null&&keyvalues[0].equals(bpnode))||keyvalues[0]==null) {
				Element rowss = rows.addElement("row") ;
				if(level<3) {
					rowss.addAttribute("open", "1");
				} 
				rowss.addAttribute("root", "1");
				rowss.addAttribute("id", keyvalues[1]);
				rowss.addAttribute(relatedCol, keyvalues[2]);
				for(int j=0;j<list.size()&&j<al.size();j++)  {
					Element cell = rowss.addElement("cell") ;
					cell.addCDATA(al.get(j))  ;
				}
				
				//具体内容
				String sqltmp = sql ;
				if(keyvalues[2]!=null) {
					sqltmp = sql+" and  "+prj_table+"."+relatedCol+"='"+keyvalues[2]+"'" ;
				}
				if(ordercol!=null && ordercol.length()>0) {
					sqltmp = sqltmp+" order by "+ordercol ;
				}
				List<ListOrderedMap> sqllist = JdbcUtil.query(sqltmp);
				if("simpletree".equalsIgnoreCase(gridType)) {
					if(sqllist.size()>0) {
						ListOrderedMap sqlmap = sqllist.get(0) ;
						String idVal = sqlmap.getValue(sqlmap.indexOf(keycol)).toString();
						if (idVal!=null && idVal.trim().length()>0) {
							rowss.addAttribute("id", idVal) ;
						}
					}
				} 
				if("simpletree".equalsIgnoreCase(gridType)) {
					if(!pset.contains(keyvalues[1])) {//叶子节点时
						rowss.addAttribute("detail", "1") ;
						
						rowss.addAttribute("root","0") ;
						if(sqllist.size()>0) {
							ListOrderedMap sqlmap = sqllist.get(0) ;
							rowss.addAttribute("id", sqlmap.getValue(sqlmap.indexOf(keycol)).toString()) ;
							List valuelist = sqlmap.valueList() ;
							for(int j=2;j<valuelist.size() ;j++) {
								Element cell = rowss.addElement("cell") ;
								cell.addCDATA(valuelist.get(j)==null?"":valuelist.get(j).toString())  ;
							}
						}
					}
				}else{
					for(int i=0;i<sqllist.size();i++)  {
						Element row = rowss.addElement("row") ;
						//增加明显行状态标识
						row.addAttribute("detail", "1") ;
						ListOrderedMap sqlmap = sqllist.get(i) ;
						row.addAttribute("id", sqlmap.getValue(sqlmap.indexOf(keycol)).toString()) ;
						List valuelist = sqlmap.valueList() ;
						for(int j=1;j<valuelist.size() ;j++) {
							Element cell = row.addElement("cell") ;
							cell.addCDATA(valuelist.get(j)==null?"":valuelist.get(j).toString())  ;
						}
					}
				}
				
				//取下一层
				if(keyvalues[0]!=null&&pset.contains(keyvalues[1])) {
					//rowss.addAttribute("xmlkids", "1") ;
					getTreeXgridXML(rowss, list, sql,prj_table,keycol,ordercol,map,relatedCol,keyvalues[1],pset,level+1,gridType) ;
				}
			}
		}
	}
	

	/**
	 * @param document
	 * @param sql 用于GRID表格EXCEL导出（主要是处理累计公式）
	 * @param category
	 * @param gkbm  取分类用的归口部门 
	 * @param addtype 
	 */
	private void getCommonXgridForExcel(Document document, String sql,String prj_table,String keycol,String ordercol) {
		List<Element> list = document.selectNodes("/rows/head/column") ;
		Element rows = document.getRootElement() ;
		
		if(ordercol!=null && ordercol.length()>0) {
			sql = sql + " order by "+ordercol ;
		}
		List<ListOrderedMap> sqllist = JdbcUtil.query(sql);
		for(int i=0;i<sqllist.size();i++)  {
			Element row = rows.addElement("row") ;
			ListOrderedMap sqlmap = sqllist.get(i) ;
			row.addAttribute("id", sqlmap.getValue(sqlmap.indexOf(keycol)).toString()) ;
			List valuelist = sqlmap.valueList() ;
			for(int j=1;j<valuelist.size() ;j++) {
				Element cell = row.addElement("cell") ;
				cell.addCDATA(valuelist.get(j)==null?"":valuelist.get(j).toString())  ;
			}
		}
	}
	/**
	 * @param document
	 * @param sql
	 * @param category
	 * @param gkbm  取分类用的归口部门 
	 * @param addtype 
	 */
	private void getCommonXgrid(Document document, String sql,String prj_table,String keycol,String ordercol) {
		List<Element> list = document.selectNodes("/rows/head/column") ;
		Element rows = document.getRootElement() ;
		
		if(ordercol!=null && ordercol.length()>0) {
			sql = sql + " order by "+ordercol ;
		}
		List<ListOrderedMap> sqllist = JdbcUtil.query(sql);
		for(int i=0;i<sqllist.size();i++)  {
			Element row = rows.addElement("row") ;
			ListOrderedMap sqlmap = sqllist.get(i) ;
			row.addAttribute("id", sqlmap.getValue(sqlmap.indexOf(keycol)).toString()) ;
			List valuelist = sqlmap.valueList() ;
			for(int j=1;j<valuelist.size() ;j++) {
				Element cell = row.addElement("cell") ;
				Element el = list.get(j-1) ;
				String coltype = el.attributeValue("type") ;   
				if(coltype!=null&&coltype.indexOf("[=")>-1) {
					continue ;
				}
				cell.addCDATA(valuelist.get(j)==null?"":valuelist.get(j).toString())  ;
			}
		}
	}
	

	/**
	 * 保存xgrid
	 * @param xml
	 * @return xml
	 */
	public static String saveXgrid(String xml)  {
		Document returnxml = DocumentHelper.createDocument();
		Element data = returnxml.addElement("data") ;
		try {
			Document document = DocumentHelper.parseText(xml);
			Element rows = document.getRootElement() ;
			
			String tablename = rows.attributeValue("tablename") ;
			String keycol = rows.attributeValue("keycol") ;
			List<Element> list = document.selectNodes("/rows/head/column") ;
			List<String> collist = new ArrayList() ;
			for(int i=0;i<list.size();i++) {
				Element column = list.get(i);
				String columnvalue = column.getText() ;
				collist.add(columnvalue) ;
			}
			String fixinsertcol = "" ;
			String fixinsertvalue = "" ;
			
			//行循环
			Iterator rowit = rows.elementIterator("row") ;
			String filter = "" ;
			while(rowit.hasNext())  {
				Element action = data.addElement("action")  ;
				String sql = "" ;
				Element row = (Element) rowit.next();
				String type = row.attributeValue("type") ;  //获得更新类型
				String id = row.attributeValue("id") ;  //主键值
				filter = keycol +" = '"+id+"' " ;
				Iterator rowattrbt = row.attributeIterator() ;
				while(rowattrbt.hasNext())  {
					Attribute collabel = (Attribute) rowattrbt.next() ;
					if(!collabel.getName().equals("type")&&(!collabel.getName().equals("id"))) {
						filter +=" and "+collabel.getName()+" = '"+collabel.getValue()+"'" ;
						fixinsertcol += ","+collabel.getName() ;
						fixinsertvalue += ",'"+collabel.getValue()+"'" ;
					}
				}
				
				if(type.equals("delete"))  { 
					sql =  "delete from "+tablename+" where "+filter ;
				} else {
					String updatesql = "" ;
					String insertsql1 = "" ;
					String insertsql2 = "" ;
					String insertsql = "" ;
					List<Element>  celllist = row.elements("cell") ;
					for(int i=0;i<celllist.size() ;i++) {
						Element cell = celllist.get(i) ;
						String cellvalue = cell.getText().replaceAll("'", "''") ;
						if(cell.attributeValue("type").equals("calendar"))  {
							if(cellvalue.trim().equals("''")) continue ;
							cellvalue = "to_date("+cellvalue+",'mm/dd/yyyy')" ;
							updatesql += ","+collist.get(i)+"='"+cellvalue+"'" ;
							insertsql1 += ","+collist.get(i) ;
							insertsql2 += ",'"+cellvalue+"'" ;
						} else {
							updatesql += ","+collist.get(i)+"='"+cellvalue +"'";
							insertsql1 += ","+collist.get(i) ;
							insertsql2 += ",'"+cellvalue+"'" ;
						}
					}
					updatesql = "update "+tablename+" set "+ updatesql.substring(1)+" where "+filter ;
					insertsql = "insert into "+tablename+" ("+insertsql1.substring(1)+fixinsertcol+") " +
								" values("+insertsql2.substring(1)+fixinsertvalue+")"  ;
					String key = get1KeyPKcolumn(tablename) ;
					if(!key.equals(""))  {
						if(key.toUpperCase().equals(keycol.toUpperCase())) {
							insertsql = "insert into "+tablename+" ("+key+insertsql1+fixinsertcol+") " +
								" values('"+SnUtil.getNewID()+"'"+insertsql2+fixinsertvalue+")"  ;
						} else {
							insertsql = "insert into "+tablename+" ("+key+insertsql1+fixinsertcol+","+keycol+") " +
								" values('"+SnUtil.getNewID()+"'"+insertsql2+fixinsertvalue+",'"+id+"')"  ;
						}
					}
					if(type.equals("insert"))  {
						sql = insertsql ;
					} else {
						sql = updatesql ;
					}
				}
				int upi = JdbcUtil.update(sql);
				if(upi==1) {
					action.addAttribute("type", type) ;
				} else {
					action.addAttribute("type", "error") ;
				}
				action.addAttribute("sid", id) ;
				action.addAttribute("tid", id) ;
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		return returnxml.asXML();
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
	public String saveXgridByColConfig(String xml, String sj_type, String modelType, String unit_id)  {
		String header = getHeader(sj_type,modelType,unit_id) ;
		List<Element> headerList = null;
		HashMap<String,Map<String, String>> headerMap = new HashMap<String, Map<String,String>>();
		if(header!=null)  {
			String default_table = getDefaultTable(modelType) ;   
			HashMap<String,String> colMap = getColMap(modelType,default_table) ;
			Document headerDoc;
			try {
				headerDoc = DocumentHelper.parseText(header);
				headerList = headerDoc.selectNodes("/rows/head/column") ;
				for(Iterator<Element> it = headerList.iterator();it.hasNext();) {
					Element el = (Element) it.next();
					String colId = el.attributeValue("id") ; 
					String colname = "" ;
					if(colMap.containsKey(colId)) {
						colname = colMap.get(colId).toString().trim() ;
					} else {
						colname = "dual."+"'"+colId.trim()+"'" ;
					}
					
					Map<String, String> attrMap = new HashMap<String, String>();
					attrMap.put("type", el.attributeValue("type"));
					headerMap.put(colname, attrMap);
				}
			} catch (DocumentException e) {
				e.printStackTrace();
			}
				
		}
				
		Document returnxml = DocumentHelper.createDocument();
		Element data = returnxml.addElement("data") ;
		try {
			Document document = DocumentHelper.parseText(xml);
			Element rows = document.getRootElement() ;
			
			String tablename = rows.attributeValue("tablename") ;
			String keycol = rows.attributeValue("keycol") ;
			List<Element> list = document.selectNodes("/rows/head/column") ;
			List<String> collist = new ArrayList() ;
			for(int i=0;i<list.size();i++) {
				Element column = list.get(i);
				String columnvalue = column.getText() ;
				collist.add(columnvalue) ;
			}
			String fixinsertcol = "" ;
			String fixinsertvalue = "" ;
			
			//行循环
			Iterator rowit = rows.elementIterator("row") ;
			String filter = "" ;
			while(rowit.hasNext())  {
				Element action = data.addElement("action")  ;
				String sql = "" ;
				Element row = (Element) rowit.next();
				String type = row.attributeValue("type") ;  //获得更新类型
				String id = row.attributeValue("id") ;  //主键值
				filter = keycol +" = '"+id+"' " ;
				Iterator rowattrbt = row.attributeIterator() ;
				while(rowattrbt.hasNext())  {
					Attribute collabel = (Attribute) rowattrbt.next() ;
					if(!collabel.getName().equals("type")&&(!collabel.getName().equals("id"))) {
						filter +=" and "+collabel.getName()+" = '"+collabel.getValue()+"'" ;
						fixinsertcol += ","+collabel.getName() ;
						fixinsertvalue += ",'"+collabel.getValue()+"'" ;
					}
				}
				
				if(type.equals("delete"))  { 
					sql =  "delete from "+tablename+" where "+filter ;
				} else {
					String updatesql = "" ;
					String insertsql1 = "" ;
					String insertsql2 = "" ;
					String insertsql = "" ;
					List<Element>  celllist = row.elements("cell") ;
					for(int i=0;i<celllist.size() ;i++) {
						Element cell = celllist.get(i) ;
						String cellvalue = cell.getText().replaceAll("'", "''") ;
						
						String keyStr = tablename+"."+collist.get(i);
						Map<String, String> attrMap = headerMap.get(keyStr);
						if (!attrMap.get("type").startsWith("ro")) {
							if(cell.attributeValue("type").equals("calendar"))  {
								if(cellvalue.trim().equals("''")) continue ;
								cellvalue = "to_date("+cellvalue+",'mm/dd/yyyy')" ;
								updatesql += ","+collist.get(i)+"='"+cellvalue+"'" ;
								insertsql1 += ","+collist.get(i) ;
								insertsql2 += ",'"+cellvalue+"'" ;
							} else {
								updatesql += ","+collist.get(i)+"='"+cellvalue +"'";
								insertsql1 += ","+collist.get(i) ;
								insertsql2 += ",'"+cellvalue+"'" ;
							}
						}
					}
					updatesql = "update "+tablename+" set "+ updatesql.substring(1)+" where "+filter ;
					insertsql = "insert into "+tablename+" ("+insertsql1.substring(1)+fixinsertcol+") " +
								" values("+insertsql2.substring(1)+fixinsertvalue+")"  ;
					String key = get1KeyPKcolumn(tablename) ;
					if(!key.equals(""))  {
						if(key.toUpperCase().equals(keycol.toUpperCase())) {
							insertsql = "insert into "+tablename+" ("+key+insertsql1+fixinsertcol+") " +
								" values('"+SnUtil.getNewID()+"'"+insertsql2+fixinsertvalue+")"  ;
						} else {
							insertsql = "insert into "+tablename+" ("+key+insertsql1+fixinsertcol+","+keycol+") " +
								" values('"+SnUtil.getNewID()+"'"+insertsql2+fixinsertvalue+",'"+id+"')"  ;
						}
					}
					if(type.equals("insert"))  {
						sql = insertsql ;
					} else {
						sql = updatesql ;
					}
				}
				int upi = JdbcUtil.update(sql);
				if(upi==1) {
					action.addAttribute("type", type) ;
				} else {
					action.addAttribute("type", "error") ;
				}
				action.addAttribute("sid", id) ;
				action.addAttribute("tid", id) ;
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		return returnxml.asXML();
	}
	
	/**
	 * 获得表的主键(只获取用来唯一标示记录的单个主键)
	 * @param tablename
	 * @return
	 */
	private static String get1KeyPKcolumn(String tablename) {
		String key = "" ;
		String sql = "select column_name from user_cons_columns where " +
				" constraint_name = (select constraint_name from user_constraints where " +
				"table_name = upper('"+tablename+"') and constraint_type = 'P')" ;
		List<ListOrderedMap> sqllist = JdbcUtil.query(sql);
		if(sqllist.size()==1) {
			key = sqllist.get(0).getValue(0)==null?"":sqllist.get(0).getValue(0).toString() ;
		}
		return key;
	}
	
	/**
	 * 获得页面内容
	 * 借用xgrid的xml进行excel的导出
	 * @param data
	 * @param gridType
	 * @param sj_type
	 * @param modelType
	 * @param company_id
	 * @param keycol
	 * @param filter
	 * @param parentsql
	 * @param bpnode
	 * @param relatedCol
	 * @return xml
	 */
	public String getTempletExcelData(String[] data, String gridType,String sj_type, String modelType, String company_id, String keycol,String filter,String ordercol, String parentsql, String bpnode, String relatedCol) {
		String xml = "" ;
		String default_table = getDefaultTable(modelType) ;  
		String prj_table = null ;
		HashMap<String,String> colMap = getColMap(modelType,default_table) ;
		Document document = getDataHeader(data) ;
		int treecol = -1 ;
		List<Element> list = document.selectNodes("/rows/head/column") ;
		for(int i=0;i<list.size();i++) {
			Element el = list.get(i);
			String colId = el.attributeValue("id") ;  
			String colType = el.attributeValue("type") ;  
			String colname = colMap.containsKey(colId)?colMap.get(colId).toString().trim():"'"+colId+"'".trim();
			el.addAttribute("id",colname) ;
			String[] ids = colname.split("[.]") ;
			if(prj_table == null&&ids.length>1) {
				prj_table = ids[0].toUpperCase() ;
			}
			if(colType.equals("tree"))  {
				treecol = i ;
			}
		}
		
		String sql = getDatasql(document,prj_table,sj_type,company_id,keycol.toUpperCase(),filter) ;

		//获取数据xml
		if(gridType.toLowerCase().equals("tree")){  //treegrid
			getTreeXgrid(document,sql,prj_table,keycol.toUpperCase(),ordercol,parentsql,bpnode,relatedCol,gridType) ;
		} else {    //普通grid
			//用于包含公式的excel导出
			getCommonXgridForExcel(document,sql,prj_table,keycol.toUpperCase(),ordercol) ;
		}
		
		getCoroValue(document);
		
		Document returnDocument = documentToArray(document,treecol,gridType.toLowerCase()) ;
		xml = returnDocument.asXML() ;
		return xml;
	}

	private void getCoroValue(Document document) {
		List<Element> listd = document.selectNodes("/rows/head/column") ;
		for(int i=0;i<listd.size();i++) {
			Element el = listd.get(i);
			String colType = el.attributeValue("type") ; 
			if(colType.indexOf("co-")>-1||colType.indexOf("coro-")>-1)  {
				el.addAttribute("type",colType.split("[-]")[0]) ;
				LinkedHashMap<String,String> comap = new LinkedHashMap<String,String>() ;
				comap = getcomap(colType.split("[-]")[1]) ;
				
				List<Element> cells = document.selectNodes("/rows/row/cell["+(i+1)+"]");
				
				for (int j = 0; j < cells.size(); j++) {
					Element cellEl = cells.get(j);
					String key = cellEl.getTextTrim();
					if (key!=null && key.length()>0 && comap.containsKey(key)) {
						cellEl.setText(comap.get(key));
					}
				}
			}
		}
	}

	private Document getDataHeader(String[] data) {
		Document Hdocument = DocumentHelper.createDocument() ;
		Element rows = Hdocument.addElement("rows") ;
		Element head = rows.addElement("head") ;
		for(int i=0;i<data.length;i++) {
			Element column = head.addElement("column") ;
			String[] datas = data[i].split("[/]") ;
			column.addAttribute("id", datas[0]) ;
			column.addAttribute("sj", datas[1]) ;
			column.addAttribute("type", datas[2]) ;
//			column.addAttribute("type", datas[2].split("[-]")[0]) ;
		}
		return Hdocument;
	}
	
	private Document documentToArray(Document document,int treecol,String gridType) {
		Document rdocument = DocumentHelper.createDocument() ;
		Element Erows = rdocument.addElement("rows") ;
		ArrayList<String> typeArray = new ArrayList() ;
		List<Element> listd = document.selectNodes("/rows/head/column") ;
		for(int i=0;i<listd.size();i++) {
			Element el = listd.get(i);
			String colType = el.attributeValue("type") ; 
			if(colType.equals("edn"))  {
				typeArray.add("sum") ;
			} else {
				typeArray.add("") ;
			}
		}
		//去掉表头
		document.getRootElement().remove(document.selectSingleNode("/rows/head"));
		if(gridType.equals("tree"))  {
			List<Element> list = document.selectNodes("/rows/row") ;
			String blank = "'" ;
			getRowsContent(Erows,list,blank,treecol,typeArray) ;
			return rdocument;
		} else {
			return document;
		}
	}
	
	private void getRowsContent(Element Erows,List list,String blank,int treecol,ArrayList<String> typeArray)  {
		for(Iterator<Element> it = list.iterator();it.hasNext();) {
			Element rows = (Element) it.next();
			Element Erow = Erows.addElement("row") ;
			List<Element> cellList = rows.elements("cell") ;
			ArrayList<String> cArrayList = new ArrayList() ;
			for(int i=0;i<typeArray.size();i++) {
				Element Ecell = Erow.addElement("cell") ;
				if(typeArray.get(i).equals("sum")) {
					if(i<cellList.size()&&(!cellList.get(i).getText().equals(""))) {
						Ecell.addCDATA(cellList.get(i).getText()) ;
					} else {
						Ecell.addCDATA(getColumnSum(rows,i).toString()) ;
					}
				} else {
					if(i<cellList.size()&&(!cellList.get(i).getText().equals(""))) {
						Element cell = cellList.get(i) ;
						String cellvalue = cell.getText();
						if(treecol==i)  {
							cellvalue = blank+cellvalue ;
						}
						Ecell.addCDATA(cellvalue) ;
					} else {
						Ecell.addCDATA("") ;
					}
				}
			}
			List Lrow = rows.elements("row") ;
			getRowsContent(Erows,Lrow,blank+"  ",treecol,typeArray) ;
		}
	}

	private BigDecimal getColumnSum(Element rows, int col) {
		BigDecimal returnDb = new BigDecimal(0) ;
		List<Element> rowList = rows.elements("row") ;
		for(int i = 0;i<rowList.size();i++)  {
			Element row = rowList.get(i) ;
			List<Element> cellList = row.elements("cell") ;
			if(cellList.size()>col&&(!cellList.get(col).getText().equals("")))  {  //有值时
				String value = cellList.get(col).getText() ;
				BigDecimal tmpB = null ;
				try {
					tmpB = new BigDecimal(value) ;
				} catch (NumberFormatException e) {
					tmpB = new BigDecimal(0) ;
				} finally {
					returnDb = returnDb.add(tmpB) ;
				}
			} else {   //没有值时迭代
				returnDb = returnDb.add(getColumnSum(row,col)) ;
			}
		}
		return returnDb;
	}
	
	/**
	 * 按照规则替换关键词
	 * @param text 待替换文本
	 * @param regex 规则表达式
	 * @param varmap 关键词集合
	 * @return
	 */
	public static String buildText(String text,String regex, Map<String, String> varmap) {
        StringBuffer sb = new StringBuffer();   
        Pattern p = Pattern.compile(regex); 
        Matcher m = p.matcher(text);
        while(m.find()){
            String varname = text.substring(m.start()+1, m.end()-1);
            if(varmap.containsKey(varname)) {
            	String value = varmap.get(varname) ;
            	if(value==null) value = "" ;
                m.appendReplacement(sb,value);   
            }else {
        		m.appendReplacement(sb,"{"+varname+"}"); 
            }
        }
        m.appendTail(sb); 
        return sb.toString() ;
	}

}