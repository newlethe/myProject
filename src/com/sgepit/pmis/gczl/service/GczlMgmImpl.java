package com.sgepit.pmis.gczl.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.flow.hbm.TaskView;
import com.sgepit.pmis.gczl.dao.GczlDAO;

public class GczlMgmImpl implements GczlMgmFacade {
	private GczlDAO gczlDAO;
	public static GczlMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (GczlMgmImpl) ctx.getBean("gczlMgmImpl");
	}	

	public GczlDAO getGczlDAO() {
		return gczlDAO;
	}

	public void setGczlDAO(GczlDAO gczlDAO) {
		this.gczlDAO = gczlDAO;
	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		GczlJyxmFacade gczlMgmImpl= (GczlJyxmFacade)Constant.wact.getBean("gczlJyxmImpl");
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("gczlJyxmTree")) {//工程质量检验项目管理树
			Iterator it = params.entrySet().iterator();
			String pid = "";
			while(it.hasNext()){
				Map.Entry<String, String[]> entry = (Entry<String, String[]>) it.next();
				String field = entry.getKey().toString();
				String value = entry.getValue()[0];
				if("pid".equals(field)){
					pid = value;
				}
			}
			list = gczlMgmImpl.gczlJyxmTree(parentId,pid);
			return list;
		}
		
		return null;
	}
	
	/**
	 * 根据PID、验评标准树的项目 查询检验项目
	 * @param orderby
	 * @param start
	 * @param limit
	 * @param params
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 27, 2011
	 */
	public List queryJyxmByPid(String orderby, Integer start, Integer limit, HashMap params) {
		String pid = (String) params.get("pid");
		String jyxmType = (String) params.get("xmid");
		
		String sql = "select * from task_view where isyp='1' and ftype='7A' ";
		
		String xmbhFilter = "";
		if (jyxmType==null || jyxmType.equals("1")) {
			if(pid!=null && pid.length()>0){
				xmbhFilter = " and xmbh in (select uids from gczl_jyxm where pid='" + pid + "')";
			}
		} else {
			String pidfilter = "";
			if(pid!=null && pid.length()>0){
				pidfilter = "where pid ='" + pid + "'";
			}
			xmbhFilter = " and xmbh in (select uids from (select * from gczl_jyxm " + pidfilter + ") start with xmbh='" + jyxmType + "' connect by prior uids = parentbh)";
		}
		
		sql += xmbhFilter;
		
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery query = ses.createSQLQuery(sql).addEntity(TaskView.class);
		int size = query.list().size();
		if (start!=null && limit!=null) {
			query.setFirstResult(start.intValue());
			query.setMaxResults(limit.intValue());
		}
		List list = query.list();
		list.add(size);
		
		return list;
	}
	
	
	/**
	 * 工程质量经济技术指标、工程质量试运性能指标、工程质量停机记录，删除主表数据同时删除从表数据
	 * @param zbBeanName	主表bean
	 * @param xbBeanName	细表bean
	 * @param bh			主表主键
	 * @return
	 */
	public Boolean deleteGczlZb(String zbBeanName, String xbBeanName, String bh){
		try {
			List listZb = this.gczlDAO.findByWhere(zbBeanName, "bh = '"+bh+"'");
			List listXb = this.gczlDAO.findByWhere(xbBeanName, "bh = '"+bh+"'");
			this.gczlDAO.deleteAll(listZb);
			this.gczlDAO.deleteAll(listXb);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
