package com.sgepit.pmis.info;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;

public class InfoDwrOper {
	public boolean insertInfoHisUser(String pubinfoId, String names) {
		Boolean mark = false;
		String[] namesArr = names.substring(13).split("%2C");
		int length = namesArr.length;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement st = conn.createStatement();
			for (int i = 0; i < namesArr.length; i++) {
				String sn = UUID.randomUUID().toString();
				sn = sn.substring(0, 8) + sn.substring(9, 13)
						+ sn.substring(14, 18) + sn.substring(19, 23)
						+ sn.substring(24);
				// 去掉重复的ID
				for (int j = 0; j < namesArr.length; j++) {
					if (namesArr[i] != null && namesArr[i].equals(namesArr[j])
							&& i != j) {
						namesArr[j] = null;
						length--;
					}
				}
				// System.out.println(getedo_user(projectid,namesArr[i])+namesArr[i]);
				if (namesArr[i] != null && getHis_user(pubinfoId, namesArr[i])) {
					String sql = "insert into sgcc_info_history_user (pubinfo_id,userid,watch_date,pub_type)values('"
							+ pubinfoId
							+ "','"
							+ namesArr[i]
							+ "',sysdate,'1"
							//+ namesArr[i]
							+ "') ";
					st.execute(sql);
				}
			}
			mark = true;
			st.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			mark = false;
			ex.printStackTrace();
		}

		return mark;
	}

	// 项目是否是否存在此用户
	public boolean getHis_user(String pubinfoId, String userid) {
		Boolean b_mark = true;
		String sql = "select * from sgcc_info_history_user where pubinfo_id='"
				+ pubinfoId + "' and userid='" + userid+"'";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement st = conn
					.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
							ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery(sql);
			rs.last();
			int flag = rs.getRow();
			rs.beforeFirst();
			if (flag > 0) {
				b_mark = false;
			}
			st.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return b_mark;
	}

}
