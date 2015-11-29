package com.sgepit.frame.util.db;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;
/**
 * 使用sql语句直接进行查询，返回json格式结果的工具类
 *
 */
public class Db2Json {
	/**
	 * 将字符串转为html适用格式,转换了各种特殊符号编码.
	 * @param in 传入字符串.
	 * @return 转换后的字符串.
	 */
	public String toHtmlString(String in) {
		StringBuffer out = new StringBuffer();
		for (int i=0;in!=null&&i<in.length();i++){   
			char c = in.charAt(i);
			switch(c) {
				case '\'':
					out.append("&#039;");
					break;
				case '\"':
					out.append("&#034;");
					break;
				case '<':
					out.append("&lt;");
					break;
				case '>':
					out.append("&gt;");
					break;
				case '&':
					out.append("&amp;");
					break;
				/*case ' ':
					out.append("&nbsp;");
					break;*/
				case '\n':
					out.append("<br>");
					break;
				default:
					out.append(c);
			}
		}
		return out.toString();
	}
	
	/**
	 * 执行指定sql语句,用于非数据查询的情况
	 * @param sql 指定的sql语句
	 * @return 执行成功返回true,否则返回false
	 */
	public boolean execute(String sql) {
		boolean flag = false;
		try {
			Context initCtx = new InitialContext();

			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String[] s = sql.split(";");
			for(int i=0; i<s.length; i++) {
				if(!s[i].trim().equals("")) {
					stmt.addBatch(s[i]);
				}
			}
			stmt.executeBatch();
			stmt.close();
			conn.close();
			initCtx.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 通过sql语句查询,生成json格式的字符串,格式为简单二维数组形式
	 * @param sqlStr 查询sql语句
	 * @return 生成的json串
	 */
	public String selectSimpleData(String sqlStr) {
		String jsonStr = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sqlStr);
			ResultSetMetaData rsmd = rs.getMetaData();
			while(rs.next()) {
				jsonStr += "," + this.formatSimpleData(rs, rsmd);
			}
			if(jsonStr.equals("")) {
				jsonStr = "[]";
			}
			else {
				jsonStr = "[" + jsonStr.substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return jsonStr;
	}
	
	/**
	 * 通过sql语句查询,生成json格式的字符串,格式为简单二维数组形式,带分页功能
	 * @param sqlStr sql查询语句
	 * @param p_pages 指定的页数
	 * @param p_size 指定的每页记录数
	 * @return 返回json格式查询结果
	 */
	public String[] selectPageSimpleData(String sqlStr, int p_pages, int p_size) {
		String[] jsonArray = new String[2];
		try {
			Context initCtx = new InitialContext();
			
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = stmt.executeQuery(sqlStr);
			ResultSetMetaData rsmd = rs.getMetaData();
			//将结果集移至最后
			rs.last();
			//得到记录条数
			jsonArray[0] = rs.getRow() + "";
			//起始位置
			int r = (p_pages - 1) * p_size;
			//结束位置
			int e = r + p_size;
			if(r==0) {
				rs.beforeFirst();
			}
			else {
				rs.absolute(r);
			}
			jsonArray[1] = "";
			while(rs.next() && r<e) {
				jsonArray[1] += "," + this.formatSimpleData(rs, rsmd);
				r++;
			}
			if(jsonArray[1].equals("")) {
				jsonArray[1] = "[]";
			}
			else {
				jsonArray[1] = "[" + jsonArray[1].substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return jsonArray;
	}
	
	/**
	 * 通过sql语句查询,生成json格式的字符串,包含相应数据列信息
	 * @param sqlStr sql查询语句
	 * @return 生成的json格式字符串
	 */
	public String selectData(String sqlStr) {
		String jsonStr = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sqlStr);
			ResultSetMetaData rsmd = rs.getMetaData();
			while(rs.next()) {
				jsonStr += "," + this.formatData(rs, rsmd);
			}
			if(jsonStr.equals("")) {
				jsonStr = "[]";
			}
			else {
				jsonStr = "[" + jsonStr.substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return jsonStr;
	}
	/**
	 * 通过sql语句查询,生成json格式的字符串,包含相应数据列信息,带分页功能
	 * @param sqlStr sqlStr sql查询语句
	 * @param p_pages 指定页数
	 * @param p_size 指定的每页记录数
	 * @return 返回json格式查询结果
	 */
	public String[] selectPageData(String sqlStr, int p_pages, int p_size) {
		String[] jsonArray = new String[2];
		try {
			Context initCtx = new InitialContext();
			
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = stmt.executeQuery(sqlStr);
			ResultSetMetaData rsmd = rs.getMetaData();
			//将结果集移至最后
			rs.last();
			//得到记录条数
			jsonArray[0] = rs.getRow() + "";
			//起始位置
			int r = (p_pages - 1) * p_size;
			//结束位置
			int e = r + p_size;
			if(r==0) {
				rs.beforeFirst();
			}
			else {
				rs.absolute(r);
			}
			jsonArray[1] = "";
			while(rs.next() && r<e) {
				jsonArray[1] += "," + this.formatData(rs, rsmd);
				r++;
			}
			if(jsonArray[1].equals("")) {
				jsonArray[1] = "[]";
			}
			else {
				jsonArray[1] = "[" + jsonArray[1].substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return jsonArray;
	}
	
	/**
	 * 执行指定的存储过程和函数(有返回结果集的情况，适用于oracle数据库)
	 * @param p_fun 指定的存储过程名称.
	 * @param p_param 参数数组
	 * @return 返回json格式查询结果
	 */
	public String selectProcedure(String p_fun, String[] p_param) {
		String jsonStr = "";
		try {
			Context initCtx = new InitialContext();

			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			//////////
			String sql = "";
			for(int i=0;i<p_param.length;i++) {
				if(sql.equals("")){
					sql = "?";
				}
				else {
					sql += ",?";
				}
			}
			sql = "{?=call " + p_fun + "(" + sql + ")}";
			//////////
			CallableStatement stmt = conn.prepareCall(sql);
			for(int i=0;i<p_param.length;i++) {
				stmt.setString(i+2, p_param[i]);
			}
			stmt.registerOutParameter( 1, oracle.jdbc.OracleTypes.CURSOR);
			stmt.execute();
			ResultSet rs = (ResultSet)stmt.getObject(1);
			ResultSetMetaData rsmd = rs.getMetaData();
			while(rs.next()) {
				jsonStr += "," + this.formatData(rs, rsmd);
			}
			if(jsonStr.equals("")) {
				jsonStr = "[]";
			}
			else {
				jsonStr = "[" + jsonStr.substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return jsonStr;
	}
	
	/**
	 * 执行指定的存储过程和函数（无返回结果集的情况）
	 * @param procedure 指定的存储过程或函数名
	 * @param parameters 参数数组
	 * @return 执行成功返回true，否则返回false
	 * @throws SQLException
	 * @throws NamingException
	 */
	public String selectProcedureNoResult(String procedure, String[] parameters) throws SQLException, NamingException {
		CallableStatement call = null;
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
		Connection conn = ds.getConnection();			
		String ifOk = "false";
		try{
			
			String pstr2 = "{call " + procedure;
			String str = "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,";
			pstr2 += " (";
			pstr2 += (parameters != null && parameters.length > 0) ? str
					.substring(0, parameters.length * 2 - 1)
					: "";
			pstr2 += ")}";
			
			call = conn.prepareCall(pstr2);

			for(int i=0;i<parameters.length;i++) {
				call.setString(i+1, parameters[i]);
			}
			
			call.execute();
			ifOk = "true";
			
		}catch(SQLException ex) {
			ifOk = "false";
			//ex.printStackTrace();
		} finally
		{			
			call.close();
			conn.close();
		}
		return ifOk;
	}	
	
	
	private String formatData(ResultSet p_rs,ResultSetMetaData p_rsmd) {
		String datStr = "";
		try {
			int colcn = p_rsmd.getColumnCount();
			for( int i=1; i<=colcn; i++ ) {
				String s = "";
				if(p_rsmd.getColumnType(i) == java.sql.Types.DATE) {
					s = p_rs.getDate(i)==null?"":new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(p_rs.getTimestamp(i));
				}
				else {
					s = p_rs.getString(i)==null?"":this.toHtmlString(p_rs.getString(i));
				}
				datStr += "," + p_rsmd.getColumnName(i).toLowerCase() + ":'" + s + "'";
			}
			if(datStr.startsWith(",")) {
				datStr = "{" + datStr.substring(1) + "}";
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return datStr;
	}
	
	private String formatSimpleData(ResultSet p_rs,ResultSetMetaData p_rsmd) {
		String datStr = "";
		try {
			int colcn = p_rsmd.getColumnCount();
			for( int i=1; i<=colcn; i++ ) {
				String s = "";
				if(p_rsmd.getColumnType(i) == java.sql.Types.DATE) {
					s = p_rs.getDate(i)==null?"":new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(p_rs.getTimestamp(i));
				}
				else {
					s = p_rs.getString(i)==null?"":this.toHtmlString(p_rs.getString(i));
				}
				datStr += ",'" + s + "'";
			}
			if(datStr.startsWith(",")) {
				datStr = "[" + datStr.substring(1) + "]";
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return datStr;
	}
}