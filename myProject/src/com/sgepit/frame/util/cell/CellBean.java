package com.sgepit.frame.util.cell;

import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;

public class CellBean {
	
	public boolean saveToDb(String p_type, String p_unit, String p_dept,String p_date, String p_content) {
		boolean flag = false;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			PreparedStatement pstmt = null;
			String sql = "select RESPORT_NO,MODEL_ID from SGCC_GUIDELINE_MODEL_MASTER"
						+ " where MODEL_TYPE='" + p_type + "' and DEPT_ID='" + p_dept + "' and SJLX='" + p_date + "'";
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				if(rs.getString(1)==null) {
					String id = SnUtil.getNewID();
					pstmt = conn.prepareStatement("insert into SYSTEM_LONGDATA (FILE_LSH,FILE_NR) values (?,?)");
					pstmt.setString(1, id);
					pstmt.setBytes(2, p_content.getBytes());
					pstmt.execute();
					pstmt.close();
					
					pstmt = conn.prepareStatement("update SGCC_GUIDELINE_MODEL_MASTER set RESPORT_NO=? where MODEL_ID='" + rs.getString(2) + "'");
					pstmt.setString(1, id);
					pstmt.execute();
					pstmt.close();
				}
				else {
					/*String sql1 = "MERGE into SYSTEM_LONGDATA t1 USING"
								+"(select ? as FILE_LSH from dual) t2 on (t1.FILE_LSH=t2.FILE_LSH)"
								+ " when matched then update set FILE_NR=?"
								+ " when not matched then insert (FILE_LSH,FILE_NR) values (t2.FILE_LSH,?)"*/;
					String sql1 = "update SYSTEM_LONGDATA set FILE_NR=? where FILE_LSH=?";
					pstmt = conn.prepareStatement(sql1);
					pstmt.setBytes(1, p_content.getBytes());
					pstmt.setString(2, rs.getString(1));
					pstmt.execute();
					pstmt.close();
				}
			}
			else {
				String id = SnUtil.getNewID();
				pstmt = conn.prepareStatement("insert into SYSTEM_LONGDATA (FILE_LSH,FILE_NR) values (?,?)");
				pstmt.setString(1, id);
				pstmt.setBytes(2, p_content.getBytes());
				pstmt.execute();
				pstmt.close();
				
				String model_id = SnUtil.getNewID();
				pstmt = conn.prepareStatement("insert into SGCC_GUIDELINE_MODEL_MASTER (MODEL_ID,MODEL_TYPE,UNIT_ID,DEPT_ID,SJLX,RESPORT_NO) values (?,?,?,?,?,?)");
				pstmt.setString(1, model_id);
				pstmt.setString(2, p_type);
				pstmt.setString(3, p_unit);
				pstmt.setString(4, p_dept);
				pstmt.setString(5, p_date);
				pstmt.setString(6, id);
				pstmt.execute();
				pstmt.close();
			}
			rs.close();
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
	
	public String getCellCtx(String p_type,String p_dept,String p_date) {
		return this.getCellContent(this.getReportID(p_type, p_dept, p_date));
	}
	
	public String getCellContent(String p_id) {
		String ctx = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select FILE_NR from SYSTEM_LONGDATA where FILE_LSH='" + p_id + "'";
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				Blob blob = rs.getBlob(1);
				ctx = new String(blob.getBytes(1, (int)blob.length()));
			}
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return ctx;
	}
	
	public String getReportID(String p_type,String p_dept,String p_date) {
		String reportID = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select RESPORT_NO from SGCC_GUIDELINE_MODEL_MASTER "
						+ "where MODEL_TYPE='" + p_type + "' and DEPT_ID='" + p_dept + "' and SJLX<='" + p_date + "' "
						+ "and RESPORT_NO is not null order by SJLX desc";
			//System.out.println(sql);
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				reportID = rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return reportID;
	}
	
	public String getDateList(String p_type,String p_dept) {
		String str = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select SJLX from SGCC_GUIDELINE_MODEL_MASTER "
						+ "where MODEL_TYPE='" + p_type + "' and DEPT_ID='" + p_dept + "' "
						+ "and RESPORT_NO is not null order by SJLX desc";
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				str += ",['" + rs.getString(1) + "']";
			}
			if(str.equals("")) {
				str = "[]";
			}
			else {
				str = "[" + str.substring(1) + "]";
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return str;
	}
}