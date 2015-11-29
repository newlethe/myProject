package com.sgepit.frame.util.cell;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;

public final class Props {

	//根据参数转换时间类型
	public String transDate(String p_dt,String p_type) {
		String date = p_dt;
		
		//下面语句用于判断日期结尾是否为字母//暂未使用
		//Character.isDigit(p_dt.charAt(p_dt.length()-1))

		try{
			int t = Integer.parseInt(p_type.substring(0,2));
			switch(t) {
				case 10:	//本年
					date = p_dt.substring(0,4);
					break;
				case 11:	//去年
					date = Integer.parseInt(p_dt.substring(0,4)) - 1 + "";
					break;
				case 12:	//前年
					date = Integer.parseInt(p_dt.substring(0,4)) - 2 + "";
					break;
				case 20:	//本月
					date = p_dt;
					break;
				case 21:	//上月
					date = Integer.parseInt(p_dt) - 1 + "";
					break;
				case 22:	//上年同月
					if(p_dt.endsWith("Q")) {
						date = Integer.parseInt(p_dt.substring(0,4)) - 1 + p_dt.substring(4, 6);
					}
					else {
						date = Integer.parseInt(p_dt) - 100 + "";
					}
					break;
				case 23: 	//上月(跨年)
					if(p_dt.endsWith("01")) {
						date = Integer.parseInt(p_dt) - 89 + "";
					}
					else {
						date = Integer.parseInt(p_dt) - 1 + "";
					}
					break;
				case 24:	//上年下月(跨年)
					if(p_dt.endsWith("12")) {
						date = Integer.parseInt(p_dt) - 11 + "";
					}
					else {
						date = Integer.parseInt(p_dt) - 99 + "";
					}
					break;
				case 30:	//本季度
					date = p_dt;
					break;
				case 31:	//上季度
					date = Integer.parseInt(p_dt.substring(0,5)) - 1 + "Q";
					break;
				case 32:	//上年同季度
					date = Integer.parseInt(p_dt.substring(0,5)) - 10 + "Q";
					break;
				case 33:	//上季度(跨年)
					if(p_dt.endsWith("1Q")) {
						date = Integer.parseInt(p_dt.substring(0,5)) - 7 + "Q";
					}
					else {
						date = Integer.parseInt(p_dt.substring(0,5)) - 1 + "Q";
					}
					break;
				case 40:	//本年_月
					date = p_dt.substring(0,4) + p_type.substring(2,4);
					break;
				case 41:	//去年_月
					date = (Integer.parseInt(p_dt.substring(0,4)) - 1) + p_type.substring(2,4);
					break;
				case 42:	//前年_季度
					date = (Integer.parseInt(p_dt.substring(0,4)) - 2) + p_type.substring(2,4);
					break;
				case 50:	//本年_季度
					date = p_dt.substring(0,4) + p_type.substring(2,4);
					break;
				case 51:	//去年_季度
					date = (Integer.parseInt(p_dt.substring(0,4)) - 1) + p_type.substring(2,4);
					break;
				case 52:	//前年_季度
					date = (Integer.parseInt(p_dt.substring(0,4)) - 2) + p_type.substring(2,4);
					break;
				case 60:	//本年_半年
					date = p_dt.substring(0,4) + p_type.substring(2,4);
					break;
				case 61:	//去年_半年
					date = (Integer.parseInt(p_dt.substring(0,4)) - 1) + p_type.substring(2,4);
					break;
				case 62:	//前年_半年
					date = (Integer.parseInt(p_dt.substring(0,4)) - 2) + p_type.substring(2,4);
					break;
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return date;
	}
	
	public HashMap getPropsMap(String p_filter) {
		HashMap hm = new HashMap();
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select property_code,module_name from property_code where type_name='" + p_filter + "' order by item_id";
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				hm.put(rs.getString(1).toUpperCase().trim(), rs.getString(2).toUpperCase().trim());
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return hm;
	}
	
	public HashMap getColTypeMap() {
		HashMap typeMap = new HashMap();
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			////////////////////////////////////////////////// XML
			/*
			String sql = "select table_name||'.'||column_name as tabCol,data_type from user_tab_cols"
						+ " where table_name in (select NLS_UPPER(substr(module_name,0,instr(module_name,'.')-1)) from property_code where type_name='REPORT_COL')"
						+ " and (column_name in (select NLS_UPPER(substr(module_name,instr(module_name,'.')+1)) from property_code where type_name='REPORT_COL')"
						//判断从表是否有DETAIL_ID字段
						+ " or column_name in ('DETAIL_ID'))";
			 */
			String sql = "select table_name||'.'||column_name as tabCol,data_type from user_tab_cols"
				+ " where table_name in (select NLS_UPPER(substr(module_name,0,instr(module_name,'.')-1)) from property_code where type_name='REPORT_COL')";
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				typeMap.put(rs.getString(1).trim(), rs.getString(2).trim());
			}
			rs.close();
			////////////////////////////////////////////////// XML
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return typeMap;
	}
}