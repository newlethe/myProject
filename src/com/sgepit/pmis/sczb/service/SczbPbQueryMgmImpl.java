package com.sgepit.pmis.sczb.service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbBc;

public class SczbPbQueryMgmImpl implements SczbPbQueryMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}

	public void insertSczbBc(SczbBc bc) {
		// TODO Auto-generated method stub
		sczbBcDao.saveOrUpdate(bc);
	}
	
	public String[] getzcAndzbTime(String rq, String bc,String pid) {
		// TODO Auto-generated method stub
		String sql="select zc_name as  ZC,to_char(t.begin_time,'hh24:mi:ss')||'-'||to_char(t.end_time,'hh24:mi:ss') as ZBTIME from sc_yx_zbgl_pb_query t  where t.initial_date = to_date('"
			+ rq + "', 'yyyy-mm-dd') and t.bc_name='" + bc + "' and pid='"+pid+"'";
		List list = JdbcUtil.query(sql);
		
		if (list != null && list.size() > 0) {
			
		}else{
			this.initByBc(pid, rq, bc);
			list = JdbcUtil.query(sql);
		}
		Map map=(Map)list.get(0);
		String[] str={map.get("ZC").toString(),map.get("ZBTIME").toString()};
		return str;
		
	}
	
	private void initByBc(String pid,String rq,String bc){
		Connection conn = null;
		CallableStatement cstmt = null;
		try {
			String callStr = "{call PKG_ZBGL.p_zbdj_bybc(?,?,?)}";
			conn = HibernateSessionFactory.getConnection();
			cstmt = conn.prepareCall(callStr);
			cstmt.setString(1, rq);
			cstmt.setString(2, bc);
			cstmt.setString(3, pid);
			cstmt.executeUpdate();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("调用PKG_ZBGL.p_zbdj_bybc存储过程出错");
			e.printStackTrace();
		} finally {
			try {
				cstmt.close();
				conn.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				System.out.println("数据库连接关闭出错");
				e.printStackTrace();
			}
		}
		
		
	}
	

}
