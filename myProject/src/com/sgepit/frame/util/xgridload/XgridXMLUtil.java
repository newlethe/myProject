package com.sgepit.frame.util.xgridload;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.collections.map.ListOrderedMap;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;

public class XgridXMLUtil {
	/**
	 * 页面配置方法生成xgrid的xml
	 * @param cols
	 * @param dataOnlyCols
	 * @param PK
	 * @param tableName
	 * @param where
	 * @param orderBy
	 * @param rootCols
	 * @param rootTableName
	 * @param rootWhere
	 * @param rootOrderBy
	 * @param selfJoinCols
	 * @param nestedCols
	 * @param lockSet
	 * @return
	 */
	public static String GetXML(String[] cols,String[] dataOnlyCols,String PK,String tableName,
			String where,String orderBy,String[] rootCols,String rootTableName,String rootWhere,
			String rootOrderBy,String[] selfJoinCols,String[] nestedCols,boolean lockSet) {
		Document document = DocumentHelper.createDocument() ;
		Element rows = document.addElement("rows") ;
		ArrayList<String> joinCols = new ArrayList<String>() ;
		if(rootCols==null)  {   //grid
			String sql = CreateSql(cols,dataOnlyCols,joinCols,PK,tableName,where,orderBy);
			getGridXML(rows,sql,cols,dataOnlyCols) ;
		} else {   //treegrid
			String rootnest = null ;
			if(nestedCols!=null&&nestedCols.length==2) {
				rootnest = nestedCols[0] ;
			}
			joinCols.add(rootnest) ;
			if(selfJoinCols.length==3) {
				joinCols.add(selfJoinCols[0])  ;
				joinCols.add(selfJoinCols[1])  ;
			}
			String rootsql = CreateSql(rootCols,null,joinCols,null,rootTableName,rootWhere,rootOrderBy);
			if(selfJoinCols.length==3)  {   //root中存在层次关系
				LinkedHashMap<String[],ArrayList<String>> rsmap = new LinkedHashMap<String[],ArrayList<String>>() ;
				ArrayList ls = rootsqlToMap(rootsql,rootCols,selfJoinCols)  ;
				HashSet<String> pset = new HashSet() ;
				rsmap = (LinkedHashMap<String[], ArrayList<String>>) ls.get(0) ;
				pset = (HashSet<String>) ls.get(1) ;
				getTreeGridXML(rows,rsmap,selfJoinCols[2],lockSet,cols,dataOnlyCols,PK,tableName,where,orderBy,nestedCols,pset) ;
			} else {
				getTGridXML(rows,rootCols,rootsql,lockSet,cols,dataOnlyCols,PK,tableName,where,orderBy,nestedCols) ;
			}
		}
		return document.asXML();
	}
	
	
	private static void getTGridXML(Element rows, String[] rootCols, String rootsql,
			boolean lockSet, String[] cols, String[] dataOnlyCols, String pk,
			String tableName, String where, String orderBy, String[] nestedCols) {
		List<ListOrderedMap> list = JdbcUtil.query(rootsql);	
		for(int s = 0 ;s < list.size() ;s++) {
			ListOrderedMap smap = list.get(s) ;
			Element row = rows.addElement("row") ;
			int joincol = smap.indexOf("joincols0".toUpperCase()) ;
			String nestedvalue = smap.getValue(joincol)==null?"":smap.getValue(joincol).toString() ;
			if(joincol>-1) {
				row.addAttribute("id",nestedvalue) ;
			}
			row.addAttribute("root", "1") ;
			row.addAttribute("open", "1") ;
			if(lockSet) {
				row.addAttribute("locked", "1") ;
			}
			for(int i=0;i<rootCols.length;i++)  {
				Element cell = row.addElement("cell") ;
				int cellindex = smap.indexOf(("cols"+i).toUpperCase()) ;
				cell.addCDATA(smap.getValue(cellindex)==null?"":smap.getValue(cellindex).toString()) ;
			}
			String filterwhere = where ;
			if(nestedCols!=null)  {
				filterwhere = where+" and "+nestedCols[1]+"='"+nestedvalue+"'" ;
			}
			String detailsql = CreateSql(cols,dataOnlyCols,null,pk,tableName,filterwhere,orderBy);
			getGridXML(row,detailsql,cols,dataOnlyCols) ;
		}
	}


