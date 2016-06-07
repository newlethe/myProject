package com.sgepit.pmis.sczb.service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbJjb;

public class SczbJjbMgmImpl implements SczbJjbMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}

	public void initJjb(String pid, String departId) {
		// TODO Auto-generated method stub
		Connection conn = null;
		CallableStatement cstmt = null;
		String callStr = "{call PKG_ZBGL.p_retrieveZC2(?)}";
		try {
			conn = HibernateSessionFactory.getConnection();
			cstmt = conn.prepareCall(callStr);
			cstmt.setString(1, pid);
			cstmt.executeUpdate();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("调用PKG_ZBGL.p_retrieveZC2存储过程出错");
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

	public String getBcBy(String pid, String qx) {
		// TODO Auto-generated method stub
		List list = JdbcUtil.query("select PKG_ZBGL.retrieveBC2('" + pid
				+ "','" + qx + "') BC from dual");
		if (list != null && list.size() > 0) {
			Map map = (Map) list.get(0);
			return map.get("BC").toString();
		}
		return null;
	}

	public String getZCBy(String pid, String qx) {
		// TODO Auto-generated method stub
		String bcName = getBcBy(pid, qx);
		
		if (bcName != null) {
			List list = JdbcUtil.query("select PKG_ZBGL.f_retrieveZC2('"
					+ bcName + "') ZC from dual");
			if (list != null && list.size() > 0) {
				Map map = (Map) list.get(0);
				return map.get("ZC").toString();
			}
		}
		return null;
	}

	public boolean initJjbTable(String pid, String departId, String qx) {
		// TODO Auto-generated method stub
		boolean isSucessfull = false;
		List list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbJjb",
				" pid='" + pid + "' and userUnitid='" + departId + "'");
		if (!(list != null && list.size() > 0)) {// 数据没有初始化
			Connection conn = null;
			CallableStatement cstmt = null;
			try {
				this.initJjb(pid, departId);
				String callStr = "{call PKG_ZBGL.initZBJLTables(?,?,?,?)}";
				String zcName = getZCBy(pid, qx);
				String bcName = getBcBy(pid, qx);

				conn = HibernateSessionFactory.getConnection();
				cstmt = conn.prepareCall(callStr);
				cstmt.setString(1, departId);
				cstmt.setString(2, pid);
				cstmt.setString(3, zcName);
				cstmt.setString(4, bcName);
				cstmt.executeUpdate();
				initMendJjb(pid);
				isSucessfull = true;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				isSucessfull = true;
				System.out.println("调用PKG_ZBGL.initZBJLTables存储过程出错");
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
		return isSucessfull;
	}

	public void initMendJjb(String pid) {
		Connection conn = null;
		CallableStatement cstmt = null;
		try {
			String callStr = "{call PKG_ZBGL.p_mend_jjbjl(?)}";
			conn = HibernateSessionFactory.getConnection();
			cstmt = conn.prepareCall(callStr);
			cstmt.setString(1, pid);
			cstmt.executeUpdate();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("调用PKG_ZBGL.p_mend_jjbjl存储过程出错");
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

	public String isCanJb(String jbPerson,String getPerson,String pid, String qx, String bc_name, String rq) {
		// TODO Auto-generated method stub
		String msg = "";
		String v_bc = getBcBy(pid, qx);
		if (!v_bc.equals(bc_name)) {//正常交接班
			msg=this.creatNewData(jbPerson, getPerson, pid, qx, bc_name, rq);
		} else {
			List list = JdbcUtil.query("select sysdate-to_date('" + rq
					+ "','yyyy-mm-dd') AA from dual");
			if ("夜班".equals(v_bc)) {
				if (list != null && list.size() > 0) {
					Map map = (Map) list.get(0);
					Double mapValue = Double.parseDouble(map.get("AA")
							.toString());
					if (mapValue < (1 + Double.parseDouble(qx) / 1440)) {
						msg = "未到接班时间！";
					} else {// 交接班
						msg=this.creatNewData(jbPerson, getPerson, pid, qx, bc_name, rq);
					}
				}
			} else {
				if (list != null && list.size() > 0) {
					Map map = (Map) list.get(0);
					Double mapValue = Double.parseDouble(map.get("AA")
							.toString());
					if (mapValue < 1) {
						msg = "未到接班时间！";
					} else {// 交接班
						msg=this.creatNewData(jbPerson, getPerson, pid, qx, bc_name, rq);
					}
				}
			}
		}
		return msg;
	}
	
	//参数：交班人，接班人
	private String creatNewData(String jbPerson,String getPerson,String pid, String qx, String bc_name, String rq ){
		String msg="";
		String v_bc = this.getBcBy(pid, qx);
		String v_zc = this.getZCBy(pid, qx);
		List list=JdbcUtil.query("select sysdate-to_date('" + rq + "','yyyy-mm-dd') AA from dual");
		if(list!=null&&list.size()>0){
			Map map=(Map)list.get(0);
			Double mapValue=Double.parseDouble(map.get("AA").toString());
			if(mapValue>1.0 && mapValue<(1+Double.parseDouble(qx)/1440) && "早班".equals(bc_name)){//hard coding!: gap.value>1 && gap<(1+adv/1440) MEANS 0:00-0:adv
				qx= "30"; //hard coding!: 30 mins in advance - by this we can keep RQ the same as p_rq in PKG_YXGL.initialJJB 
			}
		}
		Connection conn = null;
		CallableStatement cstmt = null;
		try {
			String callStr = "{call PKG_ZBGL.initialJJB(?,?,?,?,?,?,?,?)}";
			conn = HibernateSessionFactory.getConnection();
			cstmt = conn.prepareCall(callStr);
			cstmt.setString(1, pid);
			cstmt.setString(2, pid);
			cstmt.setString(3, v_bc);
			cstmt.setString(4, v_zc);
			cstmt.setString(5, jbPerson);
			cstmt.setString(6, getPerson);
			cstmt.setString(7, pid);
			cstmt.setString(8, qx);
			cstmt.executeUpdate();
			msg="交接班成功";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			msg="交接班失败";
			System.out.println("调用PKG_ZBGL.initialJJB存储过程出错");
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
		return msg;
	}

	public void updateJjb(SczbJjb jjb) {
		// TODO Auto-generated method stub
		sczbBcDao.saveOrUpdate(jjb);
	}

	public Object getJJB(String pid) {
		// TODO Auto-generated method stub
		List list=sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbJjb", "PID = '" + pid + "' and recordState='0'");
		if(list!=null&&list.size()>0){
			return list.get(0);
		}
		return null;
	}

	public void initJJBQuery(String pid, String beginTime, String endTime) {
		// TODO Auto-generated method stub
		Connection conn = null;
		CallableStatement cstmt = null;
		String callStr = "{call PKG_ZBGL.p_zbdj(?,?,?)}";
		try {
			conn = HibernateSessionFactory.getConnection();
			cstmt = conn.prepareCall(callStr);
			cstmt.setString(1, beginTime);
			cstmt.setString(2, endTime);
			cstmt.setString(3, pid);
			cstmt.executeUpdate();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("调用PKG_ZBGL.p_zbdj存储过程出错");
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
