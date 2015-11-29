package com.sgepit.pmis.rzgl.service;

import java.text.NumberFormat;
import java.util.List;

import org.hibernate.SQLQuery;

import com.sgepit.pmis.rzgl.dao.RzglFlQxUnitDAO;
import com.sgepit.pmis.rzgl.dao.RzglFlTreeDAO;
import com.sgepit.pmis.rzgl.dao.RzglRzDAO;
import com.sgepit.pmis.rzgl.dao.RzglRzPlDAO;
import com.sgepit.pmis.rzgl.hbm.RzglFlQxUnit;
import com.sgepit.pmis.rzgl.hbm.RzglFlTree;

/**
 * 日志管理-分类树Service接口实现
 * @author zhengw
 * @versionV1.00
 * @since2-14-2-17
 */
public class RzglServiceImpl implements RzglService { 
	/**
	 * 日志分类树DAO
	 */
	private RzglFlTreeDAO rzglFlTreeDAO;
	/**
	 * 日志分类权限DAO
	 */
	private RzglFlQxUnitDAO rzglFlQxUnitDAO;
	/**
	 * 日志DAO
	 */
	private RzglRzDAO rzglRzDAO;
	/**
	 * 日志评论DAO
	 */
	private RzglRzPlDAO rzglRzPlDAO;
	public RzglFlTreeDAO getRzglFlTreeDAO() {
		return rzglFlTreeDAO;
	}

	public void setRzglFlTreeDAO(RzglFlTreeDAO rzglFlTreeDAO) {
		this.rzglFlTreeDAO = rzglFlTreeDAO;
	}

	
	public RzglFlQxUnitDAO getRzglFlQxUnitDAO() {
		return rzglFlQxUnitDAO;
	}

	public void setRzglFlQxUnitDAO(RzglFlQxUnitDAO rzglFlQxUnitDAO) {
		this.rzglFlQxUnitDAO = rzglFlQxUnitDAO;
	}

	
	
	public RzglRzDAO getRzglRzDAO() {
		return rzglRzDAO;
	}

	public void setRzglRzDAO(RzglRzDAO rzglRzDAO) {
		this.rzglRzDAO = rzglRzDAO;
	}

	
	public RzglRzPlDAO getRzglRzPlDAO() {
		return rzglRzPlDAO;
	}

	public void setRzglRzPlDAO(RzglRzPlDAO rzglRzPlDAO) {
		this.rzglRzPlDAO = rzglRzPlDAO;
	}

	@Override
	public void deleteById(String uids) {
		RzglFlTree entity = new RzglFlTree(uids);
		//增加级联删除节点权限逻辑
		List<RzglFlQxUnit> flQxList = rzglFlQxUnitDAO.findByProperty("com.sgepit.pmis.rzgl.hbm.RzglFlQxUnit", "qxFl", uids);
		if (flQxList != null && flQxList.size() > 0) {
			rzglFlQxUnitDAO.deleteAll(flQxList);
		}
		rzglFlTreeDAO.getHibernateTemplate().delete(entity);
	}
	/**
	 * 获取到货批号，其他设备模块的批号可通用
	 * @param pid : PID
	 * @param prefix : 编号前缀
	 * @param col : 列名称
	 * @param table : 表名称
	 * @param lsh ：最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2012-06-29
	 */
	public String getNewFlNo( String prefix, String col, String table,Long lsh){
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 2)),0) +1,'00')) from "
					+ table + " where  substr("
					+ col + ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = this.rzglFlTreeDAO.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);

		}
		bh = prefix.concat(newLsh);
		return bh;
	}

	@Override
	public RzglFlTree findById(String uids) {
		RzglFlTree fl =  (RzglFlTree) rzglFlTreeDAO.findById("com.sgepit.pmis.rzgl.hbm.RzglFlTree", uids);
		return fl;
	}

	@Override
	public void saveAll(List<RzglFlTree> entityList) {
		rzglFlTreeDAO.getHibernateTemplate().saveOrUpdateAll(entityList);
	}

	@Override
	public void saveAllQx(List<RzglFlQxUnit> addQxList) {
		rzglFlQxUnitDAO.getHibernateTemplate().saveOrUpdateAll(addQxList);
	}

	@Override
	public RzglFlQxUnit findQxByFlAndDept(String flId, String dept) {
		List<RzglFlQxUnit> qxList = rzglFlQxUnitDAO.findByWhere2("com.sgepit.pmis.rzgl.hbm.RzglFlQxUnit", "qxFl='"+flId+"' and qxDept='"+dept+"'");
		if (qxList != null && qxList.size() > 0) {
			return qxList.get(0);
		}
		return null;
	}

	@Override
	public void deleteAllQx(List<RzglFlQxUnit> addQxList) {
		rzglFlQxUnitDAO.deleteAll(addQxList);
	}

	@Override
	public List<RzglFlTree> getSonFlByFl(String selectFl,String QxSql) {
		String sql="select * from (SELECT * FROM rzgl_fl_tree f START WITH f.uids = '"+selectFl+"' CONNECT BY f.parrent_uids = PRIOR f.uids) where 1=1 "; //这里必须是实体类名
		if (QxSql != null) {
			sql += " and uids in("+QxSql+") ";
		}
		SQLQuery sq = rzglFlTreeDAO.getSessionFactory().openSession().createSQLQuery(sql); 
		sq.addEntity(RzglFlTree.class); 
		List<RzglFlTree> list = sq.list();
		if (list != null && list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	public String getFlWhereInByFlList(List<RzglFlTree> flList) {
		if (flList != null && flList.size() > 0) {
			StringBuffer sbf = new StringBuffer();
			sbf.append("'");
			for (int i = 0; i < flList.size(); i++) {
				RzglFlTree fl = flList.get(i);
				sbf.append(fl.getUids());
				if (i != (flList.size()-1)) {
					sbf.append("','");
				}else {
					sbf.append("'");
				}
			}
			return sbf.toString();
		}
		return null;
	}
}