	private static void getTreeGridXML(Element rows,
			HashMap<String[], ArrayList<String>> rsmap, String root,
			boolean lockSet, String[] cols, String[] dataOnlyCols,
			String pk, String tableName, String where, String orderBy, String[] nestedCols, HashSet<String> pset) {
		Iterator it = rsmap.keySet().iterator() ;
		while(it.hasNext()) {
			Object key =  it.next() ;
			ArrayList<String> al = (ArrayList) rsmap.get(key) ;
			String[] keyvalues = (String[]) key ;
			if(keyvalues[1]!=null&&keyvalues[0].equals(root)) {
				Element row = rows.addElement("row") ;
				row.addAttribute("id", keyvalues[1]) ;
				row.addAttribute("root", "1") ;
				row.addAttribute("open", "1") ;
				if(lockSet) {
					row.addAttribute("locked", "1") ;
				}
				for(int i=0;i<al.size();i++)  {
					Element cell = row.addElement("cell") ;
					cell.addCDATA(al.get(i)) ;
				}
				
				//detail
				String filterwhere = where ;
				if(nestedCols!=null) {
					filterwhere = where+" and "+nestedCols[0]+"='"+keyvalues[2]+"'" ;
				}
				String detailsql = CreateSql(cols,dataOnlyCols,null,pk,tableName,filterwhere,orderBy);
				getGridXML(row,detailsql,cols,dataOnlyCols) ;
				
				if(pset.contains(keyvalues[0]))  {  //存在子层时
					getTreeGridXML(row,rsmap,keyvalues[1],lockSet,cols,dataOnlyCols,pk,tableName,where,orderBy,nestedCols,pset) ;
				}
			}
		}
	}


	private static ArrayList rootsqlToMap(String rootsql, String[] rootCols, String[] selfJoinCols) {
		ArrayList list = new ArrayList() ;
		HashSet<String> pset = new HashSet() ;
		LinkedHashMap<String[],ArrayList<String>> map = new LinkedHashMap<String[],ArrayList<String>>() ;
		List<ListOrderedMap> rootlist = JdbcUtil.query(rootsql);	
		for(int s = 0 ;s < rootlist.size() ;s++) {
			ListOrderedMap smap = rootlist.get(s) ;
			ArrayList alist = new ArrayList() ;
			for(int i=0;i<rootCols.length;i++) {
				Object value = smap.getValue(smap.indexOf(("cols"+i).toUpperCase())) ;
				alist.add(value==null?"":value) ;
			}
			String[] attri =  new String[3] ;
			attri[0] = smap.getValue(smap.indexOf(("joincols"+1).toUpperCase()))==null?"":smap.getValue(smap.indexOf(("joincols"+1).toUpperCase())).toString() ;  //父节点值
			attri[1] = smap.getValue(smap.indexOf(("joincols"+2).toUpperCase()))==null?"":smap.getValue(smap.indexOf(("joincols"+2).toUpperCase())).toString() ;  //当前节点值
			attri[2] = smap.getValue(smap.indexOf(("joincols"+0).toUpperCase()))==null?"":smap.getValue(smap.indexOf(("joincols"+0).toUpperCase())).toString() ;  //根节点与明细行关联
			map.put(attri, alist) ;
			pset.add(attri[0])  ;
		}
		list.add(map) ;
		list.add(pset) ;
		return list ;
	}


	private static String CreateSql(String[] cols, String[] dataOnlyCols,
			ArrayList joinCols, String pk, String tableName, String where, String orderBy) {
		StringBuffer sql = new StringBuffer("") ; 
		//重组sql时所有的列都加上别名，主键为PK，其他依次为cols1..n
		sql.append("select ") ;
		if(pk!=null) {
			sql.append("("+pk.replace(",", "||")+") pk");
			sql.append(",");
		}
		//加入cols中的字段 重命名为cols1..n
		for (int i = 0;i<(cols.length);i++){
			sql.append("("+cols[i]+") cols"+i);
			sql.append(",");
		}
		if(dataOnlyCols!=null)  {
			//加入dataOnlyCols中的字段 重命名为dataonlycols1..n
			for (int i = 0;i<dataOnlyCols.length;i++){
				sql.append("("+dataOnlyCols[i]+") dataonlycols"+i);
				sql.append(",");
			}
		}
		
		if(joinCols!=null&&joinCols.size()>0)  {
			for(int i=0;i<joinCols.size();i++)  {
				sql.append("("+joinCols.get(i)+") joincols"+i);
				sql.append(",");
			}
		}
		sql.deleteCharAt(sql.length()-1) ;
		sql.append(" from ");
		sql.append(tableName);
		sql.append(" where ");
		sql.append(where);	
		if(orderBy!=null) {
			sql.append(" order by ");
			sql.append(orderBy);
		}
		return sql.toString();
	}
	
	private static void getGridXML(Element rows, String sql, String[] cols, String[] dataOnlyCols) {
		List<ListOrderedMap> rootlist = JdbcUtil.query(sql);	
		for(int s = 0 ;s < rootlist.size() ;s++) {
			ListOrderedMap smap = rootlist.get(s) ;	
			Element row = rows.addElement("row") ;
			if(dataOnlyCols!=null) {
				for(int d=0;d<dataOnlyCols.length;d++)  {
					Object data = smap.getValue(smap.indexOf(("dataonlycols"+d).toUpperCase())) ;
					row.addAttribute(dataOnlyCols[d], data==null?"":data.toString()) ;
				}
			}
			row.addAttribute("id",smap.getValue(smap.indexOf(("pk").toUpperCase())).toString()) ;
			for(int c=0;c<cols.length;c++)  {
				Element cell = row.addElement("cell")  ;
				Object value = smap.getValue(smap.indexOf(("cols"+c).toUpperCase())) ;
				cell.addCDATA(value==null?"":value.toString()) ;
			}
			
		}
	}
}